/**
 * This class holds constant values used for Treatment Reminder application.
 * History
 * Version  Author      Date            Detail      Description
 * 1.0      Rajaa       03-Aug-2024    	Created      Code Refactor .
 */
public with sharing class BI_PSPB_TreatmentConstantsClassCtrl {
    
    /** Error message for DML operation failures */
    public static String errorDml = System.Label.BI_PSPB_UnableToUpdateRecord;

    /** Error message when treatment reminder is not found */
    public static String trtNotFound = System.Label.BI_PSPB_TreatRemindNotFound;

    /** Error message when care program enrollee is not found */
    public static String cpeNotFound = System.Label.BI_PSP_CareProgramEnrolleeErrorMessage;

    /** Day of treatment label */
    public static String dayOfTreatment = System.Label.BI_PSPB_DayOfTreatment;

    /** Log error severity label */
    public static String logError = System.Label.BI_PSP_ErrorSeverity;

    /** Action type for prescription */
    public static string actionTypePrescription = System.Label.BI_PSPB_Prescription;

    /** Action type for treatment */
    public static string actionTypeTreatment = System.Label.BI_PSPB_Treatment;

    /** Error message for parameter passing failures */
    public static string parameterError = System.Label.BI_PSPB_ErrorParameter;

    /** Label for treatment 14 days before */
    public static string treatmentFourteenDays = System.Label.BI_PSPB_PrFourteenDaysBefore;

    /** Label for treatment 10 days before */
    public static string treatmentTenDays = System.Label.BI_PSPB_TrTenDaysBefore;

    /** Label for treatment 7 days before */
    public static string treatmentSevenDays = System.Label.BI_PSPB_PrSevenDaysBefore;

    /** Label for treatment 1 day before */
    public static string treatmentOneDay = System.Label.BI_PSPB_TrOneDayBefore;

    /** Label for treatment 3 days before */
    public static string treatmentThreeDays = System.Label.BI_PSPB_TrThreeDaysBefore;

    /** Label for day of treatment */
    public static string trDayOfTreatment = System.Label.BI_PSPB_TrDayofTreatment;

    /** Action type for active status */
    public static string actionTypeActive = System.Label.BI_PSPB_Active;

    /** Action type for inactive status */
    public static string actionTypeInactive = System.Label.BI_PSP_Inactive;

    /** Action type for date of treatment */
    public static string actionTypeDateOfTreatment = System.Label.BI_PSPB_DateOfTreatment;

    /** URL for Google Calendar */
    public static String googleCalendar = System.Label.BI_PSPB_GoogleCalendarUrl;

    /** URL for Outlook Calendar */
    public static String outlookCalendar = System.Label.BI_PSPB_OutlookCalendarUrl;

    /** Label for date of treatment */
    public static string dateOfTreatment = System.Label.BI_PSPB_DateOfTreatment;
  public static string dateOfTreatmentMetaData = System.Label.BI_PSPB_DateOfTreatmentMetaData;
    /** Time format string */
    public static String timeFormat = System.Label.BI_PSPB_Time;

    /** Error message for Google Calendar URL generation failures */
    public static string googleUrlError = System.Label.BI_PSPB_ErrorGeneratingGoogleCalendarURL;

    /** Error message for Outlook Calendar URL generation failures */
    public static string outLookUrlError = System.Label.BI_PSPB_ErrorGeneratingOutlookCalendarURL;

    /** Label for selected checkbox */
    public static String selectedCheckBox = System.Label.BI_PSPB_SelectedCheckBox;

    /** Error message when task record is not found */
    public static String taskRecNotFound = System.Label.BI_PSPB_TaskRecNotFound;

    /** Error message for insert operation failures */
    public static String insertError = System.Label.BI_PSPB_InsertError;
}