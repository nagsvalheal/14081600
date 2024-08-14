// Parent component to display the caregiver information
// To import Libraries
import { LightningElement } from "lwc";
// To import Static Resources
import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbPrepopulatedCaregiverFormParent extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	//Declaration of Global variables
	footerSrc = resource.BIFOOTER_LOGO_JPEG_URL;
	logoSrc = resource.SPEVIGO_LOGO_JPEG_URL;
	bgLogo = resource.BGPP;
}