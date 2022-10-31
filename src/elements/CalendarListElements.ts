import { Locator, Page } from "@playwright/test"

export class CalendarListElements {

    public page: Page



    getCalendarRoot(): Locator {
        return this.page.locator("#calendarContainer")
    }

    getFilterArea(): Locator { return this.getCalendarRoot().locator("#economicCalendarFilter") }

    getCurrenciesFilter(): Locator { return this.getFilterArea().locator("ul#economicCalendarFilterCurrency") }

    getDateFilter(): Locator { return this.getFilterArea().locator("ul#economicCalendarFilterDate") }

    getImportanceFilter(): Locator { return this.getFilterArea().locator("ul#economicCalendarFilterImportance") }

    getMainTable(): Locator {
        return this.getCalendarRoot().locator("xpath=.//div[@class='ec-table' and .//div[@id='economicCalendarTable']]")
    }
}