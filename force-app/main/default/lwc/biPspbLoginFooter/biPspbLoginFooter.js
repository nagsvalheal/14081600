// To design the footer with copyright text and links in the login page
// To import Libraries
import { LightningElement } from 'lwc';
import { resources } from "c/biPspLabelAndResourceGeneral";

export default class BiPspbLoginFooter extends LightningElement {
	loginCopyrights = resources.LOGIN_COPYRIGHTS;
	contactUsLab = resources.CONTACT_US_LABEL;
	termsOfUseLab = resources.TERMS_OF_USE_LABEL;
	privacyNoticeLab = resources.PRIVACY_NOTICE_LABEL;
	privacyUrl = resources.PRIVACY_NOTICE;
	termsUrl = resources.TERMS_OF_USE;
	contactUrl = resources.CONTACT_US;
	// Navigate to Privacy Notice page.
	privacyNotice() {
		window.location.assign(this.privacyUrl);
	}
	// Navigate to Contact Us page.

	contactUs() {
		window.location.assign(this.termsUrl);
	}
	// Navigate to Terms of use page.

	termsOfUse() {
		window.location.assign(this.contactUrl);
	}
}