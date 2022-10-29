import * as config from '../../testconfig.json'


export class Config {
    public readonly BASEURL:string;
    constructor() {
        this.BASEURL = config.baseUrl;
    }

}

export const CONFIG = new Config();