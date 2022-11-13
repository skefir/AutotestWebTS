import { Page } from "@playwright/test";
import * as _ from "lodash";
import { CalendarEventInfoTab, EventHistoryColumn, EventInfoTab, TableEventHistoryColumn } from "../data";
import { CalendarEventInfoElements, DataTablePW, TabControl, DataRow } from "../elements";
import { applyMixins, asyncMap } from "../utils";
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

    private eventHistoryTable: DataTablePW<TableEventHistoryColumn>





    constructor(page: Page) {
        super(page)
        this.calendarEventInfoHelper = new CalendarEventInfoHelper(page)
        this.tabControl = new TabControl<CalendarEventInfoTab>(this.calendarEventInfoHelper.getEventTabControl())
        const colSet = new Set<TableEventHistoryColumn>(Object.values(EventHistoryColumn).map((e) =>{ 
            this.log.error(`constructor CalendarEventInfoPage = ${JSON.stringify(e)}`)
            return new TableEventHistoryColumn(EventHistoryColumn[e])}))
        this.eventHistoryTable = new DataTablePW(
            this.calendarEventInfoHelper.getEventHistoryTable(), "event-table-history", colSet)

    }

    public async goToTab(tab: CalendarEventInfoTab) {
        await this.tabControl.getTab(tab).click()
    }


    public async printHistoryStreamLog() {
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
        //  await this.eventHistoryTable.getRowStream().then((locArr)=>_.chain(locArr).first().value().textContent().then((tx)=>this.log.error(`row text=${tx}`)))
        await this.eventHistoryTable.getRowStream().then((locArr)=>_.chain(locArr).filter((_loc, index) => index < 15).value()
        .forEach(async rl=> {
            let colArr = this.eventHistoryTable.extractColumns(rl, colSet)
            await colArr.reduce(async (ra, ne) => await ra.then(async (dtr)=> { dtr[ne[0]] = await ne[1].textContent(); return dtr}), Promise.resolve({} as DataRow<string>)).then(e=> {
                this.log.error(`| ${e[EventHistoryColumn.DATE].trim().padEnd(25)}             | ` +
                   `${e[EventHistoryColumn.ACTUAL].trim().padStart(20)}` +
                   `| ${e[EventHistoryColumn.FORECAST].trim().padStart(20)} ` +
                   `| ${e[EventHistoryColumn.PREVIOUS].trim().padStart(20)} |`)
                }
            )    
        }))
     }
}