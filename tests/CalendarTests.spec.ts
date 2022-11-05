import { test, expect, Page } from '@playwright/test';
import { BasePage, CalendarEventInfoPage, CalendarListPage } from '../src/pages'
import {CONFIG} from '../src/conf'
import { CalendarEventInfoTab, Currencies, CurrencyFilter, DateFilterOptions, DateFilterValues, EventInfoTab } from '../src/data';
import { Logger } from 'tslog';
import { logToTransport } from '../src/utils';

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

let log: Logger = new Logger()
log.attachTransport(
    {
      silly: logToTransport,
      debug: logToTransport,
      trace: logToTransport,
      info: logToTransport,
      warn: logToTransport,
      error: logToTransport,
      fatal: logToTransport,
    },
    "debug"
  );

test.describe('Check calendar functional', () => {
    test('Check calendar filter', async ({ page }) => {
        await page.setViewportSize({ width: 2560, height: 1440 })
        await page.goto("https://www.mql5.com/en/economic-calendar")
        await page.waitForLoadState("domcontentloaded")
        let calendarListPage = new CalendarListPage(page)
        let directions = new Set<string>(['east', 'west']);
        log.error(`test0=${directions} size=${directions.size}`)
        let curObj = new CurrencyFilter(Currencies.CHF)
        log.error(`test1=${JSON.stringify(curObj)}`)
        let curSet = new Set<CurrencyFilter>([curObj])
        curSet.add(curObj)
        log.error(`test2=${JSON.stringify(curSet)} has=${JSON.stringify([...curSet])}`)
        await calendarListPage.setCurrenciesFilter(curSet)
        await calendarListPage.setDateFilter(new DateFilterOptions(DateFilterValues.NEXT_MONTH))
        await calendarListPage.enterToEventByNumber(1)
        let calendarEventInfoPage = new CalendarEventInfoPage(page)
        await calendarEventInfoPage.goToTab(new CalendarEventInfoTab(EventInfoTab.HISTORY))
        await calendarEventInfoPage.printHistoryToLog()
        await page.waitForLoadState("networkidle")
        await page.screenshot({ path: 'posttest.png' });
    
    });
});