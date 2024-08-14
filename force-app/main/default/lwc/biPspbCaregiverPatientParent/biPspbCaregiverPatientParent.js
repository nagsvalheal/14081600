//This  consolidates component the functionality for caregivers to view patient information and perform updates when logged in
//To import Libraries
import { LightningElement } from "lwc";


import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspbCaregiverPatientParent extends LightningElement {
	notificationSetting=resources.NOTIFIC_SETTING;
	selectAvatar=resources.SELECT_AVATAR;
	patientInfo=resources.PATIENT_INFO;
	myProfile=resources.MY_PROFILE;
	showSpinner=true;
	renderedCallback() {
		try {
			const currentURL = window.location.href;
			// Create a URL object
			const urlObject = new URL(currentURL); // Get the path
			const path = urlObject.pathname; // Split the path using '/' as a separator
			const pathComponents = path.split("/"); // Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find((component) =>
				[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_SITE_URL;
			} else {
				this.urlq = resources.UNASSIGNED_SITE_URL;
			}
		}
		catch (err) {
			let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
		}
	}

	//These are caregiver account manager Navigation
	openCarMyProfile() {
		window.location.assign(this.urlq + resources.CAREGIVER_PROFILE_SITE);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + resources.CAREGIVER_PATIENT_URL);
	}
	openCarSelectAvatar() {
		window.location.assign(this.urlq + resources.CAREGIVER_SELECT_URL);
	}
	openCarNotSettings() {
		window.location.assign(this.urlq + resources.CAREGIVER_NOTIFICATION);
	}
	handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }

}