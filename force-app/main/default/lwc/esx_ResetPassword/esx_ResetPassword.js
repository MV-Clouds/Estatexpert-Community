import { LightningElement, track, api } from 'lwc';

// import currPass from '@salesforce/apex/ResetPasswordController.getCurrentPassword';

export default class Esx_ResetPassword extends LightningElement {
    @track oldPassword = '';
    @track newPassword = '';
    @track confirmPassword = '';

    @track isNewPasswordValid = true;
    
    @api message = '';
    isVisible = false;

    // @track lengthCondition = false;
    // @track digitCondition = false;
    // @track uppercaseCondition = false;
    // @track lowercaseCondition = false;
    // @track specialCharCondition = false;

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

    dismissNotification() {
        this.isVisible = false;
        this.message = '';
    }

    handleInputChange(event) {
        const { value, dataset } = event.target;
        this[dataset.id] = value;
       
        this.clearErrorMessage(dataset.id);
        this.clearErrorBorder(dataset.id);
    }

    handleSetPassword() {
        if (this.validateInputs()) {
            this.isVisible = true;
            console.log('Password change successful');

            this.message = 'Successfully Password Changed!';

            // this.clearAllErrorMessages();
            this.clearAllInputFields();

        }
    }

    validateInputs() {
        let isValid = true;

        if (!this.oldPassword) {
            // this.showErrorMessage('oldPassword', 'Current password is required.');
            this.showErrorBorder('oldPassword');
            isValid = false;
        }

        if (!this.newPassword) {
            // this.showErrorMessage('newPassword', 'New password is required.');
            this.showErrorBorder('newPassword');
            isValid = false;
        } else if (this.newPassword.length < 8) {
            this.showErrorMessage('newPassword', 'New password must be at least 8 characters long.');
            isValid = false;
        } else if (this.newPassword.length > 16) {
            this.showErrorMessage('newPassword', 'A Maximum length of 16 characters is allowed');
            isValid = false;
        } else if (this.newPassword === this.oldPassword){
            this.showErrorMessage('newPassword', 'New password must not be same as current password');
            isValid = false;
        }else{
            this.chekNewPasswordPattern();
            if(this.isNewPasswordValid){
                this.showErrorMessage('newPassword', 'Password not match with the criteria');
                isValid = false;
            }
        }

        if (!this.confirmPassword) {
            // this.showErrorMessage('confirmPassword', 'Please confirm your new password.');
            this.showErrorBorder('confirmPassword');
            isValid = false;
        } else if (this.newPassword !== this.confirmPassword) {
            this.showErrorMessage('confirmPassword', 'Passwords do not match.');
            isValid = false;
        }

        return isValid;
    }

    showErrorMessage(fieldName, message) {
        const errorElement = this.template.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    showErrorBorder(fieldName) {
        const errorElement = this.template.querySelector(`[data-id="${fieldName}"]`);
        // console.log("inside the boredr error function ::::::: ");
        // console.log("Element ::::::::::: "+errorElement);
        if (errorElement) {
            errorElement.style.border = '1px solid red';
        }

    }

    clearErrorMessage(fieldName) {
        const errorElement = this.template.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = '';
        }

        if(fieldName == 'newPassword'){
            // console.log("inside the if statement of regex chaecked");
            for(let isMatch in this.allRegex){
                this.passwordState[isMatch] = this.allRegex[isMatch].test(this.newPassword);
                // console.log(isMatch +" ----> "+this.passwordState[isMatch]);
            }

            // this.lengthCondition = this.allRegex.length.test(this.newPassword);
            // this.digitCondition = this.allRegex.digit.test(this.newPassword);
            // this.uppercaseCondition = this.allRegex.upperCase.test(this.newPassword);
            // this.lowercaseCondition = this.allRegex.lowerCase.test(this.newPassword);
            // this.specialCharCondition = this.allRegex.specialChar.test(this.newPassword);

        }
    }

    clearErrorBorder(fieldName) {
        const errorElement = this.template.querySelector(`[data-id="${fieldName}"]`);

        // console.log("inside the border error function ::::::: ");
        // console.log("Element ::::::::::: "+errorElement);
        
        if (errorElement) {
            // errorElement.style.border = 'none';
            errorElement.style.removeProperty("border");
        }
    }

    clearAllInputFields(){
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.template.querySelectorAll('input').forEach(input => {
            input.value = '';
        });

        //clearing all the error messages
        this.template.querySelectorAll('.error-cls').forEach(element => {
            element.textContent = '';
        });

        // clearing password policy background
        for(let isMatch in this.allRegex){
            this.passwordState[isMatch] = false;
        }   

        // this.passwordState = false; 

    }

    chekNewPasswordPattern(){
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
        this.isNewPasswordValid = !pattern.test(this.newPassword);
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

}