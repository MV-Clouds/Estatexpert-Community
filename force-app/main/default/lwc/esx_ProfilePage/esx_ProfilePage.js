import { LightningElement, track } from 'lwc';
import basePath from '@salesforce/community/basePath';
import getContactdetails from '@salesforce/apex/ProfilePage.getContactdetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Blank_Profile_Photo from '@salesforce/resourceUrl/Blank_Profile_Photo';
import myProfilePageBackground from '@salesforce/resourceUrl/ProfilePageBackground';

export default class Esx_ProfilePage extends LightningElement {

    // @track contactId = '003dL000001VvuLQAS';
    @track contactId = '003dL000001DvazQAC';
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
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'},
    ];
    placeholderProfile = Blank_Profile_Photo;

    connectedCallback(){
        this.getContact();
    }

    getContact(){
        getContactdetails({contactId: this.contactId})
            .then(result => {
                console.log('result: ', result);
                if(result.contact != null){
                    this.contact = result.contact;
                    this.recordType = result.contact.RecordType.Name;
                    this.isLoading = false;
                }else{
                    this.showToast('Error', 'Error' , 'No Contacts Found');
                }

                if(result.image != null){
                    this.profileImage = 'data:image/jpeg;base64,' + result.image;
                }else{
                    console.log('No Image Found');
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

    navigateHome(){
        console.log('navigateHome');
    }

    updateContact(){
        const { name, value } = event.target;
        console.log('name: ', name);
        console.log('value: ', value);
        this.contact[name] = value;
        console.log('this.contact: ', this.contact);
    }

    uploadProfileImage(){
        console.log('uploadProfileImage');
    }

    getContactInfo(event){
        this.isDisabled = false;
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(1, 118, 211, 1)';
    }
    updateContactInfo(){
        this.isDisabled = true;
        let button = this.template.querySelector('.save-btn');
        button.style.backgroundColor = 'rgba(210, 210, 210, 1)';
    }
}