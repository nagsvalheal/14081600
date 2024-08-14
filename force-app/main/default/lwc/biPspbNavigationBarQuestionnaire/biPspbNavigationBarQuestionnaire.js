// This comppnent is used for navigating to one page to another page for all unassigned pages
// To import Libraries
import { LightningElement } from "lwc";
import { resources } from 'c/biPspLabelAndResourceGeneral';
// To import Apex Classes
//import getTaskCount from '@salesforce/apex/BI_PSPB_BellIconCount.getTaskCountUA';
import USER_DETAILS from "@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser";
import GET_CAREGIVER_ACCOUNT from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver";
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import PATIENT_STATUS from "@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus";
import COUNT_ASSESSMENT from "@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName";
import GET_PATIENT_AFTER_WEEKS from "@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks";
// To get Current UserId
import Id from "@salesforce/user/Id";

export default class BiPspbNavigationBarQuestionnaire extends LightningElement {
	accName;
	taskCount;
	patientStatusVal;
	showTreatVideo = false;
	downHeadIcon = resources.DOWN_HEAD_ICON;
	SelectIcon = resources.SELECT_ICON;
	navlogo = resources.SITE_LOGO;
	showMenu;
	showToLogin;
	HIcon = resources.HOME_ICON;
	NIcon = resources.NOTIFIC_ICON;
	MenuIcon = resources.MENU_ICON;
	NIconCol = resources.NOTIFIC_ICON_COLOR;
	CrossIcon = resources.CROSS_ICON;

	isMenuOpen;
	patientMenuList;
	caregiverMenuList;
	userName;
	showNavDetails;
	userInfo;
	currentUserIfo;
	showCareGiverMenus;
	activeData;
	caregiverDeskMenu = false;
	patientDeskMenu = false;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showChallenge;
	showSymptomTracker;
	showInformationCenter;
	showQuestionnaires;
	showHomeLine;
	showSupport;
	showCommunity;
	lastSegment;
	showPopup;
	showSupportmenu;
	showquestionnairemenu;
	showInformationCentermenu;
	showChallengesmenu;
	showCommunitymenu;
	showTabMenu;
	targetDate14;
	stwai;
	stpss;
	stdlq;
	stqsq;
	count;
	userId = Id;
	showuserSubmenu;
	userType;
	showPrescriptionmenu;
	showNotificationCentermenu;
	acutePatient = resources.ACUTE;
	brandedDevProfile = resources.BRANDED_DEV_UI_PROFILES;
	adminProfile = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfiles = resources.CAREGIVER_PROFILE;
	myProfile = resources.PATIENT_MYPROFILE_URL;
	myCaregiver = resources.MYCAREGIVER_URL;
	patientAvatar = resources.PATIENT_SELECT_AVATAR_URL;
	patientNotification = resources.PATIENT_NOTIFICATION_URL;
	unAssignedUrl = resources.UNASSIGNED_URL;
	caregiverProfile = resources.CAREGIVER_PROFILE_URL;
	patientInformation = resources.CAREGIVER_PATIENT_URL;
	selectAvatar = resources.CAREGIVER_SELECT_AVATAR_URL;
	caregiverNotification = resources.CAREGIVER_NOTIFICATION_URL;
	allPost = resources.ALLPOST_URL;
	myPost = resources.CHATTER_MYPOST;
	follower = resources.FOLLOWERS_URL;
	following = resources.FOLLOWING_URL;
	chatterSignUp = resources.CHATTER_SIGNUP_URL;
	unAssigned = resources.UNASSIGNED_LABEL;
	infoLanding = resources.INFO_LANDINGPAGE_URL;
	acuteDashboard = resources.ACUTE_DASHBOARD;
	challenges = resources.CHALLENGES_URL;
	trophy = resources.TROPHY_CASE_SITEURL;
	outStanding = resources.OUTSTANDINGPAGE_URL;
	supportCase = resources.SUPPORT_PAGE_URL;
	messageCenter = resources.MESSAGE_CENTER_URL;
	myCase = resources.MYCASE_PAGE_URL;
	summaryQues = resources.SUMMARY_URL;
	wapiCompleted = resources.WAPI_COMPLETED_SITEURL;
	dlqiCompleted = resources.DLQI_COMPLETED_SITEURL;
	pssCompleted = resources.PSS_COMPLETED_SITEURL;
	qsqOneCompleted = resources.QSQ_COMPLETED_TWOMONTHS_URL;
	qsqTwoCompleted = resources.QSQ_COMPLETED_FOURTEENWEEKS_URL;
	letPersonlize = resources.LETSPERSONALISE_URL;
	prescriptionStatus = resources.PRESCRIPTION_STATUS_URL;
	symptomLanding = resources.SYMPTOM_TRACKER_LP_URL;
	action = resources.ACTION_SITEURL;
	history = resources.HISTORY_SITEURL;
	articleCategory = resources.ARTICLE_CATEGORY_URL;
	detailedArticle = resources.DETAILED_ARTICLE_URL;
	searchResult = resources.SEARCH_RESULT_URL;
	symptomTrackerGraph = resources.SYMPTOM_TRACKER_GRAPH_URL;
	symptomTrackerMain = resources.SYMPTOM_TRACKER_MAINPAGE_URL;
	pssQuestionnaire = resources.PSORIASIS_SITEURL;
	wapiQuestionnaire = resources.WAPI_SITEURL;
	qualitativeTwo = resources.QUALITATIVE_TWOMONTHS_URL;
	qualativeFour = resources.QUALITATIVE_FOURTEENWEEKS_URL;
	medicalInformation = resources.MEDICAL_INFO_ENQUIRY_URL;
	createPost = resources.CREATEPOST_URL;
	unAssignedsite = resources.UNASSIGNED;
	acute = resources.ACUTE;
	loginUrl = resources.LOGIN;
	brandedUrl = resources.BRSITE_URL;
	secureLogout = resources.SECURE_LOGOUT;
	updateRx = resources.UPDATE_PRESCRIPTION_URL;
	loginPageUrl = resources.LOGIN_PAGE;
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	completed = resources.COMPLETED;
	expired = resources.EXPIRED;

	displayErrorPage = resources.BI_PSP_DISPLAYERRORPAGE;
	beyondGpp = resources.BI_PSP_BEYONDGPP;
	accountManager = resources.ACCOUNT_MANAGER;
	notificationCenter = resources.NOTIFICATION_CENTER;
	treatmentPresValue = resources.TREATMENT_PRES_VALUE;
	updatePrescription = resources.UPDATE_PRESCRIPTION;
	switchPatients = resources.SWITCH_PATIENTS;
	logOut = resources.LOGOUT;
	home = resources.HOME;
	informationCenter = resources.INFORMATION_CENTER;
	symptomTracker = resources.SYMPTOM_TRACKER;
	challengesLabel = resources.CHALLENGES;
	myQuestionnaire = resources.MY_QUESTIONNAIRE;
	community = resources.COMMUNITY;
	support = resources.SUPPORT;
	loginLabel = resources.LOGIN_LABEL;
	back = resources.BACK;
	myProfileLabel = resources.MY_PROFILE;
	presStatus = resources.PRES_STATUS;
	general = resources.GENERAL;
	actionRequired = resources.ACTION_REQUIRED;
	historyLabel = resources.HISTORY;
	patientInfoLabel = resources.PATIENT_INFO;
	selectAvatarLabel = resources.SELECT_AVATAR;
	notificSetting = resources.NOTIFIC_SETTING;
	supportCenterLabel = resources.SUPPORT_CENTER;
	myCaseLabel = resources.MY_CASE;
	article = resources.ARTICLES;
	patientTrtVideo = resources.PATIENT_TREATMENT_VIDEO;
	trophyCase = resources.TROPHY_CASE;
	allPosts = resources.ALL_POSTS;
	myPosts = resources.MY_POSTS;
	myFollowers = resources.MY_FOLLOWERS;
	followingLabel = resources.FOLLOWING;
	outstandingPage = resources.OUTSTANDING_PAGE;
	summary = resources.SUMMARY;
	completedQues = resources.COMPLETED_QUES;
	letsPersonalize = resources.LETS_PERSONALIZE;
	myCaregiverLabel = resources.MY_CAREGIVER;
	patientBack = resources.PATIENT_BACK;
	logoutWarning = resources.LOGOUT_WARNING;
	logoutContent = resources.LOGOUT_CONTENT;
	yes = resources.YES;
	cancel = resources.CANCEL;
	siteUrlBranded = resources.BRSITE_URL;
	displayNavErrorPage = resources.DISPLAY_NAV_ERRORPAGE;
	chronic = resources.CHRONIC_STATUS;
	spevigoArticleLabel = resources.SPEVIGO_ARTICLES;
	categoryPage = resources.CATEGORY_PAGE;

	//Qualitative Date for topbar navigation
	patientAfterThreeMonthsAndFourteenWeeks() {
		let globalThis = window;
		GET_PATIENT_AFTER_WEEKS()
			.then(data => { //Null data is handled in Apex
				if (data) {
					this.targetFourteenWeeksDate = data.targetFourteenWeeksDate ?? null;
				}
			})
			.catch(err => {
				globalThis.sessionStorage.setItem('errorMessage', err.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage);
			})
	}

	//Used to get information regarding the loggedin caregiver
	patientInfo() {
		let globalThis = window;
		GET_CAREGIVER_ACCOUNT({ userId: Id, isActive: true })
			.then((patient) => {//Null data has been handled in Apex
				this.activeData = patient.map((pat) => ({
					Id: pat.BI_PSPB_Patient__c,
					Name: pat.BI_PSPB_Patient__r.Name,
					CaregiveID: pat.BI_PSPB_Caregiver__c
				}));
				if (this.activeData.length > 0) {
					this.showCareGiverMenus = true;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage); // Catching Potential Error from Apex
			});
	}

	//Navigation

	openUpdatePrescription() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updateRx);
	}
	//Used to get the user and profile information of the current loggedin user to render the navigation bar details.

	connectedCallback() {
		let globalThis = window;
		try {
			this.getPatienStatus();
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			this.userType = typeof Id;
			const REGEX = /\/([^\\/?#]+)(?:\?.*|)$/iu;
			const MATCH = REGEX.exec(this.currentPageUrl);
			this.lastSegment = MATCH?.[1];
			if (this.lastSegment !== null && this.lastSegment !== "") {
				this.showUnderlineforMenus();
			} else {
				this.showHomeLine = true;
			}
			if (this.userType !== 'undefined') {
				USER_DETAILS()
					.then((user) => {//Nullcheck has been handled in Apex
						this.currentUserIfo = user;
						this.fetchAssessmentCount();
						if (this.currentUserIfo.BI_PSPB_Caregiver__c === true) {
							this.patientInfo();
						}
						this.userName = user.FirstName + " " + user.LastName;
						this.userInfo = user.Profile.Name;
						if (
							this.userInfo === this.adminProfile ||
							this.userInfo === this.patientProfile ||
							this.userInfo === this.caregiverProfiles
						) {
							this.showMenu = true;
							this.showNavDetails = true;
							this.showToLogin = false;
							if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
								this.caregiverDeskMenu = false;
								this.patientDeskMenu = true;
								this.patientAfterThreeMonthsAndFourteenWeeks();
							} else {
								this.caregiverDeskMenu = true;
								this.patientDeskMenu = false;
								this.patientAfterThreeMonthsAndFourteenWeeks();
							}
						} else if (this.userInfo === this.brandedDevProfile) {
							this.showMenu = false;
							this.showNavDetails = false;
							this.showToLogin = true;
						}
					})
					.catch((err) => {
						globalThis.sessionStorage.setItem('errorMessage', err.body.message);
						globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage);
					});
			} else {
				this.showMenu = false;
				this.showNavDetails = false;
				this.showToLogin = true;
			}
		} catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage);
		}
	}
	// This method is used t collect the assessment deatils.

	fetchAssessmentCount() {
		let globalThis = window;
		COUNT_ASSESSMENT()
			.then((result) => {
				if (result && result.length > 0) {
					this.count = result;
					if (
						this.count[0] !== 0 ||
						this.count[1] !== 0 ||
						this.count[2] !== 0 ||
						this.count[3] !== 0
					) {
						this.showTabMenu = true;
						this.stwai = this.count[0];
						this.stpss = this.count[1];
						this.stdlq = this.count[2];
						this.stqsq = this.count[3];
					} else {
						this.showTabMenu = false;
					}
				} else {
					this.showTabMenu = false;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage); // Catching Potential Error from Apex
				this.showTabMenu = false;
			});
	}


	showUnderlineforMenus() {
		if (this.lastSegment) {
			const questionnaireSegments = new Set([
				this.outStanding,
				this.summaryQues,
				this.dlqiCompleted,
				this.letPersonlize,
				this.pssQuestionnaire,
				this.qualitativeTwo,
				this.qualativeFour,
				this.wapiCompleted,
				this.pssCompleted,
				this.qsqOneCompleted,
				this.qsqTwoCompleted
			]);

			this.resetMenuFlags();

			if (questionnaireSegments.has(this.lastSegment)) {
				this.showQuestionnaires = true;
			}
		}
	}

	resetMenuFlags() {
		this.showChallenge = false;
		this.showInformationCenter = false;
		this.showSymptomTracker = false;
		this.showQuestionnaires = false;
		this.showHomeLine = false;
		this.showSupport = false;
		this.showCommunity = false;
	}

	//Null data won't be encountered.
	getPatienStatus() {
		let globalThis = window;
		PATIENT_STATUS({ userId: Id })
			.then((data) => {
				this.patientStatusVal = data;
				if (this.patientStatusVal === this.unAssignedsite) {
					this.showTreatVideo = true;
				} else {
					this.showTreatVideo = false;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage); // Catching Potential Error from Apex
			});
	}
	
	//Navigation for Caregiver/Patient

	userNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myProfile
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverProfile
			);
		}
	}

	//Navigation

	checkUser() {
		this.showToLogin = false;
		window.location.assign(this.baseUrl + this.brandedUrl + this.loginUrl);
	}


	openHome() {
		if (this.patientStatusVal === this.acute) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.acuteDashboard
			);
		} else {
			window.location.assign(this.baseUrl + this.unAssignedUrl);
		}
	}

	openChallenges() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.challenges);
	}
	//Navigation


	openSymptomTracker() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.symptomLanding
		);
	}



	logoutFunc() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden';
	}

	doNotLogout() {
		this.showPopup = false;
		document.body.style.overflow = '';
	}
	//This method is used for logout functionality

	logoutFromSite() {
		let globalThis = window;
		try {
			this.showPopup = false;
			let currentUrl = window.location.href;
			let urlParts = currentUrl.split("/");
			let index = urlParts.indexOf("s");
			let desiredUrl;
			if (index !== -1) {
				desiredUrl = urlParts.slice(0, index + 1).join("/");
			}
			window.location.assign(desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.brandedUrl + this.loginUrl);
		}
		catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', err.body.message);
			globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage);
		}
	}

	openMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl);
	}
	//used for rendering the components

	openMobMenu() {
		this.isMenuOpen = true;
		this.caregiverMenuList = false;
		this.patientMenuList = false;
	}

	closeMobMenu() {
		this.isMenuOpen = false;
		this.showMenu = true;

		this.showInformationCentermenu = false;
		this.showChallengesmenu = false;
		this.showquestionnairemenu = false;
		this.showCommunitymenu = false;
		this.showSupportmenu = false;
		this.showuserSubmenu = false;

		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showNotificationCentermenu = false;
		this.showPrescriptionmenu = false;
	}

	openMenuList() {
		this.caregiverMenuList = true;
		this.showMenu = false;
	}

	userMenuNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			this.caregiverMenuList = false;
			this.patientMenuList = true;
			this.showMenu = false;
			this.showuserSubmenu = false;
		} else {
			this.caregiverMenuList = true;
			this.patientMenuList = false;
			this.showMenu = false;
			this.showuserSubmenu = false;
		}
	}
	/*--Patient Profile Links--*/

	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myProfile);
	}

	openPatMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.myCaregiver
		);
	}

	openPatSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientAvatar
		);
	}

	openPatNotSettings() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientNotification
		);
	}
	/*--Patient Profile Links Ends--*/

	/*--Caregiver Profile Links--*/
	openCarMyProfile() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.caregiverProfile
		);
	}

	openCarMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientInformation
		);
	}

	openCarSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.selectAvatar
		);
	}

	openCarNotSettings() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.caregiverNotification
		);
	}


	/*--Caregiver Profile Links Ends--*/

	openSupportTwo() {
		this.showMenu = false;
		this.showSupportmenu = true;
	}
	//Used to render the components

	openQuestionsTwo() {
		this.showMenu = false;
		this.showquestionnairemenu = true;
	}

	openInformationCenterTwo() {
		this.showMenu = false;
		this.showInformationCentermenu = true;
	}

	openChallengesTwo() {
		this.showMenu = false;
		this.showChallengesmenu = true;
	}

	openCommunities() {
		this.showMenu = false;
		this.showCommunitymenu = true;
	}

	handleBack() {
		this.showMenu = true;
		this.showquestionnairemenu = false;
	}
	/*   Patient Community SubMenu */

	//Used to decide the Navigation for community chatter

	openCommunity() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {//Nulldata has been handled in Apex
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.allPost
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.chatterSignUp
					);
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage); // Catching Potential Error from Apex
			});
	}

	openMyPosts() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {//Nulldata has been handled in Apex
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.myPost
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.chatterSignUp
					);
				}
			})
			.catch((err) => {
				globalThis.sessionStorage.setItem('errorMessage', err.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage); // Catching Potential Error from Apex
			});
	}

	openMyFollowers() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {//Nulldata has been handled in Apex
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.unAssigned + this.follower
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.chatterSignUp
					);
				}
			})
			.catch((err) => {
				globalThis.sessionStorage.setItem('errorMessage', err.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage);// Catching Potential Error from Apex
			});
	}

	openFollowing() {
		let globalThis = window;
		CHECK_COMMUNITY_USERNAME({ userId: this.userId })
			.then((result) => {//Nulldata has been handled in Apex
				if (result === true) {
					window.location.assign(
						this.baseUrl + this.unAssigned + this.following
					);
				}
				if (result === false) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.chatterSignUp
					);
				}
			})
			.catch((err) => {
				globalThis.sessionStorage.setItem('errorMessage', err.body.message);
				globalThis.location?.assign(this.baseUrl + this.unAssignedUrl + this.displayNavErrorPage); // Catching Potential Error from Apex
			});
	}

	handlebackCommunity() {
		this.showMenu = true;
		this.showCommunitymenu = false;
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
	
	openInformationCenter() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.infoLanding
		);
	}
	openPTV() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.acutePatient
		);
	}

	openSupportCenter() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.supportCase
		);
	}

	openMyCases() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myCase);
	}

	openTrophycase() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.trophy);
	}
	/*showquestionnairemenu links*/
	
	openQuestions() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.outStanding
		);
	}

	openSummary() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.summaryQues
		);
	}

	openCompletedQuestionnaire() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.dlqiCompleted
		);
	}

	openLetsPersonalize() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.letPersonlize
		);
	}

	updatePrescriptionLink() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updateRx);
	}

	prescriptionStatusLink() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.prescriptionStatus
		);
	}

	openCarNotSettingsOne() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.messageCenter
		);
	}

	openSpevigoCategory() {

		if(this.patientStatusVal === this.chronic){
			window.location.assign(this.baseUrl + this.unAssignedUrl + this.categoryPage +resources.FLARE_PREVENTION_LABEL);
		}
		else{
			window.location.assign(this.baseUrl + this.unAssignedUrl +this.categoryPage + resources.FLARE_TREATMENT_LABEL)
		}
	}

	openActionRequiredNC() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.action);
	}

	openHistoryNC() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.history);
	}
	//Used to render the components

	backtoMenu() {
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
	}

	backtoMainMenu() {
		this.showMenu = true;
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showuserSubmenu = false;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}

	backtoHomeMenu() {
		this.caregiverMenuList = false;
		this.patientMenuList = false;
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
	//Used to render the components

	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.dlqiCompleted
			);
		} else if (this.stpss > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.pssCompleted
			);
		} else if (this.stwai > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.wapiCompleted
			);
		} else if (this.stqsq > 0) {
			if (this.targetFourteenWeeksDate !== null) {
				if (this.status === this.completed || this.status === this.expired) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.qsqTwoCompleted
					);
				} else {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.qsqOneCompleted
					);
				}
			} else {
				window.location.assign(
					this.baseUrl + this.unAssignedUrl + this.qsqOneCompleted
				);
			}
		}
	}
}