/*
@description       This class provides methods to retrieve dates for Assessment cards in progress for 
                   different categories like PSS, WAPI, and DLQI.It interacts with Assessment and custom objects 
                   to fetch relevant dates based on the current user's role and context.
* History:
* Version	Author		Date			Detail			Description.
* 1.0		Abinsha		05-Dec-2023		Created			Initial development.
* 1.1		Abinsha 	01-Jan-2024		Updated			Updated for caregiver.
* 1.2		Abinsha		04-Apr-2024		Updated			Catch log added.
*/
public with sharing class BI_PSP_AssessmentManagementCtrl {
 
    private static List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();
    private static List<AssessmentQuestionResponse> existingResponsesToUpdate= new List<AssessmentQuestionResponse>();
	private static Set<Id> assessmentIdsToUpdate=new Set<Id>();

    @AuraEnabled
public static void mulitipleDraftRecordsInsertion(
    List<String> darftQuestionIds,
    List<String> draftResponseTexts,
    Boolean isItDraftOrSubmit,
    Boolean isQsqAfterTwoMonths
) {
    try {
        // Check for null or empty inputs
        if ( darftQuestionIds.isEmpty() ||  draftResponseTexts.isEmpty()) {
            throw new IllegalArgumentException(BI_PSP_QuestionnaireConstant.falseParemeter);
        }

        String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
        String categoryName = BI_PSP_AssessmentHelperCtrl.getCategory(darftQuestionIds);

        String fields = 'Id';
        String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'' +
                            ' AND AssessmentStatus = \'' + BI_PSP_QuestionnaireConstant.inProgress + '\'' +
                            ' AND Name = \'' + categoryName + '\'';

        // Use the common query utility to execute the query
        List<SObject> existingAssessments = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);

        Assessment existingAssessment;
        if (!existingAssessments.isEmpty()) {
            existingAssessment = (Assessment) existingAssessments[0];
            String existingAssessmentId = existingAssessment.Id;
            updateExistingResponses(existingAssessmentId, darftQuestionIds, draftResponseTexts, isItDraftOrSubmit,isQsqAfterTwoMonths);
        } else {
            createNewAssessment(darftQuestionIds, draftResponseTexts, enrolleeId, isItDraftOrSubmit, isQsqAfterTwoMonths);
        }
    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSP_AssessmentCtrl.class.toString(), ex);
    }
}
    
    private static void createNewAssessment(List<String> qstns, List<String> respnones, String enroleeids, Boolean isItDraftOrSubmit, Boolean isQsqAfterTwoMonths) {
    String questionnaireName = BI_PSP_AssessmentHelperCtrl.getCategory(qstns);

    DateTime timeOfQsqEnrllee = getEnrolleeCreationDate(enroleeids);

    Assessment ass = initializeAssessment(enroleeids, questionnaireName, isItDraftOrSubmit, isQsqAfterTwoMonths, timeOfQsqEnrllee);
	//dml
    Database.SaveResult[] savedresuls=BI_PSP_DatabaseOperationsUtility.insertOperation(new List<Assessment>{ ass },BI_PSP_AssessmentManagementCtrl.class.toString(), false);
   if (savedresuls.size() > 0 && savedresuls[0].isSuccess()) {
    ass.Id = savedresuls[0].getId(); // Correctly assign the Id from the SaveResult
    } 
     // Check if the insertion was successful
    if (!String.isEmpty(ass.Id)) {
        associateNewAssessmentResponses(qstns, respnones, ass.Id, isQsqAfterTwoMonths, questionnaireName);
    }else{
        BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.assessmentFailed, BI_PSP_AssessmentManagementCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
    }
        
}

public static DateTime getEnrolleeCreationDate(String enroleeids) {
   // Define the fields and conditions for the query
String fields = 'Id, Name, CreatedDate';
String conditions = 'Id = \'' + enroleeids + '\'';

// Call the executeQuery method from BI_PSP_CommonQueryUtility
List<SObject> caregiverEnrolleeSObjects = BI_PSP_CommonQueryUtility.executeQuery(
    'CareProgramEnrollee',
    fields,
    conditions,
    false 
);

// Cast the list of SObject to the specific type
List<CareProgramEnrollee> caregiverEnrollee = (List<CareProgramEnrollee>) caregiverEnrolleeSObjects;


    return caregiverEnrollee.isEmpty() ? null : caregiverEnrollee[0].CreatedDate;
}

private static Assessment initializeAssessment(String enroleeids, String questionnaireName, Boolean isItDraftOrSubmit, Boolean isQsqAfterTwoMonths, DateTime timeOfQsqEnrllee) {
    Assessment ass = new Assessment();
    ass.BI_PSP_CareProgramEnrollee__c = enroleeids;
    ass.Name = questionnaireName;
    
    BI_PSP_AssessmentHelperCtrl.setAssessmentStatus(ass, isItDraftOrSubmit, questionnaireName);
    BI_PSP_AssessmentHelperCtrl.setAssessmentPersonalizationStatus(ass, isItDraftOrSubmit, isQsqAfterTwoMonths, questionnaireName);
    BI_PSP_AssessmentHelperCtrl.setRolloutDate(ass, timeOfQsqEnrllee, isQsqAfterTwoMonths, questionnaireName);

    ass.EffectiveDateTime = DateTime.now();
    ass.ExpirationDateTime = DateTime.now().addDays(BI_PSP_QuestionnaireConstant.expireDate);

    return ass;
}
   private static void associateNewAssessmentResponses(List<String> qstns, List<String> respnones ,String assIds,Boolean isQsqAfterTwoMonths,String catNames)
   {
       	 List<Id> newResponseResults =new  List<Id> ();
        for (Integer i = 0; i < qstns.size(); i++) {
                String questionId = qstns[i];
                String responseText = respnones[i];

                AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
                assRes.AssessmentQuestionId = questionId;
                assRes.ResponseText = responseText;
                assRes.AssessmentId = assIds;
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
            }
      
            if (!assResList.isEmpty()) {
                
            BI_PSP_DatabaseOperationsUtility.insertOperation(assResList, BI_PSP_AssessmentCtrl.class.toString(), false);
            
            }
            if (newResponseResults.isEmpty()) {
       			BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
   }
    
    
    public static void updateExistingResponses(String existingAssessmentId,List<String> darftQuestionIds,List<String> draftResponseTexts,Boolean isItDraftOrSubmit,Boolean isQsqAfterTwoMonths )
    {
     List<AssessmentQuestionResponse> listOfResponses =new List<AssessmentQuestionResponse>();
      List<String> fieldsList = new List<String>{
    'Id',
    'Assessment.Id',
    'ResponseText',
    'AssessmentQuestionId',
    'BI_PSP_ResponseOrder__c'
};

// Convert set of IDs to a comma-separated string
String darftQuestionIdsStr = String.join(new List<String>(darftQuestionIds), '\', \'');

// Construct the dynamic query
String query = 'SELECT ' + String.join(fieldsList, ', ') + 
               ' FROM AssessmentQuestionResponse' +
               ' WHERE AssessmentQuestionId IN (\'' + darftQuestionIdsStr + '\')' + 
               ' AND AssessmentId = \'' + existingAssessmentId + '\'' +
               ' ORDER BY BI_PSP_ResponseOrder__c ASC';

// Execute the query
List<SObject> queryResponse = BI_PSP_CommonQueryUtility.executeComplexQuery(query, false);
listOfResponses = (List<AssessmentQuestionResponse>) queryResponse;

        
        List<Id> existingUpdateResults =new  List<Id> ();
        for (AssessmentQuestionResponse existingResponse : listOfResponses) {
            BI_PSP_QuestionnaireConstant.existingResponsesMap.put(existingResponse.AssessmentQuestionId, existingResponse);
            assessmentIdsToUpdate.add(existingResponse.Assessment.Id);
        }
    

        for (Integer i = 0; i < darftQuestionIds.size(); i++) {
            String questionId = darftQuestionIds[i];
            String responseText = draftResponseTexts[i];
            AssessmentQuestionResponse existingResponse = BI_PSP_QuestionnaireConstant.existingResponsesMap.get(questionId);

            if (existingResponse != null) {
              
                existingResponse.ResponseText = responseText;
                existingResponsesToUpdate.add(existingResponse);
            } else {
               
                assResList =BI_PSP_AssessmentHelperCtrl.newDraftResponseToInsert(questionId,responseText,existingAssessmentId,isQsqAfterTwoMonths);
            }
        }
    
	//dml
    if (!existingResponsesToUpdate.isEmpty()) {
       BI_PSP_DatabaseOperationsUtility.updateOperation(existingResponsesToUpdate, BI_PSP_AssessmentCtrl.class.toString(), false);

    }        
     if (existingUpdateResults.isEmpty()) {
       			BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
            BI_PSP_AssessmentHelperCtrl.updatePersonalisation(isItDraftOrSubmit,darftQuestionIds,existingAssessmentId,isQsqAfterTwoMonths);
        
    if (!assResList.isEmpty()) {
        BI_PSP_AssessmentHelperCtrl.insertCurrentUsersExistingAndCurrentResponse(assResList);
    }
    }
  
    
}