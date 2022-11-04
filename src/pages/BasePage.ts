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
            "info"
        );

    }

    getCurrentPage = (): BasePage => this

    protected async setFilterOption(filterOptionElement: Locator) {
        await Promise.all([
            this.log.debug(`setFilterOption = ${JSON.stringify(filterOptionElement)} `),
            this.basePageElements.getFilterOptionLabel(filterOptionElement).click({ force: true }),
        ])
    }

    protected async setFilterRadio(filterElement: Locator, option: OptionFilterable) {
        await Promise.all([
            this.page.waitForLoadState("domcontentloaded"),
            this.basePageElements.getFilterOption(filterElement, option).click(),
        ])

    }

    protected isOptionContains<O extends OptionFilterable>(optionSet: Set<O>, labelOption: string): boolean {
        this.log.debug(`isOptionContains = ${JSON.stringify([...optionSet])} findOption =  ${labelOption}`)

        return _.chain([...optionSet]).filter(e => {
            return e.getTitle() == labelOption || e.getAltTitle() == labelOption
        }).first().value() != undefined
    }

    protected async isChecked(checkBoxElement: Locator) {
        return await this.basePageElements.getFilterCheckBox(checkBoxElement).isChecked()
    }

    protected async setFilterOptionCheckbox(filterOptionElement: Locator, value: boolean) {
        let curVal = await this.isChecked(filterOptionElement)
        this.log.debug(`setFilterOptionCheckbox flag = ${curVal}`)
        if (value != curVal) {
            await this.setFilterOption(filterOptionElement)
        }
    }



    protected async setFilterCheckboxGroup<O extends OptionFilterable>(
        filterElement: Locator,
        optionSet: Set<O>
    ) {

        await Promise.all([
            (await locatorToArray(this.basePageElements.getFilterOptions(filterElement))).forEach(async e => {
                this.checkAndClick<O>(e, optionSet)
            })
        ])

    }


    private async checkAndClick<O extends OptionFilterable>(e: Locator, optionSet: Set<O>) {
        this.setFilterOptionCheckbox(e, this.isOptionContains(optionSet, await e.textContent()))
        //  await Promise.all([
        //     await this.setFilterOptionCheckbox(e, this.isOptionContains(optionSet, await e.textContent())),
        // ])

    }
} 