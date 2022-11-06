import { Locator } from "@playwright/test";
import * as _ from "lodash";
import { result } from "lodash";

export async function locatorToArray(locator: Locator) {
    const elementsCount = await locator.count();
    let resultArray = new Array<Locator>
    for (let index = 0; index < elementsCount; index++) {
        resultArray.push(locator.nth(index))
    }
    return resultArray
}

export function locatorToArraySyn(locator: Locator, elementsCount: number) {
    let resArr = new Array<Locator>
    for (let index = 0; index < elementsCount; index++) {
        resArr.push(locator.nth(index));
    }
    return resArr
}

export function locatorToChain(locator: Locator, elementsCount: number) {
    return _.chain(_.range(elementsCount)).map((i)=>locator.nth(i))

}

export async function locatorToArrayAsync(locator: Locator, elementsCount: number) {
    return _.chain(_.range(elementsCount)).map((i)=>locator.nth(i))
}
