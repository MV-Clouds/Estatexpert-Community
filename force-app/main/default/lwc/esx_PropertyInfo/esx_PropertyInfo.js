import { LightningElement ,track} from 'lwc';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';

export default class Esx_PropertyInfo extends LightningElement {

    @track PhoneIcon = property_icons +'/phone.png';
    @track EmailIcon = property_icons +'/Email.png';

    @track BedroomIcon = property_icons +'/bed.png';
    @track BathroomIcon = property_icons +'/bath.png';

    @track CarParkingIcon = property_icons +'/bus.png';
    @track SwimmingIcon = property_icons +'/swim.png';
    @track GymIcon = property_icons +'/gym.png';
    @track RestaurantIcon = property_icons +'/restaurant.png';
    @track WifiIcon = property_icons +'/wifi.png';
    @track PetCenterIcon = property_icons +'/pet.png';
    @track SportsIcon = property_icons +'/sports.png';
    @track LaundryIcon = property_icons +'/laundry.png';
    @track ParkIcon = property_icons +'/park.png';
    @track BicycleIcon = property_icons +'/bicycle.png';
    @track EmergencyIcon = property_icons +'/phone.png';
    @track HockeyIcon = property_icons +'/golf.png';
    @track LibraryIcon = property_icons +'/library.png';
    @track BabyParkIcon = property_icons +'/babypark.png';


    mapMarkers = [
        {
            location: {
                // Location Information
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'CA',
                Street: '50 Fremont St',
            },
        }
    ];

    selectedMarkerValue = 'SF1';

    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue;
    }
}