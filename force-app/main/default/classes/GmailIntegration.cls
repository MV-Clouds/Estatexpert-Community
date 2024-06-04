public with sharing class GmailIntegration {


    //contentType should be text/html when sending email without attachment
    public static string sendEmail(String toEmail, String emailSubject, String contentType, String emailBody){
        String returnMsg;
        try {
            string rawBody ='From: Jaimin Shah <jaiminshah555@gmail.com>\n' +
                            'To: '+ toEmail +'\n'+ 
                            'Subject: '+ emailSubject +' \n' + 
                            'Content-Type: '+ contentType +' \n\n' + emailBody;

            String tempBody = EncodingUtil.base64Encode(Blob.valueOf(rawBody));
            tempBody = tempBody.replace('+', '-');
            tempBody = tempBody.replace('/', '_');
    
            String requestBody = '{"userId":"me","raw":"'+ tempBody +'"}';

            Http httpMail = new Http();
            HttpRequest httpReqMail = new HttpRequest();
            
            httpReqMail.setEndpoint('callout:Gmail/gmail/v1/users/me/messages/send');
            httpReqMail.setMethod('POST');
            httpReqMail.setHeader('Content-Type', 'application/json');
            httpReqMail.setHeader('Content-Length', '-1');
            httpReqMail.setBody(requestBody);

            HttpResponse httpResMail = httpMail.send(httpReqMail);
            if(httpResMail.getStatusCode() == 200){
                returnMsg =  'Success';
            }else{
                returnMsg = 'Unexpected Error while communicating with Google Calendar API. ' +'Status '+httpResMail.getBody()+' and Status Code '+httpResMail.getStatuscode();
            }
        } catch (Exception e) {
            returnMsg = 'Error Message => '+e.getMessage() + '|| Error Line no => '+e.getLineNumber();
        }
        System.debug('Gmail_Integration Return Message ==> '+returnMsg);
        return returnMsg;
    }

}