import { DataTableColumn } from "./DataTableColumn";

export enum CalendarColumn {
    TIME = "Time",
    CURRENCY = "Currency",
    EVENT = "Event",
    ACTUAL = "Actual",
    FORECAST = "Forecast",
    PREVIOUS = "Previous"
}

export class CalendarTableColumn implements DataTableColumn {
    
    readonly column: CalendarColumn

    constructor(column: CalendarColumn) {
        this.column = column
    }

    getTitle = (): string => `${this.column}`
}

