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
    @track contact = {};
    @track profileImage;
    @track recordType;
    @track isLoading = true;
    @track isDisabled = true;
    backgroundImageUrl = myProfilePageBackground;
    @track Salutationoptions = [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' },
        { label: 'Mx.', value: 'Prof.' },
    ];
    @track genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },

    ];

    @track countryOptions = [
        { label: 'India', value: 'India' },
        { label: 'UAE', value: 'UAE' },
        { label: 'United States', value: 'United States' },
        { label: 'Canada', value: 'Canada' },
        { label: 'Japan', value: 'Japan' },

    ]
    placeholderProfile = Blank_Profile_Photo;
    @track isModalOpen = false;
    @track popupMessage = '';
    @track profilePreview = false;

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
            } else {
                this.handleNavigate('Login');
            }
        } catch (error) {
            console.error(error);
        }
    }

    getCurrentContactDetails() {
        getContactdetails({ contactId: this.contactId })
            .then(result => {
                console.log('result: ', result);
                if (result.contact != null) {
                    this.contact = {
                        id: result.contact.Id,
                        salutation: result.contact.Salutation || '',
                        firstName: result.contact.FirstName || '',
                        lastName: result.contact.LastName || '',
                        gender: result.contact.Gender__c || '',
                        birthdate: result.contact.Birthdate || '',
                        age: result.contact.Age__c || '',
                        phone: result.contact.MobilePhone || '',
                        email: result.contact.Email || '',
                        mailingStreet: result.contact.MailingStreet || '',
                        mailingCity: result.contact.MailingCity || '',
                        mailingPostalCode: result.contact.MailingPostalCode || '',
                        mailingState: result.contact.MailingState || '',
                        mailingCountry: result.contact.MailingCountry || '',
                        description: result.contact.Description || '',
                    };
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
                console.log('error: ', error.message);
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
        this.contact[field] = event.target.value;
    }

    getContactInfo(event) {
        this.isDisabled = false;
        let dropdownCountry = this.template.querySelector('.country-dropdown');
        let dropdownSalutation = this.template.querySelector('.input-dropdown');
        dropdownSalutation.style.backgroundColor = 'white';
        dropdownCountry.style.backgroundColor = 'white';
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(1, 118, 211, 1)';
    }

    updateContactInfo() {
        if (this.isValidForm()) {
            console.log('conData:', JSON.stringify(this.contact));
            updateContact({ contact: JSON.stringify(this.contact) }).then(result => {
                this.popupMessage = 'Your details are updated successfully!';
                this.isModalOpen = true;
                const overlay = this.template.querySelector('.overlay');
                overlay.style.display = 'block';
                this.isDisabled = true;
                let button = this.template.querySelector('.save-btn');
                button.style.backgroundColor = 'rgba(210, 210, 210, 1)';
                this.getCurrentContactDetails();
            })
                .catch(error => {
                    console.error(error);
                });
        }
    }
    isValidForm() {
        const today = new Date();
        const allValid = [...this.template.querySelectorAll('lightning-input, input')]
            .reduce((validSoFar, inputCmp) => {
                let valid = true;
                let errorMessage = '';
                if (inputCmp.tagName === 'LIGHTNING-INPUT') {
                    inputCmp.reportValidity();
                    return validSoFar && inputCmp.checkValidity();
                } else if (inputCmp.tagName === 'INPUT') {
                    inputCmp.setCustomValidity('');
                    if (inputCmp.type === 'date') {
                        const birthdate = new Date(inputCmp.value);
                        const age = today.getFullYear() - birthdate.getFullYear();
                        const m = today.getMonth() - birthdate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
                            age--;
                        }

                        if (isNaN(birthdate) || age < 0 || age > 120) {
                            errorMessage = 'Please enter a valid birthdate within the last 120 years.';
                            valid = false;
                        }
                    } else {
                        if (!inputCmp.checkValidity()) {
                            errorMessage = inputCmp.dataset.errmsg;
                            valid = false;
                        }
                    }
                    if (!valid) {
                        inputCmp.setCustomValidity(errorMessage || inputCmp.dataset.errmsg);
                        inputCmp.reportValidity();
                        return false
                    } else {
                        inputCmp.setCustomValidity('');
                        inputCmp.reportValidity();
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
            console.log('filesizein mB:', Math.floor((files[0].size) / 1024));
            if (Math.floor((files[0].size) / 1024) <= 3000) {
                this.uploadFile(files[0]);
            } else {
                this.popupMessage = 'File size should be less than 3MB';
                this.isModalOpen = true;
                const overlay = this.template.querySelector('.overlay');
                overlay.style.display = 'block';
            }

        }
    }
    previewProfileImage() {
        console.log('method called for profile');
        this.profilePreview = true;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'block';
    }
    closePopup() {
        this.isModalOpen = false;
        this.profilePreview = false;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'none';
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
        uploadProfileImage({ contactId: this.contactId, fileName: file.name, base64Data })
            .then(contentVersion => {
                this.profileImage = 'data:image/jpeg;base64,' + contentVersion;
            })
            .catch(error => {
                console.error(error);
            });
    }

    removeProfile() {
        console.log('conId:', this.contact.Id);
        console.log('contactId:', this.contactId)
        removeProfileImage({ ContactId: this.contactId }).then(result => {
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

    cancelAction() {
        console.log('contactdetailsBeforementhodCalled:', JSON.stringify(this.contact));
        this.isLoading = true;
        this.getCurrentContactDetails();
        this.isDisabled = true;
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(210, 210, 210, 1)';
    }
}