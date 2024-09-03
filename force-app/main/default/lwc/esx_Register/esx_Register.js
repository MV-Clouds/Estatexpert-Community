import { LightningElement, track, api } from 'lwc';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
import createContacForEXP from '@salesforce/apex/ESX_UserUtil.createContacForEXP';
import genrateOtpAndSendMail from '@salesforce/apex/ESX_UserUtil.genrateOtpAndSendMailForRegister';

export default class Esx_Register extends NavigationMixin(LightningElement) {

    @api sideImageId;
    @track sideImgURL;
    @track isLoading = false;
    @track isRegisterPassPage = true;

    // OTP Page Variables Start
    @track isVerifyPassPage = false;
    @track verificationOTP;
    @track OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
    @track otpTimeStamp;
    @track otpValidationMessage = '';

    @track otpInput1Value = '';
    @track otpInput2Value = '';
    @track otpInput3Value = '';
    @track otpInput4Value = '';
    @track otpInput5Value = '';
    @track otpInput6Value = '';
    // OTP Page Variables End

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

    // validation variables
    @track isEmailValid = false;
    @track isMobileValid = false;
    @track isPasswordValid = false;
    @track isConfPasswordValid = false;
    @track emailErrorMessage = '';
    @track mobileErrorMessage = '';
    @track passwordErrorMessage = '';
    @track confPasswordErrorMessage = '';

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
            this.handleRemoveErrorMessage();

        } catch (error) {
            console.error(error.stack);
        }
    }

    // to handle inputs value of the otp page
    handleOtpKeyUp(event) {
        let input = event.target;
        let inputName = input.name;
        let code = parseInt(input.value);

        if (code >= 0 && code <= 9) {
            const next = input.nextElementSibling;
            if (next && next.tagName === 'INPUT') {
                next.focus();
            }
        } else {
            input.value = '';
        }

        const key = event.key;
        if (key === 'Backspace' || key === 'Delete') {
            const prev = input.previousElementSibling;
            if (prev && prev.tagName === 'INPUT') {
                prev.focus();
            }
        }

        // Stroing value in the variable to use furthor
        if (inputName == 'otp1') {
            this.otpInput1Value = input.value;
            this.template.querySelector('[name="otp1"]').style.border = '';
        } else if (inputName == 'otp2') {
            this.otpInput2Value = input.value;
            this.template.querySelector('[name="otp2"]').style.border = '';
        } else if (inputName == 'otp3') {
            this.otpInput3Value = input.value;
            this.template.querySelector('[name="otp3"]').style.border = '';
        } else if (inputName == 'otp4') {
            this.otpInput4Value = input.value;
            this.template.querySelector('[name="otp4"]').style.border = '';
        } else if (inputName == 'otp5') {
            this.otpInput5Value = input.value;
            this.template.querySelector('[name="otp5"]').style.border = '';
        } else if (inputName == 'otp6') {
            this.otpInput6Value = input.value;
            this.template.querySelector('[name="otp6"]').style.border = '';
        }
    }

    // To send otp to email on click of submit
    handleSubmit() {
        try {
            if (this.firstName === '') {
                this.template.querySelector('[name="firstName"]').style.border = '1px solid red';
            } else if (this.lastName === '') {
                console.log(this.template.querySelector('[name="lastName"]'));
                this.template.querySelector('[name="lastName"]').style.border = '1px solid red';                
            } else if (this.email === '') {
                this.template.querySelector('[name="email"]').style.border = '1px solid red';
            } else if (!(this.email.match("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"))) {
                this.isEmailValid = true;
                this.emailErrorMessage = 'Invalid Email';
                this.template.querySelector('[name="email"]').style.border = '1px solid red';
            } else if (this.mobile === '') {
                this.isMobileValid = true;
                this.template.querySelector('[name="mobile"]').style.border = '1px solid red';
            } else if (!(this.mobile.match(/^(\+\d{1,3}[- ]?)?\d{10}$/))) {
                this.isMobileValid = true;
                this.mobileErrorMessage = 'Invalid Mobile Number';
                this.template.querySelector('[name="mobile"]').style.border = '1px solid red';
            } else if (this.password === '') {
                this.isPasswordValid = true;
                this.template.querySelector('[name="password"]').style.border = '1px solid red';
            } else if (this.password.length < 8) {
                this.isPasswordValid = true;
                this.passwordErrorMessage = 'password must be at least 8 characters long.';
                this.template.querySelector('[name="password"]').style.border = '1px solid red';
            } else if (this.password.length > 16) {
                this.isPasswordValid = true;
                this.passwordErrorMessage = 'A Maximum length of 16 characters is allowed';
                this.template.querySelector('[name="password"]').style.border = '1px solid red';
            } else if (!(this.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/))) {
                this.isPasswordValid = true;
                this.passwordErrorMessage = 'Password does not meet the criteria. Please include at least one special character, one number,one upper latter and one lower letter.';
                this.template.querySelector('[name="password"]').style.border = '1px solid red';
            } else if (this.confPassword === '') {
                this.isConfPasswordValid = true;
                this.confPasswordErrorMessage = 'Confirm Password is required';
                this.template.querySelector('[name="confPassword"]').style.border = '1px solid red';
            } else if (this.password !== this.confPassword) {
                this.isConfPasswordValid = true;
                this.confPasswordErrorMessage = 'Password and Confirm Password does not match';
                this.template.querySelector('[name="confPassword"]').style.border = '1px solid red';
            }else{
               
                console.log('888');
                
                this.handleRemoveErrorMessage();
                this.isVerifyPassPage = true;
                this.isRegisterPassPage = false;
                this.startSpinner();

                genrateOtpAndSendMail({ userName: this.email, firstName: this.firstName })
                    .then(result => {
                        if (result != null) {
                            this.verificationOTP = result;
                            this.otpTimeStamp = Date.now();
                            this.stopSpinner();
                        } else {
                            this.stopSpinner();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.stopSpinner();
                    });
            }          
        } catch (error) {
            console.error(error.stack);
            this.stopSpinner();
        }
    }

    // For the resend OTP to email
    resendOTP() {
        try {
            this.otpValidationMessage = '';
            this.startSpinner();
            genrateOtpAndSendMail({ userName: this.email, firstName: this.firstName })
                .then(result => {
                    if (result != null) {
                        this.verificationOTP = result;
                        this.otpTimeStamp = Date.now();
                        this.stopSpinner();
                    } else {
                        this.stopSpinner();
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.stopSpinner();
                });

        } catch (error) {
            console.log(error);
            this.stopSpinner();
        }
    }

    // OTP page methods starts 

    hanldeVerifyOTP(event) {
        let enteredOTP = this.updateCombinedValue();
        const currentTime = Date.now();
        this.otpValidationMessage = '';
        if(enteredOTP.length == 6){
            if ((currentTime - this.otpTimeStamp) < this.OTP_EXPIRATION_TIME) {
                if (this.verificationOTP == enteredOTP) {
                    this.isVerifyPassPage = false;
                    this.handleRegister();
                } else {
                    this.otpValidationMessage = 'The OTP you entered is incorrect. Please try again.';
                }
            } else {
                this.otpValidationMessage = 'The OTP you entered is no longer valid. Request a new OTP to proceed.';
            }
        }else{

            let elemetborder = this.template.querySelectorAll('.otp-input');
            for (let index = 0; index < elemetborder.length; index++) {
                this.template.querySelector(`[name="${elemetborder[index].name}"]`).style.border = '1px solid red';
            }
            this.otpValidationMessage = 'Please enter the OTP';
        }
        
    }

    updateCombinedValue() {
        let finalVal = `${this.otpInput1Value}${this.otpInput2Value}${this.otpInput3Value}${this.otpInput4Value}${this.otpInput5Value}${this.otpInput6Value}`;
        return Number(finalVal);
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

    handleRemoveErrorMessage(){

        try {

            let elemetborder = this.template.querySelectorAll('.login-input');
            for (let index = 0; index < elemetborder.length; index++) {
                this.template.querySelector(`[name="${elemetborder[index].name}"]`).style.border = '';
            }

            // this.template.querySelectorAll('.login-input').style.border = '';
            this.isEmailValid = false;
            this.isMobileValid = false;
            this.isPasswordValid = false;
            this.isConfPasswordValid = false;
            this.emailErrorMessage = '';
            this.mobileErrorMessage = '';
            this.passwordErrorMessage = '';
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
                    if (result === 'Email and Mobile'){
                        this.isRegisterPassPage = true;
                        this.isVerifyPassPage = false;
                        this.handleToast('Error', 'Email and Mobile Number already exists');    
                    }else if(result === 'Email'){
                        this.isRegisterPassPage = true;
                        this.isVerifyPassPage = false;
                        this.handleToast('Error', 'Email already exists');
                    }else if(result === 'Mobile'){
                        this.isRegisterPassPage = true;
                        this.isVerifyPassPage = false;
                        this.handleToast('Error', 'Mobile Number already exists');
                    }else if(result === 'Success'){
                        this.handleToast('Success', 'Registration Successful! Please log in through the login page');
                        this.resetInpuFieldValue();
                        setTimeout(() => {
                            this.customNavigation('Login');
                        }, 2000);
                    }else{
                        this.isRegisterPassPage = true;
                        this.isVerifyPassPage = false;
                        this.handleToast('Error', 'Something Went Wrong');
                    }
                    console.log('createUser Called ***');
                    
                    
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