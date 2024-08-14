/**This Lightning web component helps to display the active challenges that has been chosen by the user**/
//To import Libraries
import { LightningElement, wire, api } from "lwc";
import { resources } from "c/biPspLabelAndResourceChallenges";
import * as label from 'c/biPspbLabelAndResourceSymptom';
//To import Apex Classes
import GET_INDIVIDUAL_CHALLENGES from "@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges";
import COUNT_ASSESSMENT from "@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName";
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';


export default class BiPspbActiveChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	@api activechallengeid;
	@api challengeidtoupdate;
	levelOne = resources.CHALLENGE_LEVEL_ONE;
	levelTwo = resources.CHALLENGE_LEVEL_TWO;
	challengeBookworm = resources.CH_BOOK_WORM;
	siteUrlBranded = resources.BR_SITE_URL;
	gppArticle = resources.IC_LANDING_PAGE;
	beingActive = resources.WHY_BEING_ACTIVE;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;
	brandedUrl = resources.BRANDED_URL;
	unAssignedUrl = resources.UN_ASSIGNED_URL_NAVI;
	brSiteUrl = resources.BR_SITE_URL;
	unAssignedUrlNavi = resources.UNASSIGNED_URL;
	brWapiQuestionnaire = resources.BR_WAPI_QUESTIONNAIRE;
	pssQuestionnaire = resources.PSS_QUESTIONNAIRE;
	dlqiQuestonnaire = resources.DLQI_QUESTIONNAIRE;
	challengeLevelThree = resources.CHALLENGE_LEVEL_THREE;
	trackYourGppLable = resources.TRACK_YOUR_GPP_LABEL;
	dlqiCompletedUrl = resources.BRDLQICOMPLETEDURL;
	biPspbWapiCompletedQuestionnaire = resources.BRWAPICOMPLETEDURL;
	brCompletedUrl = resources.BRPSSCOMPLETEDURL;
	viewLable = resources.VIEW_LABEL;
	beingActiveLink = resources.BEING_ACTIVE;
	trackYourAns = resources.TRACK_YOUR_ANSWER;
	linkArticle = resources.LINKARTICLE;
	gppWrkLifeLink = resources.GPPWORKLIFELINK;
	gppSymptomsLink = resources.GPPSYMPTOMSLINK;
	gppQualityLifeLink = resources.GPPQUALITYLIFELINK;
	questionnairelink = resources.QUESTIONNAIRELINK;
	completeChallengeButton = resources.COMPLETECHALLENGEBUTTON;
	managerYourGpp = resources.MANAGEYOURGPP;
	symptomValue = resources.SYMPTOMTRACKER;

	title;
	gppdivpsslevelone = false;
	level;
	description;
	rewardPoints;
	linktoArticle;
	whyBeingActive;
	image;
	urlq;
	otherChallenges;
	quesChallenges;
	trackYourGppDivWpai;
	trackYourGppDivPss;
	trackYourGppDivDlqi;
	titlear;
	gppDivWpaiCompletedUrl;
	gppDivWpaiUrl;
	gppdivpssleveltwo = false;
	gppDivPssCompletedUrl;
	gppDivPssUrl
	dlqilevelthree = false;
	dlqiCompUrl;
	dlqiUrl;
	manageYourGppLink;
	manageYourGppLevelTwo;

	//This wire method is used to get the individual challenges with the help of active challenges id
	@wire(GET_INDIVIDUAL_CHALLENGES, { challengeId: "$activechallengeid" })
	wiredAccount({ error, data }) {
		let globalThis = window;
		try {
			if (data) {
				this.processData(data[0]);
			}
			else if (error) {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			}
		} catch (err) {
			globalThis.sessionStorage.setItem("errorMessage", err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	processData(data) {
		if (data.Name) {
			this.setTitleAndLevel(data);
			this.setChallengeVisibility();
		}
		if (data.HealthCloudGA__Description__c) {
			this.description = data.HealthCloudGA__Description__c.replace(/<[^<>]+>/gu, "");


		}
		if (data.BI_PSP_Challenge_Reward_Points__c) {
			this.rewardPoints = data.BI_PSP_Challenge_Reward_Points__c;
		}
		if (data.BI_PSP_Challenge_Image__c) {
			this.setImage(data.BI_PSP_Challenge_Image__c);
		}
	}

	setTitleAndLevel(data) {
		this.title = data.Name;
		this.level = data.BI_PSP_Challenge_Level__c;


	}

	setChallengeVisibility() {
		const isBookworm = this.title.includes(this.challengeBookworm);
		const isGpp = this.title.includes(this.trackYourGppLable);
		const ismgpp = this.title.includes(this.managerYourGpp);


		this.resetVisibility();

		if (isBookworm) {
			if (this.level === this.levelOne) {
				this.linktoArticle = true;
				this.otherChallenges = true;
			} else if (this.level === this.levelTwo) {
				this.whyBeingActive = true;
				this.otherChallenges = true;
			}
		} else if (isGpp) {
			this.quesChallenges = true;
			if (this.level === this.levelOne) {

				this.trackYourGppDivWpai = true;

			} else if (this.level === this.levelTwo) {
				this.trackYourGppDivPss = true;
			} else if (this.level === this.challengeLevelThree) {
				this.trackYourGppDivDlqi = true;
			}

		}

		else if (ismgpp) {

			if (this.level === this.levelOne) {

				this.manageYourGppLink = true;
				this.otherChallenges = true;
			}
			else if (this.level === this.levelTwo) {

				this.manageYourGppLevelTwo = true;
				this.otherChallenges = true;
			} else if (this.level === this.challengeLevelThree) {

				this.otherChallenges = true;
			}


		}
		else {
			this.otherChallenges = true;
		}
	}

	resetVisibility() {
		this.whyBeingActive = false;
		this.linktoArticle = false;
		this.otherChallenges = false;
		this.quesChallenges = false;
		this.trackYourGppDivWpai = false;
		this.trackYourGppDivPss = false;
		this.trackYourGppDivDlqi = false;
		this.manageYourGppLink = false;
		this.manageYourGppLevelTwo = false;
	}

	setImage(image) {
		const desiredWidth = "135px";
		const desiredHeight = "70px";
		const imgTagRegex = /<img\s+[^>]*?src="([^"]+)"[^>]*>/giu;


		this.image = image.replace(
			imgTagRegex,
			(match, src) =>
				`<img src="${src}" alt="${resources.ALTVALUE}"  width="${desiredWidth}" height="${desiredHeight}">`
		);
	}
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data }) {
		let globalThis = window;
		try {
			if (data) {
				this.count = data;
				//assigning data values to the variables
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
				this.updateNewVar();
			}
		} catch (err) {
			globalThis.sessionStorage.setItem("errorMessage", err.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			);
		}
	}

	connectedCallback() {
		let globalThis = window;
		try {
			const currentURL = window.location.href;
			const urlObject = new URL(currentURL);
			const path = urlObject.pathname;
			const pathComponents = path.split("/");
			const desiredComponent = pathComponents.find((component) =>
				[this.brandedUrl, this.unAssignedUrl].includes(component)
			);

			if (desiredComponent === this.brandedUrl) {
				this.urlq = this.brSiteUrl;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}


			this.gppDivWpaiCompletedUrl = this.biPspbWapiCompletedQuestionnaire;
			this.gppDivWpaiUrl = this.brWapiQuestionnaire;

			this.gppDivPssCompletedUrl = this.brCompletedUrl;
			this.gppDivPssUrl = this.pssQuestionnaire;

			this.dlqiCompUrl = this.dlqiCompletedUrl;
			this.dlqiUrl = this.dlqiQuestonnaire;






		} catch (err) {
			globalThis.sessionStorage.setItem("errorMessage", err.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			);
		}
	}

	updateNewVar() {
		if (this.stwai > 0) {

			this.gppdivpsslevelone = true;

		}
		else {
			this.gppdivpsslevelone = false;
		}
		if (this.stpss > 0) {

			this.gppdivpssleveltwo = true;

		}
		else {
			this.gppdivpssleveltwo = false;

		}
		if (this.stdlq > 0) {
			this.dlqilevelthree = true;

		}
		else {

			this.dlqilevelthree = false;

		}
	}

	//Used for challenge cancel functionality
	aftercancel() {
		const messageEvent = new CustomEvent("cancelchallenge", {
			detail: {
				activechallengeid: this.activechallengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}
	//Used for challenge complete functionality
	afterComplete() {
		const messageEvent = new CustomEvent("completechallenge", {
			detail: {
				activechallengeid: this.activechallengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}
	//Used for navigating to articles
	openArticles() {
		let globalThis = window;
		UPDATE_REACTION({
			articleName: this.gppArticle,
			reaction: this.viewLable
		})
			.then(() => {
				this.titlear = this.viewLable + ": " + this.gppArticle;
				window.location.assign(this.gppArticle);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message);
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			});
	}
	openArticlesActive() {
		let globalThis = window;
		UPDATE_REACTION({
			articleName: this.beingActive,
			reaction: this.viewLable
		})
			.then(() => {
				this.titlear = this.viewLable + ": " + this.beingActive;
				window.location.assign(this.urlq + this.beingActive);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message);
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			});
	}

	openSymptom() {
		window.location.assign(this.urlq + label.SYMPTOM_MAIN_PAGE_URL);
	}
}