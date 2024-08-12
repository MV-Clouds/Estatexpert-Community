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
import popupIcons from '@salesforce/resourceUrl/popupicons1';
import { NavigationMixin } from 'lightning/navigation';
export default class Esx_ProfilePage extends NavigationMixin(LightningElement) {

    deleteIcon = popupIcons + '/delete.png';
    sucessIcon = popupIcons + '/success.png';
    errorIcon = popupIcons + '/error.png';

    @track contactId;
    @track contact = {};
    @track contactValues = {};
    @track profileImage;
    @track contactProfile;
    @track recordType;
    @track popupIcon = this.sucessIcon;
    @track isLoading = true;
    @track isDisabled = true;
    backgroundImageUrl = myProfilePageBackground;
    @track salutationoptions = [
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
    @track imgFile = '';
    @track base64Data = '';
    connectedCallback() {
        this.checkUserIsLoggedIn();
    }

    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
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
        this.isLoading = true;
        getContactdetails({ contactId: this.contactId })
            .then(result => {
                this.isLoading = false;
                console.log('result: ', result);
                if (result.contact != null) {
                    this.populateContactDetails(result.contact);
                    this.populateImageDetails(result.image);
                    this.setCountryAndSalutationOptions(result.contact);
                    this.isLoading = false;
                } else {
                    console.log('no data found');
                }
            })
            .catch(error => {
                let errorMessage = this.returnErrorMsg(error);
                // this.showPopupMessage(errorMessage, this.errorIcon);
                console.log('error: ', error.message);
            });
    }

    populateContactDetails(contact) {
        this.contact = {
            id: contact.Id,
            salutation: contact.Salutation || '',
            firstName: contact.FirstName || '',
            lastName: contact.LastName || '',
            gender: contact.Gender__c || '',
            birthdate: contact.Birthdate || '',
            age: contact.Age__c || '',
            phone: contact.MobilePhone || '',
            email: contact.Email || '',
            mailingStreet: contact.MailingStreet || '',
            mailingCity: contact.MailingCity || '',
            mailingPostalCode: contact.MailingPostalCode || '',
            mailingState: contact.MailingState || '',
            mailingCountry: contact.MailingCountry || '',
            description: contact.Description || '',
        };
        this.contactValues = {
            id: contact.Id,
            salutation: contact.Salutation || '',
            firstName: contact.FirstName || '',
            lastName: contact.LastName || '',
            gender: contact.Gender__c || '',
            birthdate: contact.Birthdate || '',
            age: contact.Age__c || '',
            phone: contact.MobilePhone || '',
            email: contact.Email || '',
            mailingStreet: contact.MailingStreet || '',
            mailingCity: contact.MailingCity || '',
            mailingPostalCode: contact.MailingPostalCode || '',
            mailingState: contact.MailingState || '',
            mailingCountry: contact.MailingCountry || '',
            description: contact.Description || '',
        };
        this.recordType = contact.RecordType.Name;
        this.setRadioButtons(contact.Gender__c);
    }

    populateImageDetails(image) {
        if (image) {
            this.profileImage = this.contactProfile = `data:image/jpeg;base64,${image}`;
        } else {
            this.profileImage = this.contactProfile = this.placeholderProfile;
        }
    }

    setCountryAndSalutationOptions(contact) {
        this.countryOptions = this.filterOptions(this.countryOptions, contact.MailingCountry);
        this.salutationOptions = this.filterOptions(this.salutationOptions, contact.Salutation);
    }

    filterOptions(options, value) {
        return options.filter(option => option.value !== value);
    }

    setRadioButtons(gender) {
        if (gender) {
            setTimeout(() => {
                const radioButton = this.template.querySelector(`.${gender}`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            }, 0);
        }
    }

    updateContact(event) {
        const field = event.target.name;
        this.contact[field] = event.target.value;
        if (event.target.name !== "mailingCountry" && event.target.name !== "salutation" && event.target.type !== "radio") {
            this.handleValidation(event);
        }
    }

    handleValidation(event) {
        let field = event.target;
        let pattern = field.pattern;
        let value = field.value;
        let errorMessage = field.dataset.errmsg;
        let errorElement = field.nextElementSibling;

        if (field.required && !value) {
            field.style.border = '1px solid red';
            field.style.marginBottom = '0rem';
            if (errorElement != null) {
                errorElement.textContent = 'This field is required';
                errorElement.style.display = 'block';
            }
        } else if (pattern !== '' && value.length > 0) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                field.style.border = '1px solid red';
                field.style.marginBottom = '0rem';
                if (errorElement != null) {
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                }
            } else {
                field.style.border = '1px solid rgba(191, 196, 215, 1)';
                if (errorElement != null) {
                    errorElement.style.display = 'none';
                }
            }
        } else if (field.name === 'birthdate') {
            let today = new Date();
            let birthdate = new Date(value);
            let age = today.getFullYear() - birthdate.getFullYear();
            let m = today.getMonth() - birthdate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
                age--;
            }
            if (isNaN(birthdate) || age < 0 || age > 120) {
                field.style.border = '1px solid red';
                field.style.marginBottom = '0rem';
                if (errorElement != null) {
                    errorElement.style.display = 'block';
                }
            } else {
                field.style.border = '1px solid rgba(191, 196, 215, 1)';
                if (errorElement != null) {
                    errorElement.style.display = 'none';
                }
            }
        } else {
            field.style.border = '1px solid rgba(191, 196, 215, 1)';
            if (errorElement != null) {
                errorElement.style.display = 'none';
            }
        }
    }

    getContactInfo(event) {
        this.isDisabled = false;
        let dropdownCountry = this.template.querySelector('.country-dropdown');
        let dropdownSalutation = this.template.querySelector('.input-dropdown');
        dropdownSalutation.style.backgroundColor = 'white';
        dropdownCountry.style.backgroundColor = 'white';
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(1, 118, 211, 1)';
        if (this.profileImage === this.placeholderProfile) {
            setTimeout(() => {
                this.template.querySelector('.delete-icon').style.display = 'none';
            }, 0);
        }
    }

    validateAllFields() {
        const inputs = this.template.querySelectorAll('input,textarea');
        let allValid = true;
        inputs.forEach(input => {
            const errorElement = input.nextElementSibling;
            const pattern = input.pattern;
            const value = input.value;
            const errorMessage = input.dataset.errmsg;
            if (input.required && !value) {
                input.style.border = '1px solid red';
                input.style.marginBottom = '0rem';
                if (errorElement != null) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.display = 'block';
                }
                allValid = false;
            } else if (pattern !== '' && value.length > 0) {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
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
                input.style.border = '1px solid rgba(191, 196, 215, 1)';
                if (errorElement != null) {
                    errorElement.style.display = 'none';
                }
            }
        });
        return allValid;
    }

    updateContactInfo() {
        if (this.validateAllFields()) {
            this.isLoading = true;
            if (this.imgFile !== '' && this.base64Data !== '') {
                this.uploadToSalesforce(this.imgFile, this.base64Data);
            }
            updateContact({ contact: JSON.stringify(this.contact) }).then(result => {
                this.isLoading = false;
                this.showPopupMessage('Your details are updated successfully!', this.sucessIcon);
                this.setRadioButtons(this.contact.gender);
                this.applyDisabledCss();
                // this.popupMessage = 'Your details are updated successfully!';
                // setTimeout(() => {
                //     const overlay = this.template.querySelector('.overlay');
                //     overlay.style.display = 'block';
                //     this.isModalOpen = true;
                // }, 0);

                // window.scrollTo({ top: 0, behavior: 'smooth' });
                // if (this.contact.gender != null && this.contact.gender != undefined) {
                //     setTimeout(() => {
                //         let radioButton = this.template.querySelector("." + this.contact.gender);
                //         if (radioButton != null) {
                //             radioButton.checked = true;
                //         }
                //     }, 0);
                // }
                // let button = this.template.querySelector('.save-btn');
                // button.style.backgroundColor = 'rgba(210, 210, 210, 1)';
                // let dropdownCountry = this.template.querySelector('.country-dropdown');
                // let dropdownSalutation = this.template.querySelector('.input-dropdown');
                // dropdownSalutation.style.backgroundColor = 'light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3))';
                // dropdownCountry.style.backgroundColor = 'light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3))';
                // this.getCurrentContactDetails();
            })
                .catch(error => {
                    let errorMessage = this.returnErrorMsg(error);
                    // this.showPopupMessage(errorMessage, this.errorIcon);
                    console.error(error);
                });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    uploadProfileImage() {
        this.template.querySelector('input.hidden-upload').click();
    }

    handleFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
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

    uploadFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            console.log('imgdata:=', base64);
            this.imgFile = file;
            this.base64Data = base64;
            this.profileImage = 'data:image/jpeg;base64,' + base64;
            // this.uploadToSalesforce(file, base64);
        };
        reader.readAsDataURL(file);
    }

    uploadToSalesforce(file, base64Data) {
        uploadProfileImage({ contactId: this.contactId, fileName: file.name, base64Data })
            .then(contentVersion => {
                this.profileImage = 'data:image/jpeg;base64,' + contentVersion;
                this.contactProfile = 'data:image/jpeg;base64,' + contentVersion;
                this.applyDisabledCss();
            })
            .catch(error => {
                let errorMessage = this.returnErrorMsg(error);
                // this.showPopupMessage(errorMessage, this.errorIcon);
                console.error(error);
            });
    }

    removeProfile() {
        this.isLoading = true;
        removeProfileImage({ ContactId: this.contactId }).then(result => {
            if (result) {
                this.isLoading = false;
                this.profileImage = this.placeholderProfile;
                this.contactProfile = this.placeholderProfile;
                this.setRadioButtons(this.contact.gender);
                this.applyDisabledCss();
            }
        })
            .catch(error => {
                let errorMessage = this.returnErrorMsg(error);
                // this.showPopupMessage(errorMessage, this.errorIcon);
                console.error(error);
            });
    }

    previewProfileImage() {
        this.profilePreview = true;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'block';
    }

    cancelAction() {
        this.isDisabled = true;
        this.contact = { ...this.contactValues };
        this.profileImage = this.contactProfile;
        this.applyDisabledCss();
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

    applyDisabledCss() {
        this.isDisabled = true;
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(210, 210, 210, 1)';
        let dropdownCountry = this.template.querySelector('.country-dropdown');
        let dropdownSalutation = this.template.querySelector('.input-dropdown');
        dropdownSalutation.style.backgroundColor = 'light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3))';
        dropdownCountry.style.backgroundColor = 'light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3))';
    }

    returnErrorMsg(error) {
        let errorMessage = 'Unknown error';
        if (error && error.body) {
            if (error.body.message) {
                errorMessage = error.body.message;
            } else if (error.body.pageErrors && error.body.pageErrors.length > 0) {
                errorMessage = error.body.pageErrors[0].message;
            }
        } else if (error && error.message) {
            errorMessage = error.message;
        }

        return { errorMessage, errorObject: error };
    }

    showPopupMessage(message, icon) {
        setTimeout(() => {
            const overlay = this.template.querySelector('.overlay');
            overlay.style.display = 'block';
        }, 0);
        this.popupMessage = message;
        this.popupIcon = icon;
        this.isModalOpen = true;
    }

    closePopup() {
        this.isModalOpen = false;
        this.profilePreview = false;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'none';
    }
}