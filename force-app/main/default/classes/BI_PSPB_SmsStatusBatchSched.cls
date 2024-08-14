/**
 * @description Batchable Apex class for retrieving SMS status via GET method callouts and updating corresponding records.
 * Implements Database.Batchable, Database.AllowsCallouts, and Schedulable interfaces.
 * This batch class queries SMS log records with queued status and makes GET requests to an API endpoint
 * to retrieve SMS status information. It then updates the SMS log records with the response status.
 * History
 * Version  Author      Date            Detail      Description
 * 1.0      Rajaa       30-Apr-2024     Created     This was an initial development.
 * 1.1      Rajaa       05-May-2024     Updated     Code Review Changes.
 * 1.2      Refactored  29-Jul-2024     Refactored  Reduced complexity in the updatesmsLogs method.
 */
public class BI_PSPB_SmsStatusBatchSched implements Database.Batchable<sObject>, Database.AllowsCallouts, Schedulable {
	// Variable to store the SMS response body
	private static String smsBodyrespose = '';
	

	/**
	 * @description The start method of the batch class.
	 *              Queries SMS log records with queued status.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @return A Database.QueryLocator instance for the records to be processed.
	 */
	public Database.QueryLocator start(Database.BatchableContext context) {
		try {
			String statusqueued = BI_PSPB_NotificationConstantsCtrl.queued;
	
	// Build the dynamic SOQL query
	String query = 'SELECT Id, BI_PSPB_SMSMessageId__c, BI_PSPB_GetAccessTokenResponse__c, BI_PSPB_SmsStatus__c ' +
				   'FROM BI_PSPB_OmnichannelLog__c ' +
				   'WHERE BI_PSPB_SMSMessageId__c != NULL ' +
				   'AND BI_PSPB_GetAccessTokenResponse__c != NULL ' +
				   'AND BI_PSPB_SmsStatus__c = \'' + statusqueued + '\' ' +
				   'WITH USER_MODE';
	
	// Execute the query using Database.query
	return Database.getQueryLocator(query);
		} catch (Exception ex) {			
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_SmsStatusBatchSched.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
			return null;
		}
	}
	/**
	 *@description The execute method for the Schedulable interface.
	 *
	 * Initiates the batch job when the scheduler triggers it.
	 *
	 * @param schedulableContext The SchedulableContext object containing the execution context.
	 */
	public void execute(SchedulableContext schedulableContext) {
		BI_PSPB_SmsStatusBatchSched batchJob = new BI_PSPB_SmsStatusBatchSched();
		Database.executeBatch(batchJob, 100);
	}

	/**
	 * @description The execute method of the batch class.
	 *              Processes SMS log records, makes GET requests to API endpoint, and updates records accordingly.
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @param scope   A list of BI_PSPB_OmnichannelLog__c records representing the SMS logs to be processed.
	 */
	public void execute(Database.BatchableContext context, List<BI_PSPB_OmnichannelLog__c> scope) {
		try {
			if (scope.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.recordError,
					BI_PSPB_SmsStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
				return;
			}
	
			BI_PSPB_GetMethodOmnichannel__mdt filteredSettings = BI_PSPB_GetMethodOmnichannel__mdt.getInstance(BI_PSPB_NotificationConstantsCtrl.smsGetmethod);
			String omnichannel = filteredSettings.BI_PSPB_omnichannelentapi__c;
			String country = filteredSettings.BI_PSPB_Country__c;
			String configItem = filteredSettings.BI_PSPB_configItem__c;
	
			List<Id> smsLogsIdsToUpdate = processSmsLogs(scope, omnichannel, country, configItem);
	
			if (!smsLogsIdsToUpdate.isEmpty() && String.isNotBlank(smsBodyrespose)) {
				updatesmsLogs(smsLogsIdsToUpdate, smsBodyrespose);
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgUpdate,
					BI_PSPB_SmsStatusBatchSched.class.toString(),
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
	
	private List<Id> processSmsLogs(List<BI_PSPB_OmnichannelLog__c> scope, String omnichannel, String country, String configItem) {
		List<Id> smsLogsIdsToUpdate = new List<Id>();
	
		for (BI_PSPB_OmnichannelLog__c smsLog : scope) {
			if (smsLog.BI_PSPB_SmsStatus__c == BI_PSPB_NotificationConstantsCtrl.queued) {
				String messageId = smsLog.BI_PSPB_SMSMessageId__c;
				HttpResponse response = sendSmsStatusRequest(omnichannel, country, configItem, messageId);
	
				if (response != null) {
					handleSmsStatusResponse(response, smsLog, smsLogsIdsToUpdate);
				}
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.httpResponseError,
					BI_PSPB_SmsStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
			}
		}
	
		return smsLogsIdsToUpdate;
	}
	
	private HttpResponse sendSmsStatusRequest(String omnichannel, String country, String configItem, String messageId) {
		try {
			HttpRequest req = new HttpRequest();
			req.setEndpoint('callout:BI_PSPB_OmnichannelEndpoint' + omnichannel + 'country=' + country + '&configItem=' + configItem + '&messageId=' + messageId);
			req.setMethod('GET');
	
			Http http = new Http();
			return http.send(req);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
			return null;
		}
	}
	
	private void handleSmsStatusResponse(HttpResponse response, BI_PSPB_OmnichannelLog__c smsLog, List<Id> smsLogsIdsToUpdate) {
		Integer responseCode = response.getStatusCode();
	
		if (responseCode == 200) {
			Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
			smsBodyrespose = String.valueOf(responseMap.get('status'));
			smsLogsIdsToUpdate.add(smsLog.Id);
		} else {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_SmsStatusBatchSched.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
		}
	}
	
	/**
	 * @description The finish method of the batch class.
	 *              Logs a message indicating the batch has finished.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 */
	public void finish(Database.BatchableContext context) {
		BI_PSP_LogMessagesUtility.logError(
			BI_PSPB_NotificationConstantsCtrl.finish,
			BI_PSPB_SmsStatusBatchSched.class.toString(),
			false,
			BI_PSPB_NotificationConstantsCtrl.errorSeverity
		);
	}

	/**
	 * @description Updates SMS log records with the provided status.
	 *
	 * @param logIds          The list of SMS log record Ids to update.
	 * @param smsBodyResponse The SMS response status to update.
	 */
	public static void updatesmsLogs(List<Id> logIds, String smsBodyResponse) {
		try {
			if (logIds.isEmpty() || String.isBlank(smsBodyResponse)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.parameterError,
					BI_PSPB_SmsStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
				return;
			}

			List<BI_PSPB_OmnichannelLog__c> smsLogsToUpdate = fetchSmsLogsToUpdate(logIds);

			if (smsLogsToUpdate.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.parameterError,
					BI_PSPB_SmsStatusBatchSched.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.errorSeverity
				);
				return;
			}

			updateSmsLogs(smsLogsToUpdate, smsBodyResponse);
			

		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_SmsStatusBatchSched.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
		}
	}

	private static List<BI_PSPB_OmnichannelLog__c> fetchSmsLogsToUpdate(List<Id> logIds) {
	
	
		// Build the query with a bind variable
		String query = 'SELECT Id, BI_PSPB_SmsStatus__c, BI_PSPB_DateSent__c ' +
					   'FROM BI_PSPB_OmnichannelLog__c ' +
					   'WHERE Id IN :logIds';
	
		// Execute the query directly using Database.query
		return Database.query(query);
	}
	

	private static void updateSmsLogs(List<BI_PSPB_OmnichannelLog__c> smsLogsToUpdate, String smsBodyResponse) {
		for (BI_PSPB_OmnichannelLog__c smsLog : smsLogsToUpdate) {
			smsLog.BI_PSPB_SmsStatus__c = smsBodyResponse;
		}
	   
		BI_PSP_DatabaseOperationsUtility.upsertOperation(
			smsLogsToUpdate,
			BI_PSPB_SmsStatusBatchSched.class.toString(),
			true
		);
	}
}