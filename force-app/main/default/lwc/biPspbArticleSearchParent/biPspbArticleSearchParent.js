// This lightning web component is used to display the searched article and search avatar message
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
// To import Apex Classes
import RETRIEVE_MEDIA_FROM_CMS_NEWS from '@salesforce/apex/BI_PSPB_CmsCtrl.retrieveMediaFromCMSNews';
import SHOW_FILTER_RESPONSE from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
// To import Custom Labels
import { LABELS, MINSMAP, TAGDATA, SEARCH_ARTICLE_MAP} from 'c/biPspbLabelForInfoCenter';

// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbArticleSearchParent extends LightningElement {

	loadMoreLabel = LABELS.LOAD_MORE;
	userId = ID;
	searchInput = '';
	showNoResults = false;
	stateValue = '';
	currentLength;
	currentSearchList = [];
	showLoadMore = false;
	showJustForMe = false;
	showBrandedNav = false;
	articleList = [];
	containerHeight;
	patientStatusValue = '';
	categoryForAnalytics;
	searchItems = [];
	originalSearchItems = [];
	standarItems = [];
	results = [];
	result = [];
	touch = false;
	down = true;
	up = false;
	urlq;
	showSpinner = false;
	currentPageUrl;
	urlSegments;
	baseUrl;
	siteUrlq;
	searchTerm = '';
	relatedItems = [];
	channelName = LABELS.CHANNEL_NAME;
	articleTitle;
	articles = LABELS.ARTICLES;
	patientTreatmentVideos = LABELS.PATIENT_TREATMENT_VIDEOS;
	spevigoArticleLabel=LABELS.SPEVIGO_ARTICLES;
	noSearchResult = LABELS.NO_SEARCH_RESULTS;
	justForMeCategory = LABELS.JUST_FOR_ME_CATEGORY;
	articleCategories = LABELS.ARTICLE_CATEGORIES;

	topics = MINSMAP;
	// button labels
	categoryList = [
		{ id: 1, title: LABELS.WHAT_IS_GPP_CATEGORY, titleadb: LABELS.WHAT_IS_GPP_LABEL },
		{
			id: 2,
			title: LABELS.GPP_HEALTH_CATEGORY,
			titleadb: LABELS.GPP_HEALTH_LABEL
		},
		{
			id: 3,
			title: LABELS.TALK_HCP_CATEGORY,
			titleadb: LABELS.TALK_HCP_LABEL
		},
		{
			id: 4,
			title: LABELS.MANAGE_GPP_CATEGORY,
			titleadb: LABELS.MANAGE_GPP_LABEL
		},
		{
			id: 5,
			title: LABELS.FLARES_CATEGORY,
			titleadb: LABELS.FLARES_LABEL
		}
	];

	// Tag and article map

	tagArticleMap = SEARCH_ARTICLE_MAP;

	tagsData = TAGDATA;

	renderedChildrenCount = 0;
    totalChildren = 3; // Total number of child components

    // Getter to check if all children have rendered
    get allChildrenRendered() {
        return this.renderedChildrenCount >= this.totalChildren;
    }
   /**
     * @param {boolean} val
     */
    // Setter to increment the count when a child is rendered
    set childRendered(val) {
        if (val) {
            this.renderedChildrenCount++;
            if (this.allChildrenRendered) {
                this.showSpinner = false;
            }
        }
    }

	// To get the render count
	handleChildRendered(event) {
		this.childRendered = event.detail.rendered;
		}
	// To navigate information center landing page
	openArticlesPage() {
		window.location.assign(this.siteUrlq + LABELS.LANDING_PAGE);
	}

	// To navigate information center video page based on patient status value(Acute or Chronic)
	openPTVPage() {
		if (this.patientStatusValue === LABELS.ACUTE_STATUS) {
			window.location.assign(this.siteUrlq + LABELS.ACUTE_VIDEO_PAGE);
		} else if (this.patientStatusValue === LABELS.CHRONIC_STATUS) {
			if (this.urlq === LABELS.BRANDED_URL) {
				window.location.assign(this.siteUrlq + LABELS.CHRONIC_VIDEO_PAGE);
			} else {
				window.location.assign(this.siteUrlq + LABELS.ACUTE_VIDEO_PAGE);
			}
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve patient status value
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusValue = data;

				if (this.patientStatusValue === LABELS.ACUTE_STATUS) {
					this.showBrandedNav = true;
					this.categorytreatmentnew = LABELS.FLARE_TREATMENT_LABEL;
					this.categoryForAnalytics = LABELS.FLARE_TREATMENT_CATEGORY;
				} else if (this.patientStatusValue === LABELS.CHRONIC_STATUS) {
					this.showBrandedNav = true;
					this.categorytreatmentnew = LABELS.FLARE_PREVENTION_LABEL;
					this.categoryForAnalytics = LABELS.FLARE_PREVENTION_CATEGORY;
				}
				if (this.patientStatusValue === LABELS.UNASSIGNED_STATUS) {
					this.showBrandedNav = false;
				} else if (this.urlq === LABELS.BRANDED_URL) {
					this.categorytreatmentnew = LABELS.FLARE_PREVENTION_LABEL;
					this.categoryForAnalytics = LABELS.FLARE_PREVENTION_CATEGORY;
				} else {
					this.categorytreatmentnew = LABELS.FLARE_TREATMENT_LABEL;
					this.categoryForAnalytics = LABELS.FLARE_TREATMENT_CATEGORY;
				}

				// Handle the data
			} else if (error) {
				// Handle the error
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	/* If user having null assessment record then disabled the just for me navigation */
	// To retrieve letspersonalize assessment data
	@wire(SHOW_FILTER_RESPONSE, {categoryname: LABELS.INTRODUCTION_CATEGORY})
	wiredShowFilterResponse({ error, data }) {
		try {
			if (data) {
				this.showJustForMe = false;

				let showresponsedata = data;
				if (showresponsedata.length === 1 && showresponsedata[0].BI_PSP_StatusForPersonalization__c===LABELS.COMPLETE_STATUS ) {
					this.showJustForMe = true;
				} else if(data === null) {
					this.showJustForMe = false;
				}
			} else if (error) {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			} else {
				this.showJustForMe = false;
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve CMS article data
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
						page: element.url,
						titleadb: LABELS.ARTICLE_STRING + ' ' + element.title,
						readtime: this.topics[element.title]
					}
				]));

				if (this.results.length > 0) {

						this.removeChronicArticles();
						this.removeAcuteArticles();
						this.removeBrandedArticles();
						this.removeArticlesForUnassigned();

					this.originalSearchItems = this.results;
					this.articleList = this.results;

					this.pageReferenceLogic();
				} 
				this.renderedChildrenCount++;
			}
			else if (error) {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	removeChronicArticles(){
		if (this.patientStatusValue === LABELS.ACUTE_STATUS) {
			let filteredDatanacute = this.results.filter(
				(entry) =>
					entry.text !== LABELS.PREVENTION_GPP_LABEL &&
					entry.text !== LABELS.SPEVIGO_INJECTION_LABEL
			);
			this.results = filteredDatanacute;
		}
	}

	removeAcuteArticles(){
		if (this.patientStatusValue === LABELS.CHRONIC_STATUS) {
			let filteredDatachronic = this.results.filter(
				(entry) =>
					entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
					entry.text !== LABELS.TREATING_GPP_LABEL
			);
			this.results = filteredDatachronic;
		}
	}

	removeBrandedArticles(){
		if (this.patientStatusValue === LABELS.UNASSIGNED_STATUS) {
			let filteredDataun = this.results.filter(
				(entry) =>
					entry.text !== LABELS.PREVENTION_GPP_LABEL &&
					entry.text !== LABELS.SPEVIGO_INJECTION_LABEL &&
					entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
					entry.text !== LABELS.TREATING_GPP_LABEL &&
					entry.text !== LABELS.WORK_IN_GPP_LABEL
			);
			this.results = filteredDataun;
		}
	}

	removeArticlesForUnassigned(){
		if (this.patientStatusValue === '') {
			let filteredData = this.results.filter(
				(entry) =>
					entry.text !== LABELS.PREVENTION_GPP_LABEL &&
					entry.text !== LABELS.SPEVIGO_INJECTION_LABEL &&
					entry.text !== LABELS.SPEVIGO_INFUSION_LABEL &&
					entry.text !== LABELS.TREATING_GPP_LABEL &&
					entry.text !== LABELS.WORK_IN_GPP_LABEL
			);
			this.results = filteredData;
		}
	}
	// To capitalize first letter of the input string
	capitalizeFirstLetter(inputString) {
		// Check if the input is a non-empty string
		if (typeof inputString === 'string' && inputString.length > 0) {
			return inputString.charAt(0).toUpperCase() + inputString.slice(1);
		}
		// Handle empty or non-string inputs
		return inputString;
	}

	openSpevigoCategory() {

		if(this.patientStatusValue === LABELS.CHRONIC_STATUS){
			window.location.assign(this.siteUrlq+LABELS.CATEGORY_PAGE+LABELS.FLARE_PREVENTION_LABEL)
		}
		else{
			window.location.assign(this.siteUrlq+LABELS.CATEGORY_PAGE+LABELS.FLARE_TREATMENT_LABEL)
		}
	}

	// To clear the search input
	clearInput() {
		let inputElement = this.template.querySelector('.search-bar');

		inputElement.value = '';

		if (inputElement) {
			inputElement.value = '';
		}
	}

	// To clear the Search input for mobile search bar
	clearInputMob() {
		let inputElement = this.template.querySelector('.search-barnew');

		inputElement.value = '';

		if (inputElement) {
			inputElement.value = '';
		}
	}

	// To navigate  information center detail article page
	handleReloadAndNavigate(event) {
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

	// To navigate information center search results page
	handleSearch(event) {
		let searchTerm = event.target.value.toLowerCase().trim();
		this.searchInput = event.target.value.trim();
		this.searchItems = [];
		// Filter related items based on the search term

		this.getArticleByTitle(searchTerm);
		let searchvalu = searchTerm;
		let searchval = this.capitalizeFirstLetter(searchvalu);
		this.standarItems = [];
		this.getTagRecords(searchval);

		this.standarItems = [...new Set(this.standarItems)];
		let searchlower = event.target.value.trim();
		let searchlowerval = searchlower.toLowerCase();

		// Ensure searchItems is initialized
		// this.searchItems = [];
		this.getAriclesByKeywords(searchlowerval);
		if (this.searchItems.length === 0) {
			this.showNoResults = true;
		} else {
			this.showNoResults = false;
		}

		this.showLoadMore = true;

		this.currentLength = 5;
		this.currentSearchList = this.searchItems;
		this.searchItems = this.currentSearchList.slice(
			0,
			this.currentLength
		);

		if (this.currentLength < this.currentSearchList.length) {
			this.showLoadMore = true;
		} else {
			this.showLoadMore = false;
		}
	}

	getArticleByTitle(searchTerm){
		for (let i = 0; i < this.originalSearchItems.length; i++) {
			let item = this.originalSearchItems[i];
			if (searchTerm.toLowerCase() !== LABELS.GPP_FLARE.toLowerCase()) {
				if (item.text.toLowerCase().includes(searchTerm.toLowerCase())) {
					this.searchItems.push(item);
				}
			}
		}
	}

	getTagRecords(searchval){
		for (let i = 0; i < this.tagsData.length; i++) {
			for (let j = 0; j < this.tagsData[i].searchTermn.length; j++) {
				if (
					this.tagsData[i].searchTermn[j].toLowerCase() ===
					searchval.toLowerCase()
				) {
					for (let k = 0; k < this.tagsData[i].standardItem.length; k++) {
						this.standarItems.push(this.tagsData[i].standardItem[k]);
					}
					break;
				}
			}
		}
	}

	getAriclesByKeywords(searchlowerval){
		for (let i = 0; i < this.tagArticleMap.length; i++) {
			let elementTag = this.tagArticleMap[i];
			let tagRecord = JSON.stringify(elementTag.tagValue[0]);
			let tagLowerRecord = tagRecord.toLowerCase().replace(/"/gu, '');
		
			if (searchlowerval === tagLowerRecord) {
				for (let j = 0; j < elementTag.articles.length; j++) {
					let articleName = elementTag.articles[j];
					this.filterArticleByTitle(articleName);
				}
			}
		}
	}
	
	filterArticleByTitle(articleName){
		for (let k = 0; k < this.originalSearchItems.length; k++) {
			let item = this.originalSearchItems[k];
			
			if (item.text.toLowerCase().includes(articleName.toLowerCase())) {
				if (!this.searchItems.includes(item)) {
					this.searchItems.push(item);
				}
			}
		}
	}
	// To load the article in search results page if more than 5 articles are present
	loadMore() {
		this.currentLength = this.currentLength + 5;
		this.searchItems = this.currentSearchList.slice(
			0,
			this.currentLength
		);
		if (this.currentLength < this.currentSearchList.length) {
			this.showLoadMore = true;
		} else {
			this.showLoadMore = false;
		}
	}

	// To map the cms article data to search results
	pageReferenceLogic() {
		let searchTerm = this.stateValue;
		this.searchItems = [];

		if (this.originalSearchItems.length > 1) {
			this.getArticleByTitle(searchTerm);
			

			let searchvalu = searchTerm;
			let searchval = this.capitalizeFirstLetter(searchvalu);
			this.standarItems = [];
			this.getTagRecords(searchval);
			this.standarItems = [...new Set(this.standarItems)];

			let searchlower = this.stateValue;
			let searchlowerval = searchlower.toLowerCase();
	
			// Ensure searchItems is initialized
			// this.searchItems = [];
			this.getAriclesByKeywords(searchlowerval);

			if (this.searchItems.length === 0) {
				this.showNoResults = true;
			} else {
				this.showNoResults = false;
			}

			this.showLoadMore = true;

			this.currentLength = 5;
			this.currentSearchList = this.searchItems;
			this.searchItems = this.currentSearchList.slice(
				0,
				this.currentLength
			);

			if (this.currentLength < this.currentSearchList.length) {
				this.showLoadMore = true;
			} else {
				this.showLoadMore = false;
			}
		}

	}


	// Wire method to capture the current page reference and extract the state id value
	// We are unable to utilize "data" or "error" as CurrentPageReference is default API.
	@wire(CurrentPageReference)
	pageReference({ state }) {
		try {
			if (state?.id) {
				this.stateValue = state.id;
				this.stateValue = this.stateValue.trim();
				this.searchInput = this.stateValue;

			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error
		}
	}

	// To load the search method
	handleSearchButtonClick() {
		this.handleSearch();
	}

	// Method to handle key up event for search input
	handleSearchInputKeyUp(event) {
		if (event.key === LABELS.ENTER_EVENT) {
			this.handleSearch(event);
		}
	}

	// Method to handle focus on the search bar
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

	// Method to handle blur event on the search bar
	handleSearchBarBlur() {
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.borderColor = 'rgb(105, 105, 105)';
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.borderWidth = '2px';
		this.template.querySelector(
			'hr.search-bar-border-bottom'
		).style.transition = '0.1s';
	}
	
	// Method to handle rendering adjustments
	renderedCallback() {
		try {
			let windowWidth = window.innerWidth;
			let displayVideoTab = this.template.querySelector(
				'.grid-containerNavTab'
			);

			if (windowWidth <= 1000) {
				if (displayVideoTab) {
					displayVideoTab.style.display = 'none';
				}
			} else if (displayVideoTab) {
					displayVideoTab.style.display = '';
				}
		} catch (err) {
			this.navigateToErrorPage(err.message);
		}
	}

	// Method to handle button click to navigate detail article page
	navigateCategoryPage(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articleName = finaltitle;

		window.location.href = this.baseUrl + this.siteUrlq + LABELS.CATEGORY_PAGE + articleName;
	}

	// Method to set touch state to true
	click() {
		this.touch = true;
		this.down = false;
		this.up = true;
	}

	// Method to set touch state to false
	notClick() {
		this.touch = false;
		this.down = true;
		this.up = false;
	}
	

	// To get the site name from the Current site url
	connectedCallback() {
		try {
			let globalThis = window;
			this.showSpinner=true;
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
		} catch (error) {
			this.navigateToErrorPage(error.message);// Catching Potential Error
		}
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.baseUrl + this.siteUrlq + LABELS.ERROR_PAGE; 
	}
}