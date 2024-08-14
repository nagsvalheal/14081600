//This LWC is designed for Account Manager which contains the profile details, avatar settings, notification settings and for logout functinality
//To import Libraries
import { LightningElement } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceGeneral';
//To get Current UserId
import Id from '@salesforce/user/Id';
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import GET_CAREGIVER_ACCOUNTS from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver';
import CHECK_COMMUNITY_USERNAME from '@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername';
import RETURN_THE_ACCOUNTS from '@salesforce/apex/BI_PSPB_EnrollmentUtilities.getEnrolleeCaregiver';
import PATIENT_ACCOUNT_RETURN from '@salesforce/apex/BI_PSP_CurrentUser.returnTheAccounts';

export default class BiPspbHomeBanner extends LightningElement {
	showSpinner = true;
	showToLogin;
	accounts;
	enrolleRec;
	activeData;
	desiredUrl;
	loginAttempt;
	showWithoutMenu;
	article = resources.ARTICLES;
	myCase = resources.MY_CASE;
	allPost = resources.ALL_POSTS;
	myPost = resources.MY_POSTS;
	supportCenter = resources.SUPPORT_CENTER;
	myFollowers = resources.MY_FOLLOWERS;
	following = resources.FOLLOWING;
	outstandingQues = resources.OUTSTANDING_PAGE;
	summary = resources.SUMMARY;
	completedQues = resources.COMPLETED_QUES;
	patientBack = resources.PATIENT_BACK;
	extra = resources.EXTRA;
	letsPersonalize = resources.LETS_PERSONALIZE;
	logoutWarning = resources.LOGOUT_WARNING;
	logoutContent = resources.LOGOUT_CONTENT;
	cancel = resources.CANCEL;
	yes = resources.YES;
	back = resources.BACK;
	notificationCenter = resources.NOTIFICATION_CENTER;
	prescriptionStatus = resources.PRES_STATUS;
	generel = resources.GENERAL;
	careBack = resources.CARE_BACK;
	tropyCase = resources.TROPHY_CASE;
	patientTreatment = resources.PATIENT_TREATMENT_VIDEO;
	actionRequired = resources.ACTION_REQUIRED;
	history = resources.HISTORY;
	welcome = resources.WELCOME;
	welcomeMsg = resources.WELCOME_MSG;
	iamHcp = resources.IAM_HCP;
	iamPatient = resources.IAM_PATIENT;
	login = resources.LOGIN_LABEL;
	logout = resources.LOGOUT;
	home = resources.HOME;
	challange = resources.CHALLENGES;
	community = resources.COMMUNITY;
	support = resources.SUPPORT;
	myQuestionaire = resources.MY_QUESTIONNAIRE;
	symptomTracker = resources.SYMPTOM_TRACKER;
	infoCenter = resources.INFORMATION_CENTER;
	switchPatient = resources.SWITCH_PATIENTS;
	myCaregiver = resources.MY_CAREGIVER;
	myProfile = resources.MY_PROFILE;
	patientInformation = resources.PATIENT_INFO;
	selectAvatar = resources.SELECT_AVATAR;
	accountManager = resources.ACCOUNT_MANAGER;
	notificationSetting = resources.NOTIFIC_SETTING;
	updatePrescription = resources.UPDATE_PRESCRIPTION;
	treatmentReminder = resources.TREATMENT_PRES_VALUE;
	beyandGpp = resources.BI_PSP_BEYONDGPP;
	loginPageUrl = resources.LOGIN_PAGE;
	siteUrlBranded = resources.BRSITE_URL;
	siteChallengesUrlBranded = resources.CHALLENGES_URL;
	systemAdmininstrator = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	siteUrlAllPost = resources.ALLPOST_URL;
	siteUrlchatterSignUp = resources.CHATTER_SIGNUP_URL;
	siteUrlinfoCenterLandingPage = resources.INFO_LANDINGPAGE_URL;
	siteTrophyCaseUrlBranded = resources.TROPHY_CASE_SITEURL;
	siteSymptomTrackerLpBranded = resources.SYMPTOM_TRACKER_LP_URL;
	siteLoginBranded = resources.LOGIN;
	siteOutstandingQuestionnaireBranded = resources.OUTSTANDINGPAGE_URL;
	siteSupportPageBranded = resources.SUPPORT_PAGE_URL;
	healthCareProviderUrl = resources.IAMHCPSITE_URL;
	patientUrl = resources.IAMPATIENTSITE_URL;
	chronicPatientUrl = resources.CHRONICVIDEOPAGE_URL;
	myCasesPageUrl = resources.MYCASE_PAGE_URL;
	myPostSiteUrl = resources.CHATTER_MYPOST;
	followerSiteUrl = resources.FOLLOWERS_URL;
	followingSiteUrl = resources.FOLLOWING_URL;
	summaryPageSiteUrl = resources.SUMMARY_URL;
	letsPersonaliseUrl = resources.LETSPERSONALISE_URL;
	secureLogout = resources.SECURE_LOGOUT;
	reminderPageUrl = resources.REMINDERSITE_URL;
	updatePrescriptionUrl = resources.UPDATE_PRESCRIPTION_URL;
	prescriptionStatusUrl = resources.PRESCRIPTION_STATUS_URL;
	messageCenterUrl = resources.MESSAGE_CENTER_URL;
	actionUrl = resources.ACTION_SITEURL;
	historyUrl = resources.HISTORY_SITEURL;
	wapiCompletedQuestionUrl = resources.WAPI_COMPLETED_SITEURL;
	dlqiCompletedQuestionUrl = resources.DLQI_COMPLETED_SITEURL;
	pssCompletedQuestionUrl = resources.PSS_COMPLETED_SITEURL;
	qsq1CompletedQuestionnaire = resources.QSQ_COMPLETED_TWOMONTHS_URL;
	qsq2CompletedQuestionnaire = resources.QSQ_COMPLETED_FOURTEENWEEKS_URL;
	patientMyProfileUrl = resources.PATIENT_MYPROFILE_URL;
	caregiverProfileUrl = resources.CAREGIVER_PROFILE_URL;
	myCaregiverUrl = resources.MYCAREGIVER_URL;
	patientSelectAvatarUrl = resources.PATIENT_SELECT_AVATAR_URL;
	patientNotificationUrl = resources.PATIENT_NOTIFICATION_URL;
	caregiverPatientUrl = resources.CAREGIVER_PATIENT_URL;
	caregiverSelectAvatarUrl = resources.CAREGIVER_SELECT_AVATAR_URL;
	caregiverNotificationUrl = resources.CAREGIVER_NOTIFICATION_URL;
	dashboardPageurl = resources.DASHBOARD_SITEURL;
	BGpp = resources.BEYOND_GPP;
	downHeadIcon = resources.DOWN_HEAD_ICON;
	bannerImgae = resources.BANNER_IMG;
	selectIcon = resources.SELECT_ICON;
	completed = resources.COMPLETED;
	expired = resources.EXPIRED;
	displayNavErrorPage = resources.DISPLAY_NAV_ERRORPAGE;
	displayErrorPage = resources.BI_PSP_DISPLAYERRORPAGE;
	caregiverAMlist;
	isMenuOpen;
	openwithoutMenu;
	patientDashboardPage;
	navLogo = resources.SITE_LOGO;
	showMenu;
	NIcon = resources.NOTIFIC_ICON;
	MenuIcon = resources.MENU_ICON;
	NIconCol = resources.NOTIFIC_ICON_COLOR;
	crossIcon = resources.CROSS_ICON;
	showNavDetails;
	primaryLandingPage;
	userName;
	caregiver;
	patient;
	userInfo;
	currentUserIfo;
	patientOrCare;
	showCareGiverMenus;
	caregiverDeskMenu = false;
	patientDeskMenu = false;
	showPopup;
	showCommunitymenu;
	showChallengesmenu;
	showSupportmenu;
	showInformationCentermenu;
	showQuestionnaireMenu;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showuserSubmenu;
	showPrescriptionmenu;
	showNotificationCentermenu;
	showforNotLoggedIn;
	userType;

	//Used to get information regarding the loggedin caregiver
	patientInfo() {
		let globalThis = window;
		GET_CAREGIVER_ACCOUNTS({ userId: Id, isActive: false })
			.then((patient) => {//Null check has been handled in the respective apex method.
				this.activeData = patient;
				if (this.activeData.length > 0) {
					this.showCareGiverMenus = true;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});
	}

	receivedloginvalue(event) {
		this.loginAttempt = event.detail;
		if (this.loginAttempt === 0) {
			this.showWithMenu = false;
			this.showWithoutMenu = true;
			this.showToLogin = false;
			this.showMenu = false;
			this.showforNotLoggedIn = false;
		}
	}
	//Used to get the user and profile information of the current loggedin user to render the components according to the details.

	connectedCallback() {
		let globalThis = window;
		try {
			this.userType = typeof Id;
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			if (this.userType !== 'undefined') {
				USER_DETAILS()
					.then((user) => { // Null check for user record has been handled in its respective apex method.
						this.currentUserIfo = user;

						if (this.currentUserIfo.BI_PSPB_Caregiver__c === true) {
							this.patientInfo();
						}
						this.userName = user.FirstName + '' + user.LastName;
						this.userInfo = user.Profile.Name;
						if (
							this.userInfo === this.systemAdmininstrator ||
							this.userInfo === this.patientProfile ||
							this.userInfo === this.caregiverProfile
						) {
							
							// this.loadEnrolleeRecords();
							this.showMenu = true;
							this.showNavDetails = true;
							this.patientDashboardPage = true;
							this.showWithMenu = false;
							if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
								this.loadAccountsOfPatients();
								this.showWithMenu = true;
								this.patientOrCare = true;
								this.caregiverDeskMenu = false;
								this.patientDeskMenu = true;
								this.showWithoutMenu = false;
								this.showforNotLoggedIn = false;

							} else {
								this.loadAccounts();
								this.patientOrCare = false;
								this.caregiverDeskMenu = true;
								this.patientDeskMenu = false;
								this.showWithoutMenu = true;
								this.showWithMenu = false;
								this.showforNotLoggedIn = false;

							}
							this.primaryLandingPage = false;
							this.showToLogin = false;
							this.showforNotLoggedIn = false;
						} else {
							this.showMenu = false;
							this.showNavDetails = false;
							this.patientDashboardPage = false;
							this.primaryLandingPage = true;
							this.showToLogin = true;
							this.showWithoutMenu = false;
							this.showWithMenu = false;
							this.showforNotLoggedIn = true;
						}
					})
					.catch((error) => {
						globalThis.sessionStorage.setItem('errorMessage', error.body.message);
						globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
					});
			} else {
				this.showMenu = false;
				this.showNavDetails = false;
				this.patientDashboardPage = false;
				this.primaryLandingPage = true;
				this.showToLogin = true;
				this.showWithoutMenu = false;
				this.showWithMenu = false;
				this.showforNotLoggedIn = true;
				this.showSpinner = false;
			}
		}
		catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
		}
	}

	loadAccounts() {
        let globalThis = window;

        RETURN_THE_ACCOUNTS()
            .then((data) => {
                if (data && data.length > 0) {
                    this.accounts = data[0];
                }
            })
            .catch((error) => {
                // Handle error or show an error message
                globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
            });
    }

	loadAccountsOfPatients() {
        let globalThis = window;
        PATIENT_ACCOUNT_RETURN()
            .then((data) => {
                if (data && data.length > 0) {
                    this.accounts = data[0];
                }
            })
            .catch((error) => {
                // Handle error or show an error message
                globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
            });
    }
		

	checkUser() {
		this.showToLogin = false;
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteLoginBranded);
	}
	//Used to decide the Navigation for community chatter
	openCommunity() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {// Null check has been handled in its respective apex method
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.siteUrlAllPost
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
					);
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});
	}
	

	//Navigation

	openChallenges() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteChallengesUrlBranded
		);
	}
	openTrophycase() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteTrophyCaseUrlBranded
		);
	}
	//Used to render the components
	openChallengesMenu() {
		this.showMenu = false;
		this.showChallengesmenu = true;
	}
	handlebackChallenges() {
		this.showMenu = true;
		this.showChallengesmenu = false;
	}
	handlebackSupport() {
		this.showMenu = true;
		this.showSupportmenu = false;
	}
	handlebackInformationCenter() {
		this.showMenu = true;
		this.showInformationCentermenu = false;
	}
	handleback() {
		this.showMenu = true;
		this.showQuestionnaireMenu = false;
	}
	//Navigation
	openSymptomTracker() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteSymptomTrackerLpBranded
		);
	}

	userNavigationMyCaregiver() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.myCaregiverUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverPatientUrl
			);
		}
	}
	userNavigationSelectAvatar() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.patientSelectAvatarUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverSelectAvatarUrl
			);
		}
	}
	userNavigationNotSettings() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.patientNotificationUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverNotificationUrl
			);
		}
	}
	//Navigation
	openUpdatePrescription() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.updatePrescriptionUrl
		);
	}

	openHome() {
		if (!this.userInfo) {
			window.location.assign(this.baseUrl + this.siteUrlBranded);
		}
	}

	//Used to render the components
	openCommunities() {
		this.showMenu = false;
		this.showCommunitymenu = true;
	}
	openInformationCenter2() {
		this.showMenu = false;
		this.showInformationCentermenu = true;
	}
	handlebackCommunity() {
		this.showMenu = true;
		this.showCommunitymenu = false;
	}
	//Used to render the components
	openSupport2() {
		this.showMenu = false;
		this.showSupportmenu = true;
	}
	openQuestions2() {
		this.showMenu = false;
		this.showQuestionnaireMenu = true;
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
			globalThis.location?.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded + this.siteLoginBranded);
		} catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
		}

	}

	//Navigation
	openMyProfile() {
		window.location.assign(this.baseUrl + this.siteUrlBranded);
	}
	openHCPpage() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.healthCareProviderUrl);
	}
	openPATpage() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientUrl
		);
	}
	//Used to render the components
	openMobMenu() {
		this.isMenuOpen = true;
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.openwithoutMenu = false;
	}
	openMobWithoutMenu() {
		this.isMenuOpen = false;
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.openwithoutMenu = true;
	}
	closeMobMenu() {
		this.isMenuOpen = false;
		this.showMenu = true;
		this.openwithoutMenu = false;
	}
	openAMlist() {
		this.caregiverAMlist = true;
		this.showMenu = false;
		this.openwithoutMenu = false;
	}
	userMenuNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			this.caregiverAMlist = false;
			this.patientAMlist = true;
			this.showMenu = false;
			this.showuserSubmenu = false;
			this.openwithoutMenu = false;
		} else {
			this.caregiverAMlist = true;
			this.patientAMlist = false;
			this.showMenu = false;
			this.showuserSubmenu = false;
			this.openwithoutMenu = false;
		}
	}
	/*--Patient Profile Links--*/
	openPatMyProfile() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl
		);
	}
	openPatMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.myCaregiverUrl
		);
	}
	openPatSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientSelectAvatarUrl
		);
	}
	openPatNotSettings() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientNotificationUrl
		);
	}
	/*--Patient Profile Links Ends--*/

	/*--Caregiver Profile Links--*/
	openCarMyProfile() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl
		);
	}
	openCarMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverPatientUrl
		);
	}
	openCarSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverSelectAvatarUrl
		);
	}
	openCarNotSettings() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverNotificationUrl
		);
	}
	/*--Caregiver Profile Links Ends--*/
	openInformationCenter() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteUrlinfoCenterLandingPage
		);
	}
	openPTV() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.chronicPatientUrl
		);
	}
	openSupportCenter() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteSupportPageBranded
		);
	}
	openMyCases() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.myCasesPageUrl
		);
	}

	//Used to navigate the components in community according to thr username
	openMyPosts() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {// Null check has been handled in its respective apex method
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.myPostSiteUrl
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
					);
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});
	}
	//Used to navigate the components in community according to thr username
	openMyFollowers() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {// Null check has been handled in its respective apex method
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.followerSiteUrl
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
					);
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});
	}
	//Used to navigate the components in community according to thr username
	openFollowing() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {// Null check has been handled in its respective apex method
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.followingSiteUrl
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
					);
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayNavErrorPage);
			});
	}
	//Navigation
	openQuestions() {
		window.location.assign(
			this.baseUrl +
			this.siteUrlBranded +
			this.siteOutstandingQuestionnaireBranded
		);
	}
	opensummary() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.summaryPageSiteUrl
		);
	}
	opencompletedquestionnaire() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.dlqiCompletedQuestionUrl
		);
	}
	openletspersonalize() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.letsPersonaliseUrl
		);
	}
	openTreatmentRemaindersLink() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.reminderPageUrl
		);
	}

	prescriptionStatusLink() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.prescriptionStatusUrl
		);
	}
	openGeneralNC() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.messageCenterUrl
		);
	}
	openActionRequiredNC() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.actionUrl);
	}
	openHistoryNC() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.historyUrl
		);
	}
	//Used to render the components
	backtoMenu() {
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
	}
	backtoMainMenu() {
		this.showMenu = true;
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.showuserSubmenu = false;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}
	backtohomeMenu() {
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}
	openUserDetailmenu() {
		this.showMenu = false;
		this.showuserSubmenu = true;
	}
	openUpdatePrescriptionMenu() {
		this.showPrescriptionmenu = true;
		this.showuserSubmenu = false;
		this.showMenu = false;
	}
	openNotificationCenterMenu() {
		this.showNotificationCentermenu = true;
		this.showuserSubmenu = false;
		this.showMenu = false;
	}
	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + this.dlqiCompletedQuestionUrl);
		} else if (this.stpss > 0) {
			window.location.assign(this.urlq + this.pssCompletedQuestionUrl);
		} else if (this.stwai > 0) {
			window.location.assign(this.urlq + this.wapiCompletedQuestionUrl);
		} else if (this.stqsq > 0) {
			if (this.target14wksdate !== null) {
				if (this.status === this.completed || this.status === this.expired) {
					window.location.assign(
						this.urlq + this.qsq2CompletedQuestionnaire
					);
				} else {
					window.location.assign(this.urlq + this.qsq1CompletedQuestionnaire);
				}
			} else {
				window.location.assign(this.urlq + this.qsq1CompletedQuestionnaire);
			}
		}
	}
}