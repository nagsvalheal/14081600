// This lightning web component is used for Homeicon 
// To import Libraries
import { LightningElement } from 'lwc';
// To import Static Resources
import { resource } from "c/biPspbEnrollmentFormResource";
// To Import Custom Labels
export default class BiPspbHomeIconParent extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	leaveThisPage = resource.LEAVE_THIS_PAGE;
	changeMade = resource.CHANGE_MADE;
	okay = resource.OKAY;
	cancelLabel = resource.CANCEL ;
	home_Icon = resource.HOME_ICON;
	home_Icon_Mobile = resource.HOME_ICON_MOBILE;
	openModal;

	openHome() {
		this.openModal = true;
	}

	handleYes() {
		window.location.assign(resource.BRANDED_URL);
	}

	handleNo() {
		this.openModal = false;
	}
}