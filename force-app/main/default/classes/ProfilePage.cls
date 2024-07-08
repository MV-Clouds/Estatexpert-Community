public without sharing class ProfilePage {
    public ProfilePage() {

    }

    @AuraEnabled
    public static ContactImageWrapper getContactdetails(Id contactId){
        System.debug('contactId: '+contactId);
        try{
            ContactImageWrapper wrapper = new ContactImageWrapper();
            Contact con =[SELECT Id, Salutation, FirstName, LastName, Gender__c, Birthdate, Age__c, Phone, Email, MailingStreet, MailingCity, MailingPostalCode, MailingState, MailingCountry, Description, RecordType.Name  FROM Contact WHERE Id =: contactId];
            wrapper.contact = con;

            if(con != null){
                ContentDocumentLink cdl = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: con.Id LIMIT 1];
                ContentDocument document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id =: cdl.ContentDocumentId AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];
                if(document != null){
                    ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE Id =: document.LatestPublishedVersionId];
                    wrapper.image = EncodingUtil.Base64Encode(cv.VersionData);
                }
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
            ContentVersion contentVersion = new ContentVersion();
            contentVersion.Title = 'ProfileImage';
            contentVersion.PathOnClient = fileName;
            contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
            contentVersion.FirstPublishLocationId = contactId;
            insert contentVersion;

            return EncodingUtil.Base64Encode(contentVersion.VersionData);
        } catch (Exception e) {
            System.debug('Error updating contact: ' + e.getMessage());
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