import { Locator } from "@playwright/test";
import { ControlTabEntity } from "../data";

export class TabControl<T extends ControlTabEntity> {
    private rootElement: Locator

    constructor(rootElement: Locator) {
        this.rootElement = rootElement
    }

    public getTab(tab: T): Locator {
        return this.rootElement.locator(`li:has-text('${tab.getTitle()}')`)
    }
}