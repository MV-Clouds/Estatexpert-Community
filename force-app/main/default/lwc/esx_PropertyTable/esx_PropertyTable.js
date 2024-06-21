import { LightningElement, api, track } from 'lwc';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FORM_FACTOR from '@salesforce/client/formFactor'


export default class Esx_PropertyTable extends LightningElement {

    @track property = [];
    @track allProperty = [];
    @track viewtype = 'grid';
    @track view = { gridView: false, cardView: false, listView: false, mobileView: false,moreRecords:0 };
    @track fetchrecord = 0;
    @track hasMoreData = true;

    // @track value = 'grid';


    get options() {
        return [
            { label: 'grid', value: 'grid' },
            { label: 'card', value: 'card' },
            { label: 'list', value: 'list' },
            { label: 'mobile', value: 'mobile' },
        ];
    }

    handleChange(event) {
        this.viewtype = event.detail.value;
        this.viewType();
    }

    connectedCallback() {
        this.getPropertyInfo();

        if (FORM_FACTOR == 'Small') {
            this.viewtype = 'mobile';
        }

        this.viewType();
        console.log('view type 1---->',JSON.parse(JSON.stringify(this.viewtype)));
    }

    viewType(){
        try {
            this.viewtype == 'grid' ? (this.view.gridView = true, this.view.cardView = false, this.view.listView = false, this.view.mobileView = false) :
            this.viewtype == 'card' ? (this.view.gridView = false, this.view.cardView = true, this.view.listView = false, this.view.mobileView = false) :
            this.viewtype == 'list' ? (this.view.gridView = false, this.view.cardView = false, this.view.listView = true, this.view.mobileView = false) :
            this.viewtype == 'mobile' ? (this.view.gridView = false, this.view.cardView = false, this.view.listView = false, this.view.mobileView = true) : null;

            console.log('view type 2---->', JSON.parse(JSON.stringify(this.viewtype)));
        } catch (error) {
            console.log('error-->', error);
        }
    }
       

    getPropertyInfo() {
        try {
            console.log('this.fetchrecord --->', this.fetchrecord);
            getListingData()
            .then(result => {
                console.log({ result });
                if (result != null) {
                        console.log('this.fetchrecord --->', this.fetchrecord);
                        console.log('result-->', result);
                        // this.property = result;
                        let properties = JSON.parse(JSON.stringify(result));
                        console.log('a--->' + properties);
                        console.log('a--->' + properties.length);

                        properties.forEach(property => {
                            console.log('1');
                            if (property.Listings__r && property.Listings__r.length > 0) {
                                let listing = property.Listings__r[0];
                                console.log('2');
                                    if (listing.Property__r) {
                                        listing['feture'] = `${listing.Property__r.Amenities__c || ''};${listing.Property__r.Indoor_Facilities__c || ''};${listing.Property__r.Outdoor_Facilities__c || ''}`.replace(/;+/g, ';').replace(/(^;|;$)/g, '').split(';') .slice(0, 3).join(' | ').replace(/\s*\|\s*\|\s*/g, ' | ').trim();
                                    }
                                if (!(listing.Property__r.Number_of_Bedrooms__c) && !(listing.Property__r.Number_of_Bathrooms__c) && !(listing.Property__r.Carpet_Area__c) ){
                                    listing['fetureAvali'] = false;
                                }else{
                                    listing['fetureAvali'] = true;
                                }                            
                            }
                        });
                        this.allProperty = this.property.concat(properties);
                        // this.property = properties;
                        this.loadMore();

                        console.log('property2-->', this.property);
                    } else {
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

    loadMore() {
        this.property = [...this.property, ...this.allProperty.slice(this.property.length, this.property.length + 4)];
        this.property.length >= this.allProperty.length ? this.hasMoreData = false : this.hasMoreData = true;
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