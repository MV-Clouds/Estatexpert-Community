import { LightningElement, api, track } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";
import FeaturedProperties from "@salesforce/resourceUrl/FeaturedProperties";
import FORM_FACTOR from "@salesforce/client/formFactor";
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Esx_FeaturedProperties extends LightningElement {

    Rectangle = ListedProperties + '/Rectangle.png';
    backgroundimage = FeaturedProperties + '/FeaturedProperties/backgroundimage.png';

    @track carouselItems = [];
    @track carouselItemsAll = [];
    @track currentItem = 0;
    @track mobileView = true;
    @track isLiked = false;

    @api homePage;

    connectedCallback() {
        this.handleFormFactor();
    }

    scrollerMethod() {
        this.interval = setInterval(() => {
           this.nextItem();
        }, 5000);
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }

    handleFormFactor() {
        (FORM_FACTOR === "Small") ? this.mobileView = false : this.mobileView = true;
        this.getPropertyInfo();
    }

    handleClick(event) {
        console.log('handleClick--->');
        let selectLike = event.currentTarget.dataset.id;
        this.updateIcon(selectLike);
    }

    updateIcon(selectLike) {
        let icon = this.template.querySelector(`[data-id="${selectLike}"]`);
        icon ? (icon.classList.contains('clicked') ? icon.classList.remove('clicked') : icon.classList.add('clicked')) : null;
    }

    handleChildData(event) {
        try {
            let carouselItems = JSON.parse(JSON.stringify(this.carouselItemsAll));
            carouselItems = (this.carouselItemsAll).find(item => item.Id == event.detail);

            this.carouselItems = [JSON.parse(JSON.stringify(carouselItems))];
        } catch (error) {
            console.log('error handleChildData--',(error.message));
        }
        
    }

    getPropertyInfo() {
        try {
            getListingData()
                .then(result => {
                    console.log({ result });
                    if (result != null) {
                        console.log('result-->',result);
                        let properties = JSON.parse(JSON.stringify(result));
                        properties.forEach(property => {
                            this.homePage ? property['class'] = 'carousel-property active' : property['class'] = 'carousel-property active';
                        });

                        this.homePage ? this.carouselItems = [(properties[0])]: this.carouselItems = (properties);
                        this.homePage ? this.carouselItemsAll = (properties): this.carouselItemsAll = [];
                        this.homePage ? '' : this.updateCarouselItems();
                    } else {
                        console.log({ error });
                        console.log('error getListingData--->',error.message );
                        this.showToast('Error', 'Something went Wrong', 'error');
                    }
                })
                .catch(error => {
                    console.log('error getPropertyInfo--->',error.message );
                    this.showToast('Error', 'Something went Wrong', 'error');
                })
        } catch (error) {
            console.log('error getPropertyInfo--->', error.message);
            this.showToast('Error', 'Something went Wrong', 'error');

        }

    }

    // Update the classes for carousel items
    updateCarouselItems() {
        console.log('updateCarouselItems');
        try {
            this.carouselItems = this.carouselItems.map((item, index) => {
                return { ...item, class: index === this.currentItem ? 'carousel-property active' : 'carousel-property' };
            });
        } catch (error) {
            console.log('error--',error);
        }
        
    }

    // Show the next item in the carousel
    nextItem() {
        try {
            console.log('nextItem');
            this.currentItem = (this.currentItem + 1) % this.carouselItems.length;
            this.updateCarouselItems();
        } catch (error) {
            console.error('Error in nextItem', error);
        }
    }

    // Show the previous item in the carousel
    prevItem() {
        try {
            console.log('prevItem');
            this.currentItem = (this.currentItem - 1 + this.carouselItems.length) % this.carouselItems.length;
            this.updateCarouselItems();
        } catch (error) {
            console.error('Error in prevItem', error);
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


}