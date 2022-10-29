import { OptionFilterable } from "./OptionFilterable";

export enum DateFilterValues  {
    CURRENT_WEEK = "Current week",
    PREVIOUS_WEEK = "Previous week",
    NEXT_WEEK = "Next week",
    CURRENT_MONTH = "Current month",
    PREVIOUS_MONTH = "Previous month",
    NEXT_MONTH = "Next month"
}

export class DateFilterOptions implements OptionFilterable {
    dateFilterValue: DateFilterValues

    constructor(dateFilterValue: DateFilterValues) {
        this.dateFilterValue = dateFilterValue
    }

    getTitle = (): String => this.dateFilterValue
    getAltTitle = (): String => this.getTitle()
    

}