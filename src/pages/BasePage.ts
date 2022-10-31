import { Page, Locator } from "@playwright/test"
import { applyMixins, locatorToArray } from "../utils"
import { CommonUtils } from "../elements"
import { OptionFilterable } from "../data"
import * as _ from "lodash"

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

    protected readonly basePageElements: BasePageElements

    constructor(page: Page) {
        this.page = page
        this.basePageElements = new BasePageElements(this.page)

    }

    getCurrentPage = (): BasePage => this

    protected async  setFilterOption(filterOptionElement: Locator) {
       await this.basePageElements.getFilterOptionLabel(filterOptionElement).click({force: true})
    }    

    protected async setFilterRadio(filterElement: Locator, option: OptionFilterable) {
        await this.basePageElements.getFilterOption(filterElement, option).click()
    }

    protected isOptionContains<O extends OptionFilterable>(optionSet: Set<O>, labelOption: string): boolean {
        return _.chain([...optionSet]).filter(e => e.getTitle() == labelOption || e.getAltTitle() == labelOption).first().value() != undefined
    }

    protected async isChecked(checkBoxElement: Locator) {
        return this.basePageElements.getFilterCheckBox(checkBoxElement).isChecked()
    }

    protected async setFilterOptionCheckbox(filterOptionElement: Locator, value: boolean) {

        if (value != await this.isChecked(filterOptionElement)) {
            await this.setFilterOption(filterOptionElement)
        }
    }



    protected async setFilterCheckboxGroup<O extends OptionFilterable>(
        filterElement: Locator,
        optionSet: Set<O>
    ) {
        let filterElementArray = await locatorToArray(this.basePageElements.getFilterOptions(filterElement))
        filterElementArray.forEach(async e => {
            (await e.elementHandle()).waitForElementState("stable")
            this.setFilterOptionCheckbox(e, this.isOptionContains(optionSet, await e.textContent()));
            (await e.elementHandle()).waitForElementState("stable")
            // await this.page.waitForLoadState("networkidle")
        })
        //     .forEach {
        //         setFilterOptionCheckbox(
        //             it.second,
        //             isOptionContains(optionSet, elementHelper.getFilterOptionLabel(it.second).textContent() ?: "")
        //         )
        //     }
        // return currentPage
    }

} 