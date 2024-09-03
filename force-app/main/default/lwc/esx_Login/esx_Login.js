import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import login from '@salesforce/apex/ESX_UserUtil.login';
import { esxCreateLoginSession } from "c/esx_UserModule";

export default class Esx_Login extends NavigationMixin(LightningElement) {

    @api sideImageId;
    @track sideImgURL;
    @track userName = '';
    @track password = '';
    @track badCredMessage = '';

    // LWC lifecycle event.
    connectedCallback(){
        this.loadHeroImageFromCMS();
    }
    
    // to loa and create image url for the Hero section of component.
    loadHeroImageFromCMS() {
        this.sideImgURL = basePath + '/sfsites/c/cms/delivery/media/' + this.sideImageId;
    }

    // To store value in the variable on change of the input fields.
    handleChange(event) {
        try {
            let inputName = event.target.name;
            let changedValue = event.target.value;

            if (inputName == 'userName') {
                this.userName = changedValue;
            } else if (inputName == 'password') {
                this.password = changedValue;
            }
        } catch (error) {
            console.error(error.stack);
        }
    }

    // To call login method on enter key press in passwoprd input field.
    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleLogin();        
        }
    }

    // To validate user credantiol and to create session for user.
    handleLogin() {
        try {
            this.badCredMessage = '';
            let userName = this.userName;
            let password = this.password;
            login({userName: userName, password: password})
                .then(result => {
                    if (result.statusMessage == 'Success') {
                        let contactId = result.siteUser.Contact__c;
                        let siteUserId = result.siteUser.Id;
                        esxCreateLoginSession(contactId, siteUserId);
                        this.customNavigation('Home');
                    } else if (result.statusMessage == 'Bad Credantial') {
                        this.addErrorInLoginUI();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error.stack);
        }
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

    // Navigate to Register/SignUp page.
    navigateToSignUp() {
        this.customNavigation('Register');
    }

    // Add errors on badcredantial provided.
    addErrorInLoginUI() {
        this.badCredMessage = 'Invalid username or password. Please try again.';
    }

    // Navgate to forgot password page.
    handleForgotPassword() {
        this.customNavigation('Forgot_Password');
    }
}