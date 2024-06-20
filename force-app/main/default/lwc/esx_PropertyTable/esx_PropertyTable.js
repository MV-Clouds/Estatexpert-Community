import { LightningElement, api, track } from 'lwc';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Esx_PropertyTable extends LightningElement {

    @track property = [];
    @track viewtype = 'grid';
    @track view = { gridView: false, cardView: false, listView: false, mobileView: true,moreRecords:2 };
    @track fetchrecord = 0;

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
        // this.viewType();
        console.log('view type---->',this.view);
    }

    viewType(){
        try {
            this.viewtype == 'grid' ? (this.view.gridView = true, this.view.cardView = false, this.view.listView = false, this.view.mobileView = false,this.view.moreRecords = 2) :
            this.viewtype == 'card' ? (this.view.gridView = false, this.view.cardView = true, this.view.listView = false, this.view.mobileView = false, this.view.moreRecords = 3) :
            this.viewtype == 'list' ? (this.view.gridView = false, this.view.cardView = false, this.view.listView = true, this.view.mobileView = false, this.view.moreRecords = 4) :
            this.viewtype == 'mobile' ? (this.view.gridView = false, this.view.cardView = false, this.view.listView = false, this.view.mobileView = true, this.view.moreRecords = 5) : null;
        } catch (error) {
            console.log('error-->', error);
        }
    }
       

    getPropertyInfo() {
        try {
            
            getListingData({ listingSize: this.fetchrecord = this.fetchrecord + this.view.moreRecords})
                .then(result => {
                    console.log({ result });
                    if (result != null) {
                        console.log('result-->', result);
                        this.property = result;
                        let properties = JSON.parse(JSON.stringify(this.property));
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
                        this.property = properties;

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