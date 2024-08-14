// This Lightning Web Component is designed to display both 'Just for Me' articles and recent articles from the CMS
//To import Libraries
import { LightningElement, wire } from 'lwc';
//To import Apex Classes
import RETRIEVE_MEDIA_FROM_CMS_NEWS from '@salesforce/apex/BI_PSPB_CmsCtrl.retrieveMediaFromCMSNews';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import GET_PERSONALIZED_ARTICLES from '@salesforce/apex/BI_PSPB_PersonalizedArticlesCtrl.getPersonalizedArticles';
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
//To import Static Resource
import CLOCK_ICON from '@salesforce/resourceUrl/BI_PSP_ClockIcon';
import ROUND_ICON from '@salesforce/resourceUrl/BI_PSP_RoundNextIcon';
import WHAT_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_WhatGppImg';
import FACTS_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_FactsGppImg';
import RARE_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_RareGppImg';
import HAVE_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_WhyDoIHaveGppImg';
import DIAGNOSIS_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_DiagnosisGppImg';
import GPP_CONTAGIOUS_IMG from '@salesforce/resourceUrl/BI_PSP_GppContagiousImg';
import FRIENDS_FAMILY_IMG from '@salesforce/resourceUrl/BI_PSP_FriendsFamilyImg';
import FEELING_EXCLUDED_IMG from '@salesforce/resourceUrl/BI_PSP_FeelingExcludedImg';
import GPP_INTIMACY_IMG from '@salesforce/resourceUrl/BI_PSP_GppIntimacyImg';
import GPP_PREGNANCY_IMG from '@salesforce/resourceUrl/BI_PSP_GppPregnancyImg';
import MANGE_FLARE_IMG from '@salesforce/resourceUrl/BI_PSP_ManageFlareImg';
import GPP_COMORBIDITIES_IMG from '@salesforce/resourceUrl/BI_PSP_GppComorbiditiesImg';
import MANAGE_GPP_SYMPTOMS_IMG from '@salesforce/resourceUrl/BI_PSP_ManageGppSymptomsImg';
import ASK_DOCTOR_IMG from '@salesforce/resourceUrl/BI_PSP_AskDoctorImg';
import SEEK_MEDICARE_IMG from '@salesforce/resourceUrl/BI_PSP_SeekMediCareImg';
import SEEK_EMERGENCY_IMG from '@salesforce/resourceUrl/BI_PSP_SeekEmergencyImg';
import MANGE_SCARS_IMG from '@salesforce/resourceUrl/BI_PSP_ManageScarsImg';
import COMPLICAT_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_ComplicatGppImg';
import RECOGNIZING_FLARES_IMG from '@salesforce/resourceUrl/BI_PSP_RecognizingFlaresImg';
import VISIT_IMG from '@salesforce/resourceUrl/BI_PSP_VisitDoctorImg';
import DERMATOLOGIST_IMG from '@salesforce/resourceUrl/BI_PSP_DermatologistImg';
import TALK_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_TalkGppImg';
import ALONE_IMG from '@salesforce/resourceUrl/BI_PSP_NotAloneImg';
import CHOICES_IMG from '@salesforce/resourceUrl/BI_PSP_PositiveChoicesImg';
import TREATING_GPP_IMG from '@salesforce/resourceUrl/BI_PSPB_TreatingGppImg';
import INFUSION_IMG from '@salesforce/resourceUrl/BI_PSPB_SpevigoInfusionImg';
import PREVENTION_IMG from '@salesforce/resourceUrl/BI_PSPB_PreventionGppImg';
import INJECTION_IMG from '@salesforce/resourceUrl/BI_PSPB_SpevigoInjectionImg';
import WORK_IN_GPP_IMG from '@salesforce/resourceUrl/BI_PSPB_WorkInGppImg';
//To get Current UserId
import ID from '@salesforce/user/Id';
//To import Custom Labels
import { LABELS, MINSMAP } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbArticlesForDashboard extends LightningElement {

	urlq;
	patientStatusVal;
	categoryValue;
	justForMeArticleList = [];
	results = [];
	userId = ID;
	ClockIcon = CLOCK_ICON;
	NextIcon = ROUND_ICON;
	currentPageUrl;
	urlSegments;
	baseUrl;
	channelName = LABELS.CHANNEL_NAME;
	firstImg;
	secondImg;
	thirdImg;
	fourthImg;
	firstHeading;
	secondHeading;
	thirdHeading;
	fourthHeading;
	analyticsFirstHeading;
	analyticsSecondHeading;
	analyticsThirdHeading;
	analyticsFourthHeading;
	firstDescription;
	secondDescription;
	thirdDescription;
	fourthDescription;
	threeDifferentNumbers;
	submittedRecord;
	showFirstArticle = true;
	showSecondArticle = true;
	showThirdArticle = true;
	showFourthArticle = true;
	readTimeOne;
	readTimeTwo;
	readTimeThird;
	readTimeFourth;
	siteurl;
	articleTitle;
	topics = MINSMAP;
	minutes = LABELS.MINUTES;
	articlesForYou = LABELS.ARTICLES_FOR_YOU;
	visitInfoCenter = LABELS.VISIT_INFORMATION_CENTER;
	isLoaded;
	imageMap = {
		[LABELS.WHAT_GPP_LABEL]: WHAT_GPP_IMG,
		[LABELS.FACTS_GPP_LABEL]: FACTS_GPP_IMG,
		[LABELS.RARE_GPP_LABEL]: RARE_GPP_IMG,
		[LABELS.WHY_DO_I_HAVE_GPP_LABEL]: HAVE_GPP_IMG,
		[LABELS.DIAGNOSIS_GPP_LABEL]: DIAGNOSIS_GPP_IMG,
		[LABELS.GPP_CONTAGIOUS_LABEL]: GPP_CONTAGIOUS_IMG,
		[LABELS.FRIENDS_FAMILY_LABEL]: FRIENDS_FAMILY_IMG,
		[LABELS.FEELING_EXCLUDED_LABEL]: FEELING_EXCLUDED_IMG,
		[LABELS.GPP_INTIMACY_LABEL]: GPP_INTIMACY_IMG,
		[LABELS.GPP_PREGNANCY_LABEL]: GPP_PREGNANCY_IMG,
		[LABELS.MANAGE_FLARE_LABEL]: MANGE_FLARE_IMG,
		[LABELS.GPP_COMORBIDITIES_LABEL]: GPP_COMORBIDITIES_IMG,
		[LABELS.MANAGE_GPP_SYMPTOMS_LABEL]: MANAGE_GPP_SYMPTOMS_IMG,
		[LABELS.ASK_DOCTOR_LABEL]: ASK_DOCTOR_IMG,
		[LABELS.SEEK_MEDICARE_LABEL]: SEEK_MEDICARE_IMG,
		[LABELS.SEEK_EMERGENCY_LABEL]: SEEK_EMERGENCY_IMG,
		[LABELS.MANAGE_SCARS_LABEL]: MANGE_SCARS_IMG,
		[LABELS.COMPLICAT_GPP_LABEL]: COMPLICAT_GPP_IMG,
		[LABELS.RECOGNIZING_FLARES_LABEL]: RECOGNIZING_FLARES_IMG,
		[LABELS.VISIT_DOCTOR_LABEL]: VISIT_IMG,
		[LABELS.DERMATOLOGIST_LABEL]: DERMATOLOGIST_IMG,
		[LABELS.TALK_GPP_LABEL]: TALK_GPP_IMG,
		[LABELS.NOT_ALONE_LABEL]: ALONE_IMG,
		[LABELS.POSITIVE_CHOICES_LABEL]: CHOICES_IMG,
		[LABELS.TREATING_GPP_LABEL]: TREATING_GPP_IMG,
		[LABELS.SPEVIGO_INFUSION_LABEL]: INFUSION_IMG,
		[LABELS.PREVENTION_GPP_LABEL]: PREVENTION_IMG,
		[LABELS.SPEVIGO_INJECTION_LABEL]: INJECTION_IMG,
		[LABELS.WORK_IN_GPP_LABEL]: WORK_IN_GPP_IMG
	};

	// Function to generate a secure random number within a specified range
	secureRandomInt(max) {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array); // Generate a random value
		return array[0] % max; // Limit the random number to the range 0 to max-1
	}

	// Function to generate unique random numbers based on article list length
	generateRandomNumbers() {
		let numbers = new Set();
		while (numbers.size < this.articleList.length) {
			let randomNumber = this.secureRandomInt(this.articleList.length); // Use secure random generator
			numbers.add(randomNumber);
		}
		return Array.from(numbers);
	}


	connectedCallback(){
		try{
			this.isLoaded=true;
			let globalThis = window;
			let currentUrl = globalThis.location.href;

			// Create a URL object
			let urlObject = new URL(currentUrl);

			// Get the path
			let path = urlObject.pathname;

			// Split the path using '/' as a separator
			let pathComponents = path.split('/');

			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[LABELS.BRANDED_URL.toLowerCase(), LABELS.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === LABELS.BRANDED_URL.toLowerCase()) {
				this.urlq = LABELS.BRANDED_URL;
				this.siteurl = LABELS.BRANDED_SITE_URL;
			} else {
				this.urlq = LABELS.UNASSIGNED_URL;
				this.siteurl = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

		}catch(err){
			this.navigateToErrorPage(err.message); // Catching Potential Error
		}
	}

	handleButtonClick(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articleName = finaltitle;
		UPDATE_REACTION({
			articleName: articleName, reaction: LABELS.VIEW_LABEL
		})
			.then(() => {
				this.articleTitle = LABELS.VIEW_LABEL+ ': ' + articleName;
			})
			.catch((error) => {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
				// Handle error, if needed
			});

			window.location.assign(
				this.baseUrl + this.siteurl + LABELS.DETAIL_PAGE + articleName
			);
			
		
	}

	// Used for navigation to landing page of information center
	navtoinforcenter() {
			window.location.assign(
				this.baseUrl + this.siteurl + LABELS.LANDING_PAGE
			);
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the cms article names, images and descriptions based on given channelname
	@wire(RETRIEVE_MEDIA_FROM_CMS_NEWS, { channelName: '$channelName' })
	wiredData({ error, data }) {
		try {
			if (data && data.length > 0) {
				let objStr = JSON.parse(data);

				let timestamp = new Date().getTime();
				let cbValue = `cb=${timestamp}`;

				objStr.map((element) => (this.results = [
						...this.results,
						{
							image: element.url + '?' + cbValue,
							text: element.title,
							text2: element.subtitle,
							page: element.url,
							readtime: this.topics[element.title]

						}
					]));
				this.mapArticles();
				this.isLoaded=false;
				this.dispatchEvent(new CustomEvent('articlesloaded'));
			} else if (error) {
				this.navigateToErrorPage(error.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To reterive the patient status (acute or chronic or unassigned)
	@wire(PATIENT_STATUS)
	wiredpatientstatus({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.patientStatusVal = data;
				// Handle the data
				if (this.patientStatusVal === LABELS.ACUTE_STATUS) {
					this.categoryValue = LABELS.FLARE_TREATMENT_LABEL;
				} else if (this.patientStatusVal === LABELS.CHRONIC_STATUS) {
					this.categoryValue = LABELS.FLARE_PREVENTION_LABEL;
				} else if (this.urlq === LABELS.BRANDED_URL) {
						this.categoryValue = LABELS.FLARE_PREVENTION_LABEL;
				} else {
						this.categoryValue = LABELS.FLARE_TREATMENT_LABEL;
				}
			} else if (error) {
				// Handle the error
				this.navigateToErrorPage(error.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// To map the articles heading and image
	mapArticles(){
		if (this.results.length > 0) {

			this.mapJustForMeArticles();

			this.removeChronicArticles();
			this.removeBrandedArticles();
			this.removeAcuteArticles();

			this.threeDifferentNumbers = this.generateRandomNumbers();

			this.mapFirstArticle();
			this.mapSecondArticle();
			this.mapThirdArticle();
			this.mapFourthArticle();
		}
		this.articleList = this.results;
		this.analyticsFirstHeading = LABELS.ARTICLE_STRING + ' ' + this.firstHeading;
		this.analyticsSecondHeading = LABELS.ARTICLE_STRING + ' ' + this.secondHeading;
		this.analyticsThirdHeading = LABELS.ARTICLE_STRING + ' ' + this.thirdHeading;
		this.analyticsFourthHeading = LABELS.ARTICLE_STRING + ' ' + this.fourthHeading;
		this.mapImage();
	}

	mapImage(){
		let imgele1 = this.template.querySelector('.backimg1');
		let imgele2 = this.template.querySelector('.backimg2');
		let imgele3 = this.template.querySelector('.backimg3');
		let imgele4 = this.template.querySelector('.backimg4');
		if (imgele1) {
			this.firstImg = this.getStaticResource(this.firstHeading);
			imgele1.style.backgroundImage = "url('" + this.firstImg + "')";
		}
		if (imgele2) {
			this.secondImg = this.getStaticResource(this.secondHeading);
			imgele2.style.backgroundImage = "url('" + this.secondImg + "')";
		}
		if (imgele3) {
			this.thirdImg = this.getStaticResource(this.thirdHeading);
			imgele3.style.backgroundImage = "url('" + this.thirdImg + "')";
		}
		if (imgele4) {
			this.fourthImg = this.getStaticResource(this.fourthHeading);
			imgele4.style.backgroundImage = "url('" + this.fourthImg + "')";
		}
	}

	mapJustForMeArticles(){
		if (this.justForMeArticleList.length !== 0) {
			let finalresult = this.filterResultsByTitles(
				this.justForMeArticleList
			);
			this.articleList = finalresult;
			if (this.articleList.length === 1) {
				this.showSecondArticle = false;
				this.showThirdArticle = false;
				this.showFourthArticle = false;
			}
			if (this.articleList.length === 2) {
				this.showThirdArticle = false;
				this.showFourthArticle = false;
			}
			if (this.articleList.length === 3) {
				this.showFourthArticle = false;
			}
		} else {
			this.articleList = this.results;
		}
	}
	removeAcuteArticles(){

		if (this.urlq === LABELS.BRANDED_URL) {
			if (this.patientStatusVal === LABELS.CHRONIC_STATUS) {
				let filteredData = this.articleList.filter(
					(entry) =>
						entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
						entry.text !== LABELS.TREATING_GPP_LABEL
				);
				this.articleList = filteredData;
			}
		}
	}

	removeBrandedArticles(){
		if (this.urlq !== LABELS.BRANDED_URL) {
			if (this.patientStatusVal !== LABELS.ACUTE_STATUS) {
				let filteredData = this.articleList.filter(
					(entry) =>
						entry.text !== LABELS.PREVENTION_GPP_LABEL &&
						entry.text !== LABELS.SPEVIGO_INJECTION_LABEL &&
						entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
						entry.text !== LABELS.TREATING_GPP_LABEL &&
						entry.text !== LABELS.WORK_IN_GPP_LABEL
				);
				this.articleList = filteredData;
			}
		}
	}

	removeChronicArticles(){
		if (this.urlq === LABELS.UNASSIGNED_URL) {
			if (this.patientStatusVal === LABELS.ACUTE_STATUS) {
				let filteredDataacute = this.articleList.filter(
					(entry) =>
						entry.text !== LABELS.PREVENTION_GPP_LABEL &&
						entry.text !== LABELS.SPEVIGO_INJECTION_LABEL
				);
				this.articleList = filteredDataacute;
			}
		}
	}

	mapFirstArticle(){
		if (this.articleList[this.threeDifferentNumbers[0]]) {
			this.firstImg = this.articleList[this.threeDifferentNumbers[0]].image;
			this.firstHeading = this.articleList[this.threeDifferentNumbers[0]].text;
			this.firstDescription =
				this.articleList[this.threeDifferentNumbers[0]].text2;
			this.readTimeOne = this.articleList[this.threeDifferentNumbers[0]].readtime;
		}
	}

	mapSecondArticle(){
		if (this.articleList[this.threeDifferentNumbers[1]]) {
			this.secondImg = this.articleList[this.threeDifferentNumbers[1]].image;
			this.secondHeading = this.articleList[this.threeDifferentNumbers[1]].text;
			this.secondDescription =
				this.articleList[this.threeDifferentNumbers[1]].text2;
			this.readTimeTwo = this.articleList[this.threeDifferentNumbers[1]].readtime;

		}
	}

	mapThirdArticle(){
		if (this.articleList[this.threeDifferentNumbers[2]]) {
			this.thirdImg = this.articleList[this.threeDifferentNumbers[2]].image;
			this.thirdHeading = this.articleList[this.threeDifferentNumbers[2]].text;
			this.thirdDescription =
				this.articleList[this.threeDifferentNumbers[2]].text2;
			this.readTimeThird = this.articleList[this.threeDifferentNumbers[2]].readtime;

		}
	}

	mapFourthArticle(){
		if (this.articleList[this.threeDifferentNumbers[3]]) {
			this.fourthImg = this.articleList[this.threeDifferentNumbers[3]].image;
			this.fourthHeading = this.articleList[this.threeDifferentNumbers[3]].text;
			this.fourthDescription =
				this.articleList[this.threeDifferentNumbers[3]].text2;
			this.readTimeFourth = this.articleList[this.threeDifferentNumbers[3]].readtime;

		}
	}
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To reterieve the Just for me articles from cms based on given channelname
	@wire(GET_PERSONALIZED_ARTICLES, { channelName: '$channelName' })
	wiredarticleData({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.justForMeArticleList = JSON.parse(JSON.stringify(data));
				this.mapArticles();

			} else if (error) {
				this.navigateToErrorPage(error.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// Filter the articles by titles
	filterResultsByTitles(titlesToFilter) {
		let shuffledResults = this.results;
		let filteredResults = [];
		let count = 1;

		for (let i = 0; i < shuffledResults.length; i++) {
			let result = shuffledResults[i];
			let titleFound = false;
		
			for (let j = 0; j < titlesToFilter.length; j++) {
				if (
					result.text.trim().toLowerCase() ===
					titlesToFilter[j].trim().toLowerCase()
				) {
					titleFound = true;
					break;
				}
			}
		
			if (titleFound) {
				result.count = count % 2 !== 0;
				count += 1;
				filteredResults.push(result);
			}
		}
		return filteredResults;
	}

	// To get the static resource for given article
	getStaticResource(title) {
		if (title in this.imageMap) {
			return this.imageMap[title];
		}
		return WHAT_GPP_IMG; // Default return value if title doesn't match any known articles
	}
	
	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.siteurl + LABELS.ERROR_PAGE;
	}
}