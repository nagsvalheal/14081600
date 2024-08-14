//This lightning web component is used as a Widget that shows Challenges in dashboard
//To import Libraries
import { LightningElement } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceChallenges';
//To get Current UserId
import Id from '@salesforce/user/Id';
//To import Apex Classes
import GET_RANK from '@salesforce/apex/BI_PSP_ChallengeRankCtrl.getRank';
import GET_ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GETLAST_ACTIVECHALLENGES from '@salesforce/apex/BI_PSP_LastActiveChallengesCtrl.getLastActiveChallenges';
import GET_RANDOMCHALLENGES from '@salesforce/apex/BI_PSP_RandomChallengesCtrl.getRandomChallenges';

export default class BiPspbWidgetChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	expertImage = resources.EXPERT_IMAGE;
	proficientImage = resources.PROFICIENT_IMAGE;
	intermediateImage = resources.INTERMEDIATE_IMAGE;
	beginnerImage  = resources.BEGINNER_IMAGE;
	noviceImage = resources.NOVICE_IMAGE;
	challenges = resources.WIDGET;
	brandedUrl = resources.BRANDED_URL;
	unassignedUrl = resources.UNASSIGNED_URL;
	challengesLabel = resources.CHALLENGES;
	challengeUnderstanding = resources.CHALLENGE_UNDERSTANDING;
	startChallenge = resources.START_CHALLENGE;
	availableChallenges = resources.AVAILABLE_CHALLENGES;
	completedChallenges = resources.COMPLETED_CHALLENGES;
	viewTrophies = resources.VIEW_TROPHIES;
	challengesLimit = resources.CHALLENGES_LIMIT;
	challengesXp = resources.CHALLENGES_XP;
	xpTillLevel = resources.XP_TILL_LEVEL;
	altValue = resources.ALTVALUE;
	firsttime;
	userId = Id;
	enrolleId;
	showError;
	errorMessage;
	Title;
	Description;
	RewardPoints;
	Image;
	currentXP;
	nextrankxp;
	xpNextrank;
	rankLevel;
	rankLevels;
	rankcompleted;
	tImage;
	onlyXp;
	xpValue = false;
	avaiChallenge = false;
	nullChallenge = false;
	showSpinner = true;
	slashSiteUrl = resources.SLASH_URL;
	slashSitePageUrl = resources.SLASH_SITEURL;
	siteChallengesUrlBranded = resources.BRANDED_CHALLENGES_SITEURL;
	siteTrophyCaseUrlBranded = resources.BR_TROPHY_CASE_SITE_URL;
	levelOne = resources.RANK_LEVEL_ONE;
	levelTwo = resources.RANK_LEVEL_TWO;
	levelThree = resources.RANK_LEVEL_THREE;
	levelFour = resources.RANK_LEVEL_FOUR;
	levelSix = resources.RANK_LEVEL_SIX;
	rankTwo = resources.CH_RANK_TWO;
	rankThree = resources.CH_RANK_THREE;
	rankFour = resources.CH_RANK_FOUR;
	rankFive = resources.CH_RANK_FIVE;
	availableLabel = resources.LABLE_AVAILABLE;
	activeLabel = resources.LABLE_STATUS_ACTIVE;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT; 
	expertGpp = resources.EXPERT_GPP;
	beginnerGpp = resources.BEGINNER_GPP;
	intermediateGpp = resources.INTERMEDIATE_GPP;
	noviceGpp = resources.NOVICE_GPP;
	proficientGpp = resources.PROFICIENT_GPP;
	noviceGpps = resources.NOVICE_GPPS;
	beginner = resources.BEGINNER;
	intermediate = resources.INTERMEDIATE;
	proficient = resources.PROFICIENT;
	expert = resources.EXPERT;
	displayErrorPage = resources.BI_PSP_DISPLAYERRORPAGE;
	siteUrlBranded = resources.BRSITE_URL;
	currentPageUrl;
	urlSegments;
	baseUrl;
	//connectedcallback is used for get the careprogram enrollee id
	connectedCallback() {
		let globalThis = window;
		try {
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			GET_ENROLLE({ userId: this.userId })
				.then(result => {// Null check has been handled in its respective apex method
					if (result[0].patientEnrolle !== null) {
						this.enrolleId = result[0].patientEnrolle.Id;
						this.getActiveAndAvailableChallenge(result[0].patientEnrolle.BI_PSP_Challenge_Rank__c);
					} else if (result[0].error !== null) {
						this.showError = true;
						this.errorMessage = result[0].error;
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				})

			const currentURL = globalThis.location?.href;
			// Create a URL object
			const urlObject = new URL(currentURL);

			// Get the path
			const path = urlObject.pathname;

			// Split the path using '/' as a separator
			const pathComponents = path.split(this.slashSiteUrl);

			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find(component =>
				[this.brandedUrl, this.unassignedUrl].includes(component)
			);

			if (desiredComponent === this.brandedUrl) {
				this.urlq = this.brandedUrl;
			}
			else {
				this.urlq = this.unassignedUrl;
			}
		}
		catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	//This method is used for get the active and available challenges.
	getActiveAndAvailableChallenge(rank) {
		let globalThis = window;
			if (rank !== this.expertGpp) {
				GETLAST_ACTIVECHALLENGES({ enrolleId: this.enrolleId })
				.then(result => {
					if (result !== null) {
						if (result.Name) {
							this.Title = result.Name;
						}
						if (result.HealthCloudGA__Description__c) {
							this.Description = result.HealthCloudGA__Description__c.replace(/<[^<>]+>/gu, '');
						}
						if (result.BI_PSP_Challenge_Reward_Points__c) {
							this.RewardPoints = result.BI_PSP_Challenge_Reward_Points__c;
						}
						if (result.BI_PSP_Challenge_Image__c) {
							this.Image = result.BI_PSP_Challenge_Image__c;
							const desiredWidth = '148px';
							const desiredHeight = '129px';
							const imgTagRegex = /<img\s+[^>]*?src="([^"]+)"[^>]*>/giu;
							const formattedContent = this.Image.replace(imgTagRegex, (match, src) => `<img src='${src}' alt="${resources.ALTVALUE}" width='${desiredWidth}' height='${desiredHeight}'>`);
							this.tImage = formattedContent;
						}
						this.firsttime = false;
					} else {
						this.firsttime = true;
					}
					this.xpMethod();
				}).catch(error => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
			} else {
				this.firsttime = true;
				this.xpMethod();
			}
	}
	//This method is used for get the rank and xp values.
	xpMethod() {
		let globalThis = window;
			GET_RANK({ personAccountId: this.enrolleId })
				.then(result => {// Null check has been handled in its respective apex method
					if (this.firsttime === true) {
						this.xpValue = true;
					}
						this.currentXP = result[0].BI_PSP_Total_Reward_Points__c;
						if (this.currentXP === undefined) {
							this.currentXP = 0;
						}
						if (this.currentXP < this.noviceGpps) {
							this.nextrankxp = this.noviceGpps;
							this.xpNextrank = this.noviceGpps - this.currentXP;
							this.rankLevel = this.levelOne;
							this.rankLevels = this.rankTwo;
							this.rankcompleted = this.noviceGpp;
							if (this.firsttime === true) {
								this.tImage = this.noviceImage;
							}
						} else if (this.currentXP >= this.noviceGpps && this.currentXP < this.beginner) {
							this.nextrankxp = this.beginner;
							this.xpNextrank = this.beginner - this.currentXP;
							this.rankLevel = this.levelTwo;
							this.rankLevels = this.rankThree;
							this.rankcompleted = this.beginnerGpp;
							if (this.firsttime === true) {
								this.tImage = this.beginnerImage;
							}
						} else if (this.currentXP >= this.beginner && this.currentXP < this.intermediate) {
							this.nextrankxp = this.intermediate;
							this.xpNextrank = this.intermediate - this.currentXP;
							this.rankLevel = this.levelThree;
							this.rankLevels = this.rankFour;
							this.rankcompleted = this.intermediateGpp;
							if (this.firsttime === true) {
								this.tImage = this.intermediateImage;
							}
						} else if (this.currentXP >= this.intermediate && this.currentXP < this.proficient) {
							this.nextrankxp = this.proficient;
							this.xpNextrank = this.proficient - this.currentXP;
							this.rankLevel = this.levelFour;
							this.rankLevels = this.rankFive;
							this.rankcompleted = this.proficientGpp;
							if (this.firsttime === true) {
								this.tImage = this.proficientImage;
							}
						} else if (this.currentXP >= this.proficient && this.currentXP < this.expert) {
							this.nextrankxp = this.expert;
							this.xpNextrank = this.nextrankxp - this.currentXP;
							this.rankLevel = this.levelSix;
							this.rankcompleted = this.expertGpp;
							if (this.firsttime === true) {
								this.tImage = this.expertImage;
							}
						} else if (this.currentXP >= this.expert) {
							this.onlyXp = true;
							this.getavailable();
							this.tImage = this.expertImage;
							this.xpNextrank = this.currentXP;
							this.rankLevel = this.levelSix;
						}

					// Check if running in a browser environment
				if (typeof window !== 'undefined') {
					this.dispatchEvent(new CustomEvent('load'));
				}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				})
		
	}
	//This method is used for get Only available challenges.
	getavailable() {
		let globalThis = window;
			let status = this.availableLabel;
			GET_RANDOMCHALLENGES({ personAccountId: this.enrolleId, status: status })
				.then(result => {
					this.recivedData = result.filter(obj => Object.keys(obj).length !== 0);
					if (this.recivedData === null || this.recivedData.length === 0) {
						let statusVal = this.activeLabel;
						GET_RANDOMCHALLENGES({ personAccountId: this.enrolleId, status: statusVal })
						.then(results => {
							this.recivedActiveData = results.filter(obj => Object.keys(obj).length !== 0);
							if (this.recivedActiveData === null || this.recivedActiveData.length ===0){
								this.nullChallenge = true;
								this.avaiChallenge = false;
								this.xpValue = false;
							}else {
								this.avaiChallenge = true;
								this.nullChallenge = false;
								this.xpValue = false;
							}
						})
						.catch (error => {
							globalThis.sessionStorage.setItem('errorMessage', error.body.message);
							globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
						})
					} else {
						this.avaiChallenge = true;
						this.nullChallenge = false;
						this.xpValue = false;
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage); 
				})
		
	}
	//Navigation
	navigateChallenge() {
		window.location.assign(this.siteChallengesUrlBranded);
	}
	navigateTrophy() {
		window.location.assign(this.siteTrophyCaseUrlBranded);
	}
}