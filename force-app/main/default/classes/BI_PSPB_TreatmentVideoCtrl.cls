/**
 * @description This BI_PSPB_treatmentvideocmd class is retrieves video URLs and patient status (chronic/acute/unassigned) for the Information Center
 * History:
 * Version	Author			Date			Detail				Description
 * 1.0		Gokul Krishnan	05-Nov-2023		Created				Initial development
 * 1.1		Gokul Krishnan 	01-Dec-2023		Updated				Updated the patient status retrieve
 * 1.2		Gokul Krishnan	04-Apr-2024		Updated				Catch log added
 * 1.3		Gokul Krishnan  12-Jul-2024		Updated				Common utility class added for Error handling
 * 																and retrieving careprogram enrollee id.
 */
public with sharing class BI_PSPB_TreatmentVideoCtrl {

	/**
 *@description   Retrieve the video Url from BI_PSPB_Treatment_videos__c custom object
				 It return in lwc biPspbAcuteVideo, biPspbChronicVideo
 *@return        return the url of video from BI_PSPB_Treatment_videos__c object as List<string>
					
 */
	@AuraEnabled(cacheable=true)
	public static List<BI_PSPB_Treatment_videos__c> getRecords() {
		List<BI_PSPB_Treatment_videos__c> treatmentVideoUrls;
		try {
			// Define the parameters for the query
			String sObjectType = 'BI_PSPB_Treatment_videos__c';
			String fields = 'Id, BI_PSPB_URL__c';
			String conditions = ''; // No specific conditions
			Boolean withUserMode = true; // true for enforcing sharing rules (WITH USER_MODE)

			// Execute the query using the utility method
			treatmentVideoUrls = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);
			if(treatmentVideoUrls.isEmpty()){
				throw new AuraHandledException(BI_PSPB_InfoCenterConstantCtrl.errorTreatmentVideoRetrieve);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_InfoCenterConstantCtrl.errorTreatmentVideoRetrieve,
				BI_PSPB_TreatmentVideoCtrl.class.toString(),
				ex
			);
		}

		return treatmentVideoUrls;
	}

/**
 *@description      Get the patient status value based on current user
					return in lwc biPspbArticleContent, biPspbArticleContentNavigation, biPspbArticleSearchNavigation,
					biPspbArticlesForDashboard, biPspbArticleCategoryParent, biPspbArticleContentParent, biPspbArticleContentAvatar,
					biPspbInformationCenterLanding, biPspbInfoCenterLandingParent, biPspbInfoLandingAvatar,
					biPspbRelatedArticles, biPspbArticleSearchParent,
					biPspbNavigationBar
 *@return           Return the patient status (chronic, acute, unassigned ) as String			  
 */
	@AuraEnabled(cacheable=true)
	public static String patientStatus() {
		String patientStatus;
		try {
			patientStatus = BI_PSP_CurrentUser.getEnrolleeRecords()[0].BI_PSPB_PatientStatus__c != null
			? BI_PSP_CurrentUser.getEnrolleeRecords()[0].BI_PSPB_PatientStatus__c
			: BI_PSPB_InfoCenterConstantCtrl.unassignedStatus;

		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_TreatmentVideoCtrl.class.toString(),
				ex
			);
		}
		return patientStatus;
	}
}