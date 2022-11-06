import { Page } from "@playwright/test";
import * as _ from "lodash";
import { CalendarEventInfoTab, TableEventHistoryColumn } from "../data";
import { CalendarEventInfoElements, DataTablePW, TabControl } from "../elements";
import { applyMixins } from "../utils";
import { BasePage } from "./BasePage";

export class CalendarEventInfoHelper {
    public page: Page

    constructor(page: Page) {

        this.page = page
    }

}

export interface CalendarEventInfoHelper extends CalendarEventInfoElements { }

applyMixins(CalendarEventInfoHelper, [CalendarEventInfoElements])

export class CalendarEventInfoPage extends BasePage {

    private readonly calendarEventInfoHelper: CalendarEventInfoHelper

    private readonly tabControl: TabControl<CalendarEventInfoTab>

     private eventHistoryTable:  DataTablePW<TableEventHistoryColumn>



    constructor(page: Page) {
        super(page)
        this.calendarEventInfoHelper = new CalendarEventInfoHelper(page)
        this.tabControl = new TabControl<CalendarEventInfoTab>(this.calendarEventInfoHelper.getEventTabControl())
        this.eventHistoryTable = new DataTablePW(
            this.calendarEventInfoHelper.getEventHistoryTable(), "event-table-history", null)
        
    }    

    public async goToTab(tab: CalendarEventInfoTab) {
        // log.info("Переходим на вкладку {}", tab)
       await this.tabControl.getTab(tab).click()
    }

    public async printHistoryToLog() {
        // (await this.page.$$("a")).forEach((e)=>e.click())
        // this.page.click
        await this.eventHistoryTable.getRowArray().then((prom)=>prom.first().value().then((rw)=>rw[0].textContent().then((tx)=>this.log.error(`row text=${tx}`))))

    }   

    public async printHistoryStreamLog() {
        await this.eventHistoryTable.getRowStream().then((locArr)=>_.chain(locArr).first().value().textContent().then((tx)=>this.log.error(`row text=${tx}`)))
    }    

    
    
}