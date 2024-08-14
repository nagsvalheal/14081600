//This LWC dynamically renders error messages, challenges, and congratulatory messages based on various conditions, enhancing user engagement and interaction in challenges
//To import Libraries
import { LightningElement } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceChallenges';

//To get Current UserId
import Id from '@salesforce/user/Id';
//To import Apex Classes
import GET_ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_RANDOM_CHALLENGES from '@salesforce/apex/BI_PSP_RandomChallengesCtrl.getRandomChallenges';
import GET_INDIVIDUAL_CHALLENGES from '@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges';
import UPDATE_CHALLENGES from '@salesforce/apex/BI_PSP_ChallengeCtrl.updateChallenges';
import GET_RANK from '@salesforce/apex/BI_PSP_ChallengeRankCtrl.getRank';

export default class BiPspbChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	availableChallenges = [];
	acceptedChallenges = [];
	activeChallenges = [];
	percentage = 0;
	showChallenges;
	showCongrats;
	showCongratsPre;
	bookLvlTwo = '';

	percentageCompleted;
	showQuestion = true;
	congrats = false;
	//showSpinner = true;
	siteUrlBranded = resources.BR_SITE_URL;
	siteTrophyCaseUrlBranded = resources.BR_TROPHY_CASE_SITE_URL;
	errorMessagePl = resources.ERR_MSG_PL;
	resultSuccess = '';
	completedLabel = resources.LABLE_STATUS_COMPLETED;
	activeLabel = resources.LABLE_STATUS_ACTIVE;
	availableLabel = resources.LABLE_AVAILABLE;
	levelOne = resources.RANK_LEVEL_ONE;
	levelTwo = resources.RANK_LEVEL_TWO;
	levelThree = resources.RANK_LEVEL_THREE;
	levelFour = resources.RANK_LEVEL_FOUR;
	levelFive = resources.RANK_LEVEL_FIVE;
	levelSix = resources.RANK_LEVEL_SIX;
	rankTwo = resources.CH_RANK_TWO;
	rankThree = resources.CH_RANK_THREE;
	rankFour = resources.CH_RANK_FOUR;
	rankFive = resources.CH_RANK_FIVE;
	rankSix = resources.CH_RANK_SIX;
	challengeArrowSmall = resources.CHALLENGE_ARROW_SMALL;
	challengeArrowLarge = resources.CHALLENGE_ARROW_LARGE;
	crossIcon = resources.CRO_ICON;
	celebration = resources.CELEBRATION;
	activeNo = resources.ACTIVE_NO;
	expertImage = resources.EXPERT_IMAGE;
	ProficientImage = resources.PROFICIENT_IMAGE;
	IntermediateImage = resources.INTERMEDIATE_IMAGE;
	BeginnerImage = resources.BEGINNER_IMAGE;
	NoviceImage = resources.NOVICE_IMAGE;
	errorMessages = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;
	expertGpp = resources.EXPERT_GPP;
	beginnerGpp = resources.BEGINNER_GPP;
	intermediateGpp = resources.INTERMEDIATE_GPP;
	noviveGpp = resources.NOVICE_GPP;
	proficientGpp = resources.PROFICIENT_GPP;
	noviceGpps = resources.NOVICE_GPPS;
	beginner = resources.BEGINNER;
	intermediate = resources.INTERMEDIATE;
	proficient = resources.PROFICIENT;
	expert = resources.EXPERT;
	totalXp = resources.TOTAL_XP;
	challenges = resources.CHALLENGES;
	challengesXp = resources.CHALLENGES_XP;
	challengesReach = resources.CHALLENGES_REACH;
	level = resources.LEVEL;
	challengesMaxLevel = resources.CHALLENGES_MAX_LEVEL;
	challengesExcellent = resources.CHALLENGES_EXCELLENT;
	activeChallengesLabel = resources.ACTIVE_CHALLENGES;
	noActiveChallenges = resources.NO_ACTIVE_CHALLENGES;
	acceptChallenge = resources.ACCEPT_CHALLENGE;
	availabelChallenges = resources.AVAILABLE_CHALLENGES;
	loadMore = resources.LOAD_MORE;
	loadLess = resources.LOAD_LESS;
	noAvailableChallenge = resources.NO_AVAILABLE_CHALLENGE;
	completeChallengePoints = resources.COMPLETE_CHALLENGE_POINTS;
	congratulations = resources.CONGRATULATIONS;
	youEarned = resources.YOU_EARNED;
	successChallenges = resources.SUCCESS_CHALLENGES;
	confirmChallenges = resources.CONFIRM_CHALLENGES;
	challengesHelp = resources.CHALLENGES_HELP;
	completeChallengeLabel = resources.COMPLETECHALLENGEBUTTON;
	cancel = resources.CANCEL;
	cannotCompleteChallenge = resources.CANNOT_COMPLETE_CHALLENGE;
	loading = resources.LOADING;
	noChallengesNow = resources.NO_CHALLENGES_NOW;
	checkTrophies = resources.CHECK_TROPHIES;
	trophyCase = resources.TROPHY_CASE;
	tapAbove = resources.TAP_ABOVE;
	displayErrorPage = resources.BI_PSP_DISPLAYERRORPAGE;
	altValue = resources.ALTVALUE;
	
	activeCount = 0;
	updateChallenge = {};
	updating;
	showMore;
	updateChallengeTwo = {};
	updateChallengeComplete = {};
	title;
	description;
	rewardPoints;
	image;
	showmodal;
	showbutton;
	showInfo;
	showInfo1;
	showcong;
	isLoading = false;
	rankcompleted;
	currentXP = 0;
	nextrankxp;
	xpNextrank;
	rankLevel;
	rankLevels;
	variable;
	showMoreCount = 3;
	userId = Id;
	selectedAvatarSrc;
	selectedName;
	enrolleId;
	showError;
	errorMessage;
	tImage;
	completedpercentage;
	showFiveHund;
	showNoneFive;
	showLess;
	updateChallengeOne = {};
	availableCount = 0;
	currentPageUrl;
	urlSegments;
	baseUrl;

	//this function is used for navigating to trophycase page
	navigateTrophy() {
		window.location.assign(this.siteUrlBranded + this.siteTrophyCaseUrlBranded);
	}

	//connectedcallback is used for get the careprogram enrollee id
	connectedCallback() {
		let globalThis = window;
		try {
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			GET_ENROLLE()
				.then((result) => {
					if (result.length > 0) {//result is returned as a list so we have used result.length
						if (result[0].patientEnrolle !== null) {
							this.enrolleId = result[0].patientEnrolle.Id;
							this.xpMethod();
							this.getActiveAndAvailableChallenge();
						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
					} else {
						this.showError = true;
						this.errorMessage = this.errorMessagePl;
					}
					
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		}
		catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	//This method is used for get the active and available challenges.
	getActiveAndAvailableChallenge() {
		this.getRandomChallengesCommon();
		let status = this.activeLabel;
		let globalThis = window;
		GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
			.then((result) => {
				if (
					(Array.isArray(result) &&
						result.length === 1 &&
						Object.keys(result[0]).length === 0) ||
					result === null
				) {
					this.resultSuccess = result;
				}
				else {
					this.activeChallenges = result.filter(
						(obj) => Object.keys(obj).length !== 0
					);
					this.activeCount = this.activeChallenges.length;
				}
				this.showInfos();
				//this.showSpinner = false;
				// Check if running in a browser environment
				if (typeof window !== 'undefined') {
					this.dispatchEvent(new CustomEvent('load'));
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}

	//This method is used for get the rank and xp values.
	xpMethod() {
		this.isLoading = true;
		let globalThis = window;
		GET_RANK({ personAccountId: this.enrolleId })
			.then((result) => {
				if (result !== null) {
					this.variable = true;
					this.currentXP = result[0].BI_PSP_Total_Reward_Points__c || 0;
					this.calculateRankDetails();
					if (this.currentXP >= this.expert) {
						this.handleExpertLevel();
					}
					this.getavailable();
				}
				this.isLoading = false;
				
				if (typeof window !== 'undefined') {
					this.dispatchEvent(new CustomEvent('sendxp', { detail: this.currentXP }));
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}

	calculateRankDetails() {
		if (this.currentXP < this.noviceGpps) {
			this.setRankDetails({
				nextrankxp: this.noviceGpps,
				rankLevel: this.levelOne,
				rankLevels: this.rankTwo,
				rankcompleted: this.noviceGpp,
				tImage: this.NoviceImage
			});
		} else if (this.currentXP >= this.noviceGpps &&
			this.currentXP < this.beginner) {
			this.setRankDetails({
				nextrankxp: this.beginner,
				rankLevel: this.levelTwo,
				rankLevels: this.rankThree,
				rankcompleted: this.beginnerGpp,
				tImage: this.BeginnerImage
			});
		} else if (this.currentXP >= this.beginner &&
			this.currentXP < this.intermediate) {
			this.setRankDetails({
				nextrankxp: this.intermediate,
				rankLevel: this.levelThree,
				rankLevels: this.rankFour,
				rankcompleted: this.intermediateGpp,
				tImage: this.IntermediateImage
			});
		} else if (this.currentXP >= this.intermediate &&
			this.currentXP < this.proficient) {
			this.setRankDetails({
				nextrankxp: this.proficient,
				rankLevel: this.levelFour,
				rankLevels: this.rankFive,
				rankcompleted: this.proficientGpp,
				tImage: this.ProficientImage
			});
		} else if (this.currentXP >= this.proficient && this.currentXP < this.expert) {
			this.setRankDetails({
				nextrankxp: this.expert,
				rankLevel: this.levelFive,
				rankLevels: this.rankSix,
				rankcompleted: this.expertGpp,
				tImage: this.expertImage,
				variable: false
			});
		} else if (this.currentXP >= this.expert) {
			this.handleExpertLevel();
		}
	}

	setRankDetails({ nextrankxp, rankLevel, rankLevels, rankcompleted, tImage, variable = true }) {
		this.nextrankxp = nextrankxp;
		this.xpNextrank = nextrankxp - this.currentXP;
		this.rankLevel = rankLevel;
		this.rankLevels = rankLevels;
		this.percentage = 100 * (this.currentXP / this.nextrankxp);
		this.percentage = Math.floor(this.percentage);
		this.rankcompleted = rankcompleted;
		this.tImage = tImage;
		this.variable = variable;
	}

	handleExpertLevel() {
		if (this.currentXP === 1500) {
			this.showFiveHund = true;
			this.showNoneFive = false;
		} else {
			this.showFiveHund = false;
			this.showNoneFive = true;
		}
		this.percentage = 100;
		this.tImage = this.expertImage;
		this.rankLevel = this.levelSix;
		let globalThis = window;
		this.getRandomChallenges(this.availableLabel)
			.then((data) => {
				if (data.length === 0) {
					this.getRandomChallenges(this.activeLabel)
						.then((resultData) => {
							this.showCongratsPre = resultData.length > 0;
						})
						.catch((error) => {
							globalThis.sessionStorage.setItem('errorMessage', error.body.message);
							globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
						});
				} else {
					this.showCongratsPre = true;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}

	getRandomChallenges(status) {
		let globalThis = window;
		return GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status })
			.then((datas) => datas.filter((obj) => Object.keys(obj).length !== 0))
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}

	//This method is used for get Only available challenges.
	getavailable() {
		let globalThis = window;
		if (this.currentXP >= 1500) {
			let status = this.availableLabel;
			GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
				.then((results) => {// Null check for result has been handled in Apex class.
					let result = results
					result = result.filter((obj) => Object.keys(obj).length !== 0);
					if (result.length === 0) {
						this.showCongrats = true;
						this.showChallenges = false;
						this.percentage = 100;
						let localStatus = this.activeLabel;
						GET_RANDOM_CHALLENGES({
							personAccountId: this.enrolleId,
							status: localStatus
						})
							.then((resultValues) => {
								let resultValue = resultValues
								resultValue = resultValue.filter((obj) => Object.keys(obj).length !== 0);
								if (resultValue.length === 0) {
									this.showCongrats = true;
									this.showChallenges = false;
									this.percentage = 100;
								} else {
									this.showCongrats = false;
									this.showChallenges = true;
								}
							})
							.catch((error) => {
								globalThis.sessionStorage.setItem('errorMessage', error.body.message);
								globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
							});
					} else {
						this.showCongrats = false;
						this.showChallenges = true;
					}
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		} else {
			this.showCongrats = false;
			this.showChallenges = true;
		}
	}
	//This is uesd for closing the completed challenge popup
	closeComplete() {
		this.showmodal = false;
		this.showbutton = "";
		this.updateChallengeComplete = {};
		this.showcong = true;
		this.showmodal = false;
		this.basicCannon();
	}
	//Functionality for after completing the challenge
	afterComplete() {
		this.showbutton = true;
		this.simpleUpdateChallenge(this.updateChallengeComplete);
	}
	//Navigation
	closeMobMenu1() {
		window.location.assign(window.location.href);
	}
	//Popup Functionalities
	closeMobMenu() {
		this.closeModal();
	}
	closeModal() {
		this.showmodal = false;
		this.percentageCompleted = 0;
		this.updateChallengeComplete = {};
		document.body.style.overflow = "auto";
	}
	afterClose() {
		this.showcong = false;
		window.location.assign(window.location.href);
	}
	//Functionality for completing the challenge
	completeChallenge(event) {
		const componentId1 = event.detail.activechallengeid;
		const componentId = event.detail.challengeidtoupdate;
		this.updateChallengeTwo = this.activeChallenges.filter(
			(challenges) => challenges.challengeIdToUpdate === componentId
		);
		this.updateChallengeComplete = this.updateChallengeTwo;
		this.showmodal = true;
		this.showbutton = false;
		this.getActiveChallenge(componentId1);
		this.fromNavBar(event);
	}
	//This method is used to get the Active Challenges.
	getActiveChallenge(challengeIds) {
		let globalThis = window;
		GET_INDIVIDUAL_CHALLENGES({ challengeId: challengeIds })
			.then((result) => {//Null check for the returned value has been handled in apex class.
				if (result[0].Name) {
					this.title = result[0].Name;
				}
				if (result[0].HealthCloudGA__Description__c) {
					this.description = result[0].HealthCloudGA__Description__c.replace(/<[^<>]+>/gu, "");
					if (this.description === 'Read the following article:') {
						this.bookLvlTwo = '"why being active is important"'
					}

				}
				if (result[0].BI_PSP_Challenge_Reward_Points__c) {
					this.rewardPoints = result[0].BI_PSP_Challenge_Reward_Points__c;
				}
				if (result[0].BI_PSP_Challenge_Image__c) {
					this.image = result[0].BI_PSP_Challenge_Image__c;
					const desiredWidth = '135px';
					const desiredHeight = '70px';
					const imgTagRegex = /<img\s+[^>]*?src="([^"]+)"[^>]*>/giu;
					
					const formattedContent = this.image.replace(
						imgTagRegex,
						(match, src) => `<img src="${src}" alt="${resources.ALTVALUE}" width="${desiredWidth}" height="${desiredHeight}">`
					);
					this.image = formattedContent;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}
	//Dynamically modifies the overflow css property accorfing to active challenges
	fromNavBar(event) {
		if (event.detail.activechallengeid) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}

	//This method is used to Update the Available Challenges.
	simpleUpdateChallenge(updatingChallenge) {
		let globalThis = window;
		this.updating = this.completedLabel;
		UPDATE_CHALLENGES({
			challenge: updatingChallenge[0].challengeIdToUpdate,
			activeAvailable: this.updating,
			userId: Id


		})
			.then((result) => {
				if (result[0].error === null || result[0].error === undefined) {
					const activeChallengeIds = new Set(
						this.updateChallengeTwo.map(
							(challenge) => challenge.challengeIdToUpdate
						)
					);
					this.activeChallenges = this.activeChallenges.filter(
						(challenge) =>
							!activeChallengeIds.has(challenge.challengeIdToUpdate)
					);

					this.showInfos();
					this.updateChallengeTwo = {};
					this.isLoading = false;
					this.activeCount = this.activeChallenges.length;
					this.congrats = true;
				} else {
					this.showQuestion = false;
					this.isLoading = false;
					this.congrats = false;
					this.percentageCompleted = result[0].percentage;
				}
			})
			.catch((error) => {
				this.isLoading = false;
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}

	//This method is used to remove the Active Challenges.
	removeActiveChallenge(event) {
		let globalThis = window;
		try {
			this.isLoading = true;
			const componentId = event.detail.challengeidtoupdate;
			this.updateChallengeOne = this.activeChallenges.filter(
				(challenges) => challenges.challengeIdToUpdate === componentId
			);
			this.updating = this.availableLabel;
			UPDATE_CHALLENGES({ challenge: componentId, activeAvailable: this.updating, userId: Id })
				.then(() => {
					const activeChallengeIds = new Set(
						this.availableChallenges.map(
							(challenge) => challenge.challengeIdToUpdate
						)
					);
					const updatedChallenges = this.updateChallengeOne.map((challenge) => {
						if (activeChallengeIds.has(challenge.challengeIdToUpdate)) {
							const existingChallengeIndex = this.availableChallenges.findIndex(
								(existingChallenge) =>
									existingChallenge.challengeIdToUpdate ===
									challenge.challengeIdToUpdate
							);
							if (existingChallengeIndex !== -1) {
								return challenge;
							}
							return false;

						}
						return null;
					});


					this.availableChallenges = [
						...this.availableChallenges,
						...updatedChallenges
					];
					this.showinfo();
					this.updateChallengeOne = {};
					this.isLoading = false;
					this.availableCount = this.availableChallenges.length;
				})

				.catch((error) => {
					this.isLoading = false;
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
			this.activeChallenges = this.activeChallenges.filter(
				(challenge) => challenge.challengeIdToUpdate !== componentId
			);
			this.showInfos();
		}
		catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	//This method is used to remove the Available Challenges.
	removeAvailableChallenge(event) {
		let globalThis = window;
		try {
			this.isLoading = true;
			const componentId = event.detail.challengeidtoupdate;
			this.updateChallenge = this.availableChallenges.filter(
				(challenges) => challenges.challengeIdToUpdate === componentId
			);
			this.updating = this.activeLabel;
			UPDATE_CHALLENGES({ challenge: componentId, activeAvailable: this.updating, userId: Id })
				.then(() => {
					this.isLoading = false;
					window.location.assign(window.location.href);
				})
				.catch((error) => {
					
					this.isLoading = false;
					globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
			this.showinfo();
		}
		catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	showinfo() {
		if (
			Array.isArray(this.availableChallenges) &&
			this.availableChallenges.length === 0
		) {
			this.showInfo1 = true;
		} else {
			this.showInfo1 = false;
		}
	}

	// This is used to get the Available random challlenges
	getRandomChallengesCommon() {
		let globalThis = window;
		let status = this.availableLabel;
		GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
			.then((results) => {
				this.handleChallengeResults(results);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}

	handleChallengeResults(results) {
		
		let result = results.filter(
			(obj) => Object.keys(obj).length !== 0
		);

		if (
			(Array.isArray(result) &&
				result.length === 1 &&
				Object.keys(result[0]).length === 0) ||
			result === null
		) {
			this.showInfo1 = true;
			this.showMore = false;
			this.showLess = false;
		} else {
			let filteredResult = this.filterActiveChallenges(result);
			let filteredArray = filteredResult.filter(
				(obj) => Object.keys(obj).length !== 0
			);
			this.updateAvailableChallenges(filteredArray);
			this.updateShowMoreLess(filteredArray);
			this.updateShowInfo(filteredArray);
		}
	}

	filterActiveChallenges(result) {
		if (this.activeChallenges.length > 0) {
			return result.filter((challenge) =>
				!this.activeChallenges.some(
					(activeChallenge) =>
						activeChallenge.challengeIdToUpdate ===
						challenge.challengeIdToUpdate
				)
			);
		}
		return result;
	}

	updateAvailableChallenges(filteredArray) {
		if (filteredArray.length < this.showMoreCount) {
			// If there are fewer than 4 records after filtering, set the initial 4 records
			if (filteredArray !== "" || filteredArray !== null) {
				this.availableChallenges = filteredArray;
			}
			this.showMore = false;
		} else {
			// If there are 4 or more records after filtering, set the initial 4
			if (filteredArray !== "" || filteredArray !== null) {
				this.availableChallenges = filteredArray.slice(
					0,
					this.showMoreCount
				);
			}
			if (filteredArray.length > 3) {
				this.showMore = true;
			}
		}
	}

	updateShowMoreLess(filteredArray) {
		if (
			filteredArray.length === this.availableChallenges.length &&
			filteredArray.length !== 0 &&
			filteredArray.length > 3
		) {
			this.showLess = true;
		} else {
			this.showLess = false;
		}
	}

	updateShowInfo(filteredArray) {
		if (filteredArray.length > 0) {
			this.showInfo1 = false;
			this.availableCount = filteredArray.length;
		} else {
			this.showInfo1 = true;
			this.showMore = false;
			this.showLess = false;
		}
	}

	//Functionality for show less button
	handleShowLessClick() {
		this.showLess = false;
		this.availableChallenges = [];
		this.showMoreCount = 3;
		this.getRandomChallengesCommon();
	}

	//this method used for showing more Available challenges
	handleShowMoreClick() {
		let globalThis = window;
		let status = this.availableLabel;
		this.showMoreCount += 3;
		GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
			.then((results) => {
				let result = results
				result = result.filter((obj) => Object.keys(obj).length !== 0);
				if (result !== null) {
					this.showInfo1 = false;
					if (result.length > this.availableChallenges.length) {
						const newChallenges = result.slice(
							this.availableChallenges.length,
							this.showMoreCount
						);
						this.availableChallenges = [
							...this.availableChallenges,
							...newChallenges
						];
					}
					if (result.length === this.availableChallenges.length) {
						this.showLess = true;
						this.showMore = false;
					} else if (result.length > 3) {
						this.showLess = false;
						this.showMore = true;
					}
				} else {
					this.showInfo1 = true;
					this.showLess = false;
					this.showMore = false;
				}
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
			});
	}
	// Its shows the Infromation about active challenges
	showInfos() {
		if (this.activeChallenges === null || this.activeChallenges.length === 0) {
			this.showInfo = true;
		} else {
			this.showInfo = false;
		}
	}
}