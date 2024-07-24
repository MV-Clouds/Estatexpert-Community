import { LightningElement,track } from 'lwc';
import samplePropertyImage from'@salesforce/resourceUrl/samplePropertyImage';
import getPropertyImages from '@salesforce/apex/ESX_PropertyDetailsController.getPropertyInformation';

export default class Esx_PropertyGallary extends LightningElement {
    samplePropertyImage = samplePropertyImage;
    @track propertyMediaImages= [];
    @track livingRoomImgs = [];
    @track diningRoomImgs = [];
    @track kitchenImgs = [];
    @track guestRoomImgs = [];
    @track livingRoomImgsSize;
    @track diningRoomImgsSize;
    @track kitchenImgsSize;
    @track guestRoomImgsSize;
    @track propertyImage;
    @track isModalOpen;

    propertyId = 'a02dL000000xuO1QAI';
    connectedCallback(){
        this.getImages();
    }

    getImages(){
        getPropertyImages({propertyId:this.propertyId})
        .then(result => {
            console.log("result",result);
            this.propertyMediaImages = result.mediaLinks;
            this.livingRoomImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Living Room': true;
                return tags;
            });
            this.diningRoomImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Common Area': true;
                return tags;
            });
            this.kitchenImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Kitchen': true;
                return tags;
            });
            this.guestRoomImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Others': true;
                return tags;
            });
            this.livingRoomImgsSize = this.livingRoomImgs.length;
            this.diningRoomImgsSize = this.diningRoomImgs.length;
            this.kitchenImgsSize = this.kitchenImgs.length;
            this.guestRoomImgsSize = this.guestRoomImgs.length;
        })
        .catch(error => {
            console.error(error);
        });
    }

    handleCard(event){
        this.propertyImage = event.currentTarget.dataset.url;
        this.isModalOpen = true;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'block';
    }
    closePopup() {
        this.propertyImage = '';
        this.isModalOpen = false;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'none';
    }
}

