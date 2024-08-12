import { LightningElement, api, track, wire } from 'lwc';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import msgService from '@salesforce/messageChannel/filterMessageChannel__c';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class Esx_PropertyDataTable extends LightningElement {

    @track property = [];
    @track allProperty = [];
    subscription = null;
    @track receivedMessage = '';
    @track view = {
        gridView: false,
        listView: true,
        cardView: false,
        mobileView: false
    };
    @track hasMoreData = true;
    @track recordNotFound = false;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.getPropertyInfo();
        this.subscribeMC();
        this.handleFormFactor();
    }

    disconnectedCallback() {
        this.unsubscribeMC();
    }

    handleFormFactor() {
        (FORM_FACTOR === "Small") ? this.view = {
            gridView: false,
            listView: false,
            cardView: false,
            mobileView: true
        } : null;
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
                                    listing['feture'] = `${listing.Property__r.Amenities__c || ''};${listing.Property__r.Indoor_Facilities__c || ''};${listing.Property__r.Outdoor_Facilities__c || ''}`.replace(/;+/g, ';').replace(/(^;|;$)/g, '').split(';').slice(0, 3).join(' | ').replace(/\s*\|\s*\|\s*/g, ' | ').trim();
                                }
                                if (!(listing.Property__r.Number_of_Bedrooms__c) && !(listing.Property__r.Number_of_Bathrooms__c) && !(listing.Property__r.Carpet_Area__c)) {
                                    listing['fetureAvali'] = false;
                                } else {
                                    listing['fetureAvali'] = true;
                                }
                            }
                        });
                        this.allProperty = this.property.concat(properties);

                        let propertiess = this.allProperty; 
                        propertiess.sort((a, b) => {
                            let priceA = a.Listings__r[0].Listing_Price__c ? a.Listings__r[0].Listing_Price__c : 0;
                            let priceB = b.Listings__r[0].Listing_Price__c ? b.Listings__r[0].Listing_Price__c : 0;
                            return priceB - priceA;
                        });
                        this.allProperty = propertiess;
                        
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

    subscribeMC() {
        this.subscription = subscribe(
            this.messageContext,
            msgService,
            (message) => this.displayMessage(message)
        );
    }

    unsubscribeMC() {
        unsubscribe(this.subscription);
    }

    displayMessage(message) {
        console.log('displayMessage method');

        this.receivedMessage = message ? JSON.parse(JSON.stringify(message, null, '\t')) : null;
        console.log('this.receivedMessage----->', this.receivedMessage);
        this.filterData();
    }

    filterData() {

        try {

            let viewMessage = this.receivedMessage;
            console.log('json-->',JSON.stringify(viewMessage));
            

            if (viewMessage["filterInformation"]["label"] === 'view-type') {
                let type = viewMessage["filterInformation"]["view"];
                (FORM_FACTOR !== "Small") ? (type === 'List') ? this.view = { gridView: false, listView: true, cardView: false, mobileView: false } : (type === 'Columm') ? this.view = { gridView: false, listView: false, cardView: true, mobileView: false } : (type === 'Grid') ? this.view = { gridView: true, listView: false, cardView: false, mobileView: false } : null : null;
            } else if (viewMessage["filterInformation"]["label"] === 'sort-price'){

                let properties = this.allProperty; 

                if (viewMessage["filterInformation"]["sortBy"] === 'Price High to Low'){
                    properties.sort((a, b) => {
                        let priceA = a.Listings__r[0].Listing_Price__c ? a.Listings__r[0].Listing_Price__c : 0;
                        let priceB = b.Listings__r[0].Listing_Price__c ? b.Listings__r[0].Listing_Price__c : 0;
                        return priceB - priceA;
                    });
                    this.property = properties;
                } else if (viewMessage["filterInformation"]["sortBy"] === 'Price Low to High'){
                    properties.sort((a, b) => {
                        let priceA = a.Listings__r[0].Listing_Price__c ? a.Listings__r[0].Listing_Price__c : 0;
                        let priceB = b.Listings__r[0].Listing_Price__c ? b.Listings__r[0].Listing_Price__c : 0;
                        return priceB - priceA;
                    });
                    this.property = properties;
                }

                console.log(properties);
            } else {

                let bedroom = this.receivedMessage["filterInformation"]["bedroom"];
                let bathroom = this.receivedMessage["filterInformation"]["bathroom"];
                let minPrice = this.receivedMessage["filterInformation"]["minPrice"];
                let maxPrice = this.receivedMessage["filterInformation"]["maxPrice"];
                let zipcode = this.receivedMessage["filterInformation"]["zipcode"];
                let city = this.receivedMessage["filterInformation"]["city"];
                let square = this.receivedMessage["filterInformation"]["square"];
                let searchValue = this.receivedMessage["filterInformation"]["searchValue"];
                let sortBy = this.receivedMessage["filterInformation"]["sortBy"];

                let newArray = this.allProperty.filter(item => {
                    let pro = (item.Listings__r[0].Property__r);
                    let bed = (pro.Number_of_Bedrooms__c) ? (pro.Number_of_Bedrooms__c) >= bedroom : false;
                    let bath = (pro.Number_of_Bathrooms__c) ? (pro.Number_of_Bathrooms__c) >= bathroom : false;
                    let price = (maxPrice && minPrice)
                        ? (item.Listings__r.Listing_Price__c)
                            ? (maxPrice >= (item.Listings__r.Listing_Price__c && item.Listings__r.Listing_Price__c) >= minPrice)
                            : false
                        : (maxPrice)
                            ? (item.Listings__r.Listing_Price__c)
                                ? (maxPrice >= item.Listings__r.Listing_Price__c)
                                : false
                            : (minPrice)
                                ? (item.Listings__r.Listing_Price__c)
                                    ? (item.Listings__r.Listing_Price__c >= minPrice)
                                    : false
                                : true;
                    let zip = (zipcode) ? (pro.Postal_Code__c) ? ((pro.Postal_Code__c) === zipcode) : false : true;
                    let cit = (city) ? (pro.City__c) ? ((pro.Postal_Code__c) === city) : false : true;
                    let sqr = (square) ? (pro.Postal_Code__c) ? ((pro.Postal_Code__c) >= square) : false : true;
                    let sear = (searchValue) ? (pro.Name) ? ((pro.Name).includes(searchValue)) : false : true;

                    return bed && bath && price && zip && cit && sqr && sear;
                });

                console.log('array--->',JSON.stringify(newArray));
                console.log('array length--->',newArray.length);
                console.log('allProperty length--->',this.allProperty.length);
                
                if (newArray.length > 0){
                    if(newArray.length === (this.allProperty).length){
                       this.property = [];
                       this.loadMore(); 
                    }else if (newArray.length <= 4){
                        this.hasMoreData = false;
                        this.recordNotFound = false;
                        this.property = newArray;
                    }else{
                        this.property = newArray;
                        this.hasMoreData = true;
                        this.recordNotFound = false;
                    }

                }else{
                    this.hasMoreData = false;
                    this.recordNotFound = true;
                }
            }
        } catch (error) {
            console.log(error);
            console.log('error in filterData ---> ', error.message);
        }
    }
}