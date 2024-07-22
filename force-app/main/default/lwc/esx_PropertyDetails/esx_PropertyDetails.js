import { LightningElement, track } from 'lwc';

export default class Esx_PropertyDetails extends LightningElement {

    @track isDescription = true;
    @track isGallary = false;
    handleNavigation(event) {
        const navigationName = event.currentTarget.dataset.name;
        let descElement = this.template.querySelector('.description');
        let galleryElement = this.template.querySelector('.gallary');
        event.target.style.background = 'linear-gradient(90deg,rgba(255, 255, 255, 0.3), rgba(1, 118, 211, 0.2), rgba(255, 255, 255, 1))';
        if (navigationName === 'description') {
            this.isDescription = true;
            this.isGallary = false;
            console.log('descElement:', descElement);
            descElement.style.background = 'linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(1, 118, 211, 0.2), rgba(255, 255, 255, 1))';
            console.error('descElement is null');

            galleryElement.style.background = 'rgba(255, 255, 255, 0.3)';

        } else if (navigationName === 'gallary') {
            this.isDescription = false;
            this.isGallary = true;
            console.log('galleryElement:', galleryElement);
            descElement.style.background = 'rgba(255, 255, 255, 0.3)';

            galleryElement.style.background = 'linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(1, 118, 211, 0.2), rgba(255, 255, 255, 1))';

        }
    }
}