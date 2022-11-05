import { Locator } from "@playwright/test";
import { DataTableColumn } from "../data";
import { locatorToArray, locatorToArraySyn } from "../utils";
import { DataTablePW } from "./DataTable";
import * as _ from "lodash";

export class ColumnGroupTable<E extends DataTableColumn> extends DataTablePW<E> {

    private initFlag: boolean = false

    constructor(rootElement: Locator,
        classPrefix: string,
        columns: Set<E>) {
        super(rootElement, classPrefix, columns)
    }

    private getTableHeaders(): Locator {
        return this.rootElement.locator(`.${this.classPrefix}__header .${this.classPrefix}__col`)
    }

    protected async getColumnNumber(column: E) {
        if (!this.initFlag) {
            await this.calculateColumnNumbers()
            // this.log.debug(`calculateColumnNumbers=${this.columnsNumbers} = ${JSON.stringify(this.columnsNumbers)}`);
            this.initFlag = true
        }
        return this.columnsNumbers.get(column.getTitle());
        
    }

    private async calculateColumnNumbers() {
        const hedArray = await locatorToArray(this.getTableHeaders())
        let promisArray = new Array<Promise<void>>()
        hedArray.forEach( (value, index)=> promisArray.push(new Promise((resolve, reject)=>{
            value.textContent().then((txtEl)=>{
                this.columnsNumbers.set(txtEl.substring(0, txtEl.concat(",").indexOf(',')).trim(), index)
                resolve()})
            })))
        await Promise.all(promisArray)
    }

    getRowByNumber(rowNumber: number) {
        return  this.rootElement.locator(`div.${this.classPrefix}__body div.${this.classPrefix}__item`).nth(rowNumber-1)
    }

    async getColumn(rowElement: Locator, column: E) {
        return rowElement.locator(`.${this.classPrefix}__col`).nth(await this.getColumnNumber(column))
    }
}