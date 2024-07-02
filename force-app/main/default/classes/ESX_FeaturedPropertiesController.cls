public with sharing class ESX_FeaturedPropertiesController {
    public ESX_FeaturedPropertiesController() {

    }

    @AuraEnabled
    public static string getPropertyData(){
        try {
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}