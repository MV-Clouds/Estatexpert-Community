public with sharing class ESX_HeaderMenu {
    
    @AuraEnabled
    public static ContactImageWrapper getContactdetails(Id contactId){
        try{
            Contact con =[SELECT Id, Salutation, FirstName, LastName, Gender__c, Birthdate, Age__c, Phone, Email, MailingStreet, MailingCity, MailingPostalCode, MailingState, MailingCountry, Description, RecordType.Name  FROM Contact WHERE Id =: contactId];

            List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: con.Id];

            Set<Id> cdIds = new Set<Id>();
            for (ContentDocumentLink cdl :cdlList) {
                cdIds.add(cdl.ContentDocumentId);
            }

            List<ContentDocument> document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id IN: cdIds AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];

            ContactImageWrapper wrapper = new ContactImageWrapper();
            wrapper.contact = con;

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

    public class ContactImageWrapper{
        @AuraEnabled
        public Contact contact;
        
        @AuraEnabled
        public String image;
    }

}