import { LightningElement, track, api } from 'lwc';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
import createContacForEXP from '@salesforce/apex/ESX_UserUtil.createContacForEXP';

export default class Esx_Register extends NavigationMixin(LightningElement) {

    @api sideImageId;
    @track sideImgURL;
    @track isLoading = false;

    @track userType = 'Buyer';
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track mobile = '';
    @track password = '';
    @track confPassword = '';
    
    // ***  Custom Toast Starts *** //
    @track showToast = false;
    @track toastType = '';
    @track toastMessage = '';

    // to call the toast message
    handleToast(type, message) {
        this.toastType = type;
        this.toastMessage = message;
        setTimeout(() => {
            this.showToast = true;        
        }, 100);

        setTimeout(() => {
            this.showToast = false;        
        }, 3000);
    }

    // Call when toast close button clicked
    closeToast() {
        this.showToast = false;
    }
    // *** Custom Toast Ends *** //

    
    // LWC lifecycle event.
    connectedCallback(){
        this.loadHeroImageFromCMS();
    }
    
    // to loa and create image url for the Hero section of component.
    loadHeroImageFromCMS() {
        this.sideImgURL = basePath + '/sfsites/c/cms/delivery/media/' + this.sideImageId;
    }

    // To store the value in the variable when value changed in the fields.
    handleChange(event) {
        try {
            let inputName = event.target.name;
            let changedValue = event.target.value;

            if (inputName == 'firstName') {
                this.firstName = changedValue;
            } else if (inputName == 'lastName') {
                this.lastName = changedValue;
            } else if (inputName == 'email') {
                this.email = changedValue;
            } else if (inputName == 'mobile') {
                this.mobile = changedValue;
            } else if (inputName == 'password') {
                this.password = changedValue;
            } else if (inputName == 'confPassword') {
                this.confPassword = changedValue;
            } else if (inputName == 'people-type') {
                this.userType = changedValue;
            }
        } catch (error) {
            console.error(error.stack);
        }
    }

    // To create JSON from the input field for the contact records.
    bindJSONforContact() {
        try {
            let userConObj = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                mobileNumber: this.mobile,
                userType: this.userType
            }
            let userConObjString = JSON.stringify(userConObj);
            return userConObjString;
        } catch (error) {
            console.error(error.stack);
        }
    }

    // to create exp user
    handleRegister() {
        let contactJSON = this.bindJSONforContact();
        let password = this.password;
        this.createPortalUser(contactJSON, password);
    }


    createPortalUser(contactJSON, password) {
        try {
            this.startSpinner();
            createContacForEXP({contactJSON: contactJSON, password: password})
                .then(result => {
                    console.log('Result => ', result);
                    this.stopSpinner();
                    console.log('createUser Called ***');
                    // this.handleToast('Success', 'Registration Successful! Please log in through the login page');
                    // this.resetInpuFieldValue();
                    // setTimeout(() => {
                    //     this.customNavigation('Login');
                    // }, 1000);
                })
                .catch(error => {
                    console.error(error);
                    this.stopSpinner();
                    this.handleToast('Error', 'Something Went Wrong');
                });
        } catch (error) {
            console.error(error.stack);
            this.stopSpinner();
        }
    }

    // to reset all input fields value
    resetInpuFieldValue() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.mobile = '';
        this.password = '';
        this.confPassword = '';
    }

    // to navigate to login page
    handlelogin() {
        this.customNavigation('Login');
    }

    // Navigate to community page using page API name
    customNavigation(pageAPIName) {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageAPIName
            },
        });
    }

    // To start Spinner
    startSpinner() {
        this.isLoading = true;
    }

    // To end spinner
    stopSpinner() {
        this.isLoading = false;
    }
}