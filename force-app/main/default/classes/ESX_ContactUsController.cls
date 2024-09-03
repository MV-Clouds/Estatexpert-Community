public without sharing class ESX_ContactUsController {

    // save the data provided into the contact us form.
    @AuraEnabled
    public static string saveContactUsRecord(String name, String phone, String email, String subject, String message){
        try {
            Contact_Us_Inquiry__c contactUsInquiry = new Contact_Us_Inquiry__c(
                Contact_Name__c = name,
                Contact_Email__c = email,
                Contact_Subject__c = subject
            );
            
            if (String.isNotBlank(phone)) {
                contactUsInquiry.Contact_Number__c = phone;
            }
            
            if (String.isNotBlank(message)) {
                contactUsInquiry.Message__c = message;
            }
            
            insert contactUsInquiry;
            System.debug('Contact Us created');
            
            List<EmailTemplate> templateId = [SELECT Id, Body, HtmlValue, Subject FROM EmailTemplate WHERE Name = 'Contact Us Email Template'];
            
            if (templateId.size() > 0) {
                if(String.isNotBlank(templateId[0].Subject) && String.isNotBlank(templateId[0].HtmlValue)){
                    gmailInte(email, templateId[0].Subject, templateId[0].HtmlValue);
                    return 'success';
                }else {
                    return 'Error: Email Template subject or htmlvalue not configured';
                }
            }else{
                return 'template not getting';
            }
            
        } catch (DmlException e) {
            System.debug('Error : ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @future(callout=true)
    public static void gmailInte(String email, String subject, String mailBody ){
        String res = GmailIntegration.sendEmail(email, subject, 'text/html', mailBody);
    }

}