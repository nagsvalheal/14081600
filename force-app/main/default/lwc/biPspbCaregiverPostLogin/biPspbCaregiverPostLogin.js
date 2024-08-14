//This lightning web component is used to select the patient for Caregiver
//to Import the Libraries
import { LightningElement, wire } from "lwc";
//to Import the Apex Class
import CAREGIVER_ACCOUNTS from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver";

import CURRENT_USER from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import UPDATE_SELECTED_PATIENTID from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.updateSwitchSelectedPatientID";

//To import the Custom Labels
import { label } from "c/biPspbAvatarResources";

export default class BiPspbCaregiverPostLogin extends LightningElement {
  //Proper naming conventions with camel case for all the variable will be followed in the future releases
  //Declaration of varaiable with @track
  showSpinner = true;
  myPatient = label.MY_PATIENT;
  showDetails = false;
  showMessage = false;
  messageHeader = "";
  messageBody = "";
  selectedAccountId = "";
  cargiverId = "";
  Status;
  caregiverAccounts = [];
  //Declaration of varaiable
  statusMap = new Map();
  status;
  loginAttempt;
  getFieldValue;
  userId = label.ID;
  errorPage = label.ERROR_PAGE;
  user;
  get name() {
    return this.getFieldValue(this.user.data, label.NAME_FIELD);
  }

  //To fetch the data from caregivers patient
  @wire(CAREGIVER_ACCOUNTS, { userId: "$userId", isActive: false })
  wiredCaregiverAccounts({ error, data }) {
    let globalThis = window;
    // Null data is checked and AuraHandledException is thrown from the Apex
    try {
      if (data) {
        this.showSpinner = false;
        this.caregiverAccounts = data.map((patient) => ({
          Id: patient.BI_PSPB_Patient__c,
          Name: patient.BI_PSPB_Patient__r.Name,
          status: patient.BI_PSPB_Status__c,
          login: patient.BI_PSP_Loginattempt__c,
          caregiverId: patient.BI_PSPB_Caregiver__c,
          initial:
            patient?.BI_PSPB_Patient__r.Name?.split(" ").map((name) => name[0])
              .length >= 2
              ? (
                  patient.BI_PSPB_Patient__r.Name.split(" ").map(
                    (name) => name[0]
                  )[0] +
                  patient.BI_PSPB_Patient__r.Name.split(" ").map(
                    (name) => name[0]
                  )[1]
                ).toUpperCase()
              : patient.BI_PSPB_Patient__r.Name.split(" ")
                  .map((name) => name[0])[0]
                  .toUpperCase(),
          showSelectButton: patient.BI_PSPB_Status__c === label.ACTIVE,
          showBlockMessage: patient.BI_PSPB_Status__c !== label.ACTIVE,
          blockMessageHeader: label.ACCESS_BLOCKED,
          blockMessageBody: label.CAREGIVER_ACCESS
        }));
      } else if (error) {
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl + this.errorPage
        );
      }
    } catch (err) {
      globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      globalThis.location?.assign(
        this.baseUrl +  this.errorPage
      );
    }
  }

  handleViewDetails(event) {
    let globalThis = window;
    this.selectedAccountId = event.target.dataset.id;
    this.cargiverId = this.caregiverAccounts[0]?.caregiverId;
    // update the
    UPDATE_SELECTED_PATIENTID({
      userId: this.cargiverId,
      selectedAccountId: this.selectedAccountId,
      check: true
    })
      // Null data is checked and AuraHandledException is thrown from the Apex
      // Use newAvatarSrc
      .then(() => {
        this.caregiverfunc();
      })
      .catch((error) => {
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl  + this.errorPage
        );
      });
  }
  caregiverfunc() {
    let globalThis = window;
    CURRENT_USER()
      .then((result) => {
        this.enrolleeRecords = result;
        this.loginAttempt = result[0].BI_PSP_Loginattempt__c;
        this.status = result[0].BI_PSPB_PatientStatus__c;
        this.redirectUserBasedOnStatus();
      })
      .catch((error) => {
        this.error = error;
        this.enrolleeRecords = undefined;
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl  + this.errorPage
        );
      });
  }

  redirectUserBasedOnStatus() {
    let globalThis = window;
    try {
      if (this.loginAttempt === 0) {
        window.location.assign(
          label.CAREGIVER_AVATAR_SELECTION
        );
      } else if (this.loginAttempt === 1 && this.status === label.UNASSIGNED) {
        window.location.assign(label.UNASSIGNEDSITE_URL);
      } else if (this.loginAttempt === 1 && this.status === label.ACUTE) {
        window.location.assign(
          label.UNASSIGNEDSITE_URL + label.ACUTE_DASHBOARD
        );
      } else {
        window.location.assign(label.DASHBOARD);
      }
    } catch (err) {
      globalThis.sessionStorage.setItem("errorMessage", err.body.message);
      globalThis.location?.assign(
        this.baseUrl + this.errorPage
      );
    }
  }
  handlePatientStatusError(patientStatusError) {
    this.handleError(patientStatusError.message);
  }

 
}