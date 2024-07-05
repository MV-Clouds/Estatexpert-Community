import { LightningElement, api, track } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";
import FeaturedProperties from "@salesforce/resourceUrl/FeaturedProperties";
import FORM_FACTOR from "@salesforce/client/formFactor";
import getListingData from '@salesforce/apex/ESX_PropertyDataTableController.getListingData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Esx_FeaturedProperties extends LightningElement {

    Rectangle = ListedProperties + '/Rectangle.png';
    bathroomicon = FeaturedProperties + '/FeaturedProperties/bathroomicon.png';
    bedroom = FeaturedProperties + '/FeaturedProperties/bedroom.png';
    caricon = FeaturedProperties + '/FeaturedProperties/caricon.png';
    mapicon = FeaturedProperties + '/FeaturedProperties/mapicon.png';
    readicon = FeaturedProperties + '/FeaturedProperties/readicon.png';
    backgroundimage = FeaturedProperties + '/FeaturedProperties/backgroundimage.png';

    mobilemap = FeaturedProperties + '/FeaturedProperties/mobilemap.png';
    mobilebedroom = FeaturedProperties + '/FeaturedProperties/mobilebedroom.png';
    mobilebathroom = FeaturedProperties + '/FeaturedProperties/mobilebathroom.png';
    mobilearea = FeaturedProperties + '/FeaturedProperties/mobilearea.png';

    @track carouselItems = [];
    @track currentItem = 0;
    @track mobileView = true;
    @track isLiked = false;

    @api homePage;

    connectedCallback() {
        this.handleFormFactor();
        // this.scrollerMethod();
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

    handleClick() {
        this.isLiked = !this.isLiked;
        this.updateIcon();
    }

    updateIcon() {
        // let icon = this.template.querySelector('.like-icon');
        let icon = this.template.querySelector(`[data-id="${recid}"]`);
        (icon) ? (this.isLiked) ? icon.classList.add('clicked') : icon.classList.remove('clicked') : null;    
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
                            property['class'] = 'carousel-property';
                        });

                        this.carouselItems = (properties);
                        console.log('proper',result);
                        console.log('proper', properties);
                        console.log('item-->',this.carouselItems);
                        this.updateCarouselItems();
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

    // Update the classes for carousel items
    updateCarouselItems() {
        console.log('updateCarouselItems');
        try {
            this.carouselItems = this.carouselItems.map((item, index) => {
                console.log('item ss-->', item);
                console.log('index ss-->', index);
                return { ...item, class: index === this.currentItem ? 'carousel-property active' : 'carousel-property' };
            });

            console.log('this.carouselItems-->', JSON.stringify(this.carouselItems));
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