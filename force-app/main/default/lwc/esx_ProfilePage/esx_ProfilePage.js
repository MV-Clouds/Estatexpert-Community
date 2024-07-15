import { LightningElement, track } from 'lwc';
import basePath from '@salesforce/community/basePath';
import getContactdetails from '@salesforce/apex/ProfilePage.getContactdetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Blank_Profile_Photo from '@salesforce/resourceUrl/Blank_Profile_Photo';
import myProfilePageBackground from '@salesforce/resourceUrl/ProfilePageBackground';
import updateContact from '@salesforce/apex/ProfilePage.updateContact';
import uploadProfileImage from '@salesforce/apex/ProfilePage.uploadProfileImage';
import isLoggedInUserDataCorrect from '@salesforce/apex/ESX_UserUtil.isLoggedInUserDataCorrect';
import removeProfileImage from '@salesforce/apex/ProfilePage.removeProfileImage';
import { NavigationMixin } from 'lightning/navigation';
export default class Esx_ProfilePage extends NavigationMixin(LightningElement) {

    @track contactId;
    @track contact;
    @track profileImage;
    @track recordType;
    @track isLoading = true;
    @track isDisabled = true;
    backgroundImageUrl = myProfilePageBackground;
    @track Salutationoptions = [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
    ];
    @track genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];
    placeholderProfile = Blank_Profile_Photo;

    connectedCallback() {
        this.checkUserIsLoggedIn();
    }

    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
            console.log('User info:', loggedUserInfo);
            if (loggedUserInfo) {
                let loggedUserInfoObj = JSON.parse(loggedUserInfo);
                console.log('loggeduserInfo:', loggedUserInfoObj);
                isLoggedInUserDataCorrect({ contactId: loggedUserInfoObj.contactId, siteUserId: loggedUserInfoObj.siteUserId })
                    .then(result => {
                        console.log('isLoggedInUserDataCorrect ** => ', result);
                        if (result) {
                            this.contactId = loggedUserInfoObj.contactId;
                            this.getCurrentContactDetails();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }else{
                this.handleNavigate('Login');
            }
        }catch (error) {
            console.error(error);
        }
    }

    getCurrentContactDetails() {
        getContactdetails({ contactId: this.contactId })
            .then(result => {
                console.log('result: ', result);
                if (result.contact != null) {
                    this.contact = result.contact;
                    this.recordType = result.contact.RecordType.Name;
                    this.isLoading = false;
                } else {
                    this.showToast('Error', 'Error', 'No Contacts Found');
                }
                if ((result != null && result != undefined) && (result.image != null && result.image != undefined)) {
                    this.profileImage = 'data:image/jpeg;base64,' + result.image;
                } else {
                    this.profileImage = this.placeholderProfile;
                    this.template.querySelector('.delete-icon').style.display = 'none';
                }
                if (result.contact.Gender__c != null && result.contact.Gender__c != undefined) {
                    setTimeout(() => {
                        let radioButton = this.template.querySelector(`.${result.contact.Gender__c}`);
                        if (radioButton != null) {
                            radioButton.checked = true;
                        }
                    }, 0);
                }
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }

    showToast(variant, title, message) {
        let evt = new ShowToastEvent({
            variant: variant,
            title: title,
            message: message,
            duration: 3000,
        });
        this.dispatchEvent(evt);
    }

    navigateHome() {
        this.handleNavigate('Home');
    }
    handleNavigate(page) {
        let pageApi = page;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApi
            },
        });
    }

    updateContact(event) {
        const field = event.target.name;
        this.contact = { ...this.contact, [field]: event.target.value };
    }

    getContactInfo(event) {
        this.isDisabled = false;
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(1, 118, 211, 1)';
    }

    updateContactInfo() {
        if (this.isValidForm()) {
            updateContact({ contact: this.contact }).then(result => {
                this.isDisabled = true;
                let button = this.template.querySelector('.save-btn');
                button.style.backgroundColor = 'rgba(210, 210, 210, 1)';
                this.getContact();
            })
            .catch(error => {
                console.error(error);
            });
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

    uploadProfileImage() {
        this.template.querySelector('input.hidden-upload').click();
    }

    handleFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.uploadFile(files[0]);
        }
    }

    uploadFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            console.log('imgdata:=', base64);
            this.uploadToSalesforce(file, base64);
        };
        reader.readAsDataURL(file);
    }

    uploadToSalesforce(file, base64Data) {
        uploadProfileImage({ contactId: this.contact.Id, fileName: file.name, base64Data })
            .then(contentVersion => {
                this.profileImage = 'data:image/jpeg;base64,' + contentVersion;
            })
            .catch(error => {
                console.error(error);
            });
    }

    removeProfile() {
        removeProfileImage({ ContactId: this.contact.Id }).then(result => {
            if (result) {
                this.template.querySelector('.delete-icon').style.display = 'none';
                this.profileImage = this.placeholderProfile;
            }
        })
        .catch(error => {
            console.log('errormsg:', error.body.message);
            console.error(error);
        });
    }
}