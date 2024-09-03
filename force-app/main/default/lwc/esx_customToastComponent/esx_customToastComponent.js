import { LightningElement, api, track } from 'lwc';

export default class Esx_customToastComponent extends LightningElement {
    @api showToast;
    @api type;
    @api message;

    get successToast(){
        return this.type == 'Success' ? true : false;
    }

    closeToastModel(){
        this.dispatchEvent(
            new CustomEvent("closetoast", {
                detail: false
            })
        );
    }
}