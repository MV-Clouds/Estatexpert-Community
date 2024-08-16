public without sharing class ESX_UserUtil {
    public ESX_UserUtil() {

    }



    // Create a Site User for exp community
    @AuraEnabled
    public static String createContacForEXP(String contactJSON, String password) {
        String returnMessage = '';
        ContactUserJSON cuj = new ContactUserJSON();
        cuj = (ContactUserJSON)JSON.deserialize(contactJSON, ContactUserJSON.class);
        System.debug('cuj =>' + cuj);

        List<Contact> existContactList = new List<Contact>();
        existContactList = [SELECT Id, Name, Email FROM Contact WHERE Email =: cuj.email OR MobilePhone =: cuj.mobileNumber];

        List<RecordType> recordTypeList = [SELECT Id,SobjectType,Name,DeveloperName FROM RecordType WHERE SobjectType = 'Contact' AND Name =: cuj.userType];
        
        if (existContactList.size() > 0) {
            Contact existCon = existContactList[0];
            if (existCon.Email == cuj.email && existCon.MobilePhone == cuj.mobileNumber) {
                returnMessage = 'Email and Mobile';
            } else if (existCon.Email == cuj.email) {
                returnMessage = 'Email';
            } else if (existCon.MobilePhone == cuj.mobileNumber) {
                returnMessage = 'Mobile';
            }
        } else {
            Contact userCon = new Contact(
                FirstName = cuj.firstName,
                LastName = cuj.lastName,
                Email = cuj.email,
                MobilePhone = cuj.mobileNumber
            );

            if (recordTypeList.size() > 0 && recordTypeList[0].Id != null) {
                userCon.RecordTypeId = recordTypeList[0].Id;
            }
            
            insert userCon;
            String siteUserName = cuj.firstName + ' '+ cuj.lastName;
            createUser(userCon.Id, siteUserName, cuj.email, password);
            returnMessage = 'Success';
        }
        return returnMessage;
    }

    // Create a Site User for exp community
    public static void createUser(String contactId, String siteUserName, String userName, String password) {
        Site_User__c siteUser = new Site_User__c(
            Contact__c = contactId,
            User_Name__c = userName,
            Password__c = password,
            Name = siteUserName
        );
        insert siteUser;
    }

    // Site login method for community user
    @AuraEnabled
    public static LoggedInUserData login(String userName, String password) {
        LoggedInUserData userData = new LoggedInUserData();
        List<Site_User__c> siteUserList = new List<Site_User__c>();
        siteUserList = [SELECT Id, User_Name__c, Password__c, Contact__c FROM Site_User__c WHERE User_Name__c =: userName];
        if(siteUserList.size() > 0) {
            if(password.equals(siteUserList[0].Password__c )) {
                userData.statusMessage = 'Success';
                userData.siteUser = siteUserList[0];
            } else {
                userData.statusMessage = 'Bad Credantial';
            }
        } else {
            userData.statusMessage = 'Bad Credantial';
        }
        return userData;
    }

    // Method to setPassword
    @AuraEnabled
    public static string setPassword(String userName, String password) {
        String returnMsg = '';
        List<Site_User__c> siteUserList = new List<Site_User__c>();
        siteUserList = [SELECT Id, User_Name__c, Password__c FROM Site_User__c WHERE User_Name__c =: userName LIMIT 1];
        if(siteUserList.size() > 0) {
            siteUserList[0].Password__c = password;
            update siteUserList;
            returnMsg = 'Success';
        } else {
            returnMsg = 'Bad Credantial';
        }
        return returnMsg;
    }

    // Method to reset password and send otp to user's mail
    @AuraEnabled
    public static Integer genrateOtpAndSendMail(String userName) {
        List<Site_User__c> siteUserList = new List<Site_User__c>();
        siteUserList = [SELECT Id, User_Name__c, Name FROM Site_User__c WHERE User_Name__c =: userName LIMIT 1];

        if (siteUserList.size() > 0) {
            // code to send otp in email to user
            Integer verificationCode = (Integer)(Math.random() * 1000000);
            String emailSubject = 'Verify Your Login';
            String emailBody = '<span style="font-family: verdana;">';
            emailBody += 'Dear ' + siteUserList[0].Name + ',<br><br>';
            emailBody += 'We received your password reset request. Use the OTP below to proceed:';
            emailBody += '<br><br>';
            emailBody += 'Verification Code: ' + '<b>' + verificationCode + '</b>' + '<br><br>';
            emailBody += 'This OTP is valid for the next 5 minutes. If you did not request this, you can safely ignore this email.';
            emailBody += '<br><br>';
            emailBody += 'Best regards,<br>';
            emailBody += 'EstateXpert Team';
            emailBody += '</span">';
            GmailIntegration.sendEmail(userName, emailSubject, 'text/html', emailBody);

            return verificationCode;
        } else {
            return null;
        }
    }

    // Checks the looged user details form the localStorage are valid or not
    @AuraEnabled
    public static Boolean isLoggedInUserDataCorrect(String contactId, String siteUserId) {
        Boolean returnStatus = false;
        List<Site_User__c> siteUserList = new List<Site_User__c>();
        siteUserList = [SELECT Id, Name, Contact__c FROM Site_User__c WHERE Id =: siteUserId AND Contact__c =: contactId];

        if (siteUserList.size() > 0) {
            returnStatus = true;
        } else {
            returnStatus = false;
        }
        return returnStatus;
    }

    // Wrapper class for the LoggedInUser data.
    public class LoggedInUserData {
        @AuraEnabled
        public String statusMessage {get; set;}
        @AuraEnabled
        public Site_User__c siteUser {get; set;}
    }

    // Wrapper class for the new user registration contact data.
    public class ContactUserJSON {
        @AuraEnabled
        public String firstName {get; set;}
        @AuraEnabled
        public String lastName {get; set;}
        @AuraEnabled
        public String email {get; set;}
        @AuraEnabled
        public String mobileNumber {get; set;}
        // @AuraEnabled
        // public Date birthDate {get; set;}
        @AuraEnabled
        public String userType {get; set;}
    }

}