import { LightningElement, track } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";

export default class Esx_PropertyFilter extends LightningElement {
    @track roomNumber = 1;
    @track bathRoomNumber = 1;
    @track isShowModal = false;
    @track viewType = 'list';

    bedroomIcon = ListedProperties + '/Vector.png';
    bathroomIcon = ListedProperties + '/fa-solid_bath.png';
    searchIcon = ListedProperties + '/searchIcon.png';
    dropdownIcon = ListedProperties + '/dropdownIcon.png';

    

    showModalBox() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }
}