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
            this.passNotMatchErrorMessage();
        } catch (error) {
            console.log(error);
        }
    }

    // This will be resets password.
    hanldeResetPass(event) {
        if (this.password == this.confPassword) {
            this.startSpinner();
            setPassword({userName: this.userName, password: this.password})
            .then(result => {
                if (result == 'Success') {
                    this.stopSpinner();
                    this.handleToast('Success', 'Password reset complete. You can now log in with your new password.');
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
        }
    }

    // Error display when pass and confirm pass not match
    passNotMatchErrorMessage() {
        if (this.password != this.confPassword) {
            this.passNotMatchMessage = 'Passwords are not same.';
        } else {
            this.passNotMatchMessage = '';
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
}