// This consolidated component is used to show avatar, message and caregiver notification setting
// To import Libraries
import { LightningElement } from 'lwc';

import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspbCaregiverNotificationParent extends LightningElement {
	showSpinner=true;
	notificationSetting=resources.NOTIFIC_SETTING;
	selectAvatar=resources.SELECT_AVATAR;
	patientInfo=resources.PATIENT_INFO;
	myProfile=resources.MY_PROFILE;
	//this method is used to navigating a user unassigned and branded
	connectedCallback()  {
		try {
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENTS.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_SITE_URL;
			} else {
				this.urlq = resources.UNASSIGNED_SITE_URL;
			}
		}
		catch (error) {
			let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
		}
	}
	// navigation for caregiver
	openCarMyProfile() {
		window.location.assign(this.urlq + resources.CAREGIVER_PROFILE_URL);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + resources.CAREGIVER_PATIENT_URL);
	}
	openCarSelectAvatar() {
		window.location.assign(
			this.urlq + resources.CAREGIVER_SELECT_URL
		);
	}
	openCarNotSettings() {
		window.location.assign(
			this.urlq + resources.CAREGIVER_NOTIFY_URL
		);
	}
 handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
}