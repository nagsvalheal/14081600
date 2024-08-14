/**
 * @description Batchable Apex class for retrieving email status via GET method callouts and updating corresponding records.
 * Implements Database.Batchable, Database.AllowsCallouts, and Schedulable interfaces.
 * This batch class queries email log records with queued status and makes GET requests to an API endpoint
 * to retrieve email status information. It then updates the email log records with the response status.
 * History
 * Version 	Author		Date			Detail		Description
 * 1.0		Rajaa		30-Apr-2024		Created		This was an intial development.
 * 1.1		Rajaa		03-May-2024		Updated		Code Review Changes.
 */
public class BI_PSPB_EmailStatusBatchSched implements Database.Batchable<sObject>, Database.AllowsCallouts, Schedulable {
	private static String emailBodyResponse = '';
	/**
	 *@description The start method of the batch class.
	 * Queries email log records with queued status.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @return A Database.QueryLocator instance for the records to be processed.
	 */
	public Database.QueryLocator start(Database.BatchableContext context) {
		
		try {
            String statusQueued = BI_PSPB_NotificationConstantsCtrl.queued;
            return Database.getQueryLocator([
                SELECT Id, BI_PSPB_EmailMessageId__c, BI_PSPB_GetAccessTokenResponse__c, BI_PSPB_Body__c, BI_PSPB_Status__c
                FROM BI_PSPB_OmnichannelLog__c
                WHERE BI_PSPB_EmailMessageId__c != NULL
                AND BI_PSPB_GetAccessTokenResponse__c != NULL
                AND BI_PSPB_Status__c = :statusQueued
                WITH USER_MODE
            ]);
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailStatusBatchSched.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
            return null;
        }
	}
	/**
	 *@description The execute method of the batch class.
	 *
	 * Processes email log records, makes GET requests to API endpoint, and updates records accordingly.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @param scope   A list of BI_PSPB_OmnichannelLog__c records representing the email logs to be processed.
	 */
	public void execute(Database.BatchableContext context, List<BI_PSPB_OmnichannelLog__c> scope) {
        try {
            if (scope.isEmpty()) {                
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.recordError,
					BI_PSPB_EmailStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
                return;
            }

            List<Id> emailLogsIdsToUpdate = new List<Id>();
            BI_PSPB_GetMethodOmnichannel__mdt filteredSettings = getFilteredSettings();

            if (filteredSettings == null) {
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.parameterError,
					BI_PSPB_EmailStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
                return;
            }

            String omnichannel = filteredSettings.BI_PSPB_omnichannelentapi__c;

            for (BI_PSPB_OmnichannelLog__c emailLog : scope) {
                if (isQueued(emailLog)) {
                    String emailStatus = getEmailStatusFromAPI(omnichannel, emailLog.BI_PSPB_EmailMessageId__c);
                    if (emailStatus != null) {
                        emailBodyResponse = emailStatus;
                        emailLogsIdsToUpdate.add(emailLog.Id);
                    }
                }
            }

            if (!emailLogsIdsToUpdate.isEmpty() && String.isNotBlank(emailBodyResponse)) {
                updateEmailLogs(emailLogsIdsToUpdate, emailBodyResponse);
            } else {                
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgUpdate,
					BI_PSPB_EmailStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
            }
        } catch (Exception ex) {            
            BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
        }
    }
	
	


	
	/**
	 *@description The finish method of the batch class.
	 *
	 * Logs a message indicating the completion of the batch job.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 */
	public void finish(Database.BatchableContext context) {
		BI_PSP_LogMessagesUtility.logError(
			BI_PSPB_NotificationConstantsCtrl.finish,
			BI_PSPB_EmailStatusBatchSched.class.toString(),
			false,
			BI_PSPB_NotificationConstantsCtrl.severityInfo
		);
	}
	/**
	 * @description Updates the specified email log records with the given email response status.
	 *
	 * @param logIds            The list of email log record Ids to update.
	 * @param emailBodyResponse The email response status to update.
	 */
	public static void updateEmailLogs(List<Id> logIds, String emailBodyResponse) {
        try {
            if (logIds.isEmpty() || String.isBlank(emailBodyResponse)) {               
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.parameterError,
					BI_PSPB_EmailStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
                return;
            }

            List<BI_PSPB_OmnichannelLog__c> emailLogsToUpdate = [
                SELECT Id, BI_PSPB_Status__c, BI_PSPB_DateSent__c
                FROM BI_PSPB_OmnichannelLog__c
                WHERE Id IN :logIds
                WITH USER_MODE
            ];

            for (BI_PSPB_OmnichannelLog__c emailLog : emailLogsToUpdate) {
                emailLog.BI_PSPB_Status__c = emailBodyResponse;
            }
            BI_PSP_DatabaseOperationsUtility.upsertOperation(
				emailLogsToUpdate,
				BI_PSPB_EmailStatusBatchSched.class.toString(),
				true
			);
        } catch (Exception ex) {
            // handleException(ex);
            BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailStatusBatchSched.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
        }
    }
	

    // Helper Methods
    private static BI_PSPB_GetMethodOmnichannel__mdt getFilteredSettings() {
        return BI_PSPB_GetMethodOmnichannel__mdt.getInstance(BI_PSPB_NotificationConstantsCtrl.emailGetMethod);
    }

    private static boolean isQueued(BI_PSPB_OmnichannelLog__c emailLog) {
        return BI_PSPB_NotificationConstantsCtrl.queued.equals(emailLog.BI_PSPB_Status__c);
    }

    private static String getEmailStatusFromAPI(String omnichannel, String messageId) {
        try {
            HttpRequest request = new HttpRequest();
            request.setEndpoint('callout:BI_PSPB_OmnichannelEndpoint' + omnichannel + 'message_ID=' + messageId);
            request.setMethod('GET');
            Http http = new Http();
            HttpResponse response = http.send(request);

            if (response.getStatusCode() == 200) {
                Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                return (String) responseMap.get('status');
            } else {
                // logError('API Callout failed with status code: ' + response.getStatusCode());
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.httpResponseError,
					BI_PSPB_EmailStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
        }
        return null;
    }
	/**
	 *@description The execute method for the Schedulable interface.
	 *
	 * Initiates the batch job when the scheduler triggers it.
	 *
	 * @param schedulableContext The SchedulableContext object containing the execution context.
	 */
	public void execute(SchedulableContext schedulableContext) {
		BI_PSPB_EmailStatusBatchSched batchJob = new BI_PSPB_EmailStatusBatchSched();
		Database.executeBatch(batchJob, 100);
	}
}