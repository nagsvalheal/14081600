/**
 * @description Batch class for sending SMS notifications to a list of contacts.
 * This batch class retrieves contact information and sends SMS notifications using a specified SMS endpoint.
 * It logs the status of each SMS sent and handles exceptions gracefully.
 *
 * History
 * Version     Author    Date         Detail       Description
 * 1.0         Rajaa     29-Apr-2024  Created       Initial development.
 * 1.1         Rajaa     03-May-2024  Updated       Code review changes.
 */
public with sharing class BI_PSPB_SmsBatch implements Database.Batchable<SObject>, Database.AllowsCallouts {
    private List<Id> contactIds;
    private String notificationDeveloperName = '';
    private String destUrl = '';
    private String notificationDate = '';
    

    /**
     * @description Constructs a new instance of the BI_PSPB_SmsBatch class with the provided parameters.
     *
     * @param contactIds               A list of contact IDs to whom the SMS notifications will be sent.
     * @param notificationDeveloperName The developer name of the notification settings to be used.
     * @param destUrl                  The destination URL to include in the SMS notification.
     * @param notificationDate         The date information to include in the SMS notification, if applicable.
     */
    public BI_PSPB_SmsBatch(List<Id> contactIds, String notificationDeveloperName, String destUrl, String notificationDate) {
        if (!contactIds.isEmpty() && !String.isBlank(notificationDeveloperName) && !String.isEmpty(destUrl)) {
            this.contactIds = contactIds;
            this.notificationDeveloperName = notificationDeveloperName;
            this.destUrl = destUrl;
            this.notificationDate = notificationDate;
        } else {
            BI_PSP_LogMessagesUtility.logError(
                BI_PSPB_NotificationConstantsCtrl.parameterError,
                BI_PSPB_SmsBatch.class.toString(),
                false,
                BI_PSPB_NotificationConstantsCtrl.logError
            );
        }
    }

    /**
     * @description Returns a Database.QueryLocator instance containing the contacts specified by their IDs.
     * This method is invoked at the beginning of the batch execution to retrieve the contacts
     * based on the provided contact IDs for processing.
     *
     * @param context The Database.BatchableContext object containing the execution context.
     * @return A Database.QueryLocator instance containing the contacts to be processed.
     */
    public Database.QueryLocator start(Database.BatchableContext context) {
        try {
            Set<Id> uniqueContactIds = new Set<Id>(contactIds);
            String query = 'SELECT Id, Phone, Name FROM Contact WHERE Id IN :uniqueContactIds';
            return Database.getQueryLocator(query);
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
                BI_PSPB_NotificationConstantsCtrl.contactError,
                BI_PSPB_SmsBatch.class.toString(),false,
                BI_PSPB_NotificationConstantsCtrl.errorSeverity
            );
            return null;
        }
    }

    /**
     * @description Executes the batch process for sending SMS notifications to the provided contacts.
     * This method is invoked by the batch framework to process each batch of contacts.
     * It retrieves the necessary access token, API settings, and notification details.
     * For each contact, it constructs an SMS payload and sends it via HTTP POST request.
     * It logs the status of each SMS sent and handles exceptions gracefully.
     *
     * @param context The Database.BatchableContext object containing the execution context.
     * @param scope   The list of contacts to be processed in the current batch.
     */
    public void execute(Database.BatchableContext context, List<Contact> scope) {
        List<BI_PSPB_OmnichannelLog__c> smsLogList = new List<BI_PSPB_OmnichannelLog__c>();

        try {
            BI_PSPB_Notification__mdt notification = BI_PSPB_Notification__mdt.getInstance(notificationDeveloperName);
            String smsBodyLink = createSmsBodyLink(notification.BI_PSPB_SmsBody__c);
            BI_PSPB_OmnichannelSetting__mdt filteredSettings = BI_PSPB_OmnichannelSetting__mdt.getInstance(BI_PSPB_NotificationConstantsCtrl.smsEndpoint);

            for (Contact targetContact : scope) {
                if (targetContact.Phone != null && targetContact.Name != null) {
                    String payload = createPayload(targetContact.Phone, smsBodyLink);
                    sendSmsAndLogResponse(targetContact, notification, payload, smsLogList, filteredSettings);
                } else {
                    BI_PSP_LogMessagesUtility.logError(
                        BI_PSPB_NotificationConstantsCtrl.recordError,
                        BI_PSPB_SmsBatch.class.toString(),
                        false,
                        BI_PSPB_NotificationConstantsCtrl.logError
                    );
                }
            }

            if (!smsLogList.isEmpty()) {
                saveSmsLogs(smsLogList);
            } else {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_NotificationConstantsCtrl.contactError,
                    BI_PSPB_SmsBatch.class.toString(),
                    false,
                    BI_PSPB_NotificationConstantsCtrl.logError
                );
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
                BI_PSPB_NotificationConstantsCtrl.httpResponseError,
                BI_PSPB_SmsBatch.class.toString(),
                false,
                BI_PSPB_NotificationConstantsCtrl.errorSeverity
            );
        }
    }

    /**
     * @description Constructs the SMS body link by appending the notification date and destination URL if provided.
     *
     * @param smsBody The SMS body template.
     * @return The constructed SMS body link.
     */
    private String createSmsBodyLink(String smsBody) {
        return String.isNotBlank(notificationDate) ? smsBody + ' ' + notificationDate + ' ' + destUrl : smsBody + ' ' + destUrl;
    }

    /**
     * @description Creates the payload for the SMS request in JSON format.
     *
     * @param phoneNumber The phone number to send the SMS to.
     * @param smsBodyLink The body of the SMS message.
     * @return The JSON payload for the SMS request.
     */
    private String createPayload(String phoneNumber, String smsBodyLink) {
        return '{' +
                '"phoneNumber": "' + phoneNumber + '",' +
                '"body": "' + smsBodyLink + '"' +
                '}';
    }

    /**
     * @description Sends an SMS and logs the response.
     *
     * @param targetContact   The contact to whom the SMS is sent.
     * @param notification    The notification settings to use.
     * @param payload         The payload for the SMS request.
     * @param smsLogList      The list to store SMS logs.
     * @param filteredSettings The omnichannel settings used for the request.
     */
    private void sendSmsAndLogResponse(Contact targetContact, BI_PSPB_Notification__mdt notification, String payload, List<BI_PSPB_OmnichannelLog__c> smsLogList, BI_PSPB_OmnichannelSetting__mdt filteredSettings) {
        try {
            HttpRequest request = new HttpRequest();
            request.setEndpoint('callout:BI_PSPB_OmnichannelEndpoint' + filteredSettings.BI_PSPB_omnichannelentapi__c + filteredSettings.BI_PSPB_Country__c + filteredSettings.BI_PSPB_configItem__c);
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json');
            request.setBody(payload);

            Http http = new Http();
            HttpResponse response = http.send(request);

            processSmsResponse(response, targetContact, notification, smsLogList, payload);
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
                BI_PSPB_NotificationConstantsCtrl.httpResponseError,
                BI_PSPB_SmsBatch.class.toString(),
                false,
                BI_PSPB_NotificationConstantsCtrl.errorSeverity
            );
        }
    }

    /**
     * @description Processes the SMS response and logs the result.
     *
     * @param response        The HTTP response from the SMS service.
     * @param targetContact   The contact to whom the SMS was sent.
     * @param notification    The notification settings used.
     * @param smsLogList      The list to store SMS logs.
     * @param payload         The payload that was sent.
     */
    private void processSmsResponse(HttpResponse response, Contact targetContact, BI_PSPB_Notification__mdt notification, List<BI_PSPB_OmnichannelLog__c> smsLogList, String payload) {
        Boolean smsResponse = false;
        String status = '';
        String messageId = '';

        if (response.getStatusCode() == 200 && response.getBody() != null) {
            Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            status = (String) jsonResponse.get('status');
            messageId = (String) jsonResponse.get('messageId');
            smsResponse = true;
        }

        SmsLogParams params = new SmsLogParams();
        params.targetContact = targetContact;
        params.notification = notification;
        params.smsLogList = smsLogList;
        params.smsResponse = smsResponse;
        params.status = status;
        params.messageId = messageId;
        params.statusCode = response.getStatusCode();
        params.payload = payload;

        logSmsResponse(params);
    }

    /**
     * @description Logs the SMS response details into the SMS log list.
     *
     * @param params The parameters containing SMS response details.
     */
    private void logSmsResponse(SmsLogParams params) {
        BI_PSPB_OmnichannelLog__c smsLog = new BI_PSPB_OmnichannelLog__c();
        smsLog.BI_PSPB_ContactName__c = params.targetContact.Id;
        smsLog.BI_PSPB_StatusResponse__c = String.valueOf(params.statusCode);
        smsLog.BI_PSPB_SmsBody__c = params.notification.BI_PSPB_SmsBody__c;
        smsLog.BI_PSPB_MobilePhone__c = params.targetContact.Phone;
        smsLog.BI_PSPB_EventName__c = params.notification.BI_PSPB_EventName__c;
        smsLog.BI_PSPB_EventType__c = params.notification.BI_PSPB_EventType__c;
        smsLog.BI_PSPB_SMSResponse__c = params.smsResponse;
        smsLog.BI_PSPB_SMSMessageId__c = params.messageId;
        smsLog.BI_PSPB_SmsStatus__c = params.status;

        params.smsLogList.add(smsLog);
    }

    /**
     * @description Saves the list of SMS logs to the database.
     *
     * @param smsLogList The list of SMS logs to be saved.
     */
    private void saveSmsLogs(List<BI_PSPB_OmnichannelLog__c> smsLogList) {
        BI_PSP_DatabaseOperationsUtility.insertOperation(
            smsLogList,
            BI_PSPB_SmsBatch.class.toString(),
            false
        );
        
    }

    /**
     * @description Logs a message indicating that the batch process has finished.
     *
     * @param context The Database.BatchableContext object containing the execution context.
     */
    public void finish(Database.BatchableContext context) {
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_NotificationConstantsCtrl.finish, BI_PSPB_SmsBatch.class.toString(), false, BI_PSPB_NotificationConstantsCtrl.logInfo);
    }

    /**
     * @description Wrapper class for SMS log parameters used in logging the SMS response.
     */
    public class SmsLogParams {
        public Contact targetContact;
        public BI_PSPB_Notification__mdt notification;
        public List<BI_PSPB_OmnichannelLog__c> smsLogList;
        public Boolean smsResponse;
        public String status;
        public String messageId;
        public Integer statusCode;
        public String payload;
    }
}