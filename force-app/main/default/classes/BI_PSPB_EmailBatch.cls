/**
 * @description Batch class for sending email notifications to a list of contacts.
 * This batch class retrieves contact information and sends email notifications using a specified API endpoint.
 * It logs the status of each email sent and handles exceptions gracefully.
 * History
 * Version 	Author		Date			Detail		Description
 * 1.0		Rajaa		29-Apr-2024		Created		This was an initial development.
 * 1.1		Rajaa		03-May-2024		Updated		Code Review Changes.
 */
public with sharing class BI_PSPB_EmailBatch implements Database.Batchable<SObject>, Database.AllowsCallouts {
	private List<Id> contactIds;
	private String notificationDeveloperName = '';
	private String destUrl = '';
	private String notificationDate = '';
	private List<String> userNames;
	/**
	 * @description	Constructs a new instance of the BI_PSPB_EmailBatch class with the provided parameters.
	 *
	 * @param contactIds               A list of contact IDs to whom the email notifications will be sent.
	 * @param notificationDeveloperName The developer name of the notification settings to be used.
	 * @param destUrl                  The destination URL to include in the email notification.
	 * @param notificationDate         The date information to include in the email notification, if applicable.
	 * @param userNames                The username associated with the email notifications.
	 */
	public BI_PSPB_EmailBatch(
		List<Id> contactIds,
		String notificationDeveloperName,
		String destUrl,
		String notificationDate,
		List<String> userNames
	) {
		if (validateInputs(contactIds, notificationDeveloperName, destUrl)) {
			this.contactIds = contactIds;
			this.notificationDeveloperName = notificationDeveloperName;
			this.destUrl = destUrl;
			this.notificationDate = notificationDate;
			this.userNames = userNames;
		} else {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.parameterError,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.logInfo
			);
		}
	}

	private Boolean validateInputs(
		List<Id> contactIds,
		String notificationDeveloperName,
		String destUrl
	) {
		return !contactIds.isEmpty() &&
			!String.isBlank(notificationDeveloperName) &&
			!String.isBlank(destUrl);
	}
	/**
	 * @description Returns a Database.QueryLocator instance containing the contacts specified by their IDs.
	 *
	 * This method is invoked at the beginning of the batch execution to retrieve the contacts
	 * based on the provided contact IDs for processing.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @return A Database.QueryLocator instance containing the contacts to be processed.
	 */
	public Database.QueryLocator start(Database.BatchableContext context) {
		try {
			Set<Id> uniqueContactIds = new Set<Id>(contactIds);
			String query = 'SELECT Id, Name, Email FROM Contact WHERE Id IN :uniqueContactIds';
			return Database.getQueryLocator(query);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.contactError,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
			return null;
		}
	}

	/**
	 * @description Executes the batch job processing for sending emails to a list of contacts.
	 *
	 * This method sends emails to the contacts specified in the provided scope list. It retrieves
	 * necessary configurations such as endpoint settings, notification details, and privacy policy
	 * URLs to construct the email payload. Each email is sent individually, and the response status
	 * and message ID are logged for tracking purposes.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @param scope   A list of Contact records representing the contacts to which emails will be sent.
	 */
	public void execute(
		Database.BatchableContext context,
		List<Contact> scope
	) {
		if (scope.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.errorReturning,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.logInfo
			);
			return;
		}

		List<BI_PSPB_OmnichannelLog__c> emailLogList = new List<BI_PSPB_OmnichannelLog__c>();

		try {
			BI_PSPB_Notification__mdt filteredNotifications = BI_PSPB_Notification__mdt.getInstance(
				notificationDeveloperName
			);
			BI_PSPB_PrivacyPolicy__mdt privacyPolicyList = BI_PSPB_PrivacyPolicy__mdt.getInstance(
				BI_PSPB_NotificationConstantsCtrl.privacyPolicyUrl
			);
			
			Map<Contact, String> mapString = new Map<Contact, String>();
			// Create a counter for the userNameCom list
			Integer i = 0;

			// Iterate through the contacts in the scope
			for (Contact targetContact : scope) {
				if (i < userNames.size()) {
					// Map the contact to the corresponding user name
					mapString.put(targetContact, userNames[i]);
					i++;
				} else {
					// If there are more contacts than usernames, handle the extra contacts
					mapString.put(targetContact, ''); // Or handle it in another appropriate way
				}
			}

			// Now process the contacts with their corresponding usernames
			for (Contact contact : mapString.keySet()) {
				String payload = createEmailPayload(
					contact,
					filteredNotifications,
					privacyPolicyList
				);
				sendEmailAndLogResult(
					payload,
					contact,
					filteredNotifications,
					emailLogList
				);
			}
			if (!emailLogList.isEmpty()) {
				saveEmailLogs(emailLogList);
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorReturning,
					BI_PSPB_EmailBatch.class.toString(),false,BI_PSPB_NotificationConstantsCtrl.logInfo
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

	private String createEmailPayload(
		Contact targetContact,
		BI_PSPB_Notification__mdt notifications,
		BI_PSPB_PrivacyPolicy__mdt privacyPolicy
	) {
		String userName = targetContact.Name;
		String userEmail = targetContact.Email;

		return '{' +
			'"emailId": "' +
			userEmail +
			'",' +
			'"body": {' +
			'"firstname": "' +
			userName +
			'",' +
			'"ubi-pspb-unsubscribe": "' +
			privacyPolicy.BI_PSPB_Url__c +
			'",' +
			'"ubi-pspb-termsofuse": "' +
			privacyPolicy.BI_PSPB_TermsofuseUrlEndPoint__c +
			'",' +
			'"ubi-pspb-privacynotice": "' +
			privacyPolicy.BI_PSPB_PrivacyPolicyUrlEndpoint__c +
			'",' +
			(userNames != null && !userNames.isEmpty()
				? '"Username": "' + userNames[0] + '",'
				: '') +
			(String.isNotBlank(notificationDate)
				? '"date": "' + notificationDate + '",'
				: '') +
			'"url": "' +
			destUrl +
			'"' +
			'},' +
			'"subject": "' +
			notifications.BI_PSPB_Subject__c +
			'",' +
			'"templateID": "' +
			notifications.BI_PSPB_TemplateId__c +
			'"' +
			'}';
	}

	private void sendEmailAndLogResult(
		String payload,
		Contact contact,
		BI_PSPB_Notification__mdt notifications,
		List<BI_PSPB_OmnichannelLog__c> emailLogList
	) {
		BI_PSPB_OmnichannelSetting__mdt filteredSettings = BI_PSPB_OmnichannelSetting__mdt.getInstance(
			BI_PSPB_NotificationConstantsCtrl.endPoint
		);
		String omnichannel = filteredSettings.BI_PSPB_omnichannelentapi__c;
		String country = filteredSettings.BI_PSPB_Country__c;
		String configItem = filteredSettings.BI_PSPB_configItem__c; 

		HttpRequest request = new HttpRequest();
		request.setEndpoint(
			'callout:BI_PSPB_OmnichannelEndpoint' + omnichannel + country + configItem
		);
		request.setMethod('POST');
		request.setHeader('Content-Type', 'application/json');
		request.setBody(payload);

		Http http = new Http();
		HttpResponse response = http.send(request);
		handleEmailResponse(response, contact, notifications, emailLogList);
	}

	private void handleEmailResponse(
		HttpResponse response,
		Contact contact,
		BI_PSPB_Notification__mdt notifications,
		List<BI_PSPB_OmnichannelLog__c> emailLogList
	) {
		Integer responseCode = response.getStatusCode();
		Boolean emailResponse = responseCode == 200;

		Map<String, Object> jsonResponse = emailResponse
			? (Map<String, Object>) JSON.deserializeUntyped(response.getBody())
			: null;
		String status = jsonResponse != null
			? (String) jsonResponse.get('status')
			: 'Failed';
		String messageId = jsonResponse != null
			? (String) jsonResponse.get('messageId')
			: '';

		// Create an instance of EmailLogWrapper
		EmailLogWrapper logWrapper = new EmailLogWrapper(
			contact,
			notifications,
			status,
			messageId,
			emailResponse,
			responseCode
		);
		BI_PSPB_OmnichannelLog__c emailLog = logWrapper.createEmailLog();
		emailLogList.add(emailLog);

		if (!emailResponse) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailBatch.class.toString(),false,BI_PSPB_NotificationConstantsCtrl.logInfo
			);
		}
	}

	private void saveEmailLogs(List<BI_PSPB_OmnichannelLog__c> emailLogList) {
		try {
			//insert emailLogList;
			BI_PSP_DatabaseOperationsUtility.insertOperation(
				emailLogList,
				BI_PSPB_EmailBatch.class.toString(),
				false
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_NotificationConstantsCtrl.httpResponseError,
				BI_PSPB_EmailBatch.class.toString(),
				false,
				BI_PSPB_NotificationConstantsCtrl.errorSeverity
			);
		}
	}

	private String createConcatenatedParams(
		Contact contact,
		BI_PSPB_Notification__mdt notifications,
		String messageId,
		String status
	) {
		return 'ContactId: ' +
			contact.Id +
			', Notification: ' +
			notifications.BI_PSPB_EventName__c +
			', MessageId: ' +
			messageId +
			', Status: ' +
			status;
	}
/**
	 * Handles the finishing tasks after the batch execution completes.
	 *
	 *@description This method is invoked by the batch framework once all batches have been processed.
	 * It logs a message indicating the completion of the batch process.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 */
	public void finish(Database.BatchableContext context) {
		BI_PSP_LogMessagesUtility.logError(
			BI_PSPB_NotificationConstantsCtrl.finish,
			BI_PSPB_EmailBatch.class.toString(),
			false,
			BI_PSPB_NotificationConstantsCtrl.logInfo
			
		);
	}
/**
 * @description Wrapper class for email log details, including contact information, notification settings,
 * email status, and response details. Used to create and manage email logs in the system.
 */
public class EmailLogWrapper {
	/**
	*@description contactIds List of contact IDs 
	 */
	public Contact contact { get; set; }
	
	/**
	*@description notificationDeveloperName Developer name of the notification
	 */
	public BI_PSPB_Notification__mdt notifications { get; set; }
	
	/**
	*@description status of the notification
	 */
	public String status { get; set; }
	
	/**
	*@description messageId  of the notification
	 */
	public String messageId { get; set; }
	/**
	*@description emailResponse  of the notification
	 */
	public Boolean emailResponse { get; set; }
	/**
	*@description responseCode  of the notification
	 */
	public Integer responseCode { get; set; }

	/**
	 * @description Constructs a new instance of the EmailLogWrapper class.
	 *
	 * @param contact The contact associated with the email log.
	 * @param notifications The notification settings used for the email.
	 * @param status The status of the email.
	 * @param messageId The message ID of the email.
	 * @param emailResponse Boolean indicating whether an email response was received.
	 * @param responseCode The response code from the email service.
	 */
	public EmailLogWrapper(
		Contact contact,
		BI_PSPB_Notification__mdt notifications,
		String status,
		String messageId,
		Boolean emailResponse,
		Integer responseCode
	) {
		this.contact = contact;
		this.notifications = notifications;
		this.status = status;
		this.messageId = messageId;
		this.emailResponse = emailResponse;
		this.responseCode = responseCode;
	}

	/**
	 * @description Creates a new instance of the BI_PSPB_OmnichannelLog__c object 
	 * and populates its fields with the relevant data from the contact and notification settings.
	 * This method initializes a new log entry with details such as contact information, email subject, 
	 * email body, event details, and response information.
	 * 
	 * @return A new instance of BI_PSPB_OmnichannelLog__c populated with the provided data.
	 */
	public BI_PSPB_OmnichannelLog__c createEmailLog() {
		// Initialize a new instance of BI_PSPB_OmnichannelLog__c
		BI_PSPB_OmnichannelLog__c emailLog = new BI_PSPB_OmnichannelLog__c();
		
		// Populate the fields of the emailLog object
		emailLog.BI_PSPB_ContactName__c = contact.Id; // Contact ID
		emailLog.BI_PSPB_UserEmail__c = contact.Email; // Contact's email address
		emailLog.BI_PSPB_Subject__c = notifications.BI_PSPB_Subject__c; // Email subject from notifications
		emailLog.BI_PSPB_Body__c = notifications.BI_PSPB_EmailBody__c; // Email body from notifications
		emailLog.BI_PSPB_EventName__c = notifications.BI_PSPB_EventName__c; // Event name from notifications
		emailLog.BI_PSPB_EventType__c = notifications.BI_PSPB_EventType__c; // Event type from notifications
		emailLog.BI_PSPB_EmailResponse__c = emailResponse; // Email response status
		emailLog.BI_PSPB_TemplateId__c = notifications.BI_PSPB_TemplateId__c; // Template ID from notifications
		emailLog.BI_PSPB_Status__c = status; // Email status
		emailLog.BI_PSPB_EmailMessageId__c = messageId; // Email message ID
		emailLog.BI_PSPB_StatusResponse__c = String.valueOf(responseCode); // Response code as string
		
		// Return the populated emailLog object
		return emailLog;
	}
}

	
}