import { LightningElement, track } from 'lwc';
import samplePropertyImage from '@salesforce/resourceUrl/samplePropertyImage';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
import Blank_Profile_Photo from '@salesforce/resourceUrl/Blank_Profile_Photo';
import getPropertyInformation from '@salesforce/apex/ESX_PropertyDetailsController.getPropertyInformation';

export default class Esx_PropertyDetailsHero extends LightningElement {

    samplePropertyImage = samplePropertyImage;
    @track bedroomIcon = property_icons + '/bed.png';
    @track bathroomIcon = property_icons + '/bath.png';
    @track balconyIcon = property_icons + '/balcony.png';
    @track furnishedIcon = property_icons + '/furnished.png';

    @track isProperty = false;
    propertyId = 'a02dL000000xuO1QAI';
    @track property;
    @track propertyMainImage;
    @track propertyMedias = [];
    @track allPropertyImages = [];
    @track moreImgSize;
    @track profileImage ='';
    placeholderProfile = Blank_Profile_Photo;
    connectedCallback() {
        this.getPropertyInfo();
    }

    getPropertyInfo() {
        getPropertyInformation({ propertyId: this.propertyId })
            .then(result => {
                console.log("result", result);
                if ((result != null && result != undefined) && (result.ownerProfileImage != null && result.ownerProfileImage != undefined)) {
                    this.profileImage = 'data:image/jpeg;base64,'+ result.ownerProfileImage;
                    console.log('this.profileImage==========>',this.profileImage);
                } else {
                    this.profileImage = this.placeholderProfile;
                }
                this.property = result.property;
                this.allPropertyImages = result.mediaLinks;
                this.propertyMedias = result.mediaLinks;
                this.propertyMedias = this.propertyMedias.slice(0, 6);
                this.propertyMainImage = this.propertyMedias.length>0 ?this.propertyMedias[0].ExternalLink__c :this.samplePropertyImage;
                this.isProperty = true;
                this.moreImgSize = result.mediaLinks.length - 5;
                const targetId = this.propertyMedias[5].Id;
                console.log("targetId", targetId);
                setTimeout(() => {
                    console.log('targetElement:', this.template.querySelector('[data-id="' + targetId + '"]'));
                    this.template.querySelector('[data-id="' + targetId + '"]').classList.add("activate");
                }, 0);

            })
            .catch(error => {
                console.error(error);
            });
    }

    showMoreImages() {
        const imgElements = this.template.querySelectorAll('.black');
        const scrollBox = this.template.querySelector('.scroll');
        imgElements.forEach(imgElement => {
            imgElement.style.display = 'none';
        });
        scrollBox.style.justifyContent = 'normal';
        this.propertyMedias = this.allPropertyImages;
    }
}