// This component is consolidate component used for avatar,message and prepopulate form.
//To import Libraries
import { LightningElement,  } from 'lwc';
//To import Static Resource
import { resource } from "c/biPspbEnrollmentFormResource";


export default class BiPspbPrepopulatedSummaryParent extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @track
	verifyComplete =resource.VERIFY_COMPLETE;
	allSet = resource.ALL_SET;
	caregiverValue = false;
	// Declaration of Global variables
	beyandGpp = resource.BGPP;
	footerSrc = resource.BIFOOTER_LOGO_JPEG_URL;
	LogoSrc = resource.SPEVIGO_LOGO_JPEG_URL;
	selectedAvatarSrc = resource.OLD_GUY_JPEG_URL;
	selectAvatar = resource.CAREGIVER_IMG;
	//To change avatar content based on patient
	avatarvalue(event) {
		this.caregiverValue = event.detail;

	}

}