/**
 * @description     This class defines constants used throughout the application. 
 *                   It includes static final string variables that represent various labels 
 *                   and error messages to be used across different parts of the application.
 * 
 * @history
 * Version  Author     Date          Detail      Description
 * 1.0      Sowmitha  29-July-2024   Created     Initial development of constants.
 * 1.1      Ashif     30-July-2024   Updated     Added more custom labels
 */

public class BI_PSPB_EnrollmentConstantCtrl {
/**
 * @description The BI_PSPB_EnrollmentConstantCtrl class provides a centralized way to access custom labels.
 * This class stores a map of string keys to custom label values, allowing for easy retrieval of labels
 * based on a key. Additionally, it provides static variables for commonly used constants.
 */
    public static final Map<String, String> LABELS = new Map<String, String>{
        'LOG_SEVERITY_ERROR' => System.Label.BI_PSP_ErrorSeverity,
        'UNQUALIFIED' => System.Label.BI_PSP_StatusUnqualified,
        'PATIENT' => System.Label.BI_PSPB_Patient,
        'ERROR_MSG_RECORD_NOT_FOUND' => System.Label.BI_PSPB_EnrolleRecNotFound,
        'RECORD_CANNOT_FOUND' => System.Label.BI_PSP_RecordNotFoundMsg,
        'CAREGIVER' => System.Label.BI_PSP_Caregiver,
        'SPEVIGO_DRUG' => System.Label.BI_PSPB_spevigo,
        'ERROR_FOR_CAREPROGRAM_PRODUCT' => System.Label.BI_PSPB_CareprogramProduct,
        'PHYSICIAN' => System.Label.BI_PSPB_PhysicianRecordtype,
        'ACTIVE' => System.Label.BI_PSPB_Active,
        'ERROR_RETRIEVE_COUNTRY' => System.Label.BI_PSP_ErrorCountryPicklist,
        'ERROR_RETRIEVE_STATE' => System.Label.BI_PSP_ErrorStateCodes,
        'ACC_ERROR' => System.Label.BI_PSP_AccountError,
        'ENROLLEE_CAREGIVER_ERROR' => System.Label.BI_PSP_EnrolleeCaregiverErrorMessage,
        'PARAM_ERROR' => System.Label.BI_PSPB_ErrorParameter,
        'INSERTION_FAILED' => System.Label.BI_PSPB_InsertError,
        'HEALTHCARE_PROVIDER' => System.Label.BI_PSPB_HealthcareProvider,
        'PATIENT_CAREGIVER' => System.Label.BI_PSPB_PatientorCaregiver,
        'PATIENT_QUALIFIED_STATUS' => System.Label.BI_PSPB_PatientQualified,
        'CONVERTED' => System.Label.BI_PSPB_Converted,
        'CONVERSION_ERROR' => System.Label.BI_PSP_ConvertError,
        'ERROR_GETTING_CONTACT' => System.Label.BI_PSPB_ErrorGettingAccount,
        'USER_ID_ERROR' => System.Label.BI_PSP_UserIdErrorMessage,
        'PROFILE_ID_ERROR' => System.Label.BI_PSP_ProfileIdErrorMessage
    };
/**
     * @description Retrieves the custom label value corresponding to the provided key.
     * @param key The key for which to retrieve the label value.
     * @return The custom label value associated with the provided key, or null if the key is not found.
     */
    public static String getLabel(String key) {
        return LABELS.get(key);
    }
}