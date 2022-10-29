import { OptionFilterable } from "./OptionFilterable";

export enum Importance {
   HOLIDAYS = "Holidays",
   LOW = "Low",
   MEDIUM = "Medium",
   HIGH = "High"
}

export class ImportanceFilterOption implements OptionFilterable {

    constructor(importance: Importance) {
        this.importance = importance;
    } 

    readonly importance: Importance

    getTitle = () => this.importance
        
   
    getAltTitle = () => this.importance.toUpperCase()

}

