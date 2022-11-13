import { Locator } from "@playwright/test"
import * as _ from "lodash"
import { Logger } from "tslog"
import { DataTableColumn } from "../data"
import { asyncFlatMap, asyncMap, locatorToArray, locatorToArraySyn, logToTransport } from "../utils"

export interface DataRow<T> {
    [key: string]: T;
}

export class DataTablePW<E extends DataTableColumn> {
    protected rootElement: Locator
    protected classPrefix: string
    protected columns: Set<E>
    protected columnsNumbers: Map<string, number> = new Map()
    protected initFlag: boolean = false
    readonly log: Logger = new Logger()

    constructor(rootElement: Locator,
        classPrefix: string,
        columns: Set<E>) {
        this.rootElement = rootElement
        this.classPrefix = classPrefix
        this.columns = columns
        this.log.attachTransport(
            {
                silly: logToTransport,
                debug: logToTransport,
                trace: logToTransport,
                info: logToTransport,
                warn: logToTransport,
                error: logToTransport,
                fatal: logToTransport,
            },
            "info"
        );
    }

    public async intiTable() {
        if (!this.initFlag) {
            await this.calculateColumnNumbers()
            this.initFlag = true;
        }
    }

    protected getTableHeaders(): Locator {
        return this.rootElement.locator(`.${this.classPrefix}__header div[class*=${this.classPrefix}__]`)
    }

    protected async calculateColumnNumbers() {
        const hedArray = await locatorToArray(this.getTableHeaders())
        await Promise.all(hedArray.map((loc, index) => new Promise<void>((resolve) => loc.textContent().then((txtEl) => {
            this.columnsNumbers.set(txtEl.substring(0, txtEl.concat(",").indexOf(',')).trim(), index);
            resolve()
        }))))

    }

    protected getColumnNumber(column: E): number {
        // if (!this.columns.has(column)) {
        //    throw new Error(`Illegal column - ${JSON.stringify(column)} in set ${JSON.stringify([...this.columns].map(e=>JSON.stringify(e)))}`)
        // }
        return this.columnsNumbers.get(column.getTitle())
    }

    async getRows() {
        return await locatorToArray(this.rootElement.locator(`div.${this.classPrefix}__item`))
    }

    async getRowByNumber(rowNumber: number) {
        await this.intiTable()
        return this.rootElement.locator(`div.${this.classPrefix}__item:nth-child(${rowNumber})`)
    }

    async getColumn(rowElement: Locator, column: E) {
        return rowElement.locator(`div[class*='${this.classPrefix}__']:nth-child(${this.getColumnNumber(column) + 1})`)
    }

    getBottomArea(): Locator {
        return this.rootElement.locator("div[class*='table__bottom']")
    }

    protected async getRowsOnPage(paginatorElement: Locator) {
        return await paginatorElement.click().then(async () => _.chain(await Promise.all([this.getRows()])))
    }
    protected async getRowsInPage(paginatorElement: Locator) {
        return await paginatorElement.click().then(() => this.getRows())
    }

    async getRowStream() {
        await this.intiTable()
        const pageLocator = this.getBottomArea().locator("a")
        const pageCount = await pageLocator.count()
        let pageArray = locatorToArraySyn(pageLocator, pageCount)
        if (pageArray.length < 1) {
            pageArray.push(this.getBottomArea())
        }
        return asyncFlatMap(pageArray, async (loc) => await this.getRowsInPage(loc))
    }
    
    extractColumns(rowElement: Locator, columnsSet: Set<E>) {
        this.log.error(`extractColumns ${JSON.stringify(this.columnsNumbers)}`)
        if (!this.initFlag) {
            throw new Error(`Table not initilaized`)
        }
        let rowColumns = rowElement.locator(`div[class*='${this.classPrefix}__']`)
        return _.reduce([...columnsSet], (l, a) => { l.push([a.getTitle(), rowColumns.nth(this.getColumnNumber(a))]); return l }, [] as [string, Locator][])
    }
}