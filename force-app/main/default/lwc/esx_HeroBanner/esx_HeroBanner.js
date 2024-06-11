import { LightningElement, api, track } from 'lwc';
import basePath from '@salesforce/community/basePath';

export default class Esx_HeroBanner extends LightningElement {
    @api bgTextureId;
    @api sideImageId;

    @track bgTextureURL;
    @track sideImgURL;

    get loadStyle(){
        return `--heroBg: url(${this.bgTextureURL}) 0% 0% no-repeat, linear-gradient(90deg, #C1DEE8 0%, #FBD9B9 100%)`
    }

    connectedCallback(){
        this.bgTextureURL = basePath + '/sfsites/c/cms/delivery/media/' + this.bgTextureId;
		this.sideImgURL = basePath + '/sfsites/c/cms/delivery/media/' + this.sideImageId;
	}
}