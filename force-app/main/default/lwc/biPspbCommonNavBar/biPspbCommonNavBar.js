//This LWC is designed for Account Manager which contains the profile details, avatar settings, notification settings and for logout functinality
//To import Libraries
import { LightningElement, wire } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceGeneral';
//To get Current UserId
import Id from '@salesforce/user/Id';
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import GET_ENROLLEE_RECORD from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
export default class BiPspbCommonNavBar extends LightningElement {
	//Variable declaration
	showToLogin;
	desiredUrl;
	showforNotLoggedIn = null;
	isCareGiver = false;
	showWithoutMenu;
	publicTermsOfUse = resources.PUBLIC_TERMS_OF_USE;
	publicPrivacyNotice = resources.PUBLIC_PRIVACY_NOTICE;
	publicContactUs = resources.PUBLIC_CONTACT_US;
	siteUrlBranded = resources.BRSITE_URL;
	systemAdmininstrator = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	siteLoginBranded = resources.LOGIN;
	secureLogout = resources.SECURE_LOGOUT;
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	openWithoutMenu;
	navLogo = resources.SITE_LOGO;
	menuIcon = resources.MENU_ICON;
	CrossIcon = resources.CROSS_ICON;
	showNavDetails;
	userInfo;
	showPopup;
	currentPageUrl;
	urlSegments;
	baseUrl;
	userType;
	beyondGppLabel = resources.BI_PSP_BEYONDGPP;
	loginLabel = resources.LOGIN_LABEL;
	logOut = resources.LOGOUT;
	logoutWarning = resources.LOGOUT_WARNING;
	logoutContent = resources.LOGOUT_CONTENT;
	displayErrorPage = resources.BI_PSP_DISPLAYERRORPAGE;
	yes = resources.YES;
	cancel = resources.CANCEL;
	displayNavErrorPage = resources.DISPLAY_NAV_ERRORPAGE;
	showSpinner = true;
	connectedCallback() {
		let globalThis = window;
		try {
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			this.userType = typeof Id;
			if (this.userType !== 'undefined') {
				USER_DETAILS()
					.then((user) => { // Null check for user record has been handled in its respective apex method.
						this.userInfo = user.Profile.Name;
						if (
							this.userInfo === this.systemAdmininstrator ||
							this.userInfo === this.patientProfile ||
							this.userInfo === this.caregiverProfile
						) {
							this.showNavDetails = true;
							this.showToLogin = false;
							this.showforNotLoggedIn = false;
						} else {
							this.showNavDetails = false;
							this.showToLogin = true;
							this.showWithoutMenu = false;
							this.showforNotLoggedIn = true;
							
						}
					})
					.catch((error) => {
						globalThis.sessionStorage.setItem('errorMessage', error.body.message);
						globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
					});

			} else {
				this.showNavDetails = false;
				this.showToLogin = true;
				this.showWithoutMenu = false;
				this.showforNotLoggedIn = true;
				this.showSpinner = false;
			}
		} catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
		}
	}


	@wire(GET_ENROLLEE_RECORD)
	wiredEnrolleeRecord({data})
	{
		let globalThis = window;
		const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
		try{
			
			if(data)
			{
				if (data[0].BI_PSP_Loginattempt__c === 1) {
					if (CURRENT_TAB_NAME === this.publicTermsOfUse ||
						CURRENT_TAB_NAME === this.publicPrivacyNotice || CURRENT_TAB_NAME === this.publicContactUs) {
						this.showforNotLoggedIn = false;
					}
					this.showforNotLoggedIn = false;
					this.showSpinner = false;
				} else {
					this.showforNotLoggedIn = true;
					this.showSpinner = false;
				}
			}
		}
		catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}


	checkUser() {
		this.showToLogin = false;
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteLoginBranded
		);
	}

	openHome() {
		if (!this.userInfo) {
			window.location.assign(this.baseUrl + this.siteUrlBranded);
		}
	}


	logoutFunc() {
		this.showPopup = true;
	}

	doNotLogout() {
		this.showPopup = false;
	}
	//This method is used for logout functionality

	logoutFromSite() {
		let globalThis = window;
		try {
			this.showPopup = false;
			let currentUrl = window.location.href;
			let urlParts = currentUrl.split('/');
			let index = urlParts.indexOf('s');
			if (index !== -1) {
				this.desiredUrl = urlParts.slice(0, index + 1).join('/');
			}
			window.location.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded + this.siteLoginBranded);
		} catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	//Used to render the components
	openMobWithoutMenu() {
		this.patientAMlist = false;
		this.openWithoutMenu = true;
	}

	closeMobMenu() {

		this.openWithoutMenu = false;
	}
}