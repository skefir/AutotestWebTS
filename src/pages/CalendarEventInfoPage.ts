import { Page } from "@playwright/test";
import { CalendarEventInfoTab } from "../data";
import { CalendarEventInfoElements, TabControl } from "../elements";
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



    constructor(page: Page) {
        super(page)
        this.calendarEventInfoHelper = new CalendarEventInfoHelper(page)
        this.tabControl = new TabControl<CalendarEventInfoTab>(this.calendarEventInfoHelper.getEventTabControl())
    }    

    public async goToTab(tab: CalendarEventInfoTab) {
        // log.info("Переходим на вкладку {}", tab)
       await this.tabControl.getTab(tab).click()
    }

}