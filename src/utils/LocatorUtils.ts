import { Locator } from "@playwright/test";

export async function locatorToArray(locator: Locator) {
    const elementsCount = await locator.count();
        let resultArray = new Array<Locator>
        for (let index = 0; index < elementsCount; index++) {
            resultArray.push(locator.nth(index))
        }
        return resultArray
}
