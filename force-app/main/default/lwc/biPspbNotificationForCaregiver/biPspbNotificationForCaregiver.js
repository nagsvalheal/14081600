// This is consolidated component for unassigned notification setting page.
// To import Libraries
import { LightningElement } from 'lwc';

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbNotificationForCaregiver extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	//showSpinner=true;
	unAssignedUrl = resources.UNASSIGNED_SITE_URL;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	patientInfo = resources.PATIENT_INFO;
	caregiverUrl=resources.CAREGIVER_PATIENT_URL;
	selectAvatar = resources.SELECT_AVATAR;
	patientNotification = resources.NOTIFICATION;
	notificationSetting=resources.NOTIFIC_SETTING;
	myProfile=resources.MY_PROFILE;
	myProfileUrl=resources.CAREGIVER_PROFILE_URL;
	selectAvatarUrl=resources.CAREGIVER_SELECT_URL;
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



	// navigate unassigned site  home page 
	openHome() {
		window.location.assign(this.baseUrl + this.unAssignedUrl);
	}
	// navigate unassigned site caregiverprofile page 
	openCarMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myProfileUrl);
	}
	// navigate unassigned site caregiverpatient page 
	openCarMyCaregiver() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.caregiverUrl);
	}
	// navigate unassigned site caregiverselectavatar page
	openCarSelectAvatar() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.selectAvatarUrl);
	}
	// navigate unassigned site caregivernotification page
	openCarNotSettings() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.patientNotification);
	}
 handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
    
}