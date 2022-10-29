import { test, expect, Page } from '@playwright/test';
import { BasePage, CalendarListPage } from '../src/pages'
import {CONFIG} from '../src/conf'
import { DateFilterOptions, DateFilterValues } from '../src/data';

let addDelay = async (page) => {
    const client = await page.context().newCDPSession(page)
    await client.send('Network.enable')
    await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (1 * 1024 * 1024) / 8,
        uploadThroughput: (1 * 1024 * 1024) / 8,
        latency: 720
    })
}

test.describe('Check calendar functional', () => {
    test('Check calendar filter', async ({ page }) => {
        await page.goto("https://www.mql5.com/en/economic-calendar")
        let calendarListPage = new CalendarListPage(page)
        await calendarListPage.setDateFilter(new DateFilterOptions(DateFilterValues.NEXT_MONTH))
        await calendarListPage.setDateFilter(new DateFilterOptions(DateFilterValues.NEXT_WEEK))
        await calendarListPage.setDateFilter(new DateFilterOptions(DateFilterValues.PREVIOUS_MONTH))
    });
});