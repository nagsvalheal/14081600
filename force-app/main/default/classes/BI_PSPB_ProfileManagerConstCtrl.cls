/**
 * @description The BI_PSPB_ProfileManagerConstCtrl class is a utility class in Salesforce designed to manage and provide common constants used across various controllers and services related to profile management within the BI PSPB application.
 */
public class BI_PSPB_ProfileManagerConstCtrl {
      // To retrieve Application name from setting
  public static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
    'PSPB'
  );
  // Application name of the System

  public static String applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c
    : '';
  //common variable
  public static String errorMsg = '';
  // Custom Error message label
  public static String recordCannotFound = System.Label.BI_PSP_RecordNotFoundMsg;
  public static String recordCannotUpdate = System.Label.BI_PSP_RecordUpdateErrMsg;
  // enrollee Caregiver status value
  public static String active = System.Label.BI_PSPB_EnrolleeCgStatusValue;
  public static String inActive = System.Label.BI_PSPB_EnrolleeCaregiverStatusInactive;
  //logged user Id and email get
  public static String userName = UserInfo.getName();
  public static String userEmail = UserInfo.getUserEmail();
  public static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;
    //Custom error message Label
    public static String caseRecordType = System.Label.BI_PSPB_RecordTypeForCase;
    public static String deletionReq = System.Label.BI_PSPB_AccDeletionReq;
    public static String high = System.Label.BI_PSPB_PriorityHigh;
    public static String insertError = System.label.BI_PSPB_InsertError;
    public static String accountMessage = System.label.BI_PSP_RecordNotFoundMsg;
    public static String caseDelete = System.label.BI_PSPB_CaseRequestError;

    public static String accessReq = System.Label.BI_PSPB_AccAccessReq;
    public static String medium = System.Label.BI_PSPB_PriorityMed;
    public static String caseAccess = System.label.BI_PSPB_CaseAccessError;

    public static String email = UserInfo.getUserEmail();
    public static String errorForThrow = System.Label.BI_PSP_ConsoleError;
    public static String errorForAccount = System.Label.BI_PSP_AccountError;
    public static String errorForUpdate = System.Label.BI_PSPB_UnableToUpdateRecord;
    public static String errorUpdateCpe = System.Label.BI_PSPB_ErrorUpdateCpe;
    public static String errorGettingEcg = System.Label.BI_PSPB_ErrorGettingEcg;
    
    

}