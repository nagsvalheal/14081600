// This Lightning Web Component serves as the navigation and parent component for the caregiver profile
// To import Libraries
import { LightningElement } from 'lwc';


import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspbCaregiverProfileParent extends LightningElement {
	// Declaration of global variables
	notificationSetting=resources.NOTIFIC_SETTING;
	selectAvatar=resources.SELECT_AVATAR;
	patientInfo=resources.PATIENT_INFO;
	myProfile=resources.MY_PROFILE;
	siteUrlq;
	urlq;
	showSpinner=true;
	// Navigate to the caregiver profile page
	openCarMyProfile() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_PROFILE_URL);
	}

	// Navigate to the caregiver patient page
	openCarMyCaregiver() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_PATIENT_URL);
	}

	// Navigate to the caregiver select avatar page
	openCarSelectAvatar() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_SELECT_URL);
	}

	// Navigate to the caregiver notifications page
	openCarNotSettings() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_NOTIFICATIONS);
	}

	// To reterieve the site url
	renderedCallback() {
		try {
		let currentUrl = window.location.href;
		let urlObject = new URL(currentUrl); // Get the path
		let path = urlObject.pathname; // Split the path using '/' as a separator
		let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
		let desiredComponent = pathComponents.find((component) =>
			[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
			component.toLowerCase()
			)
		);

		if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
			this.urlq = resources.BRANDED_URL;
			this.siteUrlq = resources.BRANDED_SITE_URL;
		} else {
			this.urlq = resources.UNASSIGNED_URL;
			this.siteUrlq = resources.UNASSIGNED_SITE_URL;
		}
		} catch (error) {
			let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
		}
	}

 handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
}