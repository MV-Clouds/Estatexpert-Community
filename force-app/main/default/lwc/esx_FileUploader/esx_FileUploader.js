import { LightningElement, track, api } from 'lwc';
import AWS_SDK from "@salesforce/resourceUrl/AWSSDK";
import deleteIm from "@salesforce/resourceUrl/delete";
import UploadImage from "@salesforce/resourceUrl/UploadImage";
import fileUploadCss from "@salesforce/resourceUrl/fileUploadCss";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import insertMedias from '@salesforce/apex/Esx_FileUploaderController.insertMedias';
import getAWSInfo from '@salesforce/apex/Esx_FileUploaderController.getAWSInfo';
import getPropertyMedia from '@salesforce/apex/Esx_FileUploaderController.getPropertyMedia';
import getPicklistLabelName from '@salesforce/apex/Esx_FileUploaderController.getPicklistLabelName';
import deleteAWSImage from '@salesforce/apex/Esx_FileUploaderController.deleteAWSImage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Esx_FileUploader extends LightningElement {


    @api recordId;
    @track uploadProgress = 0;
    @track isUploading = false;
    @track listOfFileData = [];
    @track imageList = [];
    @track newlatestImageList = [];
    file;
    s3;
    deleteIcon = deleteIm;
    uploadIcon = UploadImage;

    @track showModal = false;
    @track url;
    @track progressBar = false;
    @track name = '';
    @track configtionDataOfAWS;

    @track tages;

    connectedCallback() {
        this.getAWSData();
        this.getTages();
    }

    loadAWSData() {
        try {
            Promise.all([
                loadScript(this, AWS_SDK),
                loadStyle(this, fileUploadCss)
            ])
                .then(() => {
                    console.log('AWS SDK and CSS loaded successfully');

                    AWS.config.update({
                        accessKeyId: this.configtionDataOfAWS[0]['AWS_Access_Key__c'],
                        secretAccessKey: this.configtionDataOfAWS[0]['AWS_Secret_Access_Key__c'],
                        region: this.configtionDataOfAWS[0]['S3_Region_Name__c']

                    });
                    this.s3 = new AWS.S3();
                })
                .catch(error => {
                    console.error('Error loading AWS SDK or external CSS:', error);
                    console.log('Error loading AWS SDK or external CSS:', error.message);
                });

            console.log('recordID---<<<<<>', this.recordId);
        } catch (error) {
            console.log('Error loadAWSData --->', error);
            console.log('Error loadAWSData --->', error.message);
        }
    }

    get progressBarStyle() {
        return `width: ${this.uploadProgress}%`;
    }

    getTages() {
        getPicklistLabelName({ fieldname: 'Tags__c' })
            .then(result => {
                console.log('result getTages ** => ', result);
                if (result != null) {
                    console.log('result--->', result);
                    this.tages = Object.keys(result).map(key => {
                        return { label: result[key], value: key };
                    });
                } else {
                    this.showToast('Error', 'Something went Wrong getTages', 'error');
                }
            });
    }


    getAWSData() {

        getAWSInfo()
            .then(result => {
                console.log('result getAWSInfo ** => ', result);
                if (result) {
                    this.configtionDataOfAWS = result;
                    this.loadAWSData();
                    this.getMedias();
                }
            });
    }

    getMedias() {
        getPropertyMedia({ propertyId: this.recordId })
            .then(result => {
                console.log('result getPropertyMedia** => ', result);
                if (result != null) {
                    console.log('result  getMedias **', result);
                    this.imageList = result;
                } else {
                    this.showToast('Error', 'Something went Wrong getMedias', 'error');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleClick(event) {

        try {
            this.template.querySelector('.file-input').click();
        } catch (error) {
            console.log('Error--->', error.message);
            console.log('Error handleClick--->', error);
        }

    }

    handleDragOver(event) {
        try {
            console.log('handleDragOver');
            event.preventDefault();
        } catch (error) {
            console.log('Error', error);
            console.log('Error handleDragOver -->', error.message);
        }

    }

    handleDrop(event) {

        try {
            event.preventDefault();
            console.log('handleDrop');
            // handleFileChange(event);
            const files = event.dataTransfer.files;
            console.log('files----->', files);
            // this.uploadFiles(files);
            for (let index = 0; index < files.length; index++) {
                this.file = files[index];
                if (this.file) {
                    let fileName = this.file.name;
                    let d = new Date();
                    this.name = `${(fileName.substring(0, fileName.lastIndexOf('.'))).substring(0, 10)}_${d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '-' + index}.${fileName.substring(fileName.lastIndexOf('.') + 1)}`.replace(/\s+/g, "_").toLowerCase();
                    this.uploadFile();
                }
            }
        } catch (error) {
            console.log('Error', error);
            console.log('Error handleDrop -->', error.message);
        }

    }

    handleFileChange(event) {

        try {
            for (let index = 0; index < event.target.files.length; index++) {
                const element = event.target.files[index];
                this.file = element;
                if (this.file) {
                    let fileName = this.file.name;
                    let d = new Date();
                    this.name = `${(fileName.substring(0, fileName.lastIndexOf('.'))).substring(0, 10)}_${d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '-' + index}.${fileName.substring(fileName.lastIndexOf('.') + 1)}`.replace(/\s+/g, "_").toLowerCase();
                    this.uploadFile();

                }

            }
        } catch (error) {
            console.log('Error', error);
            console.log('Error handleFileChange -->', error.message);
        }
    }

    uploadFile() {
        try {
            if (!this.file) {
                alert('Please choose a file to upload first.');
                return;
            }
            this.isUploading = true;
            const params = {
                Bucket: this.configtionDataOfAWS[0]['S3_Bucket_Name__c'],
                Key: this.recordId + '/' + this.name,
                Body: this.file,
                ACL: 'public-read'
            };

            this.s3.upload(params)
                .on('httpUploadProgress', evt => {
                    this.uploadProgress = Math.round((evt.loaded / evt.total) * 100);
                    this.progressBar = true;
                })
                .send((err, data) => {
                    this.isUploading = false;
                    if (err) {
                        console.error('Error uploading file:', err);
                    } else {

                        try {
                            console.log('Successfully uploaded file:', JSON.stringify(data));
                            // uploadedArea.classList.remove("onprogress");
                            let imageBo = data;
                            imageBo['Filename__c'] = this.name;
                            imageBo['Size__c'] = (this.file.size / 1024).toFixed(2);
                            imageBo['ExternalLink__c'] = data['Location'];
                            imageBo['name'] = this.name;
                            imageBo['property'] = this.recordId;
                            imageBo['size'] = (this.file.size / 1024).toFixed(2);
                            console.log('imageBo--->', JSON.stringify(imageBo));
                            console.log({ imageBo });

                            this.newlatestImageList.push(imageBo);
                            this.imageMediahandler();
                            this.newlatestImageList = [];
                            this.progressBar = false;
                        } catch (error) {
                            console.log('error-->', error);
                            console.log('error-->', error.message);
                        }
                    }
                });
        } catch (error) {
            console.log('Error uploadFile--->', error);
            console.log('Error uploadFile--->', error.message);
        }

    }

    imageMediahandler() {
        try {
            console.log('imageMediahandler1');
            console.log('this.newlatestImageList--->', (this.newlatestImageList).length);
            insertMedias({ media: JSON.stringify(this.newlatestImageList) })
                .then(result => {
                    console.log('result imageMediahandler** => ', result);
                    if (result != null) {
                        this.imageList.push(result[0]);

                    } else {
                        this.showToast('Error', 'Something went Wrong imageMediahandler', 'error');
                    }
                });
        } catch (error) {
            console.log('Error imageMediahandler--->', error);
            console.log('Error imageMediahandler--->', error.message);
        }

    }

    imageClick(event) {
        console.log('imageClick');
        this.url = event.target.src;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    deleteImageS3(event) {
        const params = {
            Bucket: this.configtionDataOfAWS[0]['S3_Bucket_Name__c'],
            Key: this.recordId + '/' + event.currentTarget.dataset.key 
        }
        try {
            this.s3.deleteObject(params).promise();
            this.deleteImageRecordSalesfroce(event.currentTarget.dataset.id);
            this.imageList = this.imageList.filter(element => element.Id !== event.currentTarget.dataset.id);
            console.log("file deleted Successfully");

        }
        catch (err) {
            console.log("ERROR in file Deleting : " + JSON.stringify(err));
            console.log("ERROR in file Deleting : " + err.message);
        }
    }

    deleteImageRecordSalesfroce(id) {
        try {
            deleteAWSImage({ mediaId: id })
                .then(result => {
                    console.log('result  deleteImageRecordSalesfroce ** => ', result);
                    if (result != null) {
                        console.log(result);
                    } else {
                        this.showToast('Error', 'Something went Wrong deleteImageRecordSalesfroce', 'error');
                    }
                });
        } catch (error) {
            console.log('Error deleteImageRecordSalesfroce--->', error);
            console.log('Error deleteImageRecordSalesfroce--->', error.message);
        }
    }

    showToast(Title, Message, Variant) {
        const event = new ShowToastEvent({
            title: Title,
            message: Message,
            variant: Variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

}