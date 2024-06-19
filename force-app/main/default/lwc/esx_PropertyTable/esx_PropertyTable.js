import { LightningElement, api, track } from 'lwc';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Esx_PropertyTable extends LightningElement {

    @track property = [];
    @track view = 'List';
    // Grid  Card


    connectedCallback() {
        this.getPropertyInfo();
    }

    getPropertyInfo() {
        try {
            getListingData({ listingSize: 0 })
                .then(result => {
                    console.log({ result });
                    if (result != null) {
                        this.property = result;
                        console.log('property1-->',this.property);

                        console.log('size--',(this.property).length);
                        let properties = this.property;
                        console.log('a--->' + properties);
                        console.log('a--->' + properties.length);

                        // properties.forEach(property => {
                        //     if (property.Listings__r && property.Listings__r.length > 0) {
                        //         const listing = property.Listings__r[0];
                        //         if (listing.Property__r) {
                        //             const propertyDetails = listing.Property__r;
                        //             const amenities = propertyDetails.Amenities__c || '';
                        //             const indoorFacilities = propertyDetails.Indoor_Facilities__c || '';
                        //             const outdoorFacilities = propertyDetails.Outdoor_Facilities__c || '';

                        //             const combinedFacilities = `${amenities};${indoorFacilities};${outdoorFacilities}`.replace(/;/g, ' | ');
                        //             property.Listings__r[0].Amenities__c = combinedFacilities;
                        //         }
                        //     }
                        // });

                        // this.property = properties;

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