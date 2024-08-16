import { LightningElement,api, track,wire } from 'lwc';
import ImageNotFound from '@salesforce/resourceUrl/ImageNotFound';
import { NavigationMixin } from 'lightning/navigation';


export default class Esx_PropertyCard extends NavigationMixin(LightningElement) {
    @api propertydata;
    @api viewtype;
    imageNot = ImageNotFound;
    
    handleClick(event) {
        try {
            console.log('handleClick--->');
            let selectLike = event.target.dataset.id;
            this.updateIcon(selectLike);
        } catch (error) {
            console.error(error.stack);
        }
    }

    handlePropertyDetail(event){
        try {
            let propertyId = event.currentTarget.dataset.key;
            console.log('propertyId-->', propertyId);

            if (propertyId){
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Property_Details__c'
                    },
                    state: {
                        id: propertyId
                    }
                });
            }
              
        } catch (error) {
            console.error(error.stack);
        }
        
    }

    updateIcon(selectLike) {
        try {
            let icon = this.template.querySelector(`[data-id="${selectLike}"]`);
            icon 
                ? (icon.classList.contains('clicked') 
                    ? icon.classList.remove('clicked') : icon.classList.add('clicked')) : null;
        } catch (error) {
            console.error(error.stack);  
        }
    }
    handleErrro(event){
        event.target.src = this.imageNot;
        event.target.onerror = null;
    }

}