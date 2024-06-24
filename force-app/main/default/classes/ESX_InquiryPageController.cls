public with sharing class ESX_InquiryPageController {
 
    @AuraEnabled
    public static Inquiry__c getInquiryData(){
        List<Inquiry__c> inquiries = [SELECT Listing__r.Property__r.Name,Contact.Name,Contact.MobilePhone,Contact.Email,Inquiry_Date__c,Status__c FROM Inquiry Where OwnerId = :UserInfo.getUserId()];
        return inquiries;
    }

    @AuraEnabled
    public static List<Schema.FieldSet> getFieldSetFields(String objectName, String fieldSetName) {
        FieldSet fieldSet = Schema.getFieldSet(objectName, fieldSetName);
        List<FieldSetEntry> fieldSetEntries = fieldSet.getFieldSetEntries();
        
        List<Schema.FieldSet> fieldSets = new List<Schema.FieldSet>();
        
        for (Schema.FieldSetEntry field : fieldSetEntries) {
            fieldSets.add(new Schema.FieldSet(field.getFieldPath(), field.getLabel()));
        }
        
        return fieldSets;
    }

    @AuraEnabled
    public static List<sObject> getInquiries() {
        // Add your fields to the query from the field set
        List<String> fields = getFieldSetFields('Inquiry__c', 'yourFieldSetName')
                                 .stream()
                                 .map(FieldSetEntry::getFieldPath)
                                 .collect(Collectors.toList());
        
        String query = 'SELECT ' + String.join(',', fields) + ' FROM Inquiry__c';
        
        return Database.query(query);
    }
}