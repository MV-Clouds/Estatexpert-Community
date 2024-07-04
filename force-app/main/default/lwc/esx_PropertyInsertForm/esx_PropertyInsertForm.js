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
    @track contactId;
    @track showDropdown_outdoor = false;
    @track showDropdown_indoor = false;

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
        indoorAmenities: [],
        outdoorAmenities: [],
        nearbyLandmark: null,
        currentOwner: this.contactId,
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
    connectedCallback(){
        this.checkUserIsLoggedIn();
    }

    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
            if (loggedUserInfo) {
                let loggedUserInfoObj = JSON.parse(loggedUserInfo);
                console.log('contactId:', loggedUserInfoObj.contactId);
                this.contactId = loggedUserInfoObj.contactId;
            }
        } catch (error) {
            console.error({ error });
        }
    }

    handleInputChange(event) {
        console.log('name:',event.target.name);
        console.log('value:',event.target.value);

        const field = event.target.name;
        if(field === 'indoorAmenities' || field === 'outdoorAmenities'){
            if(event.target.checked){
                this.property[field].push(event.target.value);
            }else{
                let index_of_amenty = this.property[field].indexOf(event.target.value);
                    this.property[field].splice(index_of_amenty,1); 
            }
            console.log('property[indoorAmenities]:',JSON.stringify(this.property.indoorAmenities));
        }else{
            this.property[field] = event.target.value;
        }
    }

    handleCheckboxChange(event) {
        const field = event.target.name;
        this.property[field] = event.target.checked;
    }
    getPropertyObject(){
        console.log('property:==>',this.property);
        console.log('object:',JSON.stringify(this.property));
        if (this.isValidForm()){
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
                    nearbyLandmark: null,
                    currentOwner: this.contactId,
                };
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }
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

    isValidForm() {
        const allValid = [...this.template.querySelectorAll('lightning-input, input')]
            .reduce((validSoFar, inputCmp) => {
                if (inputCmp.tagName === 'LIGHTNING-INPUT') {
                    inputCmp.reportValidity();
                    return validSoFar && inputCmp.checkValidity();
                } else if (inputCmp.tagName === 'INPUT') {
                    if (!inputCmp.checkValidity()) {
                        inputCmp.reportValidity();
                        return false;
                    }
                }
                return validSoFar;
            }, true);
        return allValid;
    }

    clickhandler(event) {
        if(event.target.name === 'outdoorAmenties'){
            this.showDropdown_outdoor = this.showDropdown_outdoor==true?false:true;
        }
        if(event.target.name === 'indoorAmenties'){
            this.showDropdown_indoor = this.showDropdown_indoor==true?false:true;
        }
    }
    handleRemove(event){
        console.log('targetField:',event.currentTarget.dataset.field);
        console.log('property:',this.property[event.currentTarget.dataset.field]);
        console.log('name:',event.target.name);

        let index_of_amenty = this.property[event.currentTarget.dataset.field].indexOf(event.target.name);
        this.property[event.currentTarget.dataset.field].splice(index_of_amenty,1);
    }
}