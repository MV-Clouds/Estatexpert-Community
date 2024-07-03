import { LightningElement,track,wire } from 'lwc';
import getAllPicklistValues from '@salesforce/apex/ESX_PropertyInsertFormController.getAllPicklistValues';
export default class Esx_PropertyInsertForm extends LightningElement {
    get propTypes() {
        return [
            { label: 'Flat / Apartment', value: 'Flat / Apartment' },
            { label: 'Residential Land / Plot', value: 'Residential Land / Plot' },
            { label: 'Commercial shop', value: 'Commercial shop' },
        ];
    }

    @track propertyTypes =[];
    @track floorNumbers =[];
    @track furnishedStatuses =[];
    @track transactionTypes =[];
    @track priceIncludes =[];
    @track possessionStatus =[];
    @track indoorFacilities =[];
    @track outdoorFacilities =[];
    @track brokerages = [];
    @track carpetareaUnits = [];
    @track coveredareaUnits =[];
    error;

    @wire(getAllPicklistValues)
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.propertyTypes = data.propertyTypes.map(value => {
                return { label: value, value: value };
            });
            this.floorNumbers = data.floorNumbers.map(value => {
                return { label: value, value: value };
            });
            this.furnishedStatuses = data.furnishedStatuses.map(value => {
                return { label: value, value: value };
            });
            this.transactionTypes = data.transactionTypes.map(value => {
                return { label: value, value: value };
            });
            this.priceIncludes = data.priceIncludes.map(value => {
                return { label: value, value: value };
            });
            this.possessionStatus = data.possessionStatus.map(value => {
                return { label: value, value: value };
            });
            this.indoorFacilities = data.indoorFacilities.map(value => {
                return { label: value, value: value };
            });
            this.outdoorFacilities = data.outdoorFacilities.map(value => {
                return { label: value, value: value };
            });
            this.brokerages = data.brokerages.map(value => {
                return { label: value, value: value };
            });
            this.carpetareaUnits = data.carpetareaUnits.map(value => {
                return { label: value, value: value };
            });
            this.coveredareaUnits = data.coveredareaUnits.map(value => {
                return { label: value, value: value };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.propertyTypes = [];
            this.floorNumbers = [];
            this.furnishedStatuses = [];
            this.transactionTypes =[];
            this.priceIncludes =[];
            this.possessionStatus =[];
            this.indoorFacilities =[];
            this.outdoorFacilities =[];
        }
    }
}