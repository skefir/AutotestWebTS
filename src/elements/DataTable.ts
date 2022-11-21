import { Locator } from "@playwright/test"
import { map, range, defaultIfEmpty, mergeMap, of, from, takeWhile } from 'rxjs';
import * as _ from "lodash";
import { Logger } from "tslog"
import { DataTableColumn } from "../data"
import { asyncFlatMap, asyncMap, locatorToArray, locatorToArraySyn, logToTransport } from "../utils"


export interface DataRow<T> {
    [key: string]: T;
}

export class DataTablePW {
    protected rootElement: Locator
    protected classPrefix: string
    protected columns: Set<string>
    protected columnsNumbers: Map<string, number> = new Map()
    protected initFlag: boolean = false
    readonly log: Logger = new Logger()

    constructor(rootElement: Locator,
        classPrefix: string,
        columns: Set<string>) {
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
            // this.log.error(`intiTable>>>>>${JSON.stringify([...this.columnsNumbers.values()])}`)
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

    protected getColumnNumber(column: string): number {
        // if (!this.columns.has(column)) {
        //    throw new Error(`Illegal column - ${JSON.stringify(column)} in set ${JSON.stringify([...this.columns].map(e=>JSON.stringify(e)))}`)
        // }
        // this.log.error(`getColumnNumber>>>>key = ${column} res = ${this.columnsNumbers.get(column)}`)
        return this.columnsNumbers.get(column)
    }

    getRows() {
        return this.rootElement.locator(`div.${this.classPrefix}__item`)
    }

    async getRowByNumber(rowNumber: number) {
        await this.intiTable()
        return this.rootElement.locator(`div.${this.classPrefix}__item:nth-child(${rowNumber})`)
    }

    async getColumn(rowElement: Locator, column: string) {
        return rowElement.locator(`div[class*='${this.classPrefix}__']:nth-child(${this.getColumnNumber(column)})`)
    }

    getBottomArea(): Locator {
        return this.rootElement.locator("div[class*='table__bottom']")
    }


    protected async getRowsInPage(paginatorElement: Locator) {
        const rowsLocator = this.getRows()
        return of(paginatorElement).pipe(
            mergeMap(async p => { await p.click(); return p }),
            mergeMap(async p => await p.count()),
            mergeMap(cnt => range(0, cnt - 1).pipe(map(rNum => rowsLocator.nth(rNum)))),
        )
    }

    protected async getRowContent(row: DataRow<Locator>) {
        let tCont = await Promise.all(Object.values(row).map(c => c.textContent()))
        let res = Object.keys(row).reduce((obj, key, index) => { obj[key] = tCont[index]; return obj }, {} as DataRow<string>)
        return res
    }

    async getRowStream(predicate: (row: DataRow<string>) => boolean) {
        const pageLocator = this.getBottomArea().locator("a")
        const pageCount = await pageLocator.count()

        return range(0, pageCount - 1).pipe(
            map(pgLoc => pageLocator.nth(pgLoc)),
            defaultIfEmpty(this.getBottomArea()),
            // map(dbg=>{this.log.error(`getRowStream1>>>>>>>>> ${JSON.stringify(dbg)}`); return dbg}),
            mergeMap(async p => { await p.click(); return p }),
            // map(dbg=>{this.log.error(`getRowStream2>>>>>>>> ${JSON.stringify(dbg)}`); return dbg}),
            mergeMap(async p => await this.getRows().count()),
            // map(dbg=>{this.log.error(`getRowStream3>>>>>>>>> ${JSON.stringify(dbg)}`); return dbg}),
            // mergeMap(cnt=>range(0, cnt - 1).pipe(map(rNum => this.getRows().nth(rNum)))),
            // this.log.error(`getRowStream3a>>>>>>>>> ${JSON.stringify(arrw)} + ${this.getRows().nth(0)} `);
            mergeMap(cnt => { let arrw = Array.from(Array(cnt).keys()).map((ind) => this.getRows().nth(ind)); return from(arrw) }),
            // map(dbg=>{this.log.error(`getRowStream4>>>>>>>>> ${JSON.stringify(dbg)}`); return dbg}),
            // mergeMap(async pgLoc => (await this.getRowsInPage(pgLoc))),

            map(rlr => this.extractColumns(rlr, this.columns)),
            // map(dbg=>{this.log.error(`getRowStream5>>>>>>>>> ${JSON.stringify(dbg)}`); return dbg}),
            // map(olr=>(this.getRowContent(olr))),
            mergeMap(async olr => (await this.getRowContent(olr))),
            takeWhile(rw => predicate(rw)),
            // map(e=>e)
        )
    }

    extractColumns(rowElement: Locator, columnsSet: Set<string>) {
        if (!this.initFlag) {
            throw new Error(`Table not initilaized`)
        }
        let rowColumns = rowElement.locator(`div[class*='${this.classPrefix}__']`)
        let objLoc = _.reduce([...columnsSet], (l, a) => { l[a] = rowColumns.nth(this.getColumnNumber(a)); return l }, {} as DataRow<Locator>)
        return objLoc
    }
}