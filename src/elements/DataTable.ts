import { Locator } from "@playwright/test"
import * as _ from "lodash"
import { Logger } from "tslog"
import { DataTableColumn } from "../data"
import { locatorToArray, logToTransport } from "../utils"

export class DataTablePW<E extends DataTableColumn> {
    protected rootElement: Locator
    protected classPrefix: string
    protected columns: Set<E>
    protected columnsNumbers: Map<string, number> = new Map()
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

    protected async getColumnNumber(column: E): Promise<number> {
        if (!this.columns.has(column)) {

            throw new Error(`Illegal column - ${column}`)
        }
        if (!this.columnsNumbers.has) {
            // this.rootElement.locator(
            //             `xpath=.//div[@class='${this.classPrefix}__header']` +
            //                     `//div[contains(@class,'${this.classPrefix}__')` +
            //                     ` and .//text()='${column.getTitle()}']/preceding-sibling::div`
            //         ).count().then(res =>this.columnsNumbers.set(column, res + 1))
            this.columnsNumbers.set(column.getTitle(), (await this.rootElement.locator(
                `xpath=.//div[@class='${this.classPrefix}__header']` +
                `//div[contains(@class,'${this.classPrefix}__')` +
                ` and .//text()='${column.getTitle()}']/preceding-sibling::div`
            ).count()) + 1)
        }

        return this.columnsNumbers.get(column.getTitle())
    }

    async getRows() {
        return locatorToArray(this.rootElement.locator(`div.${this.classPrefix}__item`))
    }

    async getRowByNumber(rowNumber: number) {
        return (await this.getRows())[rowNumber]
    }

    async getColumn(rowElement: Locator, column: E) {
        return rowElement.locator(`div[class*='${this.classPrefix}__']:nth-child(${await this.getColumnNumber(column)})`)
    }

    getBottomArea(): Locator {
        return this.rootElement.locator("div[class*='table__bottom']")
    }

    async getRowsOnPage(paginatorElement: Locator) {
        await paginatorElement.click()
        return _.chain(this.getRows())
        // return this.getRows().
    }

    async getRowStream() {
        let pagerCollection = await locatorToArray(this.getBottomArea().locator("a"))
        //если страница 1 то колеция пуста добавляем туда 1 элемент страницы

        if (pagerCollection.length < 1) {
            pagerCollection.push(this.getBottomArea())
        }
        return _.flatMap(pagerCollection, (l) => this.getRowsOnPage(l))
        // _.chain(locatorToArray(pagerCollection)).flatMap((l)=>this.getRowsOnPage(l))
        //      pagerCollection.sequence() else sequence { 0 to getBottomArea() }
        // //конвертируем поток пейджей в поток строк
        // return paginationStream.flatMap { (_, l) ->
        //     getRowsOnPage(l)
        // }
    }

    async extractColumns(rowElement: Locator, columnsSet: Set<E>) {
        let rowColumns = await locatorToArray(rowElement.locator("div[class*='${classPrefix}__']"))
        // let rowColumns = rowElement.locator("div[class*='${classPrefix}__']")
        // return _.map(columnsSet, (l) =>  (await rowColumns.nth((await this.getColumnNumber(l)) - 1)).textContent())
        //  _.map(columnsSet, (l)=>this.getColumnNumber(l))
        //    return _.map([...columnsSet], async (l)=>{ return {key: l.getTitle, val: rowColumns[await this.getColumnNumber(l)-1].textContent()}}).
        // return _.map([...columnsSet], async (l)=>{ return  {key: l, val: (await rowColumns[await this.getColumnNumber(l)-1].textContent())}}).values()
        return _.reduce([...columnsSet], async (l, a) => l[a.getTitle()] = rowColumns[await this.getColumnNumber(a) - 1], {})
        //  .reduce(async (p, c, a)=>a.push[(await c).key]=(await c).val,{})


    }

}