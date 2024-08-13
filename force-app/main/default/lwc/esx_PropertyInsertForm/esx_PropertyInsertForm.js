import { LightningElement, track, wire } from 'lwc';
import backgroundImage from "@salesforce/resourceUrl/FavoriteProperties";
import getAllPicklistValues from '@salesforce/apex/ESX_PropertyInsertFormController.getAllPicklistValues';
import CreateProperty from '@salesforce/apex/ESX_PropertyInsertFormController.CreateProperty';
import popupIcons from '@salesforce/resourceUrl/popupicons1';
import isLoggedInUserDataCorrect from '@salesforce/apex/ESX_UserUtil.isLoggedInUserDataCorrect';
import dropdownAerrow from '@salesforce/resourceUrl/dropdownAerrow';
import { NavigationMixin } from 'lightning/navigation';
export default class Esx_PropertyInsertForm extends NavigationMixin(LightningElement) {
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
    @track isInserted = false;
    @track isError = false;
    @track errorMsg;
    @track isLoading = false;
    BgImage = backgroundImage + '/Bg-Image.png';
    deleteIcon = popupIcons + '/delete.png';
    sucessIcon = popupIcons + '/success.png';
    errorIcon = popupIcons + '/error.png';
    error;
    @track property = {
        saleOrRent: 'For Sell',
        propertyType: 'Flat / Apartment',
        city: null,
        locality: null,
        bedrooms: 1,
        balconies: 1,
        floorNumber: 'Lower Basement',
        totalFloors: '',
        furnishedStatus: 'Semi-furnished',
        bathrooms: 1,
        coveredArea: null,
        coveredAreaUnit: 'SqFeet',
        carpetArea: null,
        carpetAreaUnit: 'SqFeet',
        transactionType: 'Resale',
        possessionStatus: 'Ready to Move',
        availableFrom: null,
        expectedPrice: null,
        pricePerSqft: null,
        priceInclude: 'PLC',
        bookingAmount: null,
        maintenanceCharges: null,
        maintenanceChargesUnit: null,
        brokerage: null,
        responseFromBrokers: false,
        indoorAmenities: [],
        outdoorAmenities: [],
        nearbyLandmark: null,
        plotArea: null,
        plotBreadth: null,
        plotLength: null,
        currentOwner: this.contactId,
    };
    dropDownAerrowIcon = dropdownAerrow; 
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
                            setTimeout(() => {
                                const dropdowns = this.template.querySelectorAll('select');
                                console.log('dropdowns: ', dropdowns);
                                dropdowns.forEach((selector) =>{
                                    console.log('selector',selector);
                                    selector.style.backgroundImage=`url(${this.dropDownAerrowIcon})`});
                                const amenitiesDropdowns = this.template.querySelectorAll('.amenities-input');
                                amenitiesDropdowns.forEach((selector) =>{
                                    console.log('selector',selector);
                                    selector.style.backgroundImage=`url(${this.dropDownAerrowIcon})`});
                            }, 0);  
                        }
                    })
                    .catch(error => {
                        console.error(error.stack);
                    });
            }
        } catch (error) {
            console.error(error.stack);
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
            console.log('event.target.value==', event.target.value);
            this.property[field] = event.target.value;
            this.checkValidations(event);
        }
    }

    checkValidations(event) {
        const field = event.target;
        const value = field.value;
        const pattern = field.pattern;
        const errorMessage = field.dataset.errmsg || 'Invalid value';
        const errorElement = this.template.querySelector(`p[data-for="${field.name}"]`);

        console.log('values for validations:', field, value, errorMessage, errorElement);

        // Helper function to show error
        const showError = (input, message) => {
            input.style.border = '1px solid red';
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        };

        // Reset the field's border color and error message
        field.style.border = '1px solid rgba(191, 196, 215, 1)';
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // Perform validation based on field type and pattern
        if (field.required && !value) {
            showError(field, 'This field is required');
            return;
        }

        if (pattern && !new RegExp(pattern).test(value)) {
            showError(field, errorMessage);
            return;
        }

        // Specific field validations
        const specificValidations = [
            { name: 'totalFloors', condition: value <= 0, message: 'Total floors must be a positive integer.' },
            { name: 'carpetArea', condition: value <= 0, message: 'Carpet area must be a positive integer.' },
            { name: 'coveredArea', condition: value <= 0, message: 'Covered area must be a positive integer.' },
            { name: 'bookingAmount', condition: value <= 0, message: 'Booking amount must be a positive integer.' },
            { name: 'expectedPrice', condition: value < 10000 || value > 100000000, message: 'Value must be between 10,000 and 100,000,000.' },
            { name: 'maintenanceCharges', condition: value <= 0, message: 'Maintenance charge must be a positive integer.' },
            { name: 'plotArea', condition: value <= 0, message: 'Value must be a positive integer.' },
            { name: 'plotBreadth', condition: value <= 0, message: 'Value must be a positive integer.' },
            { name: 'plotLength', condition: value <= 0, message: 'Value must be a positive integer.' }
        ];

        const specificValidation = specificValidations.find(v => v.name === field.name && v.condition);
        if (specificValidation) {
            showError(field, specificValidation.message);
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
            this.isLoading = true;
            CreateProperty({ jsonData: JSON.stringify(this.property) }).then(result => {
                if (result) {
                    this.isData = true;
                    this.isLoading = false;
                    this.property = {
                        saleOrRent: 'For Sell',
                        propertyType: 'Flat / Apartment',
                        city: null,
                        locality: null,
                        bedrooms: 1,
                        balconies: 1,
                        floorNumber: 'Lower Basement',
                        totalFloors: null,
                        furnishedStatus: 'Semi-furnished',
                        bathrooms: 1,
                        coveredArea: null,
                        coveredAreaUnit: 'SqFeet',
                        carpetArea: null,
                        carpetAreaUnit: 'SqFeet',
                        transactionType: 'Resale',
                        possessionStatus: 'Ready to Move',
                        availableFrom: null,
                        expectedPrice: null,
                        pricePerSqft: null,
                        priceInclude: 'PLC',
                        bookingAmount: null,
                        maintenanceCharges: null,
                        maintenanceChargesUnit: null,
                        brokerage: null,
                        responseFromBrokers: false,
                        indoorAmenities: [],
                        outdoorAmenities: [],
                        nearbyLandmark: null,
                        plotArea: null,
                        plotBreadth: null,
                        plotLength: null,
                        currentOwner: this.contactId
                    };
                    this.showDropdown_indoor = false;
                    this.showDropdown_outdoor = false;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.isInserted = true;
                    setTimeout(() => {
                        const overlay = this.template.querySelector('.overlay');
                        overlay.style.display = 'block';
                    }, 0);
                    
                    this.connectedCallback();
                }
            }).catch(error => {
                this.isError = true;
                this.errorMsg = 'Something went wrong';
                const overlay = this.template.querySelector('.overlay');
                overlay.style.display = 'block';
                console.error('Error:', error.stack);
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    closePopup() {
        this.isInserted = false;
        this.isError = false;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'none';
    }

    increaseNumber(event) {
        if (event.target.name === 'bedrooms') {
            var input = this.template.querySelector('.bedrooms_number');
        } else if (event.target.name === 'balconies') {
            var input = this.template.querySelector('.balconies_number');
        } else if (event.target.name === 'bathrooms') {
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if (val < 15) {
            input.value = val + 1;
            if (event.target.name === 'bedrooms') {
                this.property.bedrooms = input.value;
            } else if (event.target.name === 'balconies') {
                this.property.balconies = input.value;
            } else if (event.target.name === 'bathrooms') {
                this.property.bathrooms = input.value;
            }
        }
    }

    decreaseNumber(event) {
        if (event.target.name === 'bedrooms') {
            var input = this.template.querySelector('.bedrooms_number');
        } else if (event.target.name === 'balconies') {
            var input = this.template.querySelector('.balconies_number');
        } else if (event.target.name === 'bathrooms') {
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if (val > 1) {
            input.value = val - 1;
            if (event.target.name === 'bedrooms') {
                this.property.bedrooms = input.value;
            } else if (event.target.name === 'balconies') {
                this.property.balconies = input.value;
            } else if (event.target.name === 'bathrooms') {
                this.property.bathrooms = input.value;
            }
        }
    }

    clickhandler(event) {
        if (event.target.name === 'outdoorAmenties') {
            this.showDropdown_outdoor = this.showDropdown_outdoor == true ? false : true;
            this.showDropdown_indoor = false;
            console.log('outdoorFacilities:', this.outdoorFacilities);
            setTimeout(() => {
                const checkboxes = this.template.querySelectorAll('lightning-input');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.property.outdoorAmenities.includes(checkbox.label);
                });
            }, 0);
        } else if (event.target.name === 'indoorAmenties') {
            this.showDropdown_indoor = this.showDropdown_indoor == true ? false : true;
            this.showDropdown_outdoor = false;
            setTimeout(() => {
                const checkboxes = this.template.querySelectorAll('lightning-input');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.property.indoorAmenities.includes(checkbox.label);
                });
            }, 0);
        }
    }

    handleRemove(event) {
        let index_of_amenty = this.property[event.currentTarget.dataset.field].indexOf(event.target.name);
        this.property[event.currentTarget.dataset.field].splice(index_of_amenty, 1);
    }

    showPlotAreaFields(event) {
        this.isPlotArea = this.isPlotArea == true ? false : true;
    }


    isValidForm() {
        let allValid = true;
        const fieldValues = {
            floorNumber: null,
            totalFloors: null,
            carpetArea: null,
            coveredArea: null,
            expectedPrice: null,
            bookingAmount: null,
            maintenanceCharges: null,
            plotArea: null,
            plotBreadth: null,
            plotLength: null
        };

        const inputs = [...this.template.querySelectorAll('input, select')];

        const showError = (input, message) => {
            const errorElement = this.template.querySelector(`p[data-for="${input.name}"]`);
            input.style.border = '1px solid red';
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
            allValid = false;
        };

        const hideError = (input) => {
            const errorElement = this.template.querySelector(`p[data-for="${input.name}"]`);
            if (input.name !== 'bathrooms' && input.name !== 'balconies' && input.name !== 'bedrooms') {
                input.style.border = '1px solid rgba(191, 196, 215, 1)';
            }
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        };

        inputs.forEach(input => {
            const fieldName = input.name;
            const pattern = input.pattern;
            const value = input.value;

            if (input.required && !value) {
                showError(input, 'This field is required');
            } else if (pattern && value.length > 0) {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    let errorMessage = 'Invalid input.';
                    if (input.name === 'city' || input.name === 'locality') {
                        errorMessage = 'This field only contains alphabetic characters.';
                    } else if (input.name === 'nearbyLandmark') {
                        errorMessage = 'Please enter a value with less than 255 characters.';
                    }
                    showError(input, errorMessage);
                } else {
                    hideError(input);
                }
            } else {
                hideError(input);
            }

            if (fieldValues.hasOwnProperty(fieldName)) {
                fieldValues[fieldName] = parseInt(value, 10);
            }
        });

        const {
            floorNumber,
            totalFloors,
            carpetArea,
            coveredArea,
            expectedPrice,
            bookingAmount,
            maintenanceCharges,
            plotArea,
            plotBreadth,
            plotLength
        } = fieldValues;

        const customValidations = [
            {
                condition: totalFloors !== null && totalFloors <= 0,
                inputName: 'totalFloors',
                message: 'Total floors must be a positive integer.'
            },
            {
                condition: floorNumber !== null && totalFloors !== null && floorNumber > totalFloors,
                inputName: 'floorNumber',
                message: 'Floor number cannot be greater than total floors.'
            },
            {
                condition: carpetArea !== null && carpetArea <= 0,
                inputName: 'carpetArea',
                message: 'Carpet area must be a positive integer.'
            },
            {
                condition: coveredArea !== null && coveredArea <= 0,
                inputName: 'coveredArea',
                message: 'Covered area must be a positive integer.'
            },
            {
                condition: carpetArea !== null && coveredArea !== null && carpetArea > coveredArea,
                inputName: 'carpetArea',
                message: 'Carpet area cannot be greater than covered area.'
            },
            {
                condition: bookingAmount !== null && bookingAmount <= 0,
                inputName: 'bookingAmount',
                message: 'Booking amount must be a positive integer.'
            },
            {
                condition: expectedPrice !== null && (expectedPrice < 10000 || expectedPrice > 100000000),
                inputName: 'expectedPrice',
                message: 'Value must be between 10,000 and 100,000,000.'
            },
            {
                condition: expectedPrice !== null && bookingAmount !== null && bookingAmount > expectedPrice,
                inputName: 'bookingAmount',
                message: 'Booking amount cannot be greater than expected price.'
            },
            {
                condition: maintenanceCharges !== null && maintenanceCharges <= 0,
                inputName: 'maintenanceCharges',
                message: 'Maintenance charge must be a positive integer.'
            },
            {
                condition: plotArea !== null && plotArea <= 0,
                inputName: 'plotArea',
                message: 'Plot area must be a positive integer.'
            },
            {
                condition: plotBreadth !== null && plotBreadth <= 0,
                inputName: 'plotBreadth',
                message: 'Plot breadth must be a positive integer.'
            },
            {
                condition: plotLength !== null && plotLength <= 0,
                inputName: 'plotLength',
                message: 'Plot length must be a positive integer.'
            },
            {
                condition: plotLength !== null && plotBreadth !== null && plotArea !== null && plotArea < (plotLength * plotBreadth),
                inputName: 'plotArea',
                message: 'Plot area must be greater than breadth * length.'
            }
        ];

        customValidations.forEach(({ condition, inputName, message }) => {
            if (condition) {
                const input = this.template.querySelector(`[name="${inputName}"]`);
                showError(input, message);
            }
        });

        return allValid;
    }

    navigatePage() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            },
        });
    }

}