/* History:
* @description :A class that holds helper methods for BI_PSP_AssessmentManagementCtrl class.
* Version   Author      Date            Detail          Description
* 1.0       Abinsha     05-Dec-2023     Created         Initial development.
* 1.1       Abinsha     01-Jan-2024     Updated         Updated for caregiver.
* 1.2       Abinsha     04-Apr-2024     Updated         Catch log added.
*/
public class BI_PSP_AssessmentHelperCtrl {
    
private static List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();
    //this method returns the category name of the submitted Questionnaire.
public static String getCategory(List<String> draftQuestionIds) {
 String categoryName;
 String activeVersionId;

 // Check if draftQuestionIds is not empty
 if (!draftQuestionIds.isEmpty()) {
     activeVersionId = draftQuestionIds[0];
 } else {
     BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
     return null;
 }

 // Define query parameters
 String sObjectType = 'AssessmentQuestion';
 String fields = 'Id, QuestionCategory';
 String conditions = 'ActiveVersionId = \'' + activeVersionId + '\' LIMIT 1';
 Boolean withUserMode = false; // Set this to true if user mode is needed

 // Execute the query using the common query method.
 List<SObject> queryResults = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
 
 // Assuming the query only returns one record due to LIMIT 1.
 if (!queryResults.isEmpty() && queryResults[0] instanceof AssessmentQuestion) {
     AssessmentQuestion assessmentQuestion = (AssessmentQuestion) queryResults[0];
     categoryName = assessmentQuestion.QuestionCategory;
 } else {
     BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentCtrl.class.toString(), true, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
     // Handle the case where no category is found.
     categoryName = null;
 }

 return categoryName;
}


public static List<AssessmentQuestionResponse> newDraftResponseToInsert(String questionId,String responseText, String existingAssessmentId,Boolean isQsqAfterTwoMonths) {

String catNames = BI_PSP_AssessmentHelperCtrl.getCategory(new List<String>{questionId});
             AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
             assRes.AssessmentQuestionId = questionId;
             assRes.ResponseText = responseText;
             assRes.AssessmentId = existingAssessmentId;
             assRes.Name = responseText;
             if(isQsqAfterTwoMonths == true && catNames==BI_PSP_QuestionnaireConstant.qualiCategory)
             {
             assRes.BI_PSP_QsqAfter2months__c = BI_PSP_QuestionnaireConstant.pageOne;
             }
             else if(isQsqAfterTwoMonths == false && catNames==BI_PSP_QuestionnaireConstant.qualiCategory)
             {
                 assRes.BI_PSP_QsqAfterWeeks__c = BI_PSP_QuestionnaireConstant.pageTwo;
             }
            
             assResList.add(assRes);
        return  assResList;    
          
}


    /*For Personalisation field update on assessment object.
    @params isItDraftOrSubmit :-Boolean variable that determines whether the Questionnaire Got Completed or is it a draft.
	@params categoryName:-Questionnaire Category name
	@params existingAssessmentId :-Existing assessment id of the patient.
    */
    public static void updatePersonalisation(Boolean isItDraftOrSubmit, List<String> draftQuestionIds, String existingAssessmentId,Boolean isQsqAfterTwoMonths) {
        // Get category name
         List<Assessment> assessmentsToUpdate = new List<Assessment>();
        String categoryName = BI_PSP_AssessmentHelperCtrl.getCategory(draftQuestionIds);
        // Determine status based on input conditions
        String stsOfTheQuestnr;
        if (isItDraftOrSubmit) {
            stsOfTheQuestnr = (categoryName == BI_PSP_QuestionnaireConstant.introduction)
                ? BI_PSP_QuestionnaireConstant.inProgress
                : BI_PSP_QuestionnaireConstant.completed;
        } else {
            stsOfTheQuestnr = BI_PSP_QuestionnaireConstant.inProgress;
        }
        
        // Query assessments to update
        String fields = 'Id';
        String conditions = 'Id = \'' + existingAssessmentId + '\'';
        List<SObject> queryResults = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
    	assessmentsToUpdate =checkPersnlistnConditions(draftQuestionIds,isItDraftOrSubmit,queryResults,stsOfTheQuestnr,isQsqAfterTwoMonths);
    
        // Update the assessments in the database if there are any
        if (!assessmentsToUpdate.isEmpty()) {
            BI_PSP_AssessmentHelperCtrl.updateCurrentUsersExistingResponse(assessmentsToUpdate);
        }
    }
 
    private static List<Assessment> checkPersnlistnConditions(List<String> draftQuestionIds,Boolean isItDraftOrSubmit,List<SObject> queryResults,String stsOfTheQuestnr,Boolean isQsqAfterTwoMonths)
    {
        String categoryName= BI_PSP_AssessmentHelperCtrl.getCategory(draftQuestionIds);
        List<Assessment> assessmentsToReturn = new List<Assessment>();
         for (SObject sObj : queryResults) {
            Assessment assessment = (Assessment) sObj;
            assessment.AssessmentStatus = stsOfTheQuestnr;
    		  if(isItDraftOrSubmit ==true && isQsqAfterTwoMonths ==true && categoryName == BI_PSP_QuestionnaireConstant.qualiCategory)
             {
            assessment.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.complete;
             }
            if (categoryName == BI_PSP_QuestionnaireConstant.introduction && categoryName != BI_PSP_QuestionnaireConstant.qualiCategory && isQsqAfterTwoMonths ==false) {
                assessment.BI_PSP_StatusForPersonalization__c = (isItDraftOrSubmit)
                    ? BI_PSP_QuestionnaireConstant.complete
                    : BI_PSP_QuestionnaireConstant.inProgress;
            }
    
            assessmentsToReturn.add(assessment);
            
        }
         return assessmentsToReturn;
    }
 //performs update of assessment responses.
 public static void updateCurrentUsersExistingResponse( List<Assessment> assessmentsToUpdate)
 {
     //dml
     BI_PSP_DatabaseOperationsUtility.updateOperation(assessmentsToUpdate, BI_PSP_AssessmentCtrl.class.toString(), false);
      
 }
//Associates the responses submitted by the user to the assessment he finished.
//Method doesnt return anything, just performs insert operation of assessment responses.
public static void insertCurrentUsersExistingAndCurrentResponse( List<AssessmentQuestionResponse> assResList)
 {
     //dml
     BI_PSP_DatabaseOperationsUtility.insertOperation(assResList, BI_PSP_AssessmentCtrl.class.toString(), false);
       
 }
    
    public static void setAssessmentStatus(Assessment ass, Boolean isItDraftOrSubmit, String questionnaireName) {
    if (isItDraftOrSubmit) {
        ass.AssessmentStatus = questionnaireName == BI_PSP_QuestionnaireConstant.introduction ? BI_PSP_QuestionnaireConstant.inProgress : BI_PSP_QuestionnaireConstant.completed;
    } else {
        ass.AssessmentStatus = BI_PSP_QuestionnaireConstant.inProgress;
    }
    }

    public static void setAssessmentPersonalizationStatus(Assessment ass, Boolean isItDraftOrSubmit, Boolean isQsqAfterTwoMonths, String questionnaireName) {
    Boolean preventIfAccess = false;

    if (isItDraftOrSubmit && !isQsqAfterTwoMonths && questionnaireName == BI_PSP_QuestionnaireConstant.qualiCategory) {
        ass.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.inProgress;
        preventIfAccess = true;
    }

    if (isItDraftOrSubmit && !preventIfAccess) {
        ass.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.complete;
    } else {
        ass.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.inProgress;
    }
}

public static void setRolloutDate(Assessment ass, DateTime timeOfQsqEnrllee, Boolean isQsqAfterTwoMonths, String questionnaireName) {
    if (timeOfQsqEnrllee != null && questionnaireName == BI_PSP_QuestionnaireConstant.qualiCategory) {
        ass.BI_PSP_RolloutforCompletedQuestionnarie__c = timeOfQsqEnrllee.addDays(
            isQsqAfterTwoMonths ? BI_PSP_QuestionnaireConstant.twoMonthsInt : BI_PSP_QuestionnaireConstant.fourteenWeeksInt
        );
    }
}
}