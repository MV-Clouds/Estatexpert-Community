import { LightningElement,track,wire } from 'lwc';
import getAllPicklistValues from '@salesforce/apex/ESX_PropertyInsertFormController.getAllPicklistValues';
import CreateProperty from '@salesforce/apex/ESX_PropertyInsertFormController.CreateProperty';
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
    @track property = {
        saleOrRent: 'For Sell',
        propertyType: null,
        city: null,
        locality: null,
        bedrooms: 1,
        balconies: 1,
        floorNumber: null,
        totalFloors: null,
        furnishedStatus: null,
        bathrooms: 1,
        coveredArea: null,
        coveredAreaUnit: null,
        carpetArea: null,
        carpetAreaUnit: null,
        transactionType: null,
        possessionStatus: 'Ready to Move',
        availableFrom: null,
        expectedPrice: null,
        pricePerSqft: null,
        priceInclude:'PLC',
        bookingAmount: null,
        maintenanceCharges: null,
        maintenanceChargesUnit: null,
        brokerage: null,
        responseFromBrokers: false,
        indoorAmenities: null,
        outdoorAmenities: null,
        nearbyLandmark: null
    };

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

    handleInputChange(event) {
        const field = event.target.name;
        this.property[field] = event.target.value;
    }

    handleCheckboxChange(event) {
        const field = event.target.name;
        this.property[field] = event.target.checked;
    }
    getPropertyObject(){
        console.log('property:==>',this.property);
        console.log('object:',JSON.stringify(this.property));
        CreateProperty({jsonData:JSON.stringify(this.property)}).then(result=>{
            if(result){
                this.property = {
                    saleOrRent: 'For Sell',
                    propertyType: null,
                    city: null,
                    locality: null,
                    bedrooms: 1,
                    balconies: 1,
                    floorNumber: null,
                    totalFloors: null,
                    furnishedStatus: null,
                    bathrooms: 1,
                    coveredArea: null,
                    coveredAreaUnit: null,
                    carpetArea: null,
                    carpetAreaUnit: null,
                    transactionType: null,
                    possessionStatus: 'Ready to Move',
                    availableFrom: null,
                    expectedPrice: null,
                    pricePerSqft: null,
                    priceInclude:'PLC',
                    bookingAmount: null,
                    maintenanceCharges: null,
                    maintenanceChargesUnit: null,
                    brokerage: null,
                    responseFromBrokers: false,
                    indoorAmenities: null,
                    outdoorAmenities: null,
                    nearbyLandmark: null
                };
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }
    increaseNumber(event){
        if(event.target.name==='bedrooms'){
            var input = this.template.querySelector('.bedrooms_number');
        }else if(event.target.name==='balconies'){
            var input = this.template.querySelector('.balconies_number');
        }else{
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if(val<10){
            input.value = val+1;
            if(event.target.name==='bedrooms'){
                this.property.bedrooms = input.value;
            }else if(event.target.name==='balconies'){
                this.property.balconies = input.value;
            } 
            else{
                this.property.bathrooms = input.value;
            }
        }
    }
    decreaseNumber(event){
        if(event.target.name==='bedrooms'){
            var input = this.template.querySelector('.bedrooms_number');
        }else if(event.target.name==='balconies'){
            var input = this.template.querySelector('.balconies_number');
        }else{
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if(val>0){
            input.value = val-1;
            if(event.target.name==='bedrooms'){
                this.property.bedrooms = input.value;
            }else if(event.target.name==='balconies'){
                this.property.balconies = input.value;
            } 
            else{
                this.property.bathrooms = input.value;
            }
        }
    }
}