import { DataTableColumn } from "./DataTableColumn";

export enum EventHistoryColumn {
    DATE = "Date (GMT)",
    REFERENCE = "Reference",
    ACTUAL = "Actual",
    FORECAST = "Forecast",
    PREVIOUS = "Previous"
}

export class TableEventHistoryColumn implements DataTableColumn {

    readonly column: EventHistoryColumn

    constructor(column: EventHistoryColumn) {
        this.column = column
    }

    getTitle(): string {
        return this.column
    }
}