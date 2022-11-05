import { ControlTabEntity } from "./ControlTabEntity"

export enum  EventInfoTab {
    OVERVIEW = "Overview",
    CHART = "Chart",
    HISTORY = "History",
    WIDGET = "Widget"
}

export class CalendarEventInfoTab implements ControlTabEntity {

    readonly eventInfoTab: EventInfoTab

    constructor(eventInfoTab: EventInfoTab) {
        this.eventInfoTab = eventInfoTab
    }

    getTitle(): string {
        return this.eventInfoTab
    }
}