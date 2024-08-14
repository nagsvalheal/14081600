// This consolidated component is used for prepopulating a patient information
// To import Libraries
import { LightningElement } from 'lwc';
// To import Static Resources
import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbPrepopulatedFormParent extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	bgLogo = resource.BGPP;
	footerSrc = resource.BIFOOTER_LOGO_JPEG_URL;
	logoSrc = resource.SPEVIGO_LOGO_JPEG_URL;
}