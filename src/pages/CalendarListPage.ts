import { Page, Locator } from "@playwright/test"
import { CalendarListElements } from "../elements"
import {  CurrencyFilter, DateFilterOptions } from "../data"
import {applyMixins} from "../utils"
import { BasePage } from "./BasePage"

export class CalendarListHelper {
    public page: Page

    constructor(page: Page) {
        
        this.page = page
    }
    
}

export interface CalendarListHelper extends CalendarListElements {}

applyMixins(CalendarListHelper, [CalendarListElements]) 

export class CalendarListPage extends BasePage {
    
    protected readonly calendarListHelper: CalendarListHelper

    constructor(page: Page) {
        super(page)
        this.calendarListHelper = new CalendarListHelper(page)
    }

    async setDateFilter(dateFilterOptions: DateFilterOptions)  {
        await this.setFilterRadio(this.calendarListHelper.getDateFilter(), dateFilterOptions)
    }

    async setCurrenciesFilter(currenciesSet: Set<CurrencyFilter>) {
        this.log.error(`setCurrenciesFilter=${JSON.stringify(currenciesSet)}`)
        await this.setFilterCheckboxGroup(this.calendarListHelper.getCurrenciesFilter(), currenciesSet)
        await this.page.waitForLoadState("domcontentloaded")
    }

}