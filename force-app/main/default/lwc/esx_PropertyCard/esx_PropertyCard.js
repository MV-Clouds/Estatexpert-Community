import { LightningElement,api, track,wire } from 'lwc';

export default class Esx_PropertyCard extends LightningElement {
    @api propertydata;
    @api viewtype;
    
    handleClick(event) {
        try {
            console.log('handleClick--->');
            let selectLike = event.currentTarget.dataset.id;
            this.updateIcon(selectLike);
        } catch (error) {
            console.log('error updateIcon--->', error.message); 
        }
    }

    updateIcon(selectLike) {
        try {
            let icon = this.template.querySelector(`[data-id="${selectLike}"]`);
            icon ? (icon.classList.contains('clicked') ? icon.classList.remove('clicked') : icon.classList.add('clicked')) : null;
        } catch (error) {
            console.log('error updateIcon--->',error.message);  
        }
    }

}