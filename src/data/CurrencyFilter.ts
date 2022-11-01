import { OptionFilterable } from "./OptionFilterable";

export enum Currencies {
    AUD = "Australian Dollar",
    BRL = "Brazilian real",
    CAD = "Canadian dollar",
    CHF = "Swiss frank",
    CNY = "Chinese yuan",
    EUR = "Euro",
    GBP = "Pound sterling",
    HKD = "Hong Kong dollar",
    INR = "Indian rupee",
    JPY = "Japanese yen",
    KRW = "South Korean won",
    MXN = "Mexican peso",
    NOK = "Norwegian Krone",
    NZD = "New Zealand dollar",
    SEK = "Swedish krona",
    SGD = "Singapore dollar",
    USD = "US dollar",
    ZAR = "South African rand"
}

export class CurrencyFilter implements OptionFilterable {
    readonly currency: Currencies
    constructor (currency: Currencies) {
        this.currency = currency;
        
    }
    getTitle = (): string => `${Object.keys(Currencies)[Object.values(Currencies).indexOf(this.currency)]} - ${this.currency}`
    getAltTitle = (): string => `${Object.keys(Currencies)[Object.values(Currencies).indexOf(this.currency)]}, ${this.currency}`
    
}