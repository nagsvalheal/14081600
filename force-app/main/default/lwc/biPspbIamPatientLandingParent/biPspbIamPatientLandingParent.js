import { LightningElement } from 'lwc';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
import {label} from 'c/biPspbAvatarResources';

//To import Custom lable

export default class BiPspbIamPatientLandingParent extends LightningElement {
	Brandedsiteurl = label.BRANDED_SITEURL;
	patientEnrollemetUrl = label.PATIENTENROLLMENT;
	BGpp = label.BGpp;
	patientBannerIcon=label.PATIENT_BANNER_ICON;
	beyondGpp=label.BEYOND_GPP;
	securityIcon=label.SECURITY_ICON;
	displayIcon=label.DISPLAY_ICON;
	demoVideoIcon=label.DEMO_VIDEO_ICON;
	selfDiscoveryIcon=label.SELF_DISCOVERY_ICON;
	articlesIcon=label.ARTICLES_ICON;
	calendarIcon=label.CALENDAR_ICON;
	infoCenterIcon=label.INFORMATION_ICON;
	enrollPsp=label.ENROLL_PSP;
	mobilepic = label.MOBILE;
	stayTrack=label.STAY_TRACK;
	infoCenter=label.INFO_CENTER;
	symptomTracker=label.SYMPTOM_TRACKER;
	learnAndExplore=label.LEARN;
	knowledgeHub=label.KNOWLEDGE;
	unique=label.UNIQUE;
	visualLearning=label.VISUAL_LEARNING;
	personalisedDashboard=label.PERSONALISED_DASHBOARD;
	enrollSpevigo=label.ENROLL_SPEVIGO;
	patientBannerDesktop=label.PATIENT_BANNER_DESKTOP;
	patientBanner = label.PATIENT_BANNER;
	patientIconCalender = label.PATIENT_ICON_CALENDER;
	patientIconCenter = label.PATIENT_ICON_CENTER;
	patientIconSecurity  = label.PATIENT_ICON_SECURITY;
	patientFeatureBanner = label.PATIENT_FEATURE_BANNER;
	patientIconEarn = label.PATIENT_ICON_EARN;
	patientIconHub = label.PATIENT_ICON_HUB;
	patientIconUnique = label.PATIENT_ICON_UNIQUE;
	patientIconVisual = label.PATIENT_ICON_VISUAL;
	showSpinner = true;
	get displayBackgroundImage() {
		return `background-image: url('${this.patientBannerDesktop}');background-size: cover; background-repeat: no-repeat;`;
		
	}
	openPAENpage() {
		window.location.assign(this.patientEnrollemetUrl);
	}
	handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
}