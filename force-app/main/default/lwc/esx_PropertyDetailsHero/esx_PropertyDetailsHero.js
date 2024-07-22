import { LightningElement,track } from 'lwc';
import samplePropertyImage from'@salesforce/resourceUrl/samplePropertyImage';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
import getPropertyInformation from '@salesforce/apex/ESX_PropertyDetailsController.getPropertyInformation';

export default class Esx_PropertyDetailsHero extends LightningElement {

    samplePropertyImage = samplePropertyImage;
    @track bedroomIcon = property_icons +'/bed.png';
    @track bathroomIcon = property_icons +'/bath.png';
    @track balconyIcon = property_icons +'/balcony.png';
    @track furnishedIcon = property_icons +'/furnished.png';

    @track isProperty = false;
    propertyId = 'a02dL000000xuO1QAI';
    @track property;
    @track propertyMainImage;
    @track propertyMedias = [];
    @track moreImgSize;
    connectedCallback(){
        this.getPropertyInfo();
    }

    getPropertyInfo(){
        getPropertyInformation({propertyId:this.propertyId})
        .then(result => {
            console.log("result",result);
            this.property = result.property;
            this.propertyMedias = result.mediaLinks;
            this.propertyMedias = this.propertyMedias.slice(0,6);
            this.propertyMainImage = this.propertyMedias[0].ExternalLink__c;
            this.isProperty = true;
            this.moreImgSize = result.mediaLinks.length -5;
            const targetId = this.propertyMedias[5].Id;
            console.log("targetId",targetId);
            setTimeout(() => {
                console.log('targetElement:',this.template.querySelector('[data-id="'+targetId+'"]'));
                this.template.querySelector('[data-id="' + targetId + '"]').classList.add("activate");
            }, 0);
            
        })
        .catch(error => {
            console.error(error);
        });
    }
}