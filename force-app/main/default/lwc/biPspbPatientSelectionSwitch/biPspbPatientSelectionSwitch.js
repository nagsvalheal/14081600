/*This lightning web component displays which patient to select and navigate once caregiver logs in*/
//To import Libraries
import { LightningElement, api } from 'lwc';
//To import Apex Classes
import UPDATE_SWITCH_SELECTED_PATIENTID from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.updateSwitchSelectedPatientID';
import GETCAREGIVER_ACCOUNT_FOR_SWITCH from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getcaregiverAccountforSwitch';
import GET_STATUS_PATIENT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';

import {label} from 'c/biPspbAvatarResources';

export default class BiPspbPatientSelectionSwitch extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	@api caregiverid;
	@api patientname;
	@api patientid;

	//Global variables(without @track does not trigger automatic re-renders)
	selectedAccountId;
	switchPatients = label.SWITCH_PATIENTS;
	switchIcon = label.SWITCH_ICON;
	patientSwitchMessage = label.PATIENT_SWITCH_MESSAGE;
	okayLabel = label.OKAY_LABEL;
	showSwitchIcon;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showPopup;
	status;
	siteUrlBranded = label.BRANDEDSITE_URL;
	displayNavErrorPage = label.DISPLAY_NAV_ERRORPAGE;
	//To get the available patient for the logged in caregiver
	renderedCallback() {
		let globalThis = window;
		try {
			this.currentPageUrl = window.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			GETCAREGIVER_ACCOUNT_FOR_SWITCH({ accountId: this.caregiverid }) // Use newAvatarSrc
				.then(result => {
					if (result !== null) {
						if (result.BI_PSPB_Selected_Patient_ID__c === this.patientid && result.BI_PSPB_CaregiverCheck__c === true) {
							this.showSwitchIcon = true;
						}
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage); //Catching Potential Error from Apex
				});
		} catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage); // Catching Potential Error from LWC
		}
	}

	//To add style for selected patient
	get getstyleforPatient() {
		return this.showSwitchIcon ? 'MenuProfile headMenu' : 'MenuProfile';
	}
	//To display the popup
	openShowPopup() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden';
	}
	//To close the popup
	handleClose() {
		this.showPopup = false;
		document.body.style.overflow = '';
	}
	//To update the selected patient
	updateSwitchPatient() {
		let globalThis = window;
		this.selectedAccountId = this.patientid;
		UPDATE_SWITCH_SELECTED_PATIENTID({ userId: this.caregiverid, selectedAccountId: this.selectedAccountId, check: true }) // Use newAvatarSrc
			.then(() => {
				this.getStatus();
			})
			.catch(error => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});

	}

	getStatus() {
		let globalThis = window;
		GET_STATUS_PATIENT()
			.then(result => {
				this.status = result[0].BI_PSPB_PatientStatus__c;
				
				if (this.status === label.ACUTE_LABEL) {
					window.location.assign(this.baseUrl +label. UNASSIGNED_SITE_URL + label.ACUTE_DASHBOARD);
				}
				else if (this.status === label.UNASSIGNED) {
					window.location.assign(this.baseUrl + label.UNASSIGNED_SITE_URL);
				}
				else if (this.status === label.CHRONIC_LABEL) {
					window.location.assign(this.baseUrl + label.BRANDED_SITEURL + label.DASHBOARD);
				}
			})
			.catch(error => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});

	}

}