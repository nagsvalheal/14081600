/*
@description      :Apex class to retrieve draft responses for different assessment categories such 
                  as Psoriasis, Work and Activity, and Dermatology. It handles the retrieval of 
                  draft assessment question responses based on the user's role and enrollment 
                  status in the care program.below are the LWCs where this class is used
                  biPspbIntroductionQuestionnaire, biPspbDLQIquestionnaire,biPspbPSSQuestionnaire,
                  biPspbWAPIQuestionnaire,biPspbQSQuestionnaire1,biPspbQSQuestionnaire2.
* History:
* Version   Author      Date            Detail          Description
* 1.0       Abinsha     05-Dec-2023     Created         Initial development.
* 1.1       Abinsha     01-Jan-2024     Updated         Updated for caregiver.
* 1.2       Abinsha     04-Apr-2024     Updated         Catch log added.
*/

public with sharing class BI_PSP_DraftResponseCtrl {
  /**
  * @description Retrieves draft responses for the Psoriasis category.this method is used in
  * biPspbPSSQuestionnaire  LWC component.
  * @return List of draft assessment question responses for the Psoriasis category.
  */
 private static string conditions;
 private static string enrolleeId;

 public static String buildConditions(String questCatgryName, Boolean twoMonths, String inprogress, String enrolleeId) {
        String conditions = '';
          conditions += 'assessment.BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'';
         if(questCatgryName ==BI_PSP_QuestionnaireConstant.qualiCategory && twoMonths == true)
         {
             conditions += ' AND ';
             conditions += 'BI_PSP_QsqAfter2months__c = \'' + BI_PSP_QuestionnaireConstant.pageOne + '\'';
         }
       
           if(questCatgryName ==BI_PSP_QuestionnaireConstant.qualiCategory && twoMonths == false)
         {
              conditions += ' AND ';
             conditions += 'BI_PSP_QsqAfterWeeks__c = \'' + BI_PSP_QuestionnaireConstant.pageTwo + '\'';
         }
         conditions += ' AND ';
           conditions += 'Assessment.AssessmentStatus = \'' + BI_PSP_QuestionnaireConstant.inprogress + '\'';
         conditions += ' AND ';
   conditions += 'BI_PSP_Questionnaire_Name__c = \'' + questCatgryName + '\'';
     return conditions;

 }
     
    @AuraEnabled(cacheable=true)
    public static List<AssessmentQuestionResponse> retrieveDrfatResponses(String questCatgryName, Boolean twoMonths) {
     List<AssessmentQuestionResponse> liAssessRespon = new List<AssessmentQuestionResponse>();
     try {
         enrolleeId =BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;     
         
             // Build the conditions string
                 conditions = buildConditions(questCatgryName, twoMonths, BI_PSP_QuestionnaireConstant.inprogress, enrolleeId);
         
                 String fields = 'Id, ResponseText, ResponseValue, BI_PSP_Questionnaire_Name__c, BI_PSP_ResponseOrder__c, AssessmentQuestion.Id, Assessment.Id, Assessment.AssessmentStatus';
    
             // Specify whether to enforce sharing rules
             Boolean withSharingKeywrd = false;
             String orderByClause = 'ORDER BY BI_PSP_ResponseOrder__c ASC';
             conditions += ' ' + orderByClause;
             // Execute the query using the SOQLQueryBuilder
             List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('AssessmentQuestionResponse', fields, conditions, withSharingKeywrd);
             
             // Cast the SObject list to List<AssessmentQuestionResponse>
             for (SObject sObj : sObjectResponses) {
                 liAssessRespon.add((AssessmentQuestionResponse) sObj);
             }
         
         if (liAssessRespon.isEmpty()) {
               BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_DraftResponseCtrl.class.toString(),false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
             }
     } catch (Exception ex) {
         BI_PSP_LogMessagesUtility.exceptionLogMessage(
             '',
             BI_PSP_DraftResponseCtrl.class.toString(),
             ex
         );
     }
 	return liAssessRespon;
	}

}