import { LightningElement, track } from 'lwc';
import MY_IMAGE from '@salesforce/resourceUrl/ContactFormBackgroundImage';
import saveContactUsRecord from '@salesforce/apex/ESX_ContactUsController.saveContactUsRecord';

export default class Esx_ContactUs extends LightningElement {
    imageUrl = MY_IMAGE;

    @track name;
    @track number;
    @track email;
    @track subject;
    @track message = '';

    @track isEmailValid = true;
    @track isPhoneValid = true;

    get backgroundStyle() {
        return `background-image: url(${MY_IMAGE})`;
    }


    handleInputChange(event) {
        const { value, dataset } = event.target;
        this[dataset.id] = value;
        // console.log('Value is --> '+event.target.value);
        this.clearErrorMessage(dataset.id);
        this.clearErrorBorder(dataset.id);
    }

    handleSaveContactRecord() {
        try{
            if (this.validateInputs()) {
                this.isVisible = true;
                saveContactUsRecord({name: this.name, phone: this.number,  email: this.email, subject: this.subject, message: this.message})
                    .then((res) => {
                        console.log('Result is ---> '+res);
                    })
                    .catch((err) => {
                        console.log("Error --> "+JSON.stringify(err));
                    })

                // this.clearAllErrorMessages();
                this.clearAllInputFields();

            }
        } catch (error) {
            console.error("Error in handleSaveContactRecord: ", error.stack);
        }
    }

    validateInputs() {
        let isValid = true;

        if (!this.name) {
            this.showErrorBorder('name');
            isValid = false;
        }else if(this.name > 60){
            this.showErrorMessage('name', 'characters should be less than 60');
            isValid = false;
        }

        if (!this.number || this.number.trim() === '') {
            this.isPhoneValid = true;
            isValid = true;
        } else {
            this.checkPhonePattern();
            if(!this.isPhoneValid){
                this.showErrorMessage('number', 'Phone number is not valid.');
                isValid = false;
            }
        }

        if (!this.email) {
            this.showErrorBorder('email');
            isValid = false;
        }else{
            this.chekEmailPattern();
            if(this.isEmailValid){
                this.showErrorMessage('email', 'email is not valid.');
                isValid = false;
            }
        }

        if(!this.subject){
            this.showErrorBorder('subject');
            isValid = false;
        }else if(this.subject.length > 255){
            this.showErrorMessage('subject', 'characters should be less than 255');
            isValid = false;
        }

        if(this.message.length > 131072){
            console.log('Length of message is --> '+this.message.length);
            this.showErrorMessage('message', 'characters should be less than 131072');
            isValid = false;
        }else{
            console.log('Length of message is --> '+this.message.length);
        }

        return isValid;
    }

    showErrorMessage(fieldName, message) {
        const errorElement = this.template.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearErrorMessage(fieldName) {
        const errorElement = this.template.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearErrorBorder(fieldName) {
        const errorElement = this.template.querySelector(`[data-id="${fieldName}"]`);

        if (errorElement) {
            errorElement.style.removeProperty("border");
        }
    }

    showErrorBorder(fieldName) {
        const errorElement = this.template.querySelector(`[data-id="${fieldName}"]`);
        if (errorElement) {
            errorElement.style.border = '1px solid red';
        }

    }

    clearAllInputFields(){
        this.name = '';
        this.email = '';
        this.number = '';
        this.subject = '';
        this.message = '';

        this.template.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });

        this.template.querySelectorAll('.error-cls').forEach(element => {
            element.textContent = '';
        });

    }

    chekEmailPattern(){
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.isEmailValid = !pattern.test(this.email);
    }

    checkPhonePattern() {
        const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        this.isPhoneValid =  phoneRegex.test(this.number);
    }

}