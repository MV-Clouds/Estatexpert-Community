import { LightningElement, track, wire } from 'lwc';
import backgroundImage from "@salesforce/resourceUrl/FavoriteProperties";
import getAllPicklistValues from '@salesforce/apex/ESX_PropertyInsertFormController.getAllPicklistValues';
import CreateProperty from '@salesforce/apex/ESX_PropertyInsertFormController.CreateProperty';
import popupIcons from '@salesforce/resourceUrl/popupicons1';
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
    @track isInserted = false;
    @track isError = false;
    @track errorMsg;
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
            console.log('event.target.value==',event.target.value);
            this.property[field] = event.target.value;
            this.checkValidations(event);
        }
    }

    checkValidations(event){
        const field = event.target;
        const value = field.value;
        const pattern = field.pattern;
        const errorMessage = field.dataset.errmsg;
        const errorElement = this.template.querySelector(`p[data-for="${field.name}"]`);

        // const errorElement = field.nextElementSibling;

        // Reset the field's border color and error message
        field.style.border = '1px solid rgba(191, 196, 215, 1)';
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // Perform validation based on field type and pattern
        if (field.required && !value) {
            field.style.border = '1px solid red';
            if (errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.style.display = 'block';
            }
            return;
        }

        if (pattern) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                field.style.border = '1px solid red';
                if (errorElement) {
                    errorElement.textContent = errorMessage || 'Invalid format';
                    errorElement.style.display = 'block';
                }
            }
        }
        if(field.name==='totalFloors'){
            if (value !== null && value <= 0) {
                const totalFloorsInput = this.template.querySelector('input[name="totalFloors"]');
                // const errorElement = totalFloorsInput.nextElementSibling;
                const errorElement = this.template.querySelector('p[data-for="totalFloors"]');
                console.log('errorElement',errorElement);
                console.log('totalFloorsInput',totalFloorsInput);
                totalFloorsInput.style.border = '1px solid red';
                if (errorElement != null) {
                    errorElement.textContent = 'Total floors must be a positive integer.';
                    errorElement.style.display = 'block';
                }
            }
        }
        if(field.name==='carpetArea'){
            if (value !== null && value <= 0) {
                const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
                const errorElement = carpetAreaInput.nextElementSibling;
                // const errorElement = this.template.querySelector(`p[data-for="carpetArea"]`);
                carpetAreaInput.style.border = '1px solid red';
                if (errorElement != null) {
                    errorElement.textContent = 'Carpet area must be a positive integer.';
                    errorElement.style.display = 'block';
                }
            }
        }
        if(field.name==='coveredArea'){
            if (value !== null && value <= 0) {
                const coveredAreaInput = this.template.querySelector('input[name="coveredArea"]');
                const errorElement = coveredAreaInput.nextElementSibling;
                // const errorElement = this.template.querySelector(`p[data-for="coveredArea"]`);
                coveredAreaInput.style.border = '1px solid red';
                if (errorElement != null) {
                    errorElement.textContent = 'Covered area must be a positive integer.';
                    errorElement.style.display = 'block';
                }
            }
        }
        if(field.name==='bookingAmount'){
            if (value !== null && value <= 0) {
                const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
                const errorElement = bookingAmountInput.nextElementSibling;
                // const errorElement = this.template.querySelector(`p[data-for="bookingAmount"]`);
                bookingAmountInput.style.border = '1px solid red';
                if (errorElement != null) {
                    errorElement.textContent = 'Booking amount must be a positive integer.';
                    errorElement.style.display = 'block';
                }
            }
        }
        if(field.name==='expectedPrice'){
            if (value !== null && (value<10000 || value>100000000)) {
                const bookingAmountInput = this.template.querySelector('input[name="expectedPrice"]');
                const errorElement = bookingAmountInput.nextElementSibling;
                // const errorElement = this.template.querySelector(`p[data-for="expectedPrice"]`);
                bookingAmountInput.style.border = '1px solid red';
                if (errorElement != null) {
                    errorElement.textContent = 'Value must be between 10,000 and 100,000,000.';
                    errorElement.style.display = 'block';
                }
            }
        }
        if(field.name==='maintenanceCharges'){
            if (value !== null && value <= 0) {
                const maintenanceChargeInput = this.template.querySelector('input[name="maintenanceCharges"]');
                const errorElement = maintenanceChargeInput.nextElementSibling;
                // const errorElement = this.template.querySelector(`p[data-for="maintenanceCharges"]`);
                maintenanceChargeInput.style.border = '1px solid red';
                if (errorElement != null) {
                    errorElement.textContent = 'Maintenance charge must be a positive integer.';
                    errorElement.style.display = 'block';
                }
            }
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
                    this.isData=false;
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
                    const overlay = this.template.querySelector('.overlay');
                    overlay.style.display = 'block';
                    this.connectedCallback();
                }
            }).catch(error => {
                this.isError = true;
                this.errorMsg = error.body;
                const overlay = this.template.querySelector('.overlay');
                overlay.style.display = 'block';
                console.error('Error:', error);
            });
        }else{
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    closePopup(){
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
        } else if(event.target.name === 'bathrooms') {
            var input = this.template.querySelector('.bathrooms_number');
        }
        var val = parseInt(input.value, 10);
        if (val < 15) {
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
        if (val > 1) {
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

    // isValidForm() {
    //     const allValid = [...this.template.querySelectorAll('lightning-input, input')]
    //         .reduce((validSoFar, inputCmp) => {
    //             if (inputCmp.tagName === 'LIGHTNING-INPUT') {
    //                 inputCmp.reportValidity();
    //                 return validSoFar && inputCmp.checkValidity();
    //             } else if (inputCmp.tagName === 'INPUT') {
    //                 if (!inputCmp.checkValidity()) {
    //                     inputCmp.reportValidity();
    //                     return false;
    //                 }
    //             }
    //             return validSoFar;
    //         }, true);
    //     return allValid;
    // }

    // isValidForm() {
    //     let allValid = true;
    //     let floorNumber = null;
    //     let totalFloors = null;
    //     let carpetArea = null;
    //     let coveredArea = null;
    //     let expectedPrice = null;
    //     let bookingAmount = null;
    
    //     // Query all input fields
    //     const inputs = [...this.template.querySelectorAll('lightning-input, input, select')];
    
    //     inputs.forEach(inputCmp => {
    //         if (inputCmp.tagName === 'LIGHTNING-INPUT' || inputCmp.tagName === 'INPUT' || inputCmp.tagName === 'SELECT') {
    //             inputCmp.setCustomValidity(''); // Reset custom validity
    //             if (!inputCmp.checkValidity()) {
    //                 allValid = false;
    //                 inputCmp.reportValidity();
    //             }
    
    //             if (inputCmp.name === 'floorNumber') {
    //                 console.log('floorNumber:===');
    //                 floorNumber = parseInt(inputCmp.value, 10);
    //                 console.log('floorNumber:===',floorNumber);
    //                 console.log('Floor Number:', inputCmp.value, 'Parsed Floor Number:', floorNumber);
    //             }
    //             if (inputCmp.name === 'totalFloors') {
    //                 totalFloors = parseInt(inputCmp.value, 10);
    //                 console.log('totalFloors:===',totalFloors);
    //             }
    //             if (inputCmp.name === 'carpetArea') {
    //                 carpetArea = parseInt(inputCmp.value, 10);
    //                 console.log('carpetArea:===',carpetArea);
    //             }
    //             if (inputCmp.name === 'coveredArea') {
    //                 coveredArea = parseInt(inputCmp.value, 10);
    //                 console.log('coveredArea:===',coveredArea);
    //             }
    //             if (inputCmp.name === 'expectedPrice') {
    //                 expectedPrice = parseInt(inputCmp.value, 10);
    //                 console.log('expectedPrice:===',expectedPrice);
    //             }
    //             if (inputCmp.name === 'bookingAmount') {
    //                 bookingAmount = parseInt(inputCmp.value, 10);
    //                 console.log('bookingAmount:===',bookingAmount);
    //             }
                
    //         }
    //     });
    //     // Custom validations
    //     if (floorNumber !== null && totalFloors !== null) {
    //         if (totalFloors <= 0) {
    //             const totalFloorsInput = this.template.querySelector('input[name="totalFloors"]');
    //             totalFloorsInput.setCustomValidity('Total floors must be a positive integer.');
    //             totalFloorsInput.reportValidity();
    //             allValid = false;
    //         }
    //         if (floorNumber > totalFloors) {
    //             console.log('floorNumber > totalFloors:===');
    //             const floorNumberInput = this.template.querySelector('input[name="totalFloors"]');
    //             floorNumberInput.setCustomValidity('Floor number cannot be greater than total floors.');
    //             floorNumberInput.reportValidity();
    //             allValid = false;
    //         }
    //     }
    //     if (carpetArea !== null && coveredArea !== null) {
    //         if (carpetArea <= 0) {
    //             const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
    //             carpetAreaInput.setCustomValidity('Carpet area must be a positive integer.');
    //             carpetAreaInput.reportValidity();
    //             allValid = false;
    //         }
    //         if (coveredArea <= 0) {
    //             const coveredAreaInput = this.template.querySelector('input[name="coveredArea"]');
    //             coveredAreaInput.setCustomValidity('Covered area must be a positive integer.');
    //             coveredAreaInput.reportValidity();
    //             allValid = false;
    //         }
    //         if (carpetArea > coveredArea) {
    //             const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
    //             carpetAreaInput.setCustomValidity('Carpet area cannot be greater than Covered area.');
    //             carpetAreaInput.reportValidity();
    //             allValid = false;
    //         }
    //     }
    //     if (expectedPrice !== null && bookingAmount !== null) {
    //         if (bookingAmount <= 0) {
    //             const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
    //             bookingAmountInput.setCustomValidity('Booking amount must be a positive integer.');
    //             bookingAmountInput.reportValidity();
    //             allValid = false;
    //         }
    //         if (bookingAmount > expectedPrice) {
    //             console.log('floorNumber > totalFloors:===');
    //             const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
    //             bookingAmountInput.setCustomValidity('Booking amount cannot be greater than Expected price.');
    //             bookingAmountInput.reportValidity();
    //             allValid = false;
    //         }
    //     }
    //     return allValid;
    // }

    // isValidForm() {
    //     let allValid = true;
    //     const fieldValues = {
    //         floorNumber: null,
    //         totalFloors: null,
    //         carpetArea: null,
    //         coveredArea: null,
    //         expectedPrice: null,
    //         bookingAmount: null,
    //         maintenanceCharges:null
    //     };
    
    //     // Query all input fields and the select field
    //     const inputs = [...this.template.querySelectorAll('lightning-input, input, select')];
    
    //     inputs.forEach(inputCmp => {
    //         const fieldName = inputCmp.name;
    //         if (inputCmp.tagName === 'INPUT' || inputCmp.tagName === 'SELECT') {
    //             inputCmp.setCustomValidity('');
    //             if (inputCmp.name === 'city' || inputCmp.name === 'locality') {
    //                 if (!inputCmp.checkValidity()) {
    //                     inputCmp.setCustomValidity('This field only containes alphabetic characters');
    //                     inputCmp.reportValidity();
    //                     allValid = false;
    //                 }
    //             }else if (inputCmp.name === 'nearbyLandmark') {
    //                 if (!inputCmp.checkValidity()) {
    //                     inputCmp.setCustomValidity('Please enter value which containes less than 255 characters');
    //                     inputCmp.reportValidity();
    //                     allValid = false;
    //                 }
    //             }else{
    //                 inputCmp.setCustomValidity(''); // Reset custom validity
    //                 if (!inputCmp.checkValidity()) {
    //                     allValid = false;
    //                     inputCmp.reportValidity();
    //                 }
    //                 if (fieldValues.hasOwnProperty(fieldName)) {
    //                     console.log('inputCmp.value::::::====>>>>',inputCmp.value);
    //                     fieldValues[fieldName] = parseInt(inputCmp.value, 10);
    //                 }
    //             }
    //         }
    //     });
    //     console.log('fieldValues:===:==:>',JSON.stringify(fieldValues));
    
    //     // Custom validations
    //     const {
    //         floorNumber,
    //         totalFloors,
    //         carpetArea,
    //         coveredArea,
    //         expectedPrice,
    //         bookingAmount,
    //         maintenanceCharges
    //     } = fieldValues;
        
    //     console.log('bookingAmount:===:==:>',bookingAmount);

    //     if (totalFloors !== null && totalFloors <= 0) {
    //         const totalFloorsInput = this.template.querySelector('input[name="totalFloors"]');
    //         totalFloorsInput.setCustomValidity('Total floors must be a positive integer.');
    //         totalFloorsInput.reportValidity();
    //         allValid = false;
    //     }
    //     if (floorNumber !== null && totalFloors !== null && floorNumber > totalFloors) {
    //         const floorNumberInput = this.template.querySelector('select[name="floorNumber"]');
    //         floorNumberInput.setCustomValidity('Floor number cannot be greater than total floors.');
    //         floorNumberInput.reportValidity();
    //         allValid = false;
    //     }
    
    //     if (carpetArea !== null && carpetArea <= 0) {
    //         const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
    //         carpetAreaInput.setCustomValidity('Carpet area must be a positive integer.');
    //         carpetAreaInput.reportValidity();
    //         allValid = false;
    //     }
    //     if (coveredArea !== null && coveredArea <= 0) {
    //         const coveredAreaInput = this.template.querySelector('input[name="coveredArea"]');
    //         coveredAreaInput.setCustomValidity('Covered area must be a positive integer.');
    //         coveredAreaInput.reportValidity();
    //         allValid = false;
    //     }
    //     if (carpetArea !== null && coveredArea !== null && carpetArea > coveredArea) {
    //         const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
    //         carpetAreaInput.setCustomValidity('Carpet area cannot be greater than covered area.');
    //         carpetAreaInput.reportValidity();
    //         allValid = false;
    //     }
    
    //     if (bookingAmount !== null && bookingAmount <= 0) {
    //         const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
    //         bookingAmountInput.setCustomValidity('Booking amount must be a positive integer.');
    //         bookingAmountInput.reportValidity();
    //         allValid = false;
    //     }
    //     if (expectedPrice !== null && bookingAmount !== null && bookingAmount > expectedPrice) {
    //         const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
    //         bookingAmountInput.setCustomValidity('Booking amount cannot be greater than expected price.');
    //         bookingAmountInput.reportValidity();
    //         allValid = false;
    //     }
    //     if (maintenanceCharges !== null && maintenanceCharges <= 0) {
    //         const maintenanceChargeInput = this.template.querySelector('input[name="maintenanceCharges"]');
    //         maintenanceChargeInput.setCustomValidity('Maintanance Charge must be a positive integer.');
    //         maintenanceChargeInput.reportValidity();
    //         allValid = false;
    //     }
    
    //     return allValid;
    // }

    clickhandler(event) {
        if (event.target.name === 'outdoorAmenties') {
            this.showDropdown_outdoor = this.showDropdown_outdoor == true ? false : true;
            this.showDropdown_indoor = false;
        } else if (event.target.name === 'indoorAmenties') {
            this.showDropdown_indoor = this.showDropdown_indoor == true ? false : true;
            this.showDropdown_outdoor = false;
        }
    }

    handleRemove(event) {
        let index_of_amenty = this.property[event.currentTarget.dataset.field].indexOf(event.target.name);
        this.property[event.currentTarget.dataset.field].splice(index_of_amenty, 1);
    }

    showPlotAreaFields(event) {
        this.isPlotArea = this.isPlotArea == true ? false : true;
    }

    onlyText(event){
        var value = String.fromCharCode(event.which);
        var pattern = new RegExp(/[a-zåäö ]/i);
        return pattern.test(value);
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
            maintenanceCharges: null
        };
    
        // Query all input fields and the select field
        const inputs = [...this.template.querySelectorAll('input,select')];
    
        inputs.forEach(input => {
            const fieldName = input.name;
            const pattern = input.pattern;
            const value = input.value;
            const errorElement = this.template.querySelector(`p[data-for="${input.name}"]`);
    
            if (input.required && !value) {
                input.style.border = '1px solid red';
                input.style.marginBottom = '0rem';
                if (errorElement != null) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.display = 'block';
                }
                allValid = false;
            } else if (pattern && value.length > 0) {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    let errorMessage = 'Invalid input.';
                    if (input.name === 'city' || input.name === 'locality') {
                        errorMessage = 'This field only contains alphabetic characters.';
                    } else if (input.name === 'nearbyLandmark') {
                        errorMessage = 'Please enter a value with less than 255 characters.';
                    }
                    input.style.border = '1px solid red';
                    input.style.marginBottom = '0rem';
                    if (errorElement != null) {
                        errorElement.textContent = errorMessage;
                        errorElement.style.display = 'block';
                    }
                    allValid = false;
                } else {
                    input.style.border = '1px solid rgba(191, 196, 215, 1)';
                    if (errorElement != null) {
                        errorElement.style.display = 'none';
                    }
                }
            } else {
                if(input.name !=='bathrooms' && input.name !=='balconies' && input.name !=='bedrooms'){
                    input.style.border = '1px solid rgba(191, 196, 215, 1)';
                }
                if (errorElement != null) {
                    errorElement.style.display = 'none';
                }
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
            maintenanceCharges
        } = fieldValues;
    
        console.log('fieldValues:',JSON.stringify(fieldValues));
        
        // Custom validations
        if (totalFloors !== null && totalFloors <= 0) {
            const totalFloorsInput = this.template.querySelector('input[name="totalFloors"]');
            // const errorElement = totalFloorsInput.nextElementSibling;
            const errorElement = this.template.querySelector('p[data-for="totalFloors"]');
            console.log('errorElement',errorElement);
            console.log('totalFloorsInput',totalFloorsInput);
            totalFloorsInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Total floors must be a positive integer.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
        if (floorNumber !== null && totalFloors !== null && floorNumber > totalFloors) {
            const floorNumberInput = this.template.querySelector('select[name="floorNumber"]');
            // const errorElement = floorNumberInput.nextElementSibling;
            const errorElement = this.template.querySelector('p[data-for="floorNumber"]');
            console.log('errorElement',errorElement);
            console.log('floorNumberInput',floorNumberInput);
            
            floorNumberInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Floor number cannot be greater than total floors.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
    
        if (carpetArea !== null && carpetArea <= 0) {
            const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
            const errorElement = carpetAreaInput.nextElementSibling;
            // const errorElement = this.template.querySelector(`p[data-for="carpetArea"]`);
            carpetAreaInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Carpet area must be a positive integer.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
        if (coveredArea !== null && coveredArea <= 0) {
            const coveredAreaInput = this.template.querySelector('input[name="coveredArea"]');
            const errorElement = coveredAreaInput.nextElementSibling;
            // const errorElement = this.template.querySelector(`p[data-for="coveredArea"]`);
            coveredAreaInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Covered area must be a positive integer.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
        if (carpetArea !== null && coveredArea !== null && carpetArea > coveredArea) {
            const carpetAreaInput = this.template.querySelector('input[name="carpetArea"]');
            const errorElement = carpetAreaInput.nextElementSibling;
            // const errorElement = this.template.querySelector(`p[data-for="carpetArea"]`);
            carpetAreaInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Carpet area cannot be greater than covered area.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
    
        if (bookingAmount !== null && bookingAmount <= 0) {
            const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
            const errorElement = bookingAmountInput.nextElementSibling;

            // const errorElement = this.template.querySelector(`p[data-for="bookingAmount"]`);
            bookingAmountInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Booking amount must be a positive integer.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }

        if (expectedPrice !== null && (expectedPrice<10000 || expectedPrice>100000000)) {
            const bookingAmountInput = this.template.querySelector('input[name="expectedPrice"]');
            const errorElement = bookingAmountInput.nextElementSibling;
            // const errorElement = this.template.querySelector(`p[data-for="expectedPrice"]`);
            bookingAmountInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Value must be between 10,000 and 100,000,000.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }

        if (expectedPrice !== null && bookingAmount !== null && bookingAmount > expectedPrice) {
            const bookingAmountInput = this.template.querySelector('input[name="bookingAmount"]');
            const errorElement = bookingAmountInput.nextElementSibling;
            // const errorElement = this.template.querySelector(`p[data-for="bookingAmount"]`);
            bookingAmountInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Booking amount cannot be greater than expected price.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
        if (maintenanceCharges !== null && maintenanceCharges <= 0) {
            const maintenanceChargeInput = this.template.querySelector('input[name="maintenanceCharges"]');
            const errorElement = maintenanceChargeInput.nextElementSibling;
            // const errorElement = this.template.querySelector(`p[data-for="maintenanceCharges"]`);
            maintenanceChargeInput.style.border = '1px solid red';
            if (errorElement != null) {
                errorElement.textContent = 'Maintenance charge must be a positive integer.';
                errorElement.style.display = 'block';
            }
            allValid = false;
        }
    
        return allValid;
    }
    
}