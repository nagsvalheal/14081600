// This lightning web component is used navigation of information center article LABELS.CATEGORY_PAGE
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
// To import Apex Classes
import SHOW_FILTER_RESPONSE from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Custom Labels
import {LABELS} from 'c/biPspbLabelForInfoCenter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbArticleContentNavigation extends LightningElement {
	
	userId = ID;
	categoryLabel;
	categoryData;
	showJustForMe = false;
	searchList = [];
	articleTitle;
	resultValue;
	whatIsGpp;
	gppHealth;
	talkHcp;
	manageGpp;
	flaresCategory;
	spevigoCategory = 'end-btn';
	urlq;
	categoryRecord;
	showSpevigoCategory = true;
	touch = false;
	down = true;
	up = false;
	currentPageUrl;
	urlSegments;
	baseUrl;
	siteUrlq;
	showSearch = false;
	articleCategories = LABELS.ARTICLE_CATEGORIES;
	justForMeLabel = LABELS.JUST_FOR_ME_CATEGORY;
	whatIsGppLabel = LABELS.WHAT_GPP_LABEL;
	gppHealthLabel = LABELS.GPP_HEALTH_CATEGORY;
	talkHcpLabel = LABELS.TALK_HCP_CATEGORY;
	manageGppCategory = LABELS.MANAGE_GPP_CATEGORY;
	flaresCatLabel = LABELS.FLARES_CATEGORY;

	// To remove the search input value
	clearInput() {
		let inputElement = this.template.querySelector(".search-bar");
		if (inputElement) {
			inputElement.value = "";
		}
	}

	// To navigate the information center category page
	navigateToCategory(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articlename = finaltitle;
		window.location.href =
			this.baseUrl + this.siteUrlq + LABELS.CATEGORY_PAGE + articlename;
	}

	// To navigate search results page
	handleSearch(event) {
		let searchTerm = event.target.value.toLowerCase();
		this.searchList = [];

		if (event.key === LABELS.ENTER_EVENT && searchTerm) {
			window.location.href =
				this.baseUrl + this.siteUrlq + LABELS.SEARCH_PAGE + searchTerm;
		}
	}

	// Wire method to capture the current page reference and extract the state id value
	// We are unable to utilize "data" or "error" as CurrentPageReference is default API.
	@wire(CurrentPageReference)
	pageReference({ state }) {
		try {
			if (state?.id) {
				this.resultValue = state.id;
				this.articleTitle = state.id;

				let titlesMap = {
					[LABELS.WHAT_IS_GPP_CATEGORY]: [
						LABELS.RARE_GPP_LABEL,
						LABELS.FACTS_GPP_LABEL,
						LABELS.WHAT_GPP_LABEL,
						LABELS.GPP_CONTAGIOUS_LABEL,
						LABELS.WHY_DO_I_HAVE_GPP_LABEL
					],
					[LABELS.GPP_HEALTH_CATEGORY]: [
						LABELS.TALK_GPP_LABEL,
						LABELS.NOT_ALONE_LABEL,
						LABELS.DIAGNOSIS_GPP_LABEL,
						LABELS.FEELING_EXCLUDED_LABEL,
						LABELS.FRIENDS_FAMILY_LABEL
					],
					[LABELS.TALK_HCP_CATEGORY]: [
						LABELS.GPP_COMORBIDITIES_LABEL,
						LABELS.VISIT_DOCTOR_LABEL,
						LABELS.ASK_DOCTOR_LABEL,
						LABELS.SEEK_MEDICARE_LABEL,
						LABELS.DERMATOLOGIST_LABEL
					],
					[LABELS.MANAGE_GPP_CATEGORY]: [
						LABELS.POSITIVE_CHOICES_LABEL,
						LABELS.GPP_PREGNANCY_LABEL,
						LABELS.GPP_INTIMACY_LABEL,
						LABELS.SEEK_EMERGENCY_LABEL,
						LABELS.COMPLICAT_GPP_LABEL
					],
					[LABELS.FLARES_CATEGORY]: [
						LABELS.RECOGNIZING_FLARES_LABEL,
						LABELS.MANAGE_FLARE_LABEL,
						LABELS.MANAGE_GPP_SYMPTOMS_LABEL,
						LABELS.MANAGE_SCARS_LABEL
					],
					[LABELS.JUST_FOR_ME_CATEGORY]: [],
					spevigocategory: [
						LABELS.PREVENTION_GPP_LABEL,
						LABELS.SPEVIGO_INJECTION_LABEL,
						LABELS.WORK_IN_GPP_LABEL,
						LABELS.TREATING_GPP_LABEL,
						LABELS.SPEVIGO_INFUSION_LABEL
					]
				};

				for (let key in titlesMap) {
					if (titlesMap[key].includes(this.articleTitle)) {
						this.categoryRecord = key;
						break;
					}
				}
				this.getArticleCategory();
				this.dispatchEvent(new CustomEvent('navigationloaded'));
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the patient status value
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientstatusval = data;

				if (this.patientstatusval === LABELS.ACUTE_STATUS) {
					this.showSpevigoCategory = true;
					this.categoryLabel = LABELS.FLARE_TREATMENT_LABEL;
					this.categoryData = LABELS.FLARE_TREATMENT_CATEGORY;
				} else if (this.patientstatusval === LABELS.CHRONIC_STATUS) {
					this.showSpevigoCategory = true;

					this.categoryLabel = LABELS.FLARE_PREVENTION_LABEL;
					this.categoryData = LABELS.FLARE_PREVENTION_CATEGORY;
				} else if (this.patientstatusval === LABELS.UNASSIGNED_STATUS) {
					this.showSpevigoCategory = false;
				} else {
					this.showSpevigoCategory = false;
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
	// To retrieve the letspersonalize assessment data
	@wire(SHOW_FILTER_RESPONSE, { categoryname: LABELS.INTRODUCTION_CATEGORY})
	wiredShowFilterResponse({ error, data }) {
		try {
			if (data) {
				this.showJustForMe = false;

				let showresponsedata = data;
				if (showresponsedata.length === 1 && showresponsedata[0].BI_PSP_StatusForPersonalization__c === LABELS.COMPLETE_STATUS) {
					this.showJustForMe = true;
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

	getArticleCategory(){
		const categories = [
			'whatIsGpp',
			'gppHealth',
			'talkHcp',
			'manageGpp',
			'flaresCategory',
			'spevigoCategory'
		];
		
		// Initialize all categories to "end-btn"
		const categoryClasses = {};
		categories.forEach(category => {
			categoryClasses[category] = "end-btn";
		});
		
		// Map categoryRecord to the corresponding key in categoryClasses
		const categoryMap = {
			[LABELS.WHAT_IS_GPP_CATEGORY]: 'whatIsGpp',
			[LABELS.GPP_HEALTH_CATEGORY]: 'gppHealth',
			[LABELS.TALK_HCP_CATEGORY]: 'talkHcp',
			[LABELS.MANAGE_GPP_CATEGORY]: 'manageGpp',
			[LABELS.FLARES_CATEGORY]: 'flaresCategory',
			[LABELS.SPEVIGO_CATEGORY]: 'spevigoCategory'
		};
		
		// Update the selected category to "end-btn-selected"
		if (this.categoryRecord in categoryMap) {
			categoryClasses[categoryMap[this.categoryRecord]] = "end-btn-selected";
		}
		
		// Assign the updated classes
		this.whatIsGpp = categoryClasses.whatIsGpp;
		this.gppHealth = categoryClasses.gppHealth;
		this.talkHcp = categoryClasses.talkHcp;
		this.manageGpp = categoryClasses.manageGpp;
		this.flaresCategory = categoryClasses.flaresCategory;
		this.spevigoCategory = categoryClasses.spevigoCategory;
		
	}
	// Method to set touch state to true and adjust down and up states accordingly
	click() {
		this.touch = true;
		this.down = false;
		this.up = true;
	}

	// Method to set touch state to false and adjust down and up states accordingly
	notClick() {
		this.touch = false;
		this.down = true;
		this.up = false;
	}

	// Method to handle key up event for search input
	handleSearchInputKeyUp(event) {
		// Check if the Enter key is pressed
		if (event.key === LABELS.ENTER_EVENT) {
			// Call the method to handle search
			this.handleSearch(event);
		}
	}

	// Method to handle focus on the search bar
	handleSearchBarFocus() {
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderColor = "#7B4D00";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderWidth = "2px";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.transition = "0.1s";
	}

	// Method to handle blur event on the search bar
	handleSearchBarBlur() {
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderColor = "rgba(105, 105, 105, 1)";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderWidth = "2px";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.transition = "0.1s";
	}

	// button labels
	standarItems = [
		{ id: 1, title: LABELS.WHAT_IS_GPP_CATEGORY, titleval: LABELS.WHAT_IS_GPP_LABEL },
		{
			id: 2,
			title: LABELS.GPP_HEALTH_CATEGORY,
			titleval: LABELS.GPP_HEALTH_LABEL
		},
		{
			id: 3,
			title: LABELS.TALK_HCP_CATEGORY,
			titleval: LABELS.TALK_HCP_LABEL
		},
		{
			id: 4,
			title: LABELS.MANAGE_GPP_CATEGORY,
			titleval: LABELS.WHAT_IS_GPP_LABEL
		},
		{
			id: 5,
			title: LABELS.FLARES_CATEGORY,
			titleval: LABELS.FLARES_LABEL
		}
	];

	// To retireve current URL, based on that navigation will be set
	connectedCallback() {
		try {
			let globalThis = window;
			let currentUrl = globalThis.location.href;

			// Create a URL object
			let urlObject = new URL(currentUrl);

			// Get the path
			let path = urlObject.pathname;

			// Split the path using '/' as a separator
			let pathComponents = path.split("/");

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
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			if (this.urlq !== LABELS.BRANDED_URL) {
				this.showSpevigoCategory = false;
			}
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
		}
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + LABELS.ERROR_PAGE); 
	}
}