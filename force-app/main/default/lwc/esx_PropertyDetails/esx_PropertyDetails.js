import { LightningElement, track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
export default class Esx_PropertyDetails extends NavigationMixin(LightningElement) {

    @track isDescription = true;
    @track isGallary = false;
    @track backIcon = property_icons + '/backIcon.png'
    @api propertyId;
    
    connectedCallback(){
        // const url = new URL('https://mvclouds9-dev-ed.develop.my.site.com/propertydetailpage/property?id=a02dL000000xuO1QAI');
        // const queryString = url.search;  // Extracts the query string from the URL
        
        const queryString = window.location.search;
        console.log('queryString', queryString);
        
        const urlParams = new URLSearchParams(queryString);
        console.log('urlParams', JSON.stringify([...urlParams])); // Convert the iterator to an array to JSON.stringify
        
        this.propertyId = urlParams.get('id');
        console.log('propertyId', this.propertyId);
    }

    handleNavigation(event) {
        const navigationName = event.currentTarget.dataset.name;
        const descElement = this.template.querySelector('.description');
        const galleryElement = this.template.querySelector('.gallary');

        if (!descElement || !galleryElement) {
            console.error('One or both elements are null');
            return;
        }

        const activeStyle = 'linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(1, 118, 211, 0.2), rgba(255, 255, 255, 1))';
        const inactiveStyle = 'rgba(255, 255, 255, 0.3)';

        if (navigationName === 'description') {
            this.isDescription = true;
            this.isGallary = false;
            descElement.style.background = activeStyle;
            galleryElement.style.background = inactiveStyle;
        } else if (navigationName === 'gallary') {
            this.isDescription = false;
            this.isGallary = true;
            descElement.style.background = inactiveStyle;
            galleryElement.style.background = activeStyle;
            galleryElement.style.transition = 'background 0.3s'
        }
    }
    
    navigateHome(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            },
        });
    }
}