import { LightningElement, track, wire } from 'lwc';
import backgroundImage from "@salesforce/resourceUrl/FavoriteProperties";
import getAllPicklistValues from '@salesforce/apex/ESX_PropertyInsertFormController.getAllPicklistValues';
import CreateProperty from '@salesforce/apex/ESX_PropertyInsertFormController.CreateProperty';
import popupIcons from '@salesforce/resourceUrl/popupIcons';
import isLoggedInUserDataCorrect from '@salesforce/apex/ESX_UserUtil.isLoggedInUserDataCorrect';
import dropdownAerrow from '@salesforce/resourceUrl/dropdownAerrow';
export default class Esx_PropertyInsertForm extends LightningElement {
    @track propertyTypes = [];
    @track floorNumbers = [];
    @track furnishedStatuses = [];
    @track transactionTypes = [];
    @track priceIncludes = [];
    @track possessionStatus = [];
    @track indoorFacilities = [];
    @track outdoorFacilities = [];
    @track brokerages = [];
    @track carpetareaUnits = [];
    @track coveredareaUnits = [];
    @track contactId;
    @track showDropdown_outdoor = false;
    @track showDropdown_indoor = false;
    @track isData = false;
    @track isPlotArea = false;
    @track isModalOpen = false;
    BgImage = backgroundImage + '/Bg-Image.png';
    saveIcon = popupIcons + '/Vector (17).png';
    error;
    @track property = {
        saleOrRent: 'For Sell',
        propertyType: 'Flat / Apartment',
        city: null,
        locality: null,
        bedrooms: 1,
        balconies: 1,
        floorNumber: 'Lower Basement',
        totalFloors: 0,
        furnishedStatus: 'Semi-furnished',
        bathrooms: 1,
        coveredArea: 0,
        coveredAreaUnit: 'SqFeet',
        carpetArea: 0,
        carpetAreaUnit: 'SqFeet',
        transactionType: 'Resale',
        possessionStatus: 'Ready to Move',
        availableFrom: null,
        expectedPrice: null,
        pricePerSqft: null,
        priceInclude: 'PLC',
        bookingAmount: 0,
        maintenanceCharges: null,
        maintenanceChargesUnit: null,
        brokerage: null,
        responseFromBrokers: false,
        indoorAmenities: [],
        outdoorAmenities: [],
        nearbyLandmark: null,
        plotArea: 0,
        plotBreadth: 0,
        plotLength: 0,
        currentOwner: this.contactId,
    };

    @wire(getAllPicklistValues)
    wiredPicklistValues({ error, data }) {
        if (data) {
            const picklistFields = [
                'propertyTypes',
                'floorNumbers',
                'furnishedStatuses',
                'transactionTypes',
                'priceIncludes',
                'possessionStatus',
                'indoorFacilities',
                'outdoorFacilities',
                'brokerages',
                'carpetareaUnits',
                'coveredareaUnits'
            ];

            picklistFields.forEach(field => {
                this[field] = data[field].map(value => ({ label: value, value: value }));
            });

            this.error = undefined;
        } else if (error) {
            this.error = error;
            const picklistFields = [
                'propertyTypes',
                'floorNumbers',
                'furnishedStatuses',
                'transactionTypes',
                'priceIncludes',
                'possessionStatus',
                'indoorFacilities',
                'outdoorFacilities',
                'brokerages',
                'carpetareaUnits',
                'coveredareaUnits'
            ];

            picklistFields.forEach(field => {
                this[field] = [];
            });
        }
    }
    connectedCallback() {
        this.checkUserIsLoggedIn();
        console.log('propertydata in connected:==', JSON.stringify(this.property))
    }

    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
            if (loggedUserInfo) {
                let loggedUserInfoObj = JSON.parse(loggedUserInfo);
                isLoggedInUserDataCorrect({ contactId: loggedUserInfoObj.contactId, siteUserId: loggedUserInfoObj.siteUserId })
                    .then(result => {
                        console.log('isLoggedInUserDataCorrect ** => ', result);
                        if (result) {
                            this.contactId = loggedUserInfoObj.contactId;
                            this.property['currentOwner'] = loggedUserInfoObj.contactId;
                            this.isData = true;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        } catch (error) {
            console.error({ error });
        }
    }

    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'indoorAmenities' || field === 'outdoorAmenities') {
            if (event.target.checked) {
                this.property[field].push(event.target.value);
            } else {
                let index_of_amenty = this.property[field].indexOf(event.target.value);
                this.property[field].splice(index_of_amenty, 1);
            }
            console.log('property[indoorAmenities]:', JSON.stringify(this.property.indoorAmenities));
        } else {
            this.property[field] = event.target.value;
        }
    }

    handleCheckboxChange(event) {
        const field = event.target.name;
        this.property[field] = event.target.checked;
    }

    getPropertyObject() {
        console.log('property:==>', this.property);
        console.log('object:', JSON.stringify(this.property));
        if (this.isValidForm()) {
            CreateProperty({ jsonData: JSON.stringify(this.property) }).then(result => {
                if (result) {
                    this.property = {
                        saleOrRent: 'For Sell',
                        propertyType: 'Flat / Apartment',
                        city: null,
                        locality: null,
                        bedrooms: 1,
                        balconies: 1,
                        floorNumber: 'Lower Basement',
                        totalFloors: 0,
                        furnishedStatus: 'Semi-furnished',
                        bathrooms: 1,
                        coveredArea: 0,
                        coveredAreaUnit: 'SqFeet',
                        carpetArea: 0,
                        carpetAreaUnit: 'SqFeet',
                        transactionType: 'Resale',
                        possessionStatus: 'Ready to Move',
                        availableFrom: null,
                        expectedPrice: null,
                        pricePerSqft: null,
                        priceInclude: 'PLC',
                        bookingAmount: 0,
                        maintenanceCharges: null,
                        maintenanceChargesUnit: null,
                        brokerage: null,
                        responseFromBrokers: false,
                        indoorAmenities: [],
                        outdoorAmenities: [],
                        nearbyLandmark: null,
                        plotArea: 0,
                        plotBreadth: 0,
                        plotLength: 0,
                        currentOwner: this.contactId,
                    };
                    this.showDropdown_indoor = false;
                    this.showDropdown_outdoor = false;
                    this.isModalOpen = true;
                    const overlay = this.template.querySelector('.overlay');
                    overlay.style.display = 'block';
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        }
    }
    closePopup(){
        this.inquiryIdtoDelete = '';
        this.isModalOpen = false;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'none';
    }

    increaseNumber(event) {
        if (event.target.name === 'bedrooms') {
            var input = this.template.querySelector('.bedrooms_number');
        } else if (event.target.name === 'balconies') {
            var input = this.template.querySelector('.balconies_number');
        } else if(event.target.name === 'bathrooms') {
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if (val < 10) {
            input.value = val + 1;
            if (event.target.name === 'bedrooms') {
                this.property.bedrooms = input.value;
            } else if (event.target.name === 'balconies') {
                this.property.balconies = input.value;
            } else if(event.target.name === 'bathrooms') {
                this.property.bathrooms = input.value;
            }
        }
    }

    decreaseNumber(event) {
        if (event.target.name === 'bedrooms') {
            var input = this.template.querySelector('.bedrooms_number');
        } else if (event.target.name === 'balconies') {
            var input = this.template.querySelector('.balconies_number');
        } else if(event.target.name === 'bathrooms') {
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if (val > 0) {
            input.value = val - 1;
            if (event.target.name === 'bedrooms') {
                this.property.bedrooms = input.value;
            } else if (event.target.name === 'balconies') {
                this.property.balconies = input.value;
            } else if(event.target.name === 'bathrooms') {
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
        if (event.target.name === 'outdoorAmenties') {
            this.showDropdown_outdoor = this.showDropdown_outdoor == true ? false : true;
        } else if (event.target.name === 'indoorAmenties') {
            this.showDropdown_indoor = this.showDropdown_indoor == true ? false : true;
        }
    }
    handleRemove(event) {
        let index_of_amenty = this.property[event.currentTarget.dataset.field].indexOf(event.target.name);
        this.property[event.currentTarget.dataset.field].splice(index_of_amenty, 1);
    }
    showPlotAreaFields(event) {
        this.isPlotArea = this.isPlotArea == true ? false : true;
    }
}