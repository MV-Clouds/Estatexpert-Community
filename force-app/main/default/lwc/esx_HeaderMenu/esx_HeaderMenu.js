import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import EstateXpert_Logo from '@salesforce/resourceUrl/EstateXpert_Logo';
import Blank_Profile_Photo from '@salesforce/resourceUrl/Blank_Profile_Photo';
import getContactdetails from '@salesforce/apex/ESX_HeaderMenu.getContactdetails';

export default class Esx_HeaderMenu extends NavigationMixin(LightningElement){
    @track logo = EstateXpert_Logo;
    @track isGuest = true;
    @track contactId = '003dL000001VvuLQAS' // Add dynamic Id after complete login module
    @track profileImgUrl;
    @track activeTab = 'Home';

    get profileAvatar() {
        return `background-image: url(${this.profileImgUrl});`;
    }

    get item1Class() {
        return this.activeTab === 'Home' ? 'active-tab' : '';
    }

    get item2Class() {
        return this.activeTab === 'Property__c' ? 'active-tab' : '';
    }

    get item3Class() {
        return this.activeTab === 'About__c' ? 'active-tab' : '';
    }

    connectedCallback(){
        if (this.contactId != null) {
            this.isGuest = false;
            this.getContact();
        }
    }

    getContact(){
        getContactdetails({contactId: this.contactId})
            .then(result => {
                if((result != null && result != undefined) && (result.image != null && result.image != undefined)){
                    this.profileImgUrl = 'data:image/jpeg;base64,' + result.image;
                }else{
                    this.profileImgUrl = Blank_Profile_Photo;
                }
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }

    handleNavigate(event) {
        let pageApi = event.currentTarget.dataset.id;
        this.activeTab = pageApi;

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApi
            },
        });
    }
}