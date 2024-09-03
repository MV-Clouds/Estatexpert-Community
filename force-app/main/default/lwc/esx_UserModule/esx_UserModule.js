import { LightningElement } from 'lwc';
import isLoggedInUserDataCorrect from '@salesforce/apex/ESX_UserUtil.isLoggedInUserDataCorrect';
import setPassword from '@salesforce/apex/ESX_UserUtil.setPassword';

export default class Esx_UserModule extends LightningElement {}

// to created loggin session on login succesfull
function esxCreateLoginSession(contactId, siteUserId) {
    try {
        const systemStamp = new Date();
        let jsonData = {
            contactId: contactId,
            siteUserId: siteUserId,
            createdDate: systemStamp
        }
        localStorage.setItem('loggedUserInfo', JSON.stringify(jsonData));
    } catch (error) {
        console.error(error.stack);
    }
}

// to remove loggin session on logout
function esxRemoveLoginSession() {
    try {
        localStorage.removeItem('loggedUserInfo');
    } catch (error) {
        console.error(error.stack);
    }
}

// to logout user from the site
function checkUserIsLoggedIn() {
    try {
        let loggedUserInfo = localStorage.getItem('loggedUserInfo');
        if (loggedUserInfo) {
            let loggedUserInfoObj = JSON.parse(loggedUserInfo);
            isLoggedInUserDataCorrect({contactId: loggedUserInfoObj.contactId, siteUserId: loggedUserInfoObj.siteUserId})
                .then(result => {
                    return result;
                })
                .catch(error => {
                    console.error(error);
                    return false;
                });

        } else {
            return false;
        }
    } catch (error) {
        console.error(error.stack);
        return false;
    }
}

// to set new password for user
function esxSetPassword(userName, password) {
    try {
        setPassword({userName: userName, password: password})
            .then(result => {
                if (result == 'Success') {
                    
                } else if (result == 'Bad Credantial') {
                    
                } else {

                }
            }).catch(error => {
                console.error(error);
            });
    } catch (error) {
        console.error(error.stack);
    }
}

export { esxCreateLoginSession, checkUserIsLoggedIn, esxRemoveLoginSession };