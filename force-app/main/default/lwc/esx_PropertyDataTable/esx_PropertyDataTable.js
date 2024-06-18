import { LightningElement,api,track } from 'lwc';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Esx_PropertyDataTable extends LightningElement {

    @track property = {};
    @track view = 'List';
    // Grid  Card


    connectedCallback() {
       this.getPropertyInfo();
    }

    getPropertyInfo() {
        try {
            getListingData({ listingSize: 0 })
                .then(result => {
                    console.log( {result });
                    console.log('getListingData ==>', JSON.parse(JSON.stringify(result)));
                    if (result != null) {
                        this.property = result;
                    }else{
                        console.log({ error });
                        this.showToast('Error', 'Something went Wrong', 'error');
                    }
                })
                .catch(error => {
                    console.log({ error });
                    this.showToast('Error', 'Something went Wrong', 'error');
                })
        } catch (error) {
            console.log('error-->', error);
            this.showToast('Error', 'Something went Wrong', 'error');

        }

    }

    showToast(Title, Message, Variant) {
        const event = new ShowToastEvent({
            title: Title,
            message: Message,
            variant: Variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    
}