// This component is a Header in the Site's login page
// To import Libraries
import { LightningElement } from 'lwc';
// To import Static Resources
import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbLoginHome extends LightningElement {
	// Variable Declaration
	homeIcon = resource.HOME_ICON; // For Desktop
	homeIconMob = resource.HOME_ICON_MOBILE; // For Mobile
	brandedUrl = resource.BRANDED_URL;
	handleYes() {
		window.location.assign(this.brandedUrl);
	}
	
}