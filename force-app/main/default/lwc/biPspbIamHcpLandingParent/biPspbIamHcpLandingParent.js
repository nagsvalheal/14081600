import { LightningElement } from 'lwc';
// Imports resourceUrl to reference external resources for proper rendering and functionality.

// Imports NavigationMixin for seamless component navigation between views/pages.
import { NavigationMixin } from 'lightning/navigation';
//To import Custom lable
import {label} from 'c/biPspbAvatarResources';
export default class BiPspbIamHcpLandingParent extends NavigationMixin(LightningElement)
{
	showSpinner=true;
	BGpp = label.BGpp;
	//showSpinner=true;
	gppJourney=label.GPP_JOURNEY;
	beyondGpp=label.BEYOND_GPP;
	personalisedIcon=label.PERSONALISED_ICON
	discoveryIcon=label.RESOURCES_ICON;
	videolearningIcon=label.VIDEO_LEARNING_ICON;
	hcpBanner=label.HCP_BANNER_ICON;
	encourageLearningIcon=label.ENCOURAGE_ICON;
	enrollPatient=label.ENROLL_PATIENT;
	downloadForm=label.DOWNLOAD_FORM;
	helpPatients=label.HELP_PATIENTS;
	encourageLearning=label.ENCOURAGE_LEARNING;
	accessResources=label.ACCESS_RESOURCES;
	videoLearning=label.VIDEO_LEARNING;
	personalised=label.PERSONALISED;
	supportJourney=label.SUPPORT_JOURNEY;
	hcpBannerImage = label.HCP_BANNER_IMAGE;
	patientIconCalender = label.PATIENT_ICON_CALENDER;
	patientIconCenter = label.PATIENT_ICON_CENTER;
	patientIconSecurity = label.PATIENT_ICON_SECURITY;
	hcpFeatureBanner= label.HCP_FEATURE_BANNER;
	patientIconEarn = label.PATIENT_ICON_EARN;
	patientIconHub = label.PATIENT_ICON_HUB;
	patientIconUnique = label.PATIENT_ICON_UNIQUE;
	patientIconVisual= label.PATIENT_ICON_VISUAL;
	iamHcpIconChat= label.IAM_HCP_ICON_CHAT;
	iamHcpIconYoutube= label.IAM_HCP_ICON_YOUTUBE;
	iamHcpIconBooks= label.IAM_HCP_ICON_BOOKS;
	hcpEnrollemetUrl = label.HCP_ENROLLEMENT;
	handleDownload() {
		this.showSpinner=false;
		const globalThis = window;
		globalThis.open(label.PATIENT_ENROLMENT_FROM);
		return null;
	}

	get displayBackgroundImage() {
		
		return `background-image: url('${label.HCP_BANNER_DESKTOP}');background-size: cover; background-repeat: no-repeat;`;
	}

	openHCPpage() {
    const globalThis = window;
    globalThis.location.href =  this.hcpEnrollemetUrl;
}
 handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
}