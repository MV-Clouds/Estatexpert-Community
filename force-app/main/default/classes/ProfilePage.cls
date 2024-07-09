public without sharing class ProfilePage {
    public ProfilePage() {

    }

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

    @AuraEnabled
    public static ContactImageWrapper getContactdetails(Id contactId){
        System.debug('contactId: '+contactId);
        try{
            ContactImageWrapper wrapper = new ContactImageWrapper();
            List<Contact> con =[SELECT Id, Salutation, FirstName, LastName, Gender__c, Birthdate, Age__c, Phone, Email, MailingStreet, MailingCity, MailingPostalCode, MailingState, MailingCountry, Description, RecordType.Name  FROM Contact WHERE Id =: contactId];
            wrapper.contact = con[0];

            List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: con[0].Id];

            Set<Id> cdIds = new Set<Id>();
            for (ContentDocumentLink cdl :cdlList) {
                cdIds.add(cdl.ContentDocumentId);
            }

            List<ContentDocument> document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id IN: cdIds AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];
            if(document.size() > 0){
                ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE Id =: document[0].LatestPublishedVersionId];
                wrapper.image = EncodingUtil.Base64Encode(cv.VersionData);
            }

            return wrapper;

        }catch(Exception e){
            ErrorHandler.Store_Exception(e);
            return null;
        }
    }

    @AuraEnabled
    public static void updateContact(Contact contact) {
        try {
            System.debug('Contact to update: ' + contact);
            if(contact != null){
                System.debug('Contact to update: ' + contact);
                update contact;
            }
        } catch (Exception e) {
            System.debug('Error updating contact: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String uploadProfileImage(String contactId, String fileName, String base64Data) {
        try {
            // List<ContentVersion> existingCV = [SELECT Id, Title, VersionData, PathOnClient,IsMajorVersion
            //                  FROM ContentVersion
            //                  WHERE FirstPublishLocationId =:contactId AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];
            // if(existingCV.size()>0){
            //     existingCV[0].VersionData = EncodingUtil.base64Decode(base64Data);
            //     update existingCV;
            //     return EncodingUtil.Base64Encode( existingCV[0].VersionData);
            // }else{
                ContentVersion contentVersion = new ContentVersion();
                contentVersion.Title = 'ProfileImage';
                contentVersion.PathOnClient = fileName;
                contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
                contentVersion.FirstPublishLocationId = contactId;
                contentVersion.IsMajorVersion = false;
                insert contentVersion;
                return EncodingUtil.Base64Encode(contentVersion.VersionData);
            // }
            
        } catch (Exception e) {
            System.debug('Error updating contact: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean removeProfileImage(Id ContactId){
        try {
            List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: ContactId];

            Set<Id> cdIds = new Set<Id>();
            for (ContentDocumentLink cdl :cdlList) {
                cdIds.add(cdl.ContentDocumentId);
            }

            List<ContentDocument> document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id IN: cdIds AND Title like 'ProfileImage%'];
            if(document.size() > 0){
                delete document;
                return true;
            }else{
                return false;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class ContactImageWrapper{
        @AuraEnabled
        public Contact contact;
        @AuraEnabled
        public String image;
    }

}