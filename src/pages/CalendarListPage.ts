import { Page, Locator } from "@playwright/test"
import { CalendarListElements } from "../elements"
import { DateFilterOptions } from "../data"
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
    readonly page: Page

    protected readonly calendarListHelper: CalendarListHelper

    constructor(page: Page) {
        super(page)
        this.calendarListHelper = new CalendarListHelper(page)
    }

    async setDateFilter(dateFilterOptions: DateFilterOptions)  {
        await this.setFilterRadio(this.calendarListHelper.getDateFilter(), dateFilterOptions)
        
    }

}