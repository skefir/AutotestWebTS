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
        // log.info("Получаем содержимое таблицы истории")
      let hz =await this.eventHistoryTable.getRowArray().then((prom)=>{
        // _.forEach([...prom], (lf)=>{})
        this.log.error(`printHistoryToLog=${prom} + ${JSON.stringify(prom)}`)
        // prom.forEach((e)=>e.textContent().then((tx)=>this.log.error(`row text=${tx}`)))
    })
    }    

}