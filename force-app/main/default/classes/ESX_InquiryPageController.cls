public with sharing class ESX_InquiryPageController {
 
    @AuraEnabled
    public static WrapperClass getInquiryData(){
        List<Inquiry__c> inquiries = [SELECT Listing__r.Property__r.Name,Listing__r.Property__r.Id,Contact__r.Name,Contact__r.MobilePhone,Contact__r.Email,Inquiry_Date__c,Status__c FROM Inquiry__c Where OwnerId = :UserInfo.getUserId()];

            List<Id> propertyIds = new List<Id>();                                   
            for(Inquiry__c inquiry :inquiries) {
                propertyIds.add(inquiry.Listing__r.Property__r.Id);
            }      
            System.debug('propertyIds:'+propertyIds);                            
            List<Property_Media__c> medias = [SELECT Id,ExternalLink__c,FilenameUrlEncoded__c,Property__c FROM Property_Media__c WHERE Property__c IN:propertyIds];
            System.debug('medias:'+medias);
            Map<Id, List<Property_Media__c>> propertyMediaUrlsMap = new Map<Id, List<Property_Media__c>>();
            for (Property_Media__c media : [SELECT ExternalLink__c,FilenameUrlEncoded__c,Property__c FROM Property_Media__c WHERE Property__c IN :propertyIds]) {
                propertyMediaUrlsMap.put(media.Property__c, new List<Property_Media__c>());
                propertyMediaUrlsMap.get(media.Property__c).add(media);
            }

            WrapperClass wc = new WrapperClass();
            wc.inquiries = inquiries;
            wc.propertyMedia = medias;
            wc.medias = propertyMediaUrlsMap;
            
        return wc;
    }

    public class WrapperClass{
        @AuraEnabled
        public List<Inquiry__c> inquiries;
        @AuraEnabled
        public List<Property_Media__c> propertyMedia;
        @AuraEnabled
        public Map<Id, List<Property_Media__c>> medias;

    }

    // @AuraEnabled
    // public static List<Schema.FieldSet> getFieldSetFields(String objectName, String fieldSetName) {
    //     FieldSet fieldSet = Schema.getFieldSet(objectName, fieldSetName);
    //     List<FieldSetEntry> fieldSetEntries = fieldSet.getFieldSetEntries();
        
    //     List<Schema.FieldSet> fieldSets = new List<Schema.FieldSet>();
        
    //     for (Schema.FieldSetEntry field : fieldSetEntries) {
    //         fieldSets.add(new Schema.FieldSet(field.getFieldPath(), field.getLabel()));
    //     }
        
    //     return fieldSets;
    // }

    // @AuraEnabled
    // public static List<sObject> getInquiries() {
    //     // Add your fields to the query from the field set
    //     List<String> fields = getFieldSetFields('Inquiry__c', 'InquryPageFieldset')
    //                              .stream()
    //                              .map(FieldSetEntry::getFieldPath)
    //                              .collect(Collectors.toList());
        
    //     String query = 'SELECT ' + String.join(',', fields) + ' FROM Inquiry__c';
        
    //     return Database.query(query);
    // }
}