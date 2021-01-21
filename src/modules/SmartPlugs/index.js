import BaseModule from './structures/BaseModule.js'
import { v4 as uuidv4 } from 'uuid'
import tplinkApi from "tplink-cloud-api";
const login = tplinkApi.login;
// const tplink = await login("jorenvangoethem@hotmail.com", "JorenvanGoethem51", uuidv4());

export default class SmartPlugs extends BaseModule {
    tplink;

    constructor(main) {
        super(main);
       
        this.register(SmartPlugs, {
            name: 'smartplugs'
        });
    }

    async init() {
        try {

            const config = this.auth.tp_link;
            this.tplink = await login(config.email, config.password, uuidv4());
                        
            await this.tplink.getDeviceList();

            this.log.info('TP Link', 'Established connection to TP Link account successfully.');
        } catch (error) {
            this.log.error("SmartPlugs", "Init error:", error);
            return false;
        }
        return true;
    }

    get model() {
        return SettingsModel;
    }

    async getDevices(){
        try{
            await this.tplink.getDeviceList();
        }catch (error){
            return false;
        }
       return true;
    }

    async toggle(tagString, toggle = true) {
        try {
            await this.tplink.getHS100(tagString)[toggle ? 'powerOn' : 'powerOff']();
        } catch (error) {   
            this.log.error("SmartPlugs", "Toggle error:", error);
        }
    }
}