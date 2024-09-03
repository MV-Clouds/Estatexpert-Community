import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import ABOUT_US_IMAGE from '@salesforce/resourceUrl/AboutUsHeaderImage';
import ABOUT_US_SECOND_IMAGE from '@salesforce/resourceUrl/AboutUsSecondImage';

import testimonial_IMG_1 from '@salesforce/resourceUrl/testimonial1';
import testimonial_IMG_2 from '@salesforce/resourceUrl/testimonial2';



export default class Esx_AboutUs extends NavigationMixin(LightningElement) {
    aboutUsImgUrl = ABOUT_US_IMAGE;
    aboutUsSecondImgUrl = ABOUT_US_SECOND_IMAGE;
    testimonialImg1 = testimonial_IMG_1;
    testimonialImg2 = testimonial_IMG_2;
    
    @track slides = [
            {
                id: '1',
                author: 'Author 1',
                authorDetails: 'Vp of marketing, disney',
                content: `Everyone on the team is expected to meet the same high standards and produce work of the highest calibre, Everyone on the team is expected to meet the same high standards.`,
                imgUrl: this.testimonialImg1,
                firmImage: this.testimonialImg2,  
            },
            {
                id: '2',
                author: 'Author 2',
                authorDetails: 'CEO of xyz',
                content: `The world is full of wonderful things you haven't seen yet. Don't ever give up on the chance of seeing them.`,
                imgUrl: this.testimonialImg1,
                firmImage: this.testimonialImg2,
            },
            {
                id: '3',
                author: 'Author 3',
                authorDetails: 'CEO of xyz',
                content: `The world is full of wonderful things you haven't seen yet. Don't ever give up on the chance of seeing them.`,
                imgUrl: this.testimonialImg1,
                firmImage: this.testimonialImg2, 
            },
            {
                id: '4',
                author: 'Author 4',
                authorDetails: 'CEO of abc',
                content: `Everyone on the team is expected to meet the same high standards and produce work of the highest calibre, Everyone on the team is expected to meet the same high standards.`,
                imgUrl: this.testimonialImg1,
                firmImage: this.testimonialImg2,  
            },
            {
                id: '5',
                author: 'Author 5',
                authorDetails: 'CEO of pqr',
                content: `The world is full of wonderful things you haven't seen yet. Don't ever give up on the chance of seeing them.`,
                imgUrl: this.testimonialImg1,
                firmImage: this.testimonialImg2,  
            },
        ];

    @track carousel;

    @track currentSlide = 0;
    @track numOfSlides = 0;
    
    renderedCallback(){
        this.getCarouselDataElement();
        console.log("element data loaded....... ");
    }

    // get carousel data element
    getCarouselDataElement(){
        try {
            if(this.slides.length > 0){
                this.carousel = this.template.querySelector(`[data-carousel]`);
                this.numOfSlides = this.slides.length;

                console.log("carousel --> "+this.carousel);
                console.log("numOfSlides --> "+this.numOfSlides);
            }else{
                console.log('Slides list is Empty');
            }
        } catch (error) {
            console.error("Error in getCarouselDataElement:", error.stack);
        }

    }

    // this function is used to move slide next
    nextSlide(){
        this.updateSlide(this.modulo(this.currentSlide + 1));
    }

    // this function is used to move slide privous
    privousSlide(){
        this.updateSlide(this.modulo(this.currentSlide - 1));
    }

    updateSlide(newSlideIndex) {
        try{
            this.currentSlide = newSlideIndex;
            this.carousel.style.setProperty('--current-slide', this.currentSlide);
            console.log("Slide number -->", this.currentSlide);
        }catch (error) {
            console.error("Error in privousSlide:", error.stack);
        }
    }

    // Ensure slide index wraps around using modulo
    modulo(index) {
        return (index + this.numOfSlides) % this.numOfSlides;
    }

    // if there is no slides data then simply show message
    get hasSlides() {
        return this.slides.length > 0;
    }


    // if only one slide has then hide the next and previous button
    get hasManySlides(){
        return this.slides.length > 1;
    }

    // this will redirect to the register page
    joinUs(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Register'
            }
        });
    }

}