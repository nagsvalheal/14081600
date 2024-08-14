// This lightning web component is used for Homeicon in Thankyou msg Page
// To import Libraries
import { LightningElement } from 'lwc';
// To import Static Resources
import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbHomeIconForThankyouMsg extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	HIcon = resource.HOME_ICON;
	HIconMobile = resource.HOME_ICON_MOBILE;
	openModal;
	okay = resource.OKAY;
	leaveThisPage = resource.LEAVE_THIS_PAGE;
	cancelLabel = resource.CANCEL ;
	openhome() {
		this.openModal = true;
	}

	handleYes() {
		window.location.assign(resource.BRANDED_URL);
	}

	handleNo() {
		this.openModal = false;
	}
}