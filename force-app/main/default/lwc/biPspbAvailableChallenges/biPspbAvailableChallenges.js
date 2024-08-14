//This lightning web component helps the user to see the available challenges and gives the ability to make them as active challenge
//To import Libraries
import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { resources } from "c/biPspLabelAndResourceChallenges";
import * as label from 'c/biPspbLabelAndResourceSymptom';

//To import Apex Classes
import INDIVIDUALSCHALLENGES from "@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges";
import COUNT_ASSESMENT from "@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName";
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
//To import Custom labels



export default class BiPspbAvailableChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Expose properties to parent components
	@api challengeid;
	@api challengeidtoupdate;
	levelOne = resources.CHALLENGE_LEVEL_ONE;
	levelTwo = resources.CHALLENGE_LEVEL_TWO;
	challengeBookworm = resources.CH_BOOK_WORM;
	siteUrlBranded = resources.BRSITE_URL;
	gppArticle = resources.IC_LANDING_PAGE;
	beingActive = resources.WHY_BEING_ACTIVE;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;

	beingActiveLink = resources.BEING_ACTIVE;
	trackYourAns = resources.TRACK_YOUR_ANSWER;
	linkArticle = resources.LINKARTICLE;
	gppWrkLifeLink = resources.GPPWORKLIFELINK;
	gppSymptomsLink = resources.GPPSYMPTOMSLINK;
	gppQualityLifeLink = resources.GPPQUALITYLIFELINK;
	questionnairelink = resources.QuestonnaireValue;
	acceptChallengeButton = resources.ACCEPTCHALLENGEBUTTON;
	managerYourGpp = resources.MANAGEYOURGPP;
	symptomValue = resources.SYMPTOMTRACKER;
	// Declare properties to store challenge details
	title;
	level;
	description;
	rewardPoints;
	image;
	linktoArticle;
	whyBeingActive;
	urlq;
	otherChallenges;
	quesChallenges;
	trackYourGppDivWpai;
	trackYourGppDivPss;
	trackYourGppDivDlqi;
	titlear;
	manageYourGppLink ;
	manageYourGppLevelTwo;

	// Wire method to retrieve individual challenge details
	@wire(INDIVIDUALSCHALLENGES, { challengeId: "$challengeid" })
	wiredAccount({ error, data }) {
		let globalThis = window;
		if (data) {
			try {
				this.processChallengeData(data[0]);
			} catch (err) {
				globalThis.sessionStorage.setItem("errorMessage", err.body.message);
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			}
		} else if (error) {
			globalThis.sessionStorage.setItem("errorMessage", error.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			);
		}
	}

	processChallengeData(data) {
		this.setTitleAndLevel(data);
		this.setChallengeVisibility();
		this.setDescription(data);
		this.setRewardPoints(data);
		this.setImage(data);
	}

	setTitleAndLevel(data) {
		this.title = data.Name;
		this.level = data.BI_PSP_Challenge_Level__c;
	}

	setChallengeVisibility() {
		const isBookworm = this.title.includes(this.challengeBookworm);
		const isGpp = this.title.includes(resources.TRACK_YOUR_GPP_LABEL);
		const ismgpp = this.title.includes(this.managerYourGpp);

		this.resetVisibility();

		if (isBookworm) {
			this.setBookwormVisibility();
		} else if (isGpp) {
			this.setGppVisibility();
		} else if(ismgpp){
				this.manageGppVisibility();
		}
		else {
			this.otherChallenges = true;
		}
	}

	setBookwormVisibility() {
		if (this.level === this.levelOne) {
			this.linktoArticle = true;
			this.otherChallenges = true;
		} else if (this.level === this.levelTwo) {
			this.whyBeingActive = true;
			this.otherChallenges = true;
		}
	}

	setGppVisibility() {
		this.quesChallenges = true;
		if (this.level === this.levelOne) {
			this.trackYourGppDivWpai = true;
		} else if (this.level === this.levelTwo) {
			this.trackYourGppDivPss = true;
		} else if (this.level === resources.CHALLENGE_LEVEL_THREE) {
			this.trackYourGppDivDlqi = true;
		}
	}

	manageGppVisibility(){
				
				if(this.level === this.levelOne){
					
					this.manageYourGppLink = true;
					this.otherChallenges = true;
					}
					else if (this.level === this.levelTwo) {
						
						this.manageYourGppLevelTwo = true;
						this.otherChallenges = true;
			} else if (this.level === this.challengeLevelThree) {
				
				this.otherChallenges = true;
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

	setDescription(data) {
		if (data.HealthCloudGA__Description__c) {
			this.description = data.HealthCloudGA__Description__c.replace(/<[^<>]+>/gu, "");
		}
	}

	setRewardPoints(data) {
		if (data.BI_PSP_Challenge_Reward_Points__c) {
			this.rewardPoints = data.BI_PSP_Challenge_Reward_Points__c;
		}
	}

	setImage(data) {
		if (data.BI_PSP_Challenge_Image__c) {
			const desiredWidth = "135px";
			const desiredHeight = "70px";
			const imgTagRegex = /<img\s+[^>]*?src="([^"]+)"[^>]*>/giu;
			

			this.image = data.BI_PSP_Challenge_Image__c.replace(
				imgTagRegex,
				(match, src) =>
					`<img src="${src}" alt="${resources.ALTVALUE}" width="${desiredWidth}" height="${desiredHeight}">`
			);
		}
	}
	@wire(COUNT_ASSESMENT)
	wiredAssessmentResponsesqsq({ data }) {
		let globalThis = window;
		try {
			if (data) {
				this.count = data;
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			}
		} catch (err) {
			globalThis.sessionStorage.setItem("errorMessage", err.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			);
		}
	}
	renderedCallback() {
		let globalThis = window;
		try {
			const currentURL = window.location.href;
			const urlObject = new URL(currentURL);
			const path = urlObject.pathname;
			const pathComponents = path.split("/");
			const desiredComponent = pathComponents.find((component) =>
				[resources.BRANDED_URL, resources.UNASSIGNED_URL].includes(component)
			);

			if (desiredComponent === resources.BRANDED_URL) {
				this.urlq = resources.BRSITE_URL;
			} else {
				this.urlq = resources.UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			globalThis.sessionStorage.setItem("errorMessage", error.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			); // Catching Potential Error
		}
	}
	// Method to handle accepting a challenge
	afterAccept() {
		const messageEvent = new CustomEvent("acceptchallenge", {
			detail: {
				challengeid: this.challengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}

	// Method to open articles
	openArticles() {
		let globalThis = window;
		UPDATE_REACTION({
			articleName: this.gppArticle,
			reaction: resources.VIEW_LABEL
		})
			.then(() => {
				this.titlear = resources.VIEW_LABEL + ": " + this.gppArticle;
				window.location.assign(this.urlq + this.gppArticle);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message); // Catching Potential Error from Apex
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			});
	}
	openArticlesActive() {
		let globalThis = window;
		UPDATE_REACTION({
			articleName: this.beingActive,
			reaction: resources.VIEW_LABEL
		})
			.then(() => {
				this.titlear = resources.VIEW_LABEL + ": " + this.beingActive;
				window.location.assign(this.urlq + this.beingActive);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message); // Catching Potential Error from Apex
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			});
	}
	TrackYourGppNavigationWPAI() {
		if (this.stwai > 0) {
			window.location.assign(this.urlq + resources.BRWAPICOMPLETEDURL);
		} else {
			window.location.assign(this.urlq + resources.BR_WAPI_QUESTIONNAIRE);
		}
	}
	TrackYourGppNavigationPSS() {
		if (this.stpss > 0) {
			window.location.assign(this.urlq + resources.BRPSSCOMPLETEDURL);
		} else {
			window.location.assign(this.urlq + resources.PSS_QUESTIONNAIRE);
		}
	}
	TrackYourGppNavigationDLQI() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + resources.BRDLQICOMPLETEDURL);
		} else {
			window.location.assign(this.urlq + resources.DLQI_QUESTIONNAIRE);
		}
	}
	openSymptom() {
		window.location.assign(this.urlq + label.SYMPTOM_MAIN_PAGE_URL);
			}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== "undefined") {
			this.dispatchEvent(event);
		}
	}
}