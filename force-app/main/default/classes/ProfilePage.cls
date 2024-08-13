public without sharing class ProfilePage {
    public ProfilePage() {

    }

    @AuraEnabled
    public static ContactImageWrapper getContactdetails(Id contactId){
        try{
            ContactImageWrapper wrapper = new ContactImageWrapper();
            List<Contact> con =[SELECT Id, Salutation, FirstName, LastName, Gender__c, Birthdate, Age__c, Phone,MobilePhone, Email, MailingStreet, MailingCity, MailingPostalCode, MailingState, MailingCountry, Description, RecordType.Name  FROM Contact WHERE Id =: contactId];
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
    public static void updateContact(String contact) {
        try {
            ContactData con = (ContactData) JSON.deserialize(contact, ContactData.class);
            Contact contactRecord =[SELECT Id, Salutation, FirstName, LastName, Gender__c, Birthdate, Age__c, Phone,MobilePhone, Email, MailingStreet, MailingCity, MailingPostalCode, MailingState, MailingCountry, Description, RecordType.Name  FROM Contact WHERE Id =: con.id LIMIT 1];
            contactRecord.Salutation = con.salutation;
            contactRecord.FirstName = con.firstName;
            contactRecord.LastName = con.lastName;
            contactRecord.Gender__c = con.gender;
            contactRecord.Birthdate = con.birthdate;
            contactRecord.MobilePhone = con.phone;
            contactRecord.Email = con.email;
            contactRecord.MailingStreet = con.mailingStreet;
            contactRecord.MailingCity = con.mailingCity;
            contactRecord.MailingPostalCode = con.mailingPostalCode;
            contactRecord.MailingState = con.mailingState;
            contactRecord.MailingCountry = con.mailingCountry;
            contactRecord.Description = con.description;
            update contactRecord;
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
            contentVersion.IsMajorVersion = false;
            insert contentVersion;
            return EncodingUtil.Base64Encode(contentVersion.VersionData);            
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

    public class ContactData {
        public String id;
        public String salutation;
        public String firstName;
        public String lastName;
        public String gender;
        public Date birthdate;
        public String phone;
        public String email;
        public String mailingStreet;
        public String mailingCity;
        public String mailingPostalCode;
        public String mailingState;
        public String mailingCountry;
        public String description;
    }

}