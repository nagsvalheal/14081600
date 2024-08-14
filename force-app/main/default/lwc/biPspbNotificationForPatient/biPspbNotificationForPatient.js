// This is consolidate component for unassigned patient notification
// To import Libraries
import { LightningElement } from 'lwc';

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbNotificationForPatient extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	showSpinner=true;
	unassignedUrl = resources.UNASSIGNED_SITE_URL;
	myProfile = resources.MY_PROFILE;
	myProfileUrl=resources.PATIENT_MYPROFILE_URL;
	mySelectAvatarUrl=resources.PATIENT_SELECTAVATAR_URL;
	myCaregiverUrl=resources.MYCAREGIVER_URL;
	myCaregiver = resources.MY_CAREGIVER;
	selectAvatar = resources.SELECT_AVATAR;
	patientNotification = resources.NOTIFICATION;
	notificationSetting=resources.NOTIFIC_SETTING;
	patientInfo=resources.PATIENT_INFO;
	baseUrl;
	currentPageUrl;
	urlSegments;

	connectedCallback() {
		try {
			const globalThis = window;
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		}
		catch (error) {
			let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
		}
	}

	// navigate unassigned site home page
	openHome() {
		window.location.assign(this.baseUrl + this.unassignedUrl);
	}
	// navigate unassigned site patientprofile page
	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.myProfileUrl);
	}
	// navigate unassigned site patientcaregiver page
	openPatMyCaregiver() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.myCaregiverUrl);
	}
	openPatSelectAvatar() {
		// navigate unassigned site patientselectavatar page
		window.location.assign(this.baseUrl + this.unassignedUrl + this.mySelectAvatarUrl);
	}
	// navigate unassigned site patientnotificationt page
	openPatNotSettings() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.patientNotification);
	}
 handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }

}