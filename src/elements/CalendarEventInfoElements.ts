import { Locator, Page } from "@playwright/test"

export class CalendarEventInfoElements {

    public page: Page

    private getEventRoot(): Locator {
        return this.page.locator("#eventContentPanel")
    }

    public getEventCurrency(): Locator {
        return this.getEventRoot().locator(".economic-calendar__event-header-currency")
    }


    public getEventImportance(): Locator {
        return this.getEventRoot().locator(".event-table__importance")
    }


    public getEventDate(): Locator {
        return this.getEventRoot().locator("td#actualValueDate")
    }


    public getEventTabControl(): Locator { return this.getEventRoot().locator("ul#calendar-tabs") }


    public getEventHistoryTable(): Locator { return this.getEventRoot().locator("#tab_content_history") }
}    