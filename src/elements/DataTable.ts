import { Locator } from "@playwright/test"
import * as _ from "lodash"
import { CollectionChain } from "lodash"
import { Logger } from "tslog"
import { DataTableColumn } from "../data"
import { asyncFlatMap, asyncMap, locatorToArray, locatorToArrayAsync, locatorToArraySyn, locatorToChain, logToTransport } from "../utils"

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
        return await locatorToArray(this.rootElement.locator(`div.${this.classPrefix}__item`))
    }

    getRowsChain(rowCount:number) {
        return locatorToChain(this.rootElement.locator(`div.${this.classPrefix}__item`), rowCount)
    }

   async getPageRows(paginatorElement: Locator) {
      const loc = this.rootElement.locator(`div.${this.classPrefix}__item`)
      return  loc.count().then((ec)=>locatorToArrayAsync(loc, ec))

   }


    getRowByNumber(rowNumber: number) {
        return this.rootElement.locator(`div.${this.classPrefix}__item:nth-child(${rowNumber})`)
    }

    async getColumn(rowElement: Locator, column: E) {
        return rowElement.locator(`div[class*='${this.classPrefix}__']:nth-child(${await this.getColumnNumber(column)})`)
    }

    getBottomArea(): Locator {
        return this.rootElement.locator("div[class*='table__bottom']")
    }

    protected async getRowsOnPage(paginatorElement: Locator) {
        return await paginatorElement.click().then(async () => _.chain(await Promise.all([this.getRows()])))

        // return this.getRows().
    }
    protected async getChainRowsInPage(paginatorElement: Locator) {
         return await paginatorElement.click().then(() =>{ 
            return this.rootElement.locator(`div.${this.classPrefix}__item`).count().then((ec)=>
               this.getRowsChain(ec))
        })

        // return this.getRows().
    }

    protected async getRowsInPage(paginatorElement: Locator) {
        return await paginatorElement.click().then(() => this.getRows())

        // return this.getRows().
    }


    async getRowArray() {
        const pageLocator = this.getBottomArea().locator("a")
        const pageCount = await pageLocator.count()
        let pageArray = locatorToArraySyn(pageLocator, pageCount)
        if (pageArray.length < 1) {
            pageArray.push(this.getBottomArea())
        }
        return _
            .chain(pageArray)
                .flatMap(async aloc => await this.getRowsInPage(aloc))


        //     let res =  await Promise.all([ _.map([... await locatorToArray(this.getBottomArea().locator("a"))], 
        //       async (aloc)=>await this.getRowsInPage(aloc))


        //         // let rswe = this.getRowsInPage(aloc).then((res)=>res)
        //         // return rswe
        //     //  })  
        //     //     .map<Locator[]>((aloc) => this.getRowsInPage(aloc))
        //     //     .value()
        //     // return await Promise.all([ _.chain( locatorToArray(this.getBottomArea().locator("a")))
        //     //     .map<Locator[]>((aloc) => this.getRowsInPage(aloc))
        //     //     .value()
        // ])
        // return res;

    }

    async getRowStream() {
        const pageLocator = this.getBottomArea().locator("a")
        const pageCount = await pageLocator.count()
        let pageArray = locatorToArraySyn(pageLocator, pageCount)
        if (pageArray.length < 1) {
            pageArray.push(this.getBottomArea())
        }
        return asyncFlatMap(pageArray, async (loc)=>await this.getRowsInPage(loc))
    
    }

    async getRowStreamLodash() {
        const pageLocator = this.getBottomArea().locator("a")
        const pageCount = await pageLocator.count()
        let pageArray = locatorToArraySyn(pageLocator, pageCount)
        if (pageArray.length < 1) {
            pageArray.push(this.getBottomArea())
        }
        return asyncMap(pageArray, async (loc)=>await this.getPageRows(loc))
        // return (await asyncMap(pageArray, async (loc)=>await this.getChainRowsInPage(loc))).reduce((l, a)=>l.concat()))
        // return asyncMap(pageArray, async (loc)=>await this.getChainRowsInPage(loc).then((ch)=>ch.reduce((l, a)=>l.concat(a), _.chain<Locator>([]))))
        // return asyncMap(pageArray, async (loc)=>await this.getChainRowsInPage(loc).then((ch)=>ch.reduce((a, b, indx, myMappedCollection)=>a&b)))
          
        //  (a, b, indx, myMappedCollection) =>
        //  return _.map(pageArray, async (loc)=>await this.getChainRowsInPage(loc)).reduce(async (l, a)=> await a.then((ar)=>l.concat(ar.value())), {} as  CollectionChain<Locator> )
        // return asyncMap(pageArray, async (loc)=>await this.getChainRowsInPage(loc))
        // return [Promise.all(_.map(pageArray, async aloc => await this.getChainRowsInPage(aloc)))]

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