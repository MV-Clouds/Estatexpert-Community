import { LightningElement, track, wire } from 'lwc';
import getPicklistLabelName from '@salesforce/apex/ESX_PropertyDataTableController.getPicklistLabelName';
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
    @track listValue = '';
    @track searchValue = '';
    @track list = true;
    @track columm = false;
    @track grid = false;
    @track isDropdownOpen = false;
    @track deviceType = false;
    @track sortValue = 'Price High to Low';

    @wire(getPicklistLabelName)
    wiredData({ error, data }) {
      if (data) {
        const optionsList = Object.entries(data).map(([label, value]) => ({ label, value }));
        console.log(optionsList);
        this.listType = optionsList;
      } else if (error) {
        console.error('Error:', error);
      }
    }

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.handleFormFactor();
    }

    // Handle device type
    handleFormFactor() {
        (FORM_FACTOR === "Small") 
            ? this.deviceType = true 
                : this.deviceType = false;
    }

    // Handle popup
    showModalBox() {
        this.isShowModal = true;
    }

    // Handle popup
    hideModalBox() {
        this.isShowModal = false;
    }

    // Increase the room and bathroom values
    increaseHandle(event) {
        (event.currentTarget.dataset.name === 'bathroom') 
            ? (this.bathRoomNumber < 15) 
                ? (this.bathRoomNumber++, this.bathRoomNumberFilterInput = this.bathRoomNumber) 
                    : null 
        :(event.currentTarget.dataset.name === 'room') 
            ? (this.roomNumber < 15) 
                ? (this.roomNumber++, this.roomNumberFilterInput = this.roomNumber)
                    : null
        : null;

        (event.currentTarget.dataset.name === 'bathroom-filter-input') 
            ? (this.bathRoomNumberFilterInput < 15) 
                ? this.bathRoomNumberFilterInput++ 
                : null 
        : (event.currentTarget.dataset.name === 'room-filter-input') 
            ? (this.roomNumberFilterInput < 15) 
                ? this.roomNumberFilterInput++ 
                    : null 
        : null;

    }


    // Decrease the room and bathroom values
    decreaseHandle(event) {
        (event.currentTarget.dataset.name === 'bathroom') 
            ? (this.bathRoomNumber > 1) 
                ? (this.bathRoomNumber--, this.bathRoomNumberFilterInput = this.bathRoomNumber) 
                    : null 
        : (event.currentTarget.dataset.name === 'room') 
            ? (this.roomNumber > 1) 
                ? (this.roomNumber--, this.roomNumberFilterInput = this.roomNumber) 
                    : null 
        : null;

        (event.currentTarget.dataset.name === 'bathroom-filter-input') 
            ? (this.bathRoomNumberFilterInput > 1) 
                ? this.bathRoomNumberFilterInput-- 
                    : null 
        : (event.currentTarget.dataset.name === 'room-filter-input') 
            ? (this.roomNumberFilterInput > 1) 
                ? this.roomNumberFilterInput-- 
                    : null 
        : null;
    }

    // Check the input value to ensure it is a positive number and set the zipcode to six digits
    handleKeyPress(event) {
        const charCode = event.charCode ? event.charCode : event.keyCode;
        (charCode != 8 && charCode != 0 && (charCode < 48 || charCode > 57)) 
            ? event.preventDefault() 
        : (event.target.dataset.label === "zipcode" && event.target.value.length >= 6) 
            ? event.preventDefault() 
        : null;
    }

    // Change the view type based on the click
    handleViewType(event) {
        (this.viewType === 'List') 
            ? (this.viewType = 'Columm', this.grid = false, this.columm = true, this.list = false) 
        : (this.viewType === 'Columm') 
            ? (this.viewType = 'Grid', this.grid = true, this.columm = false, this.list = false) 
        : (this.viewType === 'Grid') 
            ? (this.viewType = 'List', this.grid = false, this.columm = false, this.list = true) 
        : null;

        this.handleApplyFilter(event);
    }

    // Store the value when the user enters it into the filter component
    handleInputChange(event) {
        try {
            let label = event.target.dataset.label;
            console.log('label-->',label);
            let value = event.target.value;
            console.log('value-->', value);

            if (label === "search") {
                this.searchValue = value;
            } else if (label === "listing") {
                this.listValue = value;
            } else if (label === "min-price") {
                this.minPrice = value;
            } else if (label === "max-price") {
                this.maxPrice = value;
            } else if (label === "square") {
                this.square = value;
            } else if (label === "city") {
                this.city = value;
            } else if (label === "zipcode") {
                this.zipcode = value;
            } else if (label === "sort-price") {
                this.sortValue = value;
                this.handleApplyFilter(event);
            }
        } catch (error) {
            console.error(error.stack);
        }
    }


    // Pass the message to another component using LMS based on the filter
    handleApplyFilter(event) {
        try {
            let labelValue = event.target.dataset.label;
            console.log('labelValue---', labelValue);
            

            if (labelValue === 'apply-filter') {

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
                        label: labelValue
                    }
                };

                publish(this.messageContext, msgService, messagePayload);
                this.hideModalBox();

            } else if (labelValue === 'search-button') {
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
                        label: labelValue
                    }
                };

                publish(this.messageContext, msgService, messagePayload);

            } else if (event.currentTarget.dataset.label === 'view-type') {

                const messagePayload = {
                    filterInformation: {
                        view: this.viewType,
                        label: event.currentTarget.dataset.label
                    }
                };

                publish(this.messageContext, msgService, messagePayload);

            } else if (labelValue === 'sort-price') {

                const messagePayload = {
                    filterInformation: {
                        sortBy: this.sortValue,
                        label: labelValue
                    }
                };

                publish(this.messageContext, msgService, messagePayload);
            }

        } catch (error) {
            console.error(error.stack);
        }
    }

    // Set the default value
    handleCancleFilter() {
        try {
            this.maxPrice = this.minPrice = this.square = this.zipcode = null;
            this.city = '';
            this.roomNumberFilterInput = this.bathRoomNumberFilterInput = 1;
        } catch (error) {
            console.error(error.stack);
        }
    }
}