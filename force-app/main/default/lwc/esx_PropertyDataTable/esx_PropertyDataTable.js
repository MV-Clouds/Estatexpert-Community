import { LightningElement, api, track, wire } from 'lwc';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import msgService from '@salesforce/messageChannel/filterMessageChannel__c';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class Esx_PropertyDataTable extends LightningElement {


    @track property = []; // Use this to display the property data on the page
    @track allProperty = []; // Use this to store all property data
    @track searchAllProperty = []; // Store all search property information
    subscription = null;
    @track receivedMessage = ''; // Store the LMS message information
    @track view = {     // Store the view information
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

    // Use this method to disconnect from the unsubscribe method
    disconnectedCallback() {
        this.unsubscribeMC();
    }

    // Check the device type
    handleFormFactor() {
        (FORM_FACTOR === "Small") ? this.view = {
            gridView: false,
            listView: false,
            cardView: false,
            mobileView: true
        } : null;
    }

    // Fetch the property data from the backend
    getPropertyInfo() {
        try {
            getListingData()
                .then(result => {
                    console.log({ result });
                    if (result != null) {
                        let properties = JSON.parse(JSON.stringify(result));

                        properties.forEach(property => {
                            if (property.Listings__r && property.Listings__r.length > 0) {
                                let listing = property.Listings__r[0];
                                if (listing.Availability_Date__c){
                                    listing.Availability_Date__c = new Date(listing.Availability_Date__c).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                                }
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
                        this.searchAllProperty = this.allProperty;
                        this.loadMore();

                    } else {
                        console.error(error.stack);
                        this.showToast('Error', 'Something went Wrong', 'error');
                    }
                })
                .catch(error => {
                    console.error(error.stack);
                    this.showToast('Error', 'Something went Wrong', 'error');
                })
        } catch (error) {
            console.error(error.stack);
            this.showToast('Error', 'Something went Wrong', 'error');

        }
    }

    // Add the data to the frontend on button click
    loadMore() {
        this.property = [...this.property, ...this.searchAllProperty.slice(this.property.length, this.property.length + 4)];
        this.property.length >= this.searchAllProperty.length ? this.hasMoreData = false : this.hasMoreData = true;
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

    // lms part
    subscribeMC() {
        this.subscription = subscribe(
            this.messageContext,
            msgService,
            (message) => this.displayMessage(message)
        );
    }

    // lms part
    unsubscribeMC() {
        unsubscribe(this.subscription);
    }

    // Get the message from LMS and store the information in a variable
    displayMessage(message) {
        this.receivedMessage = message ? JSON.parse(JSON.stringify(message, null, '\t')) : null;
        this.filterData();
    }


    // Filter the properties based on the value using the filter method.
    filterData() {
        try {
            let viewMessage = this.receivedMessage;

            if (viewMessage["filterInformation"]["label"] === 'view-type') {
                let type = viewMessage["filterInformation"]["view"];
                (FORM_FACTOR !== "Small")
                    ? (type === 'List')
                        ? this.view = { gridView: false, listView: true, cardView: false, mobileView: false, }
                    : (type === 'Columm')
                        ? this.view = { gridView: false, listView: false, cardView: true, mobileView: false }
                    : (type === 'Grid')
                        ? this.view = { gridView: true, listView: false, cardView: false, mobileView: false }
                    : null
                : null;
                this.property = [];
                this.loadMore();

            } else if (viewMessage["filterInformation"]["label"] === 'sort-price') {

                let properties = this.searchAllProperty;
                this.property = [];

                if (viewMessage["filterInformation"]["sortBy"] === 'Price High to Low') {
                    properties.sort((a, b) => {
                        let priceA = a.Listings__r[0].Listing_Price__c ? a.Listings__r[0].Listing_Price__c : 0;
                        let priceB = b.Listings__r[0].Listing_Price__c ? b.Listings__r[0].Listing_Price__c : 0;
                        return priceB - priceA;
                    });
                    this.property = properties;

                } else if (viewMessage["filterInformation"]["sortBy"] === 'Price Low to High') {
                    properties.sort((a, b) => {
                        let priceA = a.Listings__r[0].Listing_Price__c ? a.Listings__r[0].Listing_Price__c : 0;
                        let priceB = b.Listings__r[0].Listing_Price__c ? b.Listings__r[0].Listing_Price__c : 0;
                        return priceB - priceA;
                    });
                    this.property = properties;
                }

            } else {

                let bedroom = this.receivedMessage["filterInformation"]["bedroom"];
                let bathroom = this.receivedMessage["filterInformation"]["bathroom"];
                let minPrice = Number(this.receivedMessage["filterInformation"]["minPrice"]);
                let maxPrice = Number(this.receivedMessage["filterInformation"]["maxPrice"]);
                let zipcode = Number(this.receivedMessage["filterInformation"]["zipcode"]);
                let city = this.receivedMessage["filterInformation"]["city"];
                let square = this.receivedMessage["filterInformation"]["square"];
                let searchValue = this.receivedMessage["filterInformation"]["searchValue"];
                let listingType = this.receivedMessage["filterInformation"]["listingType"];

                let newArray = this.allProperty.filter(item => {
                    let pro = (item.Listings__r[0].Property__r);
                    let listingPrice = item.Listings__r[0].Listing_Price__c;
                    let listingTypeValue = item.Listings__r[0].Listing_Type__c;
                    let bed = (pro.Number_of_Bedrooms__c) ? (pro.Number_of_Bedrooms__c) >= bedroom : false;
                    let bath = (pro.Number_of_Bathrooms__c) ? (pro.Number_of_Bathrooms__c) >= bathroom : false;
                    let price = (maxPrice && minPrice)
                        ? (listingPrice)
                            ? ((maxPrice >= (listingPrice)) && ((listingPrice) >= minPrice))
                            : false
                        : (maxPrice)
                            ? (listingPrice)
                                ? (maxPrice >= listingPrice)
                                : false
                            : (minPrice)
                                ? (listingPrice)
                                    ? (listingPrice >= minPrice)
                                    : false
                                : true;
                    let zip = (zipcode) ? (pro.Postal_Code__c) ? ((pro.Postal_Code__c) === zipcode) : false : true;
                    let cit = (city) ? (pro.City__c) ? (((pro.City__c).toLowerCase()) === (city.toLowerCase())) : false : true;
                    let sqr = (square) ? (pro.Carpet_Area__c) ? ((pro.Carpet_Area__c) >= square) : false : true;
                    let sear = (searchValue) ? (pro.Name) ? (((pro.Name).toLowerCase()).includes(searchValue.toLowerCase())) : false : true;
                    let lisType = (listingType) ? (listingTypeValue) ? (listingTypeValue === listingType) : false : true;

                    return bed && bath && price && zip && cit && sqr && sear && lisType;
                });

                this.property = [];

                console.log('newArray.length-->', newArray.length);
                
                if (newArray.length > 0) {

                    if (newArray.length === (this.allProperty).length) {
                        this.searchAllProperty = this.allProperty;
                        this.loadMore();

                    } else if (newArray.length <= 4) {
                        this.hasMoreData = false;
                        this.recordNotFound = false;
                        this.property = newArray;

                    } else {
                        this.searchAllProperty = newArray;
                        this.loadMore();
                        this.hasMoreData = true;
                        this.recordNotFound = false;
                    }

                } else {
                    this.hasMoreData = false;
                    this.recordNotFound = true;
                }
            }
        } catch (error) {
            console.error(error.stack);
        }
    }
}