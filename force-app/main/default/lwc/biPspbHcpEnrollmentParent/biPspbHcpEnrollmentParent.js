import { LightningElement } from "lwc";
//To import Static resources
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbHcpEnrollmentParent extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	
	beyondGpp = resource.BGPP;
	footerSrc = resource.BIFOOTER_LOGO_JPEG_URL;
	logoSrc = resource.SPEVIGO_LOGO_JPEG_URL;
}