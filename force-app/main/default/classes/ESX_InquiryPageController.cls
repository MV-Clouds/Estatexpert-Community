public without sharing class ESX_InquiryPageController {
 
    @AuraEnabled
    public static WrapperClass getInquiryData(Id contactId){
        WrapperClass wc = new WrapperClass();
        try {
            // Query for inquiries related to the current user
            List<Inquiry__c> inquiries = [SELECT Id, Listing__r.Property__r.Name,Listing__r.Property__r.Id,Listing__r.Property__r.Property_Status__c,Contact__r.Name,Contact__r.MobilePhone,Contact__r.Email,Contact__r.Id,Listing__r.Property__r.Current_Owner__r.Id,Listing__r.Property__r.Current_Owner__r.Name,Listing__r.Property__r.Current_Owner__r.MobilePhone,Listing__r.Property__r.Current_Owner__r.Email,Inquiry_Date__c,Status__c FROM Inquiry__c WHERE Listing__r.Property__r.Current_Owner__r.Id = :contactId];

            // List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: contactId];
            // Set<Id> cdIds = new Set<Id>();
            // for (ContentDocumentLink cdl :cdlList) {
            //     cdIds.add(cdl.ContentDocumentId);
            // }
            // List<ContentDocument> document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id IN: cdIds AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];
            // if(document.size() > 0){
            //     ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE Id =: document[0].LatestPublishedVersionId];
            //     wc.image = EncodingUtil.Base64Encode(cv.VersionData);
            // }
             // Extract contact IDs from inquiries
             Set<Id> contactIds = new Set<Id>();
             for (Inquiry__c inquiry : inquiries) {
                 if (inquiry.Contact__r.Id != null) {
                     contactIds.add(inquiry.Contact__r.Id);
                 }
             }
             
             System.debug('contactIds:'+contactIds);
             // Query for ContentDocumentLinks related to the extracted contact IDs
             List<ContentDocumentLink> cdlListProfile = [
                 SELECT Id, ContentDocumentId, LinkedEntityId 
                 FROM ContentDocumentLink 
                 WHERE LinkedEntityId IN :contactIds
             ];
             
             System.debug('cdlListProfile:'+cdlListProfile);

             // Map to store ContentDocumentId to LinkedEntityId (Contact Id)
             Map<Id, Id> contentDocumentToContactMap = new Map<Id, Id>();
             for (ContentDocumentLink cdl : cdlListProfile) {
                 contentDocumentToContactMap.put(cdl.ContentDocumentId, cdl.LinkedEntityId);
             }
             
             System.debug('contentDocumentToContactMap:'+contentDocumentToContactMap);

             // Query for ContentDocuments based on the ContentDocumentLink
             List<ContentDocument> documents = [
                 SELECT Id, Title, FileExtension, LatestPublishedVersionId 
                 FROM ContentDocument 
                 WHERE Id IN :contentDocumentToContactMap.keySet() AND Title LIKE 'ProfileImage%' 
                 ORDER BY CreatedDate DESC
             ];
             
             System.debug('contentDocumentToContactMap:'+contentDocumentToContactMap);

             // Map to hold the ContentVersions for each contact
             Map<Id, String> contactContentVersionMap = new Map<Id, String>();
 
             if (!documents.isEmpty()) {
                 // Query for the latest ContentVersions
                List<ContentVersion> contentVersions = [
                     SELECT Id, ContentDocumentId, VersionData 
                     FROM ContentVersion 
                     WHERE Id IN (SELECT LatestPublishedVersionId FROM ContentDocument WHERE Id IN :contentDocumentToContactMap.keySet())
                ];
                 
                 System.debug('contentVersions:'+contentVersions);

                 // Create the map of Contact Ids to ContentVersions
                if (!contentVersions.isEmpty()) {
                    for (ContentVersion cv : contentVersions) {
                        Id conId = contentDocumentToContactMap.get(cv.ContentDocumentId);
                        if (conId != null) {
                            contactContentVersionMap.put(conId,  EncodingUtil.Base64Encode(cv.VersionData));
                        }
                    }
                }
             }
             System.debug('contactContentVersionMap:'+contactContentVersionMap);

             wc.contactContentVersions = contactContentVersionMap;           

            if (!inquiries.isEmpty()) {
                // Extract property IDs from the inquiries
                List<Id> propertyIds = new List<Id>();
                for (Inquiry__c inquiry : inquiries) {
                    if (inquiry.Listing__r != null && inquiry.Listing__r.Property__r != null) {
                        propertyIds.add(inquiry.Listing__r.Property__r.Id);
                    }
                }

                if (!propertyIds.isEmpty()) {
                    // Query for property media related to the extracted property IDs
                    List<Property_Media__c> medias = [SELECT Id, ExternalLink__c, FilenameUrlEncoded__c, Property__c FROM Property_Media__c WHERE Property__c IN :propertyIds];

                    // Create a map of property IDs to their corresponding media records
                    Map<Id, List<Property_Media__c>> propertyMediaUrlsMap = new Map<Id, List<Property_Media__c>>();
                    for (Property_Media__c media : medias) {
                        if (!propertyMediaUrlsMap.containsKey(media.Property__c)) {
                            propertyMediaUrlsMap.put(media.Property__c, new List<Property_Media__c>());
                        }
                        propertyMediaUrlsMap.get(media.Property__c).add(media);
                    }

                    // Assign the data to the wrapper class
                    wc.inquiries = inquiries;
                    wc.propertyMedia = medias;
                    wc.medias = propertyMediaUrlsMap;
                } else {
                    wc.errorMessage = 'No properties found for the inquiries.';
                }
            } else {
                wc.errorMessage = 'No inquiries found for the current user.';
            }
        } catch (Exception e) {
            wc.errorMessage = 'An error occurred: ' + e.getMessage();
            System.debug('Error in getInquiryData: ' + e);
        }
        return wc;
    }

    public class WrapperClass {
        @AuraEnabled
        public List<Inquiry__c> inquiries;
        @AuraEnabled
        public List<Property_Media__c> propertyMedia;
        @AuraEnabled
        public Map<Id, String> contactContentVersions;
        @AuraEnabled
        public Map<Id, List<Property_Media__c>> medias;
        @AuraEnabled
        public String image;
        @AuraEnabled
        public String errorMessage;
    }

    @AuraEnabled
    public static Boolean DeleteInquiry(Id inquiryId){
        try {
            Inquiry__c inquiry = [SELECT Id FROM Inquiry__c WHERE Id=:inquiryId LIMIT 1];
                if(inquiry!=null){
                    delete inquiry;
                }
        } catch(Exception e) {
                System.debug(e.getMessage());
        }
        return true;
    }
    @AuraEnabled
    public static Boolean updateInquiryStatus(String Status,Id recordId){
        try {
            Inquiry__c inquiry = [SELECT Id,Status__c FROM Inquiry__c WHERE Id=:recordId LIMIT 1];
            if(inquiry!=null){
                inquiry.Status__c = Status;
                update inquiry;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return true;
    }

}