import { LightningElement } from "lwc";
import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbPatientProfileParent extends LightningElement {
  notificationSetting=resources.NOTIFIC_SETTING;
	selectAvatar=resources.SELECT_AVATAR;
  myCaregiverLabel = resources.MY_CAREGIVER;
	myProfile=resources.MY_PROFILE;
  patientMyProfile = resources.PATIENT_MYPROFILE_URL;
	myCaregiver = resources.MYCAREGIVER_URL;
	patientSelectAvatar = resources.PATIENT_SELECTAVATAR_URL;
	patientNotification = resources.PATIENT_NOTIFICATION_URL;
showSpinner = true;
 openPatMyProfile() {
		window.location.assign( this.patientMyProfile);
	}
	openPatMyCaregiver() {
		window.location.assign( this.myCaregiver);
	}
	openPatSelectAvatar() {
		window.location.assign( this.patientSelectAvatar);
	}
	openPatNotSettings() {
		window.location.assign( this.patientNotification);
	}
  connectedCallback() {
    try {
      let globalThis=window;
      const currentURL = globalThis.location.href;
      
      const urlObject = new URL(currentURL); // Get the path
      const path = urlObject.pathname; // Split the path using '/' as a separator
      const pathComponents = path.split("/"); // Find the component you need (in this case, 'Branded')
      const desiredComponent = pathComponents.find((component) =>
        [resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
          component.toLowerCase()
        )
      );

      if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
        this.urlq = resources.BRANDED_URL;
      } else {
        this.urlq = resources.UNASSIGNED_URL;
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