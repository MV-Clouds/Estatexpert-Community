import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import genrateOtpAndSendMail from '@salesforce/apex/ESX_UserUtil.genrateOtpAndSendMail';
import setPassword from '@salesforce/apex/ESX_UserUtil.setPassword';

export default class Esx_ForgotPassword extends NavigationMixin(LightningElement) {
    
    @api sideImageId;
    @track sideImgURL;
    @track isLoading = false;
    
    @track isForgotPassPage = true;
    // @track isForgotPassPage = false;
    @track userName = '';
    @track badCredMessage = '';

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

    @track isResetPassPage = false;
    // @track isResetPassPage = true;
    @track password = '';
    @track confPassword = '';

    @track passwordState = {
        length: false,
        digit: false,
        lowerCase: false,
        upperCase: false,
        specialChar: false,
    }

    allRegex = {
        length: /.{8,}/,
        digit: /\d/,
        lowerCase: /[a-z]/,
        upperCase: /[A-Z]/,
        specialChar: /[@$!#%*?&]/
    }


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

    connectedCallback(){
        this.loadHeroImageFromCMS();
    }
    
    // to loa and create image url for the Hero section of component.
    loadHeroImageFromCMS() {
        this.sideImgURL = basePath + '/sfsites/c/cms/delivery/media/' + this.sideImageId;
    }

    // to store value on change of the input field.
    handleChange(event) {
        try {
            let inputName = event.target.name;
            let changedValue = event.target.value;
            if (inputName == 'userName') {
                this.userName = changedValue;
            }
        } catch (error) {
            console.log(error);
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
        } else if (inputName == 'otp2') {
            this.otpInput2Value = input.value;
        } else if (inputName == 'otp3') {
            this.otpInput3Value = input.value;
        } else if (inputName == 'otp4') {
            this.otpInput4Value = input.value;
        } else if (inputName == 'otp5') {
            this.otpInput5Value = input.value;
        } else if (inputName == 'otp6') {
            this.otpInput6Value = input.value;
        }
    }

    // To send otp to email on click of submit
    handleSubmit() {
        try {
            this.badCredMessage = '';
            this.startSpinner();
            genrateOtpAndSendMail({ userName: this.userName })
                .then(result => {
                    if (result != null) {
                        this.verificationOTP = result;
                        this.isVerifyPassPage = true;
                        this.isForgotPassPage = false;
                        this.otpTimeStamp = Date.now();
                        this.stopSpinner();
                    } else {
                        this.stopSpinner();
                        this.addErrorInForgotUI();
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

    // For the resend OTP to email
    resendOTP() {
        try {
            this.otpValidationMessage = '';
            this.startSpinner();
            genrateOtpAndSendMail({ userName: this.userName })
                .then(result => {
                    if (result != null) {
                        this.verificationOTP = result;
                        this.otpTimeStamp = Date.now();
                        this.stopSpinner();
                    } else {
                        this.stopSpinner();
                        this.addErrorInForgotUI();
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

    // Add errors on badcredantial provided.
    addErrorInForgotUI() {
        this.badCredMessage = 'Invalid username. Please try again.';
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

    // Navigate to Login page.
    handleBackLogin() {
        this.customNavigation('Login');
    }


    // OTP page methods starts 

    hanldeVerifyOTP(event) {
        let enteredOTP = this.updateCombinedValue();
        const currentTime = Date.now();
        this.otpValidationMessage = '';
        if ((currentTime - this.otpTimeStamp) < this.OTP_EXPIRATION_TIME) {
            if (this.verificationOTP == enteredOTP) {
                this.isResetPassPage = true;
                this.isVerifyPassPage = false;
                this.isForgotPassPage = false;
            } else {
                this.otpValidationMessage = 'The OTP you entered is incorrect. Please try again.';
            }
        } else {
            this.otpValidationMessage = 'The OTP you entered is no longer valid. Request a new OTP to proceed.';
        }
    }

    updateCombinedValue() {
        let finalVal = `${this.otpInput1Value}${this.otpInput2Value}${this.otpInput3Value}${this.otpInput4Value}${this.otpInput5Value}${this.otpInput6Value}`;
        return Number(finalVal);
    }


    // *** Password Reset Methods starts ***

    // 
    handlePassChange(event) {
        try {
            let inputName = event.target.name;
            let changedValue = event.target.value;
            if (inputName == 'password') {
                this.password = changedValue;
            } else if (inputName == 'confPassword') {
                this.confPassword = changedValue;
            }
            this.passNotMatchErrorMessage(inputName);
        } catch (error) {
            console.log(error);
        }
    }

    // This will be resets password.
    hanldeResetPass(event) {
        if(this.validateInputs()){
            this.startSpinner();
            setPassword({userName: this.userName, password: this.password})
            .then(result => {
                if (result == 'Success') {
                    this.stopSpinner();
                    this.handleToast('Success', 'Password reset complete. You can now log in with your new password.');
                    

                    //clearing the input field
                    this.password = '';
                    this.confPassword = '';

                    // clearing password policy background
                    for(let isMatch in this.allRegex){
                        this.passwordState[isMatch] = false;
                    }

                    

                    setTimeout(() => {
                        this.customNavigation('Login');
                    }, 1000);

                } else if (result == 'Bad Credantial') {
                    this.stopSpinner();
                    this.handleToast('Error', 'Something Went Wrong');
                } else {
                    this.stopSpinner();
                }
            }).catch(error => {
                console.log({error});
                this.stopSpinner();
            });
        }else{
            console.log('Inside else...');
        }
    }

    // Error display when pass and confirm pass not match
    passNotMatchErrorMessage(fieldName) {

        for(let isMatch in this.allRegex){
            this.passwordState[isMatch] = this.allRegex[isMatch].test(this.password);
            // console.log(isMatch + " --> " + this.passwordState[isMatch]);
        }

        const errorElement = this.template.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.innerText = '';
        }

        const errorBorderEle = this.template.querySelector(`[data-id="${fieldName}"]`);

        if (errorBorderEle) {
            // errorElement.style.border = 'none';
            errorBorderEle.style.removeProperty("border");
        }

    }

    // *** Spinner methods starts *** //

    startSpinner() {
        this.isLoading = true;
    }

    stopSpinner() {
        this.isLoading = false;
    }

    // *** Spinner methods ends *** //


    // *** Validating all password policy *** //

    validateInputs() {
        let isValid = true;
        console.log('validate input is called --> ');

        if (!this.password) {
            this.showErrorBorder('password');
            isValid = false;
            console.log('Inside 1 --> ');
        } else if (this.password.length < 8) {
            this.showErrorMessage('password', 'password must be at least 8 characters long');
            isValid = false;
            console.log('Inside 2 --> ');
        } else if (this.password.length > 16) {
            this.showErrorMessage('password', 'A Maximum length of 16 characters is allowed');
            isValid = false;
            console.log('Inside 3 --> ');
        } else if(this.chekNewPasswordPattern() == true) {
            this.showErrorMessage('password', 'Password not match with the criteria');
            isValid = false;
            console.log('Inside 4 --> ');
        }else if(!this.confPassword){
            this.showErrorBorder('confPassword');
            isValid = false;
            console.log('Inside 5 ');
        } else if(this.password !== this.confPassword) {
            this.showErrorMessage('confPassword', 'Passwords are not same.');
            isValid = false;
            console.log('Inside 6 ');
        }

        return isValid;
    }

    showErrorMessage(fieldName, message) {
        const errorElement = this.template.querySelector(`[data-error="${fieldName}"]`);
        console.log("inside the error message --> "+errorElement);
        if (errorElement) {
            errorElement.innerText = message;
        }
    }

    showErrorBorder(fieldName) {
        const errorElement = this.template.querySelector(`[data-id="${fieldName}"]`);
        if (errorElement) {
            errorElement.style.border = '1px solid red';
        }

    }

    chekNewPasswordPattern(){
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
        return !pattern.test(this.password);
    }

    get legthClass(){
        return this.passwordState.length ? 'password-match' : 'password-not-match';
    }

    get digitClass(){
        return this.passwordState.digit ? 'password-match' : 'password-not-match';
    }

    get capitalCaseClass(){
        return this.passwordState.upperCase ? 'password-match' : 'password-not-match';
    }

    get lowerCaseClass(){
        return this.passwordState.lowerCase ? 'password-match' : 'password-not-match';
    }

    get specialCharClass(){
        return this.passwordState.specialChar ? 'password-match' : 'password-not-match';
    }


    // *** Validating all password policy Ends Here *** //


}