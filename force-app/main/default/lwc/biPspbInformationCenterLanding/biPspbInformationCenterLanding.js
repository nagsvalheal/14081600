// This Lightning web component is used to display the four most recent articles and is also utilized for category navigation.
// To import Libraries
import { LightningElement, wire } from 'lwc';
// To import Apex Classes
import RETRIEVE_MEDIA_FROM_CMS_NEWS from '@salesforce/apex/BI_PSPB_CmsCtrl.retrieveMediaFromCMSNews';
import SHOW_FILTER_RESPONSE from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
// To import Static Resource
import TREAT_VIDEO_IMG from '@salesforce/resourceUrl/BI_PSPB_TreatVideoImg';
import ACUTE_VIDEO_IMG from '@salesforce/resourceUrl/BI_PSPB_AcuteVideoThumbnail';
// To import Custom Labels
import { LABELS, MINSMAP } from 'c/biPspbLabelForInfoCenter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbInformationCenterLanding extends LightningElement {
	
	userId = ID;
	urlq;
	showTreatVideo = true;
	articleList = [];
	showJustForMe = false;
	results = [];
	result = [];
	patientStatusRecord = '';
	categoryLabel = '';
	touch = false;
	down = true;
	up = false;
	articleOneReadTime;
	articleTwoReadTime;
	articleThreeReadTime;
	svgHeight = 24;
	svgWidth = 24;
	renderedCount=0;
	firstImg;
	secondImg;
	thirdImg;
	videoThumbnail;
	firstHeading;
	secondHeading;
	thirdHeading;
	analyticFirstTag;
	analyticSecondTag;
	analyticThirdTag;
	channelName = LABELS.CHANNEL_NAME;
	firstDescription;
	secondDescription;
	thirdDescription;
	threeDifferentNumbers;
	submittedRecord;
	searchTerm = '';
	relatedItems = [];
	currentPageUrl;
	urlSegments;
	baseUrl;
	siteUrlq;
	articleTitle;
	searchItems = [];
	originalSearchItems = [];
	articleCategoriesLabel = LABELS.ARTICLE_CATEGORIES;
	justForMeLabel = LABELS.JUST_FOR_ME_CATEGORY
	minutes = LABELS.MINUTES;
	recentArticlesLabel = LABELS.RECENT_ARTICLES;
	visualLearningLabel = LABELS.VISUAL_LEARNING;
	watchLearnLabel = LABELS.WATCH_LEARN;
	videoLandingMsg = LABELS.VIDEO_LANDING_MSG;
	watchVideoLabel = LABELS.WATCH_VIDEO;
	// button labels
	standarItems = [
		{ id: 1, title: LABELS.WHAT_IS_GPP_CATEGORY, categoryLabel: LABELS.WHAT_IS_GPP_LABEL },
		{
			id: 2,
			title: LABELS.GPP_HEALTH_CATEGORY,
			categoryLabel: LABELS.GPP_HEALTH_LABEL
		},
		{
			id: 3,
			title: LABELS.TALK_HCP_CATEGORY,
			categoryLabel: LABELS.TALK_HCP_LABEL
		},
		{
			id: 4,
			title: LABELS.MANAGE_GPP_CATEGORY,
			categoryLabel: LABELS.MANAGE_GPP_LABEL
		},
		{
			id: 5,
			title: LABELS.FLARES_CATEGORY,
			categoryLabel: LABELS.FLARES_LABEL
		}
	];
	topics = MINSMAP;
	
	/* If user having null assessment record then disabled the just for me navigation */
	// To check whether the user has attended the LetsPersonalized questionnaires or not
	@wire(SHOW_FILTER_RESPONSE, {categoryname: LABELS.INTRODUCTION_CATEGORY})
	wiredShowFilterResponse({ error, data }) {
		try {
			if (data) {
				let showresponsedata = data;
				if (showresponsedata.length === 1 && showresponsedata[0].BI_PSP_StatusForPersonalization__c===LABELS.COMPLETE_STATUS ) {
					this.showJustForMe = true;
				} 
			} else if (error) {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// To retrieve the CMS article based on the given channel name
	@wire(RETRIEVE_MEDIA_FROM_CMS_NEWS, { channelName: '$channelName' })
	wiredData({ error, data }) {
		try {
			if (data) {
				let objStr = JSON.parse(data);
				let timestamp = new Date().getTime();
				let cbValue = `cb=${timestamp}`;

				objStr.map((element) => (this.results = [
						...this.results,
						{
							image: element.url + '?' + cbValue,
							text: element.title,
							text2: element.subtitle,
							page: element.url
						}
					]));
				this.mapArticles();
				const event = new CustomEvent('childrendered', {
					detail: { rendered: true }
					});
				this.dispatchEvent(event);

			} else if (error) {
				this.results = undefined;
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// To clear the search input
	clearinput() {
		let inputElement = this.template.querySelector('.search-bar');
		if (inputElement) {
			inputElement.value = '';
		}
	}

	// Function to generate a secure random integer within a specified range
	secureRandomInt(max) {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array); // Generate a random value
		return array[0] % max; // Limit the random number to the range 0 to max-1
	}

	// Function to generate 3 unique random numbers from 0 to 8 securely
	generateRandomNumbers() {
		let numbers = new Set();
		while (numbers.size < 3) {
			let randomNumber = this.secureRandomInt(9); // Generates numbers from 0 to 8
			numbers.add(randomNumber);
		}
		return Array.from(numbers);
	}

	connectedCallback(){
		try{
			let globalThis = window;
			if(globalThis.innerWidth<=600){
				this.svgHeight = 12;
				this.svgWidth = 12;
			}
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
				this.siteUrlq = LABELS.BRANDED_SITE_URL;
			} else {
				this.urlq = LABELS.UNASSIGNED_URL;
				this.siteUrlq = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			this.fetchPatientStatus();
			if (this.urlq === LABELS.BRANDED_URL) {
				this.showTreatVideo = true;
			} else if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
					this.showTreatVideo = true;
				} else {
					this.showTreatVideo = false;
				}
		}
		catch(err){
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
		window.location.href =
			this.baseUrl + this.siteUrlq + LABELS.DETAIL_PAGE + articleName;
	}

	// To navigate to article category page
	handleButtonClicknew(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articleName = finaltitle;
		window.location.href =
			this.baseUrl + this.siteUrlq + LABELS.CATEGORY_PAGE + articleName;
	}

	handleSearch(event) {
		let searchTerm = event.target.value.toLowerCase();

		if (searchTerm) {
			// Filter related items based on the search term
			this.searchItems = this.originalSearchItems.filter((item) =>
				item.title.toLowerCase().includes(searchTerm)
			);
		} else {
			// If the search input is empty, reset to original items
			this.searchItems = [...this.originalSearchItems];
		}

		// Navigate to the next page when Enter key is pressed
		if (event.key === LABELS.ENTER_EVENT && searchTerm) {
			window.location.href =
				this.baseUrl + this.siteUrlq + LABELS.SEARCH_PAGE + searchTerm;
		}
	}

	handleSearchButtonClick() {
		this.handleSearch();
	}

	handleSearchInputKeyUp(event) {
		if (event.key === LABELS.ENTER_EVENT) {
			this.handleSearch(event);
		}
	}

	handleSearchBarFocus() {
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.borderColor = '#7B4D00';
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.borderWidth = '2px';
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.transition = '0.1s';
	}

	handleSearchBarBlur() {
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.borderColor = 'rgba(111, 81, 29, 1)';
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.borderWidth = '2px';
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.transition = '0.1s';
	}

	// To navigate to video page based on user status
	openPTVPage() {
		if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
			window.location.assign(this.siteUrlq + LABELS.ACUTE_VIDEO_PAGE);
			this.categoryLabel = LABELS.FLARE_TREATMENT_LABEL;
		} else if (
			this.patientStatusRecord === LABELS.CHRONIC_STATUS &&
			this.urlq === LABELS.BRANDED_URL
		) {
			window.location.assign(this.siteUrlq + LABELS.CHRONIC_VIDEO_PAGE);
			this.categoryLabel = LABELS.FLARE_PREVENTION_LABEL;
		} else {
			window.location.assign(this.siteUrlq + LABELS.ACUTE_VIDEO_PAGE);
		}
	}

	// To retrieve the current patient status
	fetchPatientStatus() {
        PATIENT_STATUS()
            .then(data => {
                this.patientStatusRecord = data;
                // Handle the data
                if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
                    this.categoryLabel = LABELS.FLARE_TREATMENT_LABEL;
                    this.videoThumbnail = ACUTE_VIDEO_IMG;
                } else if (this.patientStatusRecord === LABELS.CHRONIC_STATUS) {
                    this.categoryLabel = LABELS.FLARE_PREVENTION_LABEL;
                    this.videoThumbnail = TREAT_VIDEO_IMG;
                } else if (this.urlq === LABELS.BRANDED_URL) {
                    this.categoryLabel = LABELS.FLARE_PREVENTION_LABEL;
                } else {
                    this.categoryLabel = LABELS.FLARE_TREATMENT_LABEL;
                    this.videoThumbnail = TREAT_VIDEO_IMG;
                }
            })
            .catch(error => {
                this.navigateToErrorPage(error.body.message);
            });
    }

	click() {
		this.touch = true;
		this.down = false;
		this.up = true;
	}
	notClick() {
		this.touch = false;
		this.down = true;
		this.up = false;
	}

	mapArticles(){

		if (this.results.length > 0) {
			this.articleList = this.results;

			this.filterUnAssignedArticles();

			if (this.urlq === LABELS.BRANDED_URL) {
				if (this.patientStatusRecord === LABELS.CHRONIC_STATUS) {
					let filteredData = this.articleList.filter(
						(entry) =>
							entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
							entry.text !== LABELS.TREATING_GPP_LABEL
					);
					this.articleList = filteredData;
				}
				if (this.patientStatusRecord === LABELS.UNASSIGNED_STATUS) {
					this.showTreatVideo = false;
				}
			}

			this.threeDifferentNumbers = this.generateRandomNumbers();

			this.mapFirstArticle();
			this.mapSecondArticle();
			this.mapThirdArticle();


		}
		this.articleList = this.results;
		this.analyticFirstTag = LABELS.ARTICLE_STRING + ' ' + this.firstHeading;
		this.analyticSecondTag = LABELS.ARTICLE_STRING + ' ' + this.secondHeading;
		this.analyticThirdTag = LABELS.ARTICLE_STRING + ' ' + this.thirdHeading;

		this.articleOneReadTime = this.topics[this.firstHeading];
		this.articleTwoReadTime = this.topics[this.secondHeading];
		this.articleThreeReadTime = this.topics[this.thirdHeading];
	}

	filterUnAssignedArticles(){
		if (this.urlq === LABELS.UNASSIGNED_URL) {
			if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
				this.showTreatVideo = true;

				let filteredDataacute = this.articleList.filter(
					(entry) =>
						entry.text !== LABELS.PREVENTION_GPP_LABEL &&
						entry.text !== LABELS.SPEVIGO_INJECTION_LABEL
				);
				this.articleList = filteredDataacute;
			}
		}
		this.removeBrandedArticles();
	}

	removeBrandedArticles(){
		if (this.urlq !== LABELS.BRANDED_URL) {
			if (this.patientStatusRecord !== LABELS.ACUTE_STATUS) {
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
			if (this.patientStatusRecord === LABELS.UNASSIGNED_STATUS) {
				this.showTreatVideo = false;
			}
		}
	}

	mapFirstArticle(){
		if (this.articleList[this.threeDifferentNumbers[0]]) {
			this.firstImg = this.articleList[this.threeDifferentNumbers[0]].image;
			this.firstHeading = this.articleList[this.threeDifferentNumbers[0]].text;
			this.firstDescription =
				this.articleList[this.threeDifferentNumbers[0]].text2;
		}
	}

	mapSecondArticle(){
		if (this.articleList[this.threeDifferentNumbers[1]]) {
			this.secondImg = this.articleList[this.threeDifferentNumbers[1]].image;
			this.secondHeading = this.articleList[this.threeDifferentNumbers[1]].text;
			this.secondDescription =
				this.articleList[this.threeDifferentNumbers[1]].text2;
		}
	}

	mapThirdArticle(){
		if (this.articleList[this.threeDifferentNumbers[2]]) {
			this.thirdImg = this.articleList[this.threeDifferentNumbers[2]].image;
			this.thirdHeading = this.articleList[this.threeDifferentNumbers[2]].text;
			this.thirdDescription =
				this.articleList[this.threeDifferentNumbers[2]].text2;
		}
	}
	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.baseUrl + this.siteUrlq + LABELS.ERROR_PAGE; 
	}
}