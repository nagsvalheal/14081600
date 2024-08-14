// This lightning web component is used for display the related articles of selected articles category
// To import Libraries
import { LightningElement, wire} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
// To import Apex Classes
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import RETRIEVE_MEDIA_FROM_CMS_NEWS from '@salesforce/apex/BI_PSPB_CmsCtrl.retrieveMediaFromCMSNews';
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
// To import static resources
import ROUND_ICON from '@salesforce/resourceUrl/BI_PSP_RoundNextIcon';
// To import Custom Labels
import { LABELS, MINSMAP } from 'c/biPspbLabelForInfoCenter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbRelatedArticles extends LightningElement {

	previous = LABELS.PREVEIOUS;
	next = LABELS.NEXT;
	relatedArticles = LABELS.RELATED_ARTICLES;
	minutes = LABELS.MINUTES;
	currentIndex = 0;
	isDisabledprev;
	showContent = false;
	isDisablednext;
	articleTitle;
	prevPage;
	nextPage;
	categoryOfArticle;
	articleCategoryList = [];
	articleList = [];
	results = [];
	result = [];
	patientStatus;
	categoryForAnalytics;
	articleNameData = '';
	urlq;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showBrandedNav = true;
	articleOneReadTime;
	articleTwoReadTime;
	articleThreeReadTime;
	prevBlur=false;
	nextBlur=false;
	renderedCount=0;
	siteUrlq;
	firstImg;
	secondImg;
	thirdImg;
	firstHeading;
	secondHeading;
	thirdHeading;
	nextArticle;
	previousArticle;
	userId = ID;
	nextBtn=ROUND_ICON;
	titleOneForAnalytics;
	titleTwoForAnalytics;
	titleThreeForAnalytics;
	firstDescription;
	secondDescription;
	thirdDescription;
	threeDifferentNumbers;
	submittedRecord;
	channelName = LABELS.CHANNEL_NAME;
	articleMinsMap = MINSMAP;
	topics = [
		LABELS.RARE_GPP_LABEL,
		LABELS.FACTS_GPP_LABEL,
		LABELS.WHAT_GPP_LABEL,
		LABELS.GPP_CONTAGIOUS_LABEL,
		LABELS.WHY_DO_I_HAVE_GPP_LABEL,
		LABELS.TALK_GPP_LABEL,
		LABELS.NOT_ALONE_LABEL,
		LABELS.DIAGNOSIS_GPP_LABEL,
		LABELS.FEELING_EXCLUDED_LABEL,
		LABELS.FRIENDS_FAMILY_LABEL,
		LABELS.GPP_COMORBIDITIES_LABEL,
		LABELS.VISIT_DOCTOR_LABEL,
		LABELS.ASK_DOCTOR_LABEL,
		LABELS.SEEK_MEDICARE_LABEL,
		LABELS.DERMATOLOGIST_LABEL,
		LABELS.POSITIVE_CHOICES_LABEL,
		LABELS.GPP_PREGNANCY_LABEL,
		LABELS.GPP_INTIMACY_LABEL,
		LABELS.SEEK_EMERGENCY_LABEL,
		LABELS.COMPLICAT_GPP_LABEL,
		LABELS.RECOGNIZING_FLARES_LABEL,
		LABELS.MANAGE_FLARE_LABEL,
		LABELS.MANAGE_GPP_SYMPTOMS_LABEL,
		LABELS.MANAGE_SCARS_LABEL
	];
	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the CMS article content
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
					this.dispatchEvent(new CustomEvent('articlesloaded'));
			} else if (error) {
				this.navigateToErrorPage(error.body.message);  // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message);  // Catching Potential Error from Lwc
		}
	}

	// Getter function to determine whether to display the category value for Spevigo.
	get findSpevigoCategory() {
		return !(this.categoryOfArticle === LABELS.CHRONIC_CATEGORY ||
			this.categoryOfArticle === LABELS.ACUTE_CATEGORY);
	}

	// Getter method to determine the class of the button
	get ClassOfButton() {
		if (this.firstHeading === LABELS.MANAGE_FLARE_LABEL) {
			return "button-disable";
		}
		return "borderless-button";
	}

	// Function to generate a secure random integer within a specified range
	secureRandomInt(max) {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array); // Generate a random value
		return array[0] % max; // Limit the random number to the range 0 to max-1
	}
	
    // Method to generate unique secure random numbers based on the length of articleCategoryList
    generateRandomNumbers() {
        let len = this.articleCategoryList.length;
        let numbers = new Set();

        while (numbers.size < len) {
            let randomNumber = this.secureRandomInt(len); // Generates numbers from 0 to len-1
            numbers.add(randomNumber);
        }

        return Array.from(numbers);
    }


	// To navigate article detail page
	navigateToArticleContent(event) {
		// Prevent any default action and stop propagation
		event.preventDefault();
		event.stopPropagation();
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

	// Wire method to capture the current page reference and extract the state id value
	// We are unable to utilize "data" or "error" as CurrentPageReference is default API.
	@wire(CurrentPageReference)
	pageReference({ state }) {
		try {
			if (state?.id) {
				this.articleNameData = state.id;
				this.articleTitle = state.id;
			}
			else {
				this.articleNameData = LABELS.SEEK_MEDICARE_LABEL;
				this.articleTitle = LABELS.SEEK_MEDICARE_LABEL;
			}
				let titlesMap = {
					[LABELS.WHAT_IS_GPP_LABEL]: [
						LABELS.RARE_GPP_LABEL,
						LABELS.FACTS_GPP_LABEL,
						LABELS.WHAT_GPP_LABEL,
						LABELS.GPP_CONTAGIOUS_LABEL,
						LABELS.WHY_DO_I_HAVE_GPP_LABEL
					],
					[LABELS.GPP_HEALTH_LABEL]: [
						LABELS.TALK_GPP_LABEL,
						LABELS.NOT_ALONE_LABEL,
						LABELS.DIAGNOSIS_GPP_LABEL,
						LABELS.FEELING_EXCLUDED_LABEL,
						LABELS.FRIENDS_FAMILY_LABEL
					],
					[LABELS.TALK_HCP_LABEL]: [
						LABELS.GPP_COMORBIDITIES_LABEL,
						LABELS.VISIT_DOCTOR_LABEL,
						LABELS.ASK_DOCTOR_LABEL,
						LABELS.SEEK_MEDICARE_LABEL,
						LABELS.DERMATOLOGIST_LABEL
					],
					[LABELS.MANAGE_GPP_LABEL]: [
						LABELS.POSITIVE_CHOICES_LABEL,
						LABELS.GPP_PREGNANCY_LABEL,
						LABELS.GPP_INTIMACY_LABEL,
						LABELS.SEEK_EMERGENCY_LABEL,
						LABELS.COMPLICAT_GPP_LABEL
					],
					[LABELS.FLARES_LABEL]: [
						LABELS.RECOGNIZING_FLARES_LABEL,
						LABELS.MANAGE_FLARE_LABEL,
						LABELS.MANAGE_GPP_SYMPTOMS_LABEL,
						LABELS.MANAGE_SCARS_LABEL
					],
					[LABELS.ACUTE_CATEGORY]: [
						LABELS.TREATING_GPP_LABEL,
						LABELS.SPEVIGO_INFUSION_LABEL,
						LABELS.WORK_IN_GPP_LABEL
					],
					[LABELS.CHRONIC_CATEGORY]: [
						LABELS.PREVENTION_GPP_LABEL,
						LABELS.SPEVIGO_INJECTION_LABEL,
						LABELS.WORK_IN_GPP_LABEL
					]
				};

				for (let key in titlesMap) {
					if (titlesMap[key].includes(this.articleTitle)) {
						this.categoryOfArticle = key;
						break;
					}
				}

				this.articleCategoryList = titlesMap[this.categoryOfArticle];



				let index = this.topics.indexOf(this.articleTitle);
				if (index === 0) {
					this.isDisabledprev = "button-disable";
					this.isDisablednext = "borderless-button-next";
					this.nextPage = this.topics[index + 1];
					this.prevBlur=true;
				} else if (index === this.topics.length - 1) {
					this.isDisabledprev = "borderless-button";
					this.isDisablednext = "button-disable";
					this.prevPage = this.topics[index - 1];
					this.nextBlur = true;
				} else {
					this.isDisabledprev = "borderless-button";
					this.isDisablednext = "borderless-button-next";
					this.prevPage = this.topics[index - 1];
					this.nextPage = this.topics[index + 1];
					this.nextBlur = false;
				}
				
		} catch (err) {
			this.navigateToErrorPage(err.message);  // Catching Potential Error
		}
	}

	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve patient status value
	
	articleNextPrevLogic(){
				if (this.patientStatus === LABELS.ACUTE_STATUS) {
					this.categoryForAnalytics = LABELS.FLARE_TREATMENT_CATEGORY;
				} else if (this.patientStatus === LABELS.CHRONIC_STATUS) {
					this.categoryForAnalytics = LABELS.FLARE_PREVENTION_CATEGORY;
				}

				if (this.articleNameData) {
					this.articleTitle = this.articleNameData;
					if (this.urlq === LABELS.BRANDED_URL) {
							this.filterBrandedArticles();
					} else {
							this.filterUnAssignedArticles();
					}

					let index = this.topics.indexOf(this.articleTitle);
					this.getNextArticle(index);
					this.nextArticle = LABELS.ARTICLE_STRING + ' ' + this.nextPage;
					this.previousArticle = LABELS.ARTICLE_STRING + ' ' + this.prevPage;
				}
	}

	getNextArticle(index){
		if (index === 0) {
			this.isDisabledprev = "button-disable";
			this.isDisablednext = "borderless-button-next";
			this.nextPage = this.topics[index + 1];
			this.prevBlur=true;
		} else if (index === this.topics.length - 1) {
			this.isDisabledprev = "borderless-button";
			this.isDisablednext = "button-disable";
			this.prevPage = this.topics[index - 1];
			this.nextBlur = true;
		} else {
			this.isDisabledprev = "borderless-button";
			this.isDisablednext = "borderless-button-next";
			this.prevPage = this.topics[index - 1];
			this.nextPage = this.topics[index + 1];
			this.nextBlur =false;
		}
	}

	filterBrandedArticles(){
		if (this.categoryForAnalytics === LABELS.FLARE_TREATMENT_CATEGORY) {
			this.topics.push(LABELS.TREATING_GPP_LABEL);
			this.topics.push(LABELS.SPEVIGO_INFUSION_LABEL);
			this.topics.push(LABELS.WORK_IN_GPP_LABEL);
		} else {
			this.topics.push(LABELS.PREVENTION_GPP_LABEL);
			this.topics.push(LABELS.SPEVIGO_INJECTION_LABEL);
			this.topics.push(LABELS.WORK_IN_GPP_LABEL);
		}
	}

	filterUnAssignedArticles(){
		if (this.patientStatus === LABELS.ACUTE_STATUS) {
			this.topics.push(LABELS.TREATING_GPP_LABEL);
			this.topics.push(LABELS.SPEVIGO_INFUSION_LABEL);
			this.topics.push(LABELS.WORK_IN_GPP_LABEL);
		}
		if (this.patientStatus === LABELS.CHRONIC_STATUS) {
			this.topics.push(LABELS.PREVENTION_GPP_LABEL);
			this.topics.push(LABELS.SPEVIGO_INJECTION_LABEL);
			this.topics.push(LABELS.WORK_IN_GPP_LABEL);
		}
	}
	// Filter the article by given title
	filterResultsByTitles(titlesToFilter) {
		let shuffledResults;

		shuffledResults = this.results;

		let filteredResults = [];
		let count = 1;

		for (let i = 0; i < shuffledResults.length; i++) {
			let result = shuffledResults[i];
			let titleFound = false;
		
			for (let j = 0; j < titlesToFilter.length; j++) {
				let ele = titlesToFilter[j];
				if (result.text.trim().toLowerCase() === ele.trim().toLowerCase()) {
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

	getPatientStatus(){
		PATIENT_STATUS()
		.then(data => {
			if (data) {
				// Handle the data
				this.patientStatus = data;
				this.articleNextPrevLogic();
			}
		})
		.catch(error => {
			this.navigateToErrorPage(error.message);
		});
	}

	getNextBtnDesign() {
		if (window.innerWidth < 1115) {
			if (this.articleTitle === LABELS.RARE_GPP_LABEL) {
				let styleofprenbtn = this.template.querySelector(".button-disable");
				if(styleofprenbtn){
				styleofprenbtn.style.marginRight = "auto";
				styleofprenbtn.style.marginLeft = "0";
				}
				let prevHeading = this.template.querySelector('.preheading');
				if(prevHeading){
				prevHeading.style.marginTop="6px";
				}


			}
			if (this.isDisablednext === "button-disable") {
				let styleofnxbtn = this.template.querySelector(".button-disable");
				if(styleofnxbtn){
				styleofnxbtn.style.marginLeft = "auto";
				}
			}
		}
	}
	connectedCallback() {
		try{
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
				this.siteUrlq = LABELS.BRANDED_SITE_URL;
			} else {
				this.urlq = LABELS.UNASSIGNED_URL;
				this.siteUrlq = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

			if (this.urlq === LABELS.BRANDED_URL) {
				this.showBrandedNav = true;
			} else {
				this.showBrandedNav = false;
			}
			this.getPatientStatus();
		}
		catch(error){
			this.navigateToErrorPage(error.message);
		}
	}
	// To render the article previous button and next button 
	renderedCallback() {
		try {
			this.getNextBtnDesign();
		} catch (err) {
			this.navigateToErrorPage(err.message);  // Catching Potential Error
		}
	}
	
	mapArticles(){
		if (this.results.length > 0) {
			this.articleList = this.results;

			if (this.articleTitle === LABELS.WORK_IN_GPP_LABEL) {
				this.fetchSpevigoArticles();
			}

			let articleToRemove = this.articleTitle;

			let newList = [];
			this.articleCategoryList.forEach((item) => {
				if (item !== articleToRemove) {
					newList.push(item);
				}
			});

			this.articleCategoryList = newList;

			let testdata = this.filterResultsByTitles(this.articleCategoryList);
			this.articleList = testdata;
			if (this.urlq !== LABELS.BRANDED_URL || this.urlq.length !== 0) {
				this.removeBrandedArticles();
				this.removeChronicArticles();
				this.removeAcuteArticles();
			}

			this.threeDifferentNumbers = this.generateRandomNumbers();

			this.mapFirstArticle();
			this.mapSecondArticle();
			this.mapThirdArticle();
			this.titleOneForAnalytics = LABELS.ARTICLE_STRING + ' ' + this.firstHeading;
			this.titleTwoForAnalytics = LABELS.ARTICLE_STRING + ' ' + this.secondHeading;
		}
		this.articleList = this.results;
		this.showContent = true;
	}

	fetchSpevigoArticles(){
		if (this.patientStatus === LABELS.ACUTE_STATUS) {
			this.articleCategoryList = [
				LABELS.TREATING_GPP_LABEL,
				LABELS.SPEVIGO_INFUSION_LABEL,
				LABELS.WORK_IN_GPP_LABEL
			];
		} else if (this.patientStatus === LABELS.CHRONIC_STATUS) {
			this.articleCategoryList = [
				LABELS.PREVENTION_GPP_LABEL,
				LABELS.SPEVIGO_INJECTION_LABEL,
				LABELS.WORK_IN_GPP_LABEL
			];
		}
	}

	removeBrandedArticles(){
		if (this.patientStatus === LABELS.UNASSIGNED_STATUS) {
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

	removeChronicArticles(){
		if (this.patientStatus === LABELS.ACUTE_STATUS) {
			let filteredDataacute = this.articleList.filter(
				(entry) =>
					entry.text !== LABELS.PREVENTION_GPP_LABEL &&
					entry.text !== LABELS.SPEVIGO_INJECTION_LABEL
			);
			this.articleList = filteredDataacute;
		}
	}

	removeAcuteArticles(){
		if (this.patientStatus === LABELS.CHRONIC_STATUS) {
			let filteredDatachronic = this.articleList.filter(
				(entry) =>
					entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
					entry.text !== LABELS.TREATING_GPP_LABEL
			);
			this.articleList = filteredDatachronic;
		}
	}
	
	mapFirstArticle(){

		if (this.articleList[this.threeDifferentNumbers[0]]) {
			this.firstImg = this.articleList[this.threeDifferentNumbers[0]].image;
			this.firstHeading = this.articleList[this.threeDifferentNumbers[0]].text;
			this.articleOneReadTime = this.articleMinsMap[this.firstHeading];
			this.firstDescription =
				this.articleList[this.threeDifferentNumbers[0]].text2;
		}
	}

	mapSecondArticle(){
		if (this.articleList[this.threeDifferentNumbers[1]]) {
			this.secondImg = this.articleList[this.threeDifferentNumbers[1]].image;
			this.secondHeading = this.articleList[this.threeDifferentNumbers[1]].text;
			this.articleTwoReadTime = this.articleMinsMap[this.secondHeading];
			this.secondDescription =
				this.articleList[this.threeDifferentNumbers[1]].text2;
		}
	}

	mapThirdArticle(){
		if (
			this.categoryOfArticle !== LABELS.CHRONIC_CATEGORY &&
			this.categoryOfArticle !== LABELS.ACUTE_CATEGORY
		) {
			if (this.articleList[this.threeDifferentNumbers[2]]) {
				this.thirdImg = this.articleList[this.threeDifferentNumbers[2]].image;
				this.thirdHeading = this.articleList[this.threeDifferentNumbers[2]].text;
				this.articleThreeReadTime = this.articleMinsMap[this.thirdHeading];
				this.thirdDescription =
					this.articleList[this.threeDifferentNumbers[2]].text2;
				this.titleThreeForAnalytics = LABELS.ARTICLE_STRING + ' ' + this.thirdHeading;
			}
		}
	}
	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.baseUrl + this.siteUrlq + LABELS.ERROR_PAGE; 
	}
}