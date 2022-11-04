import { Page, Locator } from "@playwright/test"
import { CalendarListElements, ColumnGroupTable } from "../elements"
import { CalendarColumn, CalendarTableColumn, CurrencyFilter, DateFilterOptions } from "../data"
import { applyMixins } from "../utils"
import { BasePage } from "./BasePage"
import * as _ from "lodash"

export class CalendarListHelper {
    public page: Page

    constructor(page: Page) {

        this.page = page
    }

}

export interface CalendarListHelper extends CalendarListElements { }

applyMixins(CalendarListHelper, [CalendarListElements])

export class CalendarListPage extends BasePage {

    protected readonly calendarListHelper: CalendarListHelper

    private calendarMainDataTable: ColumnGroupTable<CalendarTableColumn>

    constructor(page: Page) {
        super(page)
        this.calendarListHelper = new CalendarListHelper(page)
        let colSet = new Set<CalendarTableColumn>()
        for (let column in CalendarColumn) {
            colSet.add(new CalendarTableColumn(CalendarColumn[column]))
        }

        this.calendarMainDataTable = new ColumnGroupTable<CalendarTableColumn>(this.calendarListHelper.getMainTable(), "ec-table", colSet)
    }

    async setDateFilter(dateFilterOptions: DateFilterOptions) {
        await this.setFilterRadio(this.calendarListHelper.getDateFilter(), dateFilterOptions)
    }

    async setCurrenciesFilter(currenciesSet: Set<CurrencyFilter>) {
        this.log.error(`setCurrenciesFilter=${JSON.stringify(currenciesSet)}`)
        await this.setFilterCheckboxGroup(this.calendarListHelper.getCurrenciesFilter(), currenciesSet)
        await this.page.waitForLoadState("domcontentloaded")
    }

    async enterToEventByNumber(eventNumber: number) {
        await (await this.calendarMainDataTable.getColumn(await this.calendarMainDataTable.getRowByNumber(eventNumber), new CalendarTableColumn(CalendarColumn.EVENT)))
            .locator("a").click()
    }

}