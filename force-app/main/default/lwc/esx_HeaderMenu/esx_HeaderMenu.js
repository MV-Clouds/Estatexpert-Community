import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import EstateXpert_Logo from '@salesforce/resourceUrl/EstateXpert_Logo';
import Blank_Profile_Photo from '@salesforce/resourceUrl/Blank_Profile_Photo';
import getContactdetails from '@salesforce/apex/ESX_HeaderMenu.getContactdetails';

export default class Esx_HeaderMenu extends NavigationMixin(LightningElement){
    @track logo = EstateXpert_Logo;
    @track isGuest = true;
    @track contactId = '003dL000001VvuLQAS' // Add dynamic Id after complete login module
    @track contact = {};
    @track profileImgUrl;
    @track activeTab = 'Home';
    @track displayRowIcon = true;

    get profileAvatar() {
        return `background-image: url(${this.profileImgUrl});`;
    }

    get item1Class() {
        return this.activeTab == 'Home' ? 'active-tab' : '';
    }

    get item2Class() {
        return this.activeTab == 'Property__c' ? 'active-tab' : '';
    }

    get item3Class() {
        return this.activeTab == 'About__c' ? 'active-tab' : '';
    }

    get item4Class() {
        return this.activeTab == 'My_Properties__c' ? 'active-tab' : '';
    }

    get item5Class() {
        return this.activeTab == 'Check_Password' ? 'active-tab' : '';
    }

    get item6Class() {
        return this.activeTab == 'Contact_Us__c' ? 'active-tab' : '';
    }

    get checkContainerCls(){
        return this.displayRowIcon == false ? 'container' : '';
    }

    get checkViewType (){
        this.resizeFunction();
    }

    connectedCallback(){
        window.addEventListener('resize', this.resizeFunction);
        if (this.contactId != null) {
            this.isGuest = false;
            this.getContact();
        }
    }

    getContact(){
        getContactdetails({contactId: this.contactId})
            .then(result => {
                this.contact['Name'] = result.contact.Name;
                this.contact['Type'] = result.contact.RecordTypeId != null ? result.contact.RecordType.Name : '';
                console.log('this.contact ==> ',this.contact);
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

    changeIcon(){
        if (this.displayRowIcon) {
            this.template.querySelector('.side-menu-div').style="width:70%";
            this.displayRowIcon = false;
        } else {
            this.template.querySelector('.side-menu-div').style="width:0px";
            this.displayRowIcon = true;
        }
    }

    closeSideMenu(){
        this.template.querySelector('.side-menu-div').style="width:0px";
        this.displayRowIcon = true;
    }

    resizeFunction = () => {
		if (window.innerWidth < 600) {
            var css = this.template.host.style;
            css.setProperty('--mobileHeight', window.innerHeight + 'px');
		}
    };

    handleNavigate(event) {
        let pageApi = event.currentTarget.dataset.id;
        this.activeTab = pageApi;

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApi
            },
        });

        this.closeSideMenu();
    }
}