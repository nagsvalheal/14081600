/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_CommunityTaskQueryCtrl {
	/**
	 * @description  Fetches a list of pending community posts that are unread and in progress.
	 *                The method queries the Task object based on specific conditions and returns
	 *                tasks related to community posts that match these criteria.
	 * @return A list of Task records that meet the criteria specified in the conditions. The list
	 *         contains tasks with fields such as Id, WhatId, BI_PSP_CommunityPostStatus__c,
	 *         BI_PSP_ChatterType__c, BI_PSP_Category__c, Status, and BI_PSP_CommunityUserName__c.
	 */
	public static List<Task> fetchPendingCommunityPosts() {
	  String fields = 'Id, WhatId, BI_PSP_CommunityPostStatus__c, BI_PSP_ChatterType__c, BI_PSP_Category__c, Status, BI_PSP_CommunityUserName__c';
	  String conditions =
		'BI_PSP_Category__c = \'' +
		BI_PSPB_NotificationConstantsCtrl.actionTypeGeneralCommunity +
		'\' ' +
		'AND BI_PSP_ChatterType__c = \'' +
		BI_PSPB_NotificationConstantsCtrl.createPost +
		'\' ' +
		'AND Status = \'' +
		BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead +
		'\' ' +
		'AND BI_PSP_CommunityPostStatus__c = \'' +
		BI_PSPB_NotificationConstantsCtrl.inProgressType +
		'\' ';
	  List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
		'Task',
		fields,
		conditions,
		false
	  );
	  return (List<Task>) results;
	}
  }