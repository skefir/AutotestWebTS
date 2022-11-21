import { Page } from "@playwright/test";
import * as _ from "lodash";
import { map, of, mergeMap } from "rxjs";
import { CalendarEventInfoTab, EventHistoryColumn, TableEventHistoryColumn } from "../data";
import { CalendarEventInfoElements, DataTablePW, TabControl, DataRow } from "../elements";
import { applyMixins } from "../utils";
import { BasePage } from "./BasePage";

export class CalendarEventInfoHelper {
    public page: Page

    constructor(page: Page) {

        this.page = page
    }

}
7
export interface CalendarEventInfoHelper extends CalendarEventInfoElements { }

applyMixins(CalendarEventInfoHelper, [CalendarEventInfoElements])

export class CalendarEventInfoPage extends BasePage {

    private readonly calendarEventInfoHelper: CalendarEventInfoHelper

    private readonly tabControl: TabControl<CalendarEventInfoTab>

    private eventHistoryTable: DataTablePW

    private  readonly limitDate: Date





    constructor(page: Page) {
        super(page)
        this.calendarEventInfoHelper = new CalendarEventInfoHelper(page)
        this.tabControl = new TabControl<CalendarEventInfoTab>(this.calendarEventInfoHelper.getEventTabControl())
        const colArr = Object.values(EventHistoryColumn).map((e) => {
            return `${e}`
        })
        const colSet = new Set<string>(colArr)
        this.eventHistoryTable = new DataTablePW(
            this.calendarEventInfoHelper.getEventHistoryTable(), "event-table-history", colSet)
        let curDate = new Date();
        this.limitDate  = new Date(curDate.setFullYear(curDate.getFullYear()-1));    

    }

    public async goToTab(tab: CalendarEventInfoTab) {
        await this.tabControl.getTab(tab).click()
    }

    private isAfterDate =  (row: DataRow<string>) => {
        const skey = `${EventHistoryColumn.DATE}`
        const curDate = new Date(row[skey])
        // this.log.error(`isAfterDate>>>>> ${skey} +  ${row[skey]} + ${curDate} + ${this.limitDate}`)
        return curDate>this.limitDate;
    }

    public async printHistoryStreamLogExp() {
        await this.eventHistoryTable.intiTable()
        const colSet = new Set<TableEventHistoryColumn>()
        colSet.add(new TableEventHistoryColumn(EventHistoryColumn.DATE))
        colSet.add(new TableEventHistoryColumn(EventHistoryColumn.ACTUAL))
        colSet.add(new TableEventHistoryColumn(EventHistoryColumn.FORECAST))
        colSet.add(new TableEventHistoryColumn(EventHistoryColumn.PREVIOUS))
        const header = `| ${EventHistoryColumn.DATE.padEnd(25)}             | ` +
            `${EventHistoryColumn.ACTUAL.padStart(20)}` +
            `| ${EventHistoryColumn.FORECAST.padStart(20)} ` +
            `| ${EventHistoryColumn.PREVIOUS.padStart(20)} |`
        this.log.info(header)
        const PREDICATE_KEY = "predicate"
        await this.eventHistoryTable.getRowStream(this.isAfterDate).then(o=>o.subscribe({next: e=>this.log.error(`| ${e[EventHistoryColumn.DATE].trim().padEnd(25)}             | ` +
        `${e[EventHistoryColumn.ACTUAL].trim().padStart(20)}` +
        `| ${e[EventHistoryColumn.FORECAST].trim().padStart(20)} ` +
        `| ${e[EventHistoryColumn.PREVIOUS].trim().padStart(20)} |`) }))
     }
}