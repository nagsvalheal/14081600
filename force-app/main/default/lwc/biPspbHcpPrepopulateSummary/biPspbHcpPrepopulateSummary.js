import { LightningElement, wire } from "lwc";
// Imports resourceUrl to reference external resources for proper rendering and functionality.
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import LEAD_GET from "@salesforce/apex/BI_PSPB_ThankyouPageUtilites.getExistingLeads";
import HCP_GET from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getHcpDetails";
// Imports showToastEvent to display notification messages, informing users about component actions or events.
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbHcpPrepopulateSummary extends LightningElement {
  toActive = resource.TO_ACTIVE;
  enrollThank = resource.ENROLL_THANK;
  addressColan = resource.ADRRESS_COLAN;
  enrollHead = resource.ENROLL_SUMMARY;
  nameColan = resource.NAME_COLAN;
  dobColan = resource.DOB_COLAN;
  emailColan = resource.EMAIL_COLAN;
  phoneColan = resource.PHONE_COLAN;
  prescriptionInfo = resource.PRESCRIPTION_INFO;
  patientinfo = resource.PATIENT_INFO;
  physicianInfo = resource.PHYSICIAN_INFO;
  age = true;
  showSpinner = true;
  recordDetails;
  caregiver;
  result;
  recordId;
  count;
  patientEmail;
  mailImg = resource.IMG;
  beyandGpp = resource.BGPP;
  errorPage = resource.ERROR_PAGE;

  //  get lead record from apex
  //There's no need to check for null because in Apex, we're throwing an AuraHandledException.
  //Therefore, null data won't be encountered.
  handleGlobalError(error) {
    let globalThis = window;
    const errorMessage = error?.body?.message || 'An unknown error occurred';
    globalThis.sessionStorage.setItem("errorMessage", errorMessage);
    globalThis.location?.assign(`${this.baseUrl}${resource.BRANDED_URL}${this.errorPage}`);
}

handleWireResult({ data, errors }, targetField, additionalLogic = null) {
    if (data && data.length > 0) {
        this.showSpinner = false;
        this[targetField] = data;
        if (additionalLogic) {
            additionalLogic.call(this, data);
        }
    } else if (errors) {
        this.handleGlobalError(errors);
    }
}

@wire(LEAD_GET, { createLeadId: "$recordId" })
wiredRecordDetailsLead(result) {
    this.handleWireResult(result, 'recordDetails', function(data) {
        this.patientEmail = data[0].Email;
    });
}

@wire(HCP_GET, { leadId: "$recordId" })
wiredRecordDetailsHcp(result) {
    this.handleWireResult(result, 'caregiver', function() {
        this.age = true;
    });
}

connectedCallback() {
    let globalThis = window;
    try {
        // Retrieve the recordId and count from localStorage
        this.recordId = globalThis?.localStorage.getItem("recordId");
        this.count = globalThis?.localStorage.getItem("count");
        
        if (this.count !== '2') {  // Store as a string to match localStorage type
            globalThis?.localStorage.setItem("count", '2');
        }
    } catch (error) {
        this.handleGlobalError(error);
    }
}


}