import { LightningElement,track } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";
import ImageNotFound from '@salesforce/resourceUrl/ImageNotFound';
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';

export default class Esx_FeaturedPropertieCard extends LightningElement {
    @track isDown = false;
    @track scrollX;
    @track scrollLeft;

    @track cards = [];

    Rectangle = ListedProperties + '/Rectangle.png';
    imageNot = ImageNotFound;

    connectedCallback() {
        this.getPropertyInfo();
    }

    handleMouseDown(event) {
        event.preventDefault();
        this.isDown = true;
        this.template.querySelector('.scroll').classList.add('active');
        this.scrollX = event.pageX - this.template.querySelector('.scroll').offsetLeft;
        this.scrollLeft = this.template.querySelector('.scroll').scrollLeft;
    }

    handleMouseUp() {
        this.isDown = false;
        this.template.querySelector('.scroll').classList.remove('active');
    }

    handleMouseLeave() {
        this.isDown = false;
        this.template.querySelector('.scroll').classList.remove('active');
    }

    handleMouseMove(event) {
        if (!this.isDown) return;
        event.preventDefault();
        const element = event.pageX - this.template.querySelector('.scroll').offsetLeft;
        const scrolling = (element - this.scrollX) * 2;
        this.template.querySelector('.scroll').scrollLeft = this.scrollLeft - scrolling;
    }

    getPropertyInfo() {
        try {
            getListingData()
                .then(result => {
                    console.log({ result });
                    if (result != null) {
                        this.cards = result;
                    } else {
                        console.log({ error });
                        this.showToast('Error', 'Something went Wrong', 'error');
                    }
                })
                .catch(error => {
                    console.log('error');
                    console.log({ error });
                    this.showToast('Error', 'Something went Wrong', 'error');
                })
        } catch (error) {
            console.log('error-->', error);
            this.showToast('Error', 'Something went Wrong', 'error');

        }

    }

    showToast(Title, Message, Variant) {
        const event = new ShowToastEvent({
            title: Title,
            message: Message,
            variant: Variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    handleCard(event){
        let selectCard = event.currentTarget.dataset.key;
        console.log('selCard-->', selectCard);
        this.sendBackParent(selectCard);
    }

    sendBackParent(selectCard) {
        this.dispatchEvent(
            new CustomEvent("senddata", {
                detail: selectCard
            })
        );
    }

    handleErrro(event) {
        event.target.src = this.imageNot;
        event.target.onerror = null;
    }
    
}