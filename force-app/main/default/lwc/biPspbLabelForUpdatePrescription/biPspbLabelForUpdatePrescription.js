import { LightningElement } from 'lwc';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl'
import PRESCRIPTION_STATUS from '@salesforce/label/c.BI_PSPB_PrescriptionStatusUrl';
import UPDATERX from '@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import INVALID_PRESCRIPTION from '@salesforce/label/c.BI_PSPB_InvalidPrescription';
import PRESCRIPTION_VERIFIED from '@salesforce/label/c.BI_PSPB_PrescriptionVerified';
import PRESCRIPTION_UNDER_VERIFICATION from '@salesforce/label/c.BI_PSPB_PrescriptionUnderVerification';
import SUBMITTED from '@salesforce/label/c.BI_PSPB_Submitted';
import PHARMACY_LABEL from '@salesforce/label/c.BI_PSPB_PrescriptionError';
import UPLOAD_ERROR from '@salesforce/label/c.BI_PSPB_UploadFileError';
import NO from '@salesforce/label/c.BI_PSP_OptionValueNo';
import YES from '@salesforce/label/c.BI_PSP_OptionValueYes';
import UPDATE_PRESCRIPTION_LABEL from '@salesforce/label/c.BI_PSPB_UpdatePrescription';
import PRESCRIPTION_STATUS_LABEL from '@salesforce/label/c.BI_PSPB_PrescriptionStatus';
import PRESCRIPTION_VALIDATION_LABEL from '@salesforce/label/c.BI_PSP_PrescriptionValidationLabel';
import NO_PRESCRIPTION_LABEL from '@salesforce/label/c.BI_PSP_NoPrescriptionLabel';
import DESCRIPTION_LABEL from '@salesforce/label/c.BI_PSP_DescriptionLabel';
import STATUS from '@salesforce/label/c.BI_PSPB_Status';
import TYPE from '@salesforce/label/c.BI_PSPB_Type';
import DATE from '@salesforce/label/c.BI_PSP_DateLabel';
import PRESCRIPTION_MESSAGE from '@salesforce/label/c.BI_PSP_PrescriptionMessage';
import UPDATE_LABEL from '@salesforce/label/c.BI_PSP_UpdateLabel';
import PRESCRIPTION_CONTACT_MSG from '@salesforce/label/c.BI_PSP_PrescriptionContactMsg';
import LATEST_PRESCRIPTION_QSTN from '@salesforce/label/c.BI_PSP_LatestPrescriptionQstn';
import EPRESCRIPTION_QSTN from '@salesforce/label/c.BI_PSP_EprescriptionQstn';
import SUBMIT from '@salesforce/label/c.BI_PSP_ButtonSubmit';
import CANCEL from '@salesforce/label/c.BI_PSP_CancelButton';
import ADDITIONAL_COMMENTS from '@salesforce/label/c.BI_PSP_AdditionalComments';
import PRESCRIPTION_TOAST_MSG from '@salesforce/label/c.BI_PSP_PrescriptionToastMsg';
import PHARMACY_PRESCRIPTION_QSTN from '@salesforce/label/c.BI_PSP_PharmacyPrescriptionQstn';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';

export const LABELS = {BRANDED_URL,UNASSIGNED_URL,BRANDED_URL_NAVI,UNASSIGNED_URL_NAVI,PRESCRIPTION_STATUS,
    UPDATERX, ERROR_VARIANT,ERROR_MESSAGE, INVALID_PRESCRIPTION, PRESCRIPTION_VERIFIED,PRESCRIPTION_UNDER_VERIFICATION,
    SUBMITTED, YES, NO, UPLOAD_ERROR, PHARMACY_LABEL,UPDATE_PRESCRIPTION_LABEL,PRESCRIPTION_STATUS_LABEL,
    PRESCRIPTION_VALIDATION_LABEL,NO_PRESCRIPTION_LABEL,DESCRIPTION_LABEL,STATUS,TYPE,DATE, PRESCRIPTION_MESSAGE,UPDATE_LABEL,
    PRESCRIPTION_CONTACT_MSG, LATEST_PRESCRIPTION_QSTN, EPRESCRIPTION_QSTN,SUBMIT,CANCEL,ADDITIONAL_COMMENTS,
    PRESCRIPTION_TOAST_MSG, PHARMACY_PRESCRIPTION_QSTN,ERROR_PAGE
}

export default class BiPspbLabelForUpdatePrescription extends LightningElement {}