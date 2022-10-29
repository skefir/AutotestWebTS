import { Locator, Page } from "@playwright/test";
import { OptionFilterable } from "../data";

export class CommonUtils {

    getFilterOptions(rootFilterElement: Locator): Locator { return rootFilterElement.locator("li:visible") }

    getFilterCheckBox(filterOptionElement: Locator): Locator { return filterOptionElement.locator("input[type='checkbox']") }

    getFilterOptionLabel(filterOptionsElement: Locator): Locator { return filterOptionsElement.locator("label") }

    getFilterOption(rootFilterElement: Locator, option: OptionFilterable): Locator { return rootFilterElement.locator(`li label:has-text('${option.getTitle()}')`) }

}