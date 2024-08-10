import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
export default class Esx_PropertyDetails extends NavigationMixin(LightningElement) {

    @track isDescription = true;
    @track isGallary = false;
    @track backIcon = property_icons + '/backIcon.png'

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