import { LightningElement } from 'lwc';
import { resources } from 'c/biPspbResourceProfileManager';
import Id from '@salesforce/user/Id';
export default class BiPspDisplayErrorPage extends LightningElement {
	errorMessage;
	userId = Id;
	openWithoutMenu = false;
	displayNav = false;
	somethingWrong = resources.SOMETHING_WRONG;
	error = resources.ERROR;
	sorryMessage = resources.SORRY_MESSAGE;
	possibleReason = resources.POSSIBLE_REASON;
	unavailable = resources.UNAVAILABLE;
	pageNotExist = resources.PAGE_NOT_EXIST;
	technicalIssue = resources.TECHNICAL_ISSUE;
	questionContent = resources.QUESTION_CONTENT;
	reloadPage = resources.RELOAD_PAGE;
	previousPage = resources.PREVIOUS_PAGE;
	furtherAssistance = resources.FURTHER_ASSISTANCE;
	displayNavErrorPage = resources.DISPLAY_NAV_ERRORPAGE;
	beyondGppLabel = resources.BI_PSP_BEYONDGPP;
	crossIcon = resources.CROSS_ICON;
	logout = resources.LOGOUT;
	navLogo = resources.SITE_LOGO;
	menuIcon = resources.MENU_ICON;
	logoutWarning = resources.LOGOUT_WARNING;
	logoutContent = resources.LOGOUT_CONTENT;
	yes = resources.YES;
	cancel = resources.CANCEL;
	siteUrlBranded = resources.BRANDED_SITE_URL;
	siteLoginBranded = resources.LOGIN;
	secureLogout = resources.SECURE_LOGOUT;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showPopup;
	homeIcon = resources.HOME_ICON; // For Desktop
	homeIconMob = resources.HOME_ICON_MOBILE; // For Mobile
	
	handleYes() {
		window.location.assign(this.siteUrlBranded);
	}


	connectedCallback() {
		const globalThis = window;
		this.currentPageUrl = globalThis.location?.href;
		this.urlSegments = this.currentPageUrl.split("/");
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		this.detectPageUrl();
		// Retrieve data from sessionStorage when the component is connected
		this.errorMessage = globalThis.sessionStorage.getItem('errorMessage');
	}

	detectPageUrl()
	{
		let globalThis = window;
		const currentTabName = globalThis.location?.pathname.split('/').pop();
		if (currentTabName === this.displayNavErrorPage )
		{
			this.displayNav=true;
		}else{
			this.displayNav=false;
		}
	}

	
	openHome() {
		if (!this.userInfo) {
			window.location.assign(this.baseUrl + this.siteUrlBranded);
		}
	}
	
	logoutFunc() {
		this.showPopup = true;
	}
	openMobWithoutMenu() {
		this.openWithoutMenu = true;
	}

	closeMobMenu() {

		this.openWithoutMenu = false;
	}
	doNotLogout() {
		this.showPopup = false;
	}
	logoutFromSite() {
		this.showPopup = false;
		let currentUrl = window.location.href;
		let urlParts = currentUrl.split('/');
		let index = urlParts.indexOf('s');
		if (index !== -1) {
			this.desiredUrl = urlParts.slice(0, index + 1).join('/');
		}
		window.location.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded + this.siteLoginBranded);
		
	}
}