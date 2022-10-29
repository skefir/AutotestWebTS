import { Page, Locator } from "@playwright/test"
import { applyMixins } from "../utils"
import { CommonUtils } from "../elements"
import { OptionFilterable } from "../data"

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

    protected setFilterOption = (filterOptionElement: Locator) =>
        this.basePageElements.getFilterOptionLabel(filterOptionElement).click()

    protected async setFilterRadio(filterElement: Locator, option: OptionFilterable) {
        await this.basePageElements.getFilterOption(filterElement, option).click()
    }

} 