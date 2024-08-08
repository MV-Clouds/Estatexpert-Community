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
    @track previewImageUrl;
    @track currentIndex;
    @track leftArrowDisabled = false;
    @track rightArrowDisabled = false;
    @track totalImages;
    @track imageClass = 'active';

    propertyId = 'a02dL000000xuO1QAI';
    connectedCallback(){
        this.getImages();
    }

    getImages(){
        getPropertyImages({propertyId:this.propertyId})
        .then(result => {
            console.log("result",result);
            this.propertyMediaImages = result.mediaLinks;
            this.totalImages = this.propertyMediaImages.length;
            console.log('result.mediaLinks:',result.mediaLinks);
            this.livingRoomImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Living Room': false;
                return tags;
            });
            console.log('livingRoomImgs:',this.livingRoomImgs);

            this.diningRoomImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Common Area': false;
                return tags;
            });
            console.log('livingRoomImgs:',this.livingRoomImgs);

            this.kitchenImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Kitchen': false;
                return tags;
            });
            this.guestRoomImgs = this.propertyMediaImages.filter(media =>{
                const tags = media.Tags__c ? media.Tags__c=='Others': false;
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
        this.previewImageUrl = event.currentTarget.dataset.url;
        this.currentIndex = this.propertyMediaImages.findIndex(image => image.ExternalLink__c === this.previewImageUrl);
        this.isModalOpen = true;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'block';
    }
    closePopup() {
        this.propertyImage = '';
        this.previewImageUrl = null;
        this.currentIndex = null;
        this.isModalOpen = false;
        const overlay = this.template.querySelector('.overlay');
        overlay.style.display = 'none';
    }


    touchStartX = 0;
    touchEndX = 0;

    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
    }

    handleTouchMove(event) {
        this.touchEndX = event.touches[0].clientX;
    }

    handleTouchEnd() {
        if (this.touchStartX - this.touchEndX > 50) {
            this.goToNext();
        }

        if (this.touchEndX - this.touchStartX > 50) {
            this.goToPrevious();
        }
    }

    
    goToPrevious(){
        if (this.currentIndex > 0) {
            this.leftArrowDisabled = false;
            // this.currentIndex -= 1;
            // this.previewImageUrl = this.propertyMediaImages[this.currentIndex].ExternalLink__c;
            this.imageClass = 'slide-in';
            setTimeout(() => {
                this.currentIndex -= 1;
                this.previewImageUrl = this.propertyMediaImages[this.currentIndex].ExternalLink__c;
                this.imageClass = 'slide-out';
                setTimeout(() => {
                    this.imageClass = 'active';
                }, 500);
            }, 500);
            this.updateNavigationButtons();
        }
        else{
            this.leftArrowDisabled = true;
            this.rightArrowDisabled = false;
        }
    }
    goToNext(){
        console.log('currentIndex:',this.currentIndex);
        console.log('livingRoomImgs:',this.propertyMediaImages.length);
        if (this.currentIndex < this.propertyMediaImages.length - 1) {
            this.rightArrowDisabled = false;
            // this.currentIndex += 1;
            // this.previewImageUrl = this.propertyMediaImages[this.currentIndex].ExternalLink__c;
            this.imageClass = 'slide-out';
            setTimeout(() => {
                this.currentIndex += 1;
                this.previewImageUrl = this.propertyMediaImages[this.currentIndex].ExternalLink__c;
                this.imageClass = 'slide-in';
                setTimeout(() => {
                    this.imageClass = 'active';
                }, 500);
            }, 500);
            this.updateNavigationButtons();
        }
        else{
            this.leftArrowDisabled = false;
            this.rightArrowDisabled = true;
        }
    }

    updateNavigationButtons() {
        this.leftArrowDisabled = this.currentIndex === 0;
        this.rightArrowDisabled = this.currentIndex === this.propertyMediaImages.length - 1;
    }
}

