// To import libraries
import { LightningElement } from 'lwc';
// To Import Static Resources 
import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbPatientEnrollmentParent extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	footerSrc = resource.BIFOOTER_LOGO_JPEG_URL;
	logoSrc = resource.SPEVIGO_LOGO_JPEG_URL;
}