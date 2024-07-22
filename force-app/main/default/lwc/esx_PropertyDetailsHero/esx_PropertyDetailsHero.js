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
    connectedCallback(){
        this.getPropertyInfo();
    }

    getPropertyInfo(){
        getPropertyInformation({propertyId:this.propertyId})
        .then(result => {
            console.log("result",result);
            this.property = result.property;
            this.propertyMedias = result.mediaLinks;
            this.propertyMainImage = this.propertyMedias[0].ExternalLink__c;
            this.isProperty = true;
        })
        .catch(error => {
            console.error(error);
        });
    }
}