import { Locator } from "@playwright/test";
import { DataTableColumn } from "../data";
import { DataTablePW } from "./DataTable";
import * as _ from "lodash";

export class ColumnGroupTable<E extends DataTableColumn> extends DataTablePW<E> {

    constructor(rootElement: Locator,
        classPrefix: string,
        columns: Set<E>) {
        super(rootElement, classPrefix, columns)
    }

    protected getTableHeaders(): Locator {
        return this.rootElement.locator(`.${this.classPrefix}__header .${this.classPrefix}__col`)
    }

    async getRowByNumber(rowNumber: number) {
        await this.intiTable()
        return  this.rootElement.locator(`div.${this.classPrefix}__body div.${this.classPrefix}__item`).nth(rowNumber-1)
    }

    async getColumn(rowElement: Locator, column: E) {
        return rowElement.locator(`.${this.classPrefix}__col`).nth(this.getColumnNumber(column))
    }
}