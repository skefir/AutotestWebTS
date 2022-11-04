import { Locator } from "@playwright/test";
import { result } from "lodash";

export async function locatorToArray(locator: Locator) {
    const elementsCount = await locator.count();
        let resultArray = new Array<Locator>
        for (let index = 0; index < elementsCount; index++) {
            resultArray.push(locator.nth(index))
        }
        return resultArray
}

export async function locatorToArraySyn(locator: Locator) {
    
    // let resultArray = new Array<Locator>
    const [resultArray] = await Promise.all([
        locator.count().then((count)=> fillArray(count)),
     ])   

     return resultArray
     
    

     function  fillArray(elementsCount: number) {
        let resArr = new Array<Locator>
        for (let index = 0; index < elementsCount; index++) {
            resArr.push(locator.nth(index));
        }
        return  resArr;
    }
}
