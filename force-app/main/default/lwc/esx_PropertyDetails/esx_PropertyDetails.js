import { LightningElement, track } from 'lwc';

export default class Esx_PropertyDetails extends LightningElement {

    @track isDescription = true;
    @track isGallary = false;
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
        }
    }
}