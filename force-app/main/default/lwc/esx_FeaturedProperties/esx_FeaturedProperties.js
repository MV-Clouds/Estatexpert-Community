import { LightningElement,track } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";
import FeaturedProperties from "@salesforce/resourceUrl/FeaturedProperties";
import FORM_FACTOR from "@salesforce/client/formFactor";



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



    @track carouselItems = [
        { id: 1, content: 'Item 1', class: 'carousel-property' },
        { id: 2, content: 'Item 2', class: 'carousel-property' },
        { id: 3, content: 'Item 3', class: 'carousel-property' },
        // Add more items as needed
    ];
    @track currentItem = 0;
    @track mobileView = true;


   @track isLiked = false;

    

    connectedCallback() {
        this.handleFormFactor();
        this.updateCarouselItems();
    }

    handleFormFactor() {

        if (FORM_FACTOR === "Small") {
            this.mobileView = false;
        }
    }

    handleClick() {
        this.isLiked = !this.isLiked;
        this.updateIcon();
    }

    updateIcon() {

        try {
            console.log('updateIcon----');
            let icon = this.template.querySelector('.like-icon');
            if (this.isLiked) {
                icon.classList.add('clicked');
            } else {
                icon.classList.remove('clicked');
            }
            console.log({ icon });
        } catch (error) {
            console.log('error--------->');
            console.log({ error });
        }
        
    }

    // Update the classes for carousel items
    updateCarouselItems() {
        this.carouselItems = this.carouselItems.map((item, index) => {
            return { ...item, class: index === this.currentItem ? 'carousel-property active' : 'carousel-property' };
        });
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


}