import { Page, Locator } from "@playwright/test"
import { applyMixins, locatorToArray, logToTransport } from "../utils"
import { CommonUtils } from "../elements"
import { OptionFilterable } from "../data"
import * as _ from "lodash"
import { Logger } from "tslog";


export class BasePageElements {
    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

}
export interface BasePageElements extends CommonUtils { }

applyMixins(BasePageElements, [CommonUtils])



export class BasePage {
    readonly page: Page

    readonly log: Logger = new Logger()


    protected readonly basePageElements: BasePageElements

    constructor(page: Page) {
        this.page = page
        this.basePageElements = new BasePageElements(this.page)
        this.log.attachTransport(
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

    }

    getCurrentPage = (): BasePage => this

    protected async setFilterOption(filterOptionElement: Locator) {
        // await (await filterOptionElement.elementHandle()).waitForElementState("stable")
        await Promise.all([
            //  this.page.waitForLoadState("domcontentloaded"),
            this.log.error(`setFilterOption = ${JSON.stringify(filterOptionElement)} `),
            this.basePageElements.getFilterOptionLabel(filterOptionElement).click({ force: true }),
            //  this.page.waitForLoadState("domcontentloaded"),
            // this.page.waitForNavigation(),
        ])

        //    this.page.click(this.basePageElements.getFilterOptionLabel(filterOptionElement)., {force: true}) 
        //    await (await filterOptionElement.elementHandle()).waitForElementState("stable")
        //  await this.page.waitForNavigation()
    }

    protected async setFilterRadio(filterElement: Locator, option: OptionFilterable) {
        await Promise.all([
            this.page.waitForLoadState("domcontentloaded"),
            this.basePageElements.getFilterOption(filterElement, option).click(),
        ])

    }

    protected isOptionContains<O extends OptionFilterable>(optionSet: Set<O>, labelOption: string): boolean {
        this.log.error(`isOptionContains = ${JSON.stringify([...optionSet])} findOption =  ${labelOption}`)

        return _.chain([...optionSet]).filter(e => {
            return e.getTitle() == labelOption || e.getAltTitle() == labelOption
        }).first().value() != undefined
    }

    protected async isChecked(checkBoxElement: Locator) {
        return await this.basePageElements.getFilterCheckBox(checkBoxElement).isChecked()
    }

    protected async setFilterOptionCheckbox(filterOptionElement: Locator, value: boolean) {
        let curVal = await this.isChecked(filterOptionElement)
        this.log.error(`setFilterOptionCheckbox flag = ${curVal}`)
        if (value != curVal) {
            await this.setFilterOption(filterOptionElement)
        }
    }



    protected async setFilterCheckboxGroup<O extends OptionFilterable>(
        filterElement: Locator,
        optionSet: Set<O>
    ) {
        let ind: number = 0;
        await Promise.all([
            (await locatorToArray(this.basePageElements.getFilterOptions(filterElement))).forEach(async e => {
                ind = await this.checkAndClick<O>(e, optionSet, ind)
            })
        ])

        // let filterElementArray = await locatorToArray(this.basePageElements.getFilterOptions(filterElement))


        //     .forEach {
        //         setFilterOptionCheckbox(
        //             it.second,
        //             isOptionContains(optionSet, elementHelper.getFilterOptionLabel(it.second).textContent() ?: "")
        //         )
        //     }
        // return currentPage
    }


    private async checkAndClick<O extends OptionFilterable>(e: Locator, optionSet: Set<O>, ind: number) {

        // await  this.page.waitForLoadState('domcontentloaded'),
        // await this.setFilterOptionCheckbox(e, this.isOptionContains(optionSet, await e.textContent())),
        // await this.page.waitForLoadState("domcontentloaded")
        await Promise.all([
            await this.page.waitForLoadState('domcontentloaded'),
            // (await e.elementHandle()).waitForElementState("stable"),
            
            await this.setFilterOptionCheckbox(e, this.isOptionContains(optionSet, await e.textContent())),
            await this.page.waitForLoadState("domcontentloaded")
        ])
        return ind + 1
    }
} 