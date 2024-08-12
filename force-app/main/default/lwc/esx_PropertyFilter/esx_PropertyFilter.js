import { LightningElement, track,wire } from 'lwc';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import ListingType from "@salesforce/schema/Listing__c.Listing_Status__c";
import { publish, subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import msgService from '@salesforce/messageChannel/filterMessageChannel__c';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class Esx_PropertyFilter extends LightningElement {
    @track roomNumber = 1;
    @track roomNumberFilterInput = 1;
    @track bathRoomNumber = 1;
    @track bathRoomNumberFilterInput = 1;
    @track isShowModal = false;
    @track viewType = 'List';
    @track maxPrice;
    @track minPrice;
    @track zipcode;
    @track city = '';
    @track square;
    @track listType;
    @track listValue;
    @track searchValue = '';
    @track list = true;
    @track columm = false;
    @track grid = false;
    @track isDropdownOpen = false;
    @track deviceType = false;
    @track sortValue = 'Availability';
   
    @wire(getPicklistValues, { recordTypeId: null, fieldApiName: ListingType })
    picklistResults1({ error, data }) {
        if (data) {
            console.log('data picklist--->',data);
            this.listType = data.values;
        } else if (error) {
            console.log('error picklist value---->',error.message);    
        }
    }

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.handleFormFactor();
    }

    handleFormFactor() {
        (FORM_FACTOR === "Small") ? this.deviceType = true : this.deviceType = false;
    }

    showModalBox() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }

    increaseHandle(event){
        (event.currentTarget.dataset.name === 'bathroom') ? (this.bathRoomNumber < 15) ? (this.bathRoomNumber++, this.bathRoomNumberFilterInput = this.bathRoomNumber) : null : (event.currentTarget.dataset.name === 'room') ? (this.roomNumber < 15) ? (this.roomNumber++, this.roomNumberFilterInput = this.roomNumber) : null : null;
        (event.currentTarget.dataset.name === 'bathroom-filter-input') ? (this.bathRoomNumberFilterInput < 15) ? this.bathRoomNumberFilterInput++ : null : (event.currentTarget.dataset.name === 'room-filter-input') ? (this.roomNumberFilterInput < 15) ? this.roomNumberFilterInput++: null : null;

    }

    decreaseHandle(event){
        (event.currentTarget.dataset.name === 'bathroom') ? (this.bathRoomNumber > 1) ? (this.bathRoomNumber--, this.bathRoomNumberFilterInput = this.bathRoomNumber) : null : (event.currentTarget.dataset.name === 'room') ? (this.roomNumber > 1) ? (this.roomNumber--, this.roomNumberFilterInput = this.roomNumber) : null : null;
        (event.currentTarget.dataset.name === 'bathroom-filter-input') ? (this.bathRoomNumberFilterInput > 1) ? this.bathRoomNumberFilterInput-- : null : (event.currentTarget.dataset.name === 'room-filter-input') ? (this.roomNumberFilterInput > 1) ? this.roomNumberFilterInput-- : null : null;
    }

    handleKeyPress(event) {
         const charCode = event.charCode ? event.charCode : event.keyCode;
         (charCode != 8 && charCode != 0 && (charCode < 48 || charCode > 57)) ? event.preventDefault() : (event.target.dataset.label === "zipcode" && event.target.value.length >= 6) ? event.preventDefault() : null;
    }

    handleViewType(event){
        (this.viewType === 'List') ? (this.viewType = 'Columm', this.grid = false, this.columm = true, this.list = false) : (this.viewType === 'Columm') ? (this.viewType = 'Grid', this.grid = true, this.columm = false, this.list = false) : (this.viewType === 'Grid') ? (this.viewType = 'List', this.grid = false, this.columm = false, this.list = true) : null;
        this.handleApplyFilter(event);
    }

    handleInputChange(event) {
        try {
            if (event.target.dataset.label === "search"){
                this.searchValue = event.target.value;
            }else if (event.target.dataset.label === "listing") {
                this.listValue = event.target.value;
            } else if (event.target.dataset.label === "min-price") {
                this.minPrice = event.target.value;
            } else if (event.target.dataset.label === "max-price") {
                this.maxPrice = event.target.value;
            } else if (event.target.dataset.label === "square"){
                this.square = event.target.value;
            } else if (event.target.dataset.label === "city") {
                this.city  = event.target.value;
            } else if (event.target.dataset.label === "zipcode") {
                this.zipcode = event.target.value;
            } else if (event.target.dataset.label === "sort-price") {
                this.sortValue = event.target.value;
                this.handleApplyFilter(event);
            }
            console.log('event.target.dataset.label--->', event.target.dataset.label);
        } catch (error) {
            console.log('error--->',error.message);    
        }   
    }


    handleApplyFilter(event) {
        try {
            
            if (event.target.dataset.label === 'apply-filter'){

                this.bathRoomNumber = this.bathRoomNumberFilterInput;
                this.roomNumber = this.roomNumberFilterInput;

                const messagePayload = {
                    filterInformation: {
                        bedroom: this.roomNumber,
                        bathroom: this.bathRoomNumber,
                        view: this.viewType,
                        maxPrice: this.maxPrice,
                        minPrice: this.minPrice,
                        zipcode: this.zipcode,
                        city: this.city,
                        square: this.square,
                        listingType: this.listValue,
                        searchValue: this.searchValue,
                        sortBy: this.sortValue,
                        label: event.target.dataset.label
                    }
                };

                publish(this.messageContext, msgService, messagePayload);
                this.hideModalBox();

            } else if (event.target.dataset.label === 'search-button'){
                const messagePayload = {
                    filterInformation: {
                        bedroom: this.roomNumber,
                        bathroom: this.bathRoomNumber,
                        view: this.viewType,
                        maxPrice: this.maxPrice,
                        minPrice: this.minPrice,
                        zipcode: this.zipcode,
                        city: this.city,
                        square: this.square,
                        listingType: this.listValue,
                        searchValue: this.searchValue,
                        sortBy: this.sortValue,
                        label: event.target.dataset.label
                    }
                };

                publish(this.messageContext, msgService, messagePayload);
                
            } else if (event.currentTarget.dataset.label === 'view-type'){
                
                const messagePayload = {
                    filterInformation: {
                        view: this.viewType,
                        label: event.currentTarget.dataset.label
                    }
                };

                publish(this.messageContext, msgService, messagePayload);

            } else if (event.target.dataset.label === 'sort-price') {

                const messagePayload = {
                    filterInformation: {
                        sortBy: this.sortValue,
                        label: event.target.dataset.label
                    }
                };

                publish(this.messageContext, msgService, messagePayload);
            }
            
        } catch (error) {
            console.log('error--->',error.message)
        }
    }

    handleCancleFilter(){
        try {
            this.maxPrice = this.minPrice = this.square = this.zipcode = null;
            this.city = '';
            this.roomNumberFilterInput = this.bathRoomNumberFilterInput = 1;
        } catch (error) {
            console.log('error--->',error.message);
            
        }
    }
}