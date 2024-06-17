import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Footersvg from '@salesforce/resourceUrl/FooterSVG';

export default class Esx_Footer extends NavigationMixin(LightningElement) {
    @track bg = Footersvg + '/FooterSVG/blue-bg.png';
    @track grpImage = Footersvg + '/FooterSVG/grp-image.png';
    @track logo = Footersvg + '/FooterSVG/logo-2.png';
    @track twittorIcon = Footersvg + '/FooterSVG/twitter-Icon.png';
    @track facebookIcon = Footersvg + '/FooterSVG/facebook-Icon.png';
    @track linkdinIcon = Footersvg + '/FooterSVG/linkdin-Icon.png';
    @track instagramIcon = Footersvg + '/FooterSVG/instagram-Icon.png';
    @track skypeIcon = Footersvg + '/FooterSVG/skype-Icon.png';
    @track phone = Footersvg + '/FooterSVG/phone.png';
    @track email = Footersvg + '/FooterSVG/email.png';
    @track website = Footersvg + '/FooterSVG/website.png';
    @track sideImage = Footersvg + '/FooterSVG/footer-image.png';

    handleRedirect(event){
        let redirectURL = event.currentTarget.dataset.link;
        window.open(redirectURL, '_blank');
    }

    handleNavigate(event) {
        let pageApi = event.currentTarget.dataset.id;
        this.activeTab = pageApi;

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApi
            },
        });
    }
}