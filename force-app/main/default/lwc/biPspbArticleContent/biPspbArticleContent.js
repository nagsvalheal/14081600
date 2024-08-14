// This lightning web component is used to show the article content from Content Management System.
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
// To import Apex Classes
import RETRIEVE_NEWS_FROM_CMS from '@salesforce/apex/BI_PSPB_CmsCtrl.retrieveNewsFromCMS';
import RETRIEVE_ASSESSMENT_RECORD from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Custom Labels
import { LABELS,MINSMAP } from 'c/biPspbLabelForInfoCenter';

// To get Current UserId
import Id from '@salesforce/user/Id';

export default class BiPspbArticleContent extends LightningElement {
	articleContent = '';
	referenceContent = '';
	remainContent = '';
	showContent = false;
	treatmentCategoryLabel;
	len = 0;
	articleTitle = LABELS.SEEK_MEDICARE_LABEL;
	result;
	isContentVisible = false;
	tagList = [];
	showTwoTag = false;
	showThreeTag = false;
	firstTag;
	secondTag;
	thirdTag;
	fourthTag;
	showJustForMe = false;
	urlq;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showBrandedNav = true;
	touch = false;
	down = true;
	up = false;
	categoryValue;
	whatIsGpp;
	gppHealth;
	talkHcp;
	manageGpp;
	flaresCategory;
	spevigoCategory="end-btn";
	linkOfSite;
	urlObject;
	siteUrlq;
	userId = Id;
	firstHeadFont;
	strongFont;
	topics = MINSMAP;
	articleCategories = LABELS.ARTICLE_CATEGORIES;
	references=LABELS.REFERENCES;
	minutes=LABELS.MINUTES;
	justForMeLabel = LABELS.JUST_FOR_ME_CATEGORY;

	// To get the site name from the Current site url
	connectedCallback() {
		try {
			let globalThis = window;
			let currentUrl = globalThis.location.href;
			// Create a URL object
			this.urlObject = new URL(currentUrl);
			// Get the path
			let path = this.urlObject.pathname;
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
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
		}
	}

	// To set the icon up or down
	get iconName() {
		return this.isContentVisible ? "utility:chevronup" : "utility:chevrondown";
	}

	// To expand the reference content
	get iconAltText() {
		return this.isContentVisible ? "Collapse Content" : "Expand Content";
	}

	// To set the reference content visbile
	get contentClass() {
		return this.isContentVisible ? "content visible" : "content";
	}

	// To change the toggle content to visible
	toggleContent() {
		this.isContentVisible = !this.isContentVisible;
	}

	// Wire method to capture the current page reference and extract the state id value
	// We are unable to utilize "data" or "error" as CurrentPageReference is default API.
	@wire(CurrentPageReference)
	pageReference({ state }) {
		try {
			if (state?.id) {
				this.result = state.id;
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
						this.categoryValue = key;
						break;
					}
				}

				this.mapCategoryBtn();
				this.standarItems = [
					{ id: 1, title: LABELS.WHAT_IS_GPP_CATEGORY, category: this.whatIsGpp },
					{ id: 2, title: LABELS.GPP_HEALTH_CATEGORY, category: this.gppHealth },
					{ id: 3, title: LABELS.TALK_HCP_CATEGORY, category: this.talkHcp },
					{ id: 4, title: LABELS.MANAGE_GPP_CATEGORY, category: this.manageGpp },
					{ id: 5, title: LABELS.FLARES_CATEGORY, category: this.flaresCategory }
				];
			
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error
		}
	}

	mapCategoryBtn(){
		// Initialize all categories to "end-btn"
		this.whatIsGpp = "end-btn";
		this.gppHealth = "end-btn";
		this.talkHcp = "end-btn";
		this.manageGpp = "end-btn";
		this.flaresCategory = "end-btn";
		this.spevigoCategory = "end-btn";

		// Map categoryValue to the corresponding key in the state
		const categoryMap = {
			[LABELS.WHAT_IS_GPP_CATEGORY]: 'whatIsGpp',
			[LABELS.GPP_HEALTH_CATEGORY]: 'gppHealth',
			[LABELS.TALK_HCP_CATEGORY]: 'talkHcp',
			[LABELS.MANAGE_GPP_CATEGORY]: 'manageGpp',
			[LABELS.FLARES_CATEGORY]: 'flaresCategory',
			[LABELS.SPEVIGO_CATEGORY]: 'spevigoCategory'
		};

		// Update the selected category to "end-btn-selected"
		if (this.categoryValue in categoryMap) {
			this[categoryMap[this.categoryValue]] = "end-btn-selected";
		}

	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve news content from CMS
	@wire(RETRIEVE_NEWS_FROM_CMS, { articleName: "$articleTitle"})
	wiredData({ error, data }) {
		try {
			if (data) {
				let objStr = JSON.parse(data);
				for (let i = 0; i < objStr.length; i++) {
					if (objStr[i].title.toLowerCase() === this.articleTitle.toLowerCase()) {
						this.articleContent = objStr[i].body; // Removed JSON.stringify
						this.articleContent = this.articleContent.substring(
							86,
							this.articleContent.length - 2
						);

						this.len = this.articleContent.length;
						this.linkOfSite = this.getArticleUrl();
						this.replaceArticleDevLink();
						this.replaceLinkAndBreak();
						this.replaceFont();
						this.setMobFont();
						this.setArticleBanner();
						this.mainRefTagMap();

						let indexOfFirstHeading = this.articleContent.indexOf("</h1>") + 5;

						// Split the string based on the index
						let firstPart = this.articleContent.substring(0, indexOfFirstHeading);
						let remainingPart = this.articleContent.substring(indexOfFirstHeading);
						this.articleContent = firstPart;
						this.remainContent = remainingPart;
						break;
					}
				}
				this.dispatchEvent(new CustomEvent('contendloaded'));
				this.showContent = true;
			} else if (error) {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	replaceArticleDevLink(){
		if (this.linkOfSite!==''){
			this.articleContent = this.articleContent.replace(new RegExp(this.linkOfSite, 'gu'),this.urlObject.origin);
		}
	}

	replaceLinkAndBreak(){
		this.articleContent = this.articleContent.replace(/Branded/gu,this.urlq);
		// Replace newline characters with <br>
		this.articleContent = this.articleContent.replace(/\n/gu, "<br>");
		this.articleContent = this.articleContent.replace(/<ul>([\s\S]*?)<\/ul>/gu, (match) => match.replace(/<br>/gu, ''));
	}

	replaceFont(){
			let listFont = this.addStyleAfterTag(this.articleContent, "li","font-size:14px");
			let output = this.addStyleAfterTag(
				listFont,
				"a",
				"color:#000000; text-decoration: underline;"
			);
			let headFont = this.addStyleAfterTag(
				output,
				"h3",
				"font-size:16px;"
			);
			let paraFont = this.addStyleAfterTag(
				headFont,
				"p",
				"font-size:14px;"
			);
			let sixthHeadFont = this.addStyleAfterTag(
				paraFont,
				"h6",
				"font-size:16px; font-family:Eina-Regular; font-weight:400;"
			);

			this.strongFont = this.addStyleAfterTag(
				sixthHeadFont,
				"strong",
				"color: #403A60;"
			);

			this.firstHeadFont = this.addStyleAfterTag(
				this.strongFont,
				"h1",
				"color: #403A60; font-size:32px;"
			);
	}

	setMobFont(){
		if (window.innerWidth<=400){
			this.firstHeadFont = this.addStyleAfterTag(
				this.strongFont,
				"h1",
				"color: #403A60; font-size:20px;"
			);
		}
	}

	setTagList(tagIndex){
		if (tagIndex !== -1) {
			let tags = this.articleContent.substring(
				tagIndex + 5,
				this.articleContent.length - 3
			);
			this.tagList = tags.split(",");
			if (this.tagList.length === 2) {
				this.showTwoTag = true;
				this.firstTag = this.tagList[0];
				this.secondTag = this.tagList[1];
			} else if (this.tagList.length === 3) {
				this.showThreeTag = true;
				this.firstTag = this.tagList[0];
				this.secondTag = this.tagList[1];
				this.thirdTag = this.tagList[2];
			} else if (this.tagList.length === 4) {
				this.showThreeTag = true;
				this.firstTag = this.tagList[0];
				this.secondTag = this.tagList[1];
				this.thirdTag = this.tagList[2];
				this.fourthTag = this.tagList[3];
			}
		}
	}

	setTagFont(){
		let taginreference = this.referenceContent.indexOf(LABELS.TAGS_LABEL);
		if (taginreference !== -1) {
			this.referenceContent = this.referenceContent.substring(
				0,
				taginreference
			);
			this.referenceContent = this.referenceContent.replace(/font-size:14px;/gu, 'font-size:16px;');

		}
	}

	setReferenceFont(){
		let newstartIndex = this.articleContent.indexOf(LABELS.REFERENCES);

		this.referenceContent = this.articleContent.substring(
			newstartIndex + 10
		);
		this.referenceContent = this.referenceContent.replace(/font-size:14px;/gu, 'font-size:16px;');
	}
	setArticleBanner(){
		this.articleContent = this.addStyleAfterTag(
			this.firstHeadFont,
			"img",
			"width: 100% !important;"
		);
	}

	mainRefTagMap(){
		let startIndex = this.articleContent.indexOf(LABELS.REFERENCES);
		let tagIndex = this.articleContent.indexOf(LABELS.TAGS_LABEL);

		if (startIndex !== -1) {
			this.setReferenceFont();
			this.setTagList(tagIndex);
			this.setTagFont();

			this.articleContent = this.articleContent.substring(
				0,
				startIndex
			);
		}
	}
	// To add the style after the provided html tag like <P> or <h1> or <h5>
	addStyleAfterTag(input, tagName, style) {
		let regex = new RegExp("<\\s*" + tagName + "\\s*([^>]*)>", "giu");
		let replacement = "<" + tagName + ' style="' + style + '" $1>';
		return input.replace(regex, replacement);
	}

	// Generate a random number between 2 and 4 (inclusive)
	get dynamicProperty() {
		let readTime = this.topics[this.articleTitle];
		return readTime;
	}

	// Method to set touch state to true and adjust down and up states accordingly
	click() {
		this.touch = true;
		this.down = false;
		this.up = true;
	}

	// Method to set touch state to false and adjust down and up states accordingly
	notclick() {
		this.touch = false;
		this.down = true;
		this.up = false;
	}

	// button labels
	standarItems = [];

	// To navigate to information center article category page
	handleButtonClicknew(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articlename = finaltitle;

		window.location.href =
			this.baseUrl + this.siteUrlq + LABELS.CATEGORY_PAGE + articlename;
	}

	/* If user having null assessment record then disabled the just for me navigation */
	// To retrieve letspersonalized assessment data
	@wire(RETRIEVE_ASSESSMENT_RECORD,{categoryname: LABELS.INTRODUCTION_CATEGORY})
	wiredAssessmentData({ error, data }) {
		try {
			if (data) {
				this.showJustForMe = false;

				let showresponsedata = data;
				if (showresponsedata.length === 1 && showresponsedata[0].BI_PSP_StatusForPersonalization__c===LABELS.COMPLETE_STATUS ) {
					this.showJustForMe = true;
				} else {
					this.showJustForMe = false;
				}
			} else if (error) {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			} else if(data === null) {
				this.showJustForMe = false;
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve patient status value
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusRecord = data;

				if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
					this.treatmentCategoryLabel = LABELS.FLARE_TREATMENT_LABEL;
				} else if (this.patientStatusRecord === LABELS.CHRONIC_STATUS) {
					this.treatmentCategoryLabel = LABELS.FLARE_PREVENTION_LABEL;
				} else if (this.urlq === LABELS.BRANDED_URL) {
					this.treatmentCategoryLabel = LABELS.FLARE_PREVENTION_LABEL;
				} else {
					this.treatmentCategoryLabel = LABELS.FLARE_TREATMENT_LABEL;
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

	getArticleUrl(){
		// Regular expression to match the first link containing "devint" up to ".com"
		const regex = /href="(https:\/\/[^"]*devint[^"]*\.com[^"]*)"/u;
		const match = RegExp(regex, "u").exec(this.articleContent);

		if (match) {
			const firstLink = match[1]; // Extracting the first captured group (the link)
			return firstLink.substring(0,52);
		} 
		return '';

	}

	handleArticlesLoaded(){
		this.dispatchEvent(new CustomEvent('relatedarticlesloaded'));
	}
	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + LABELS.ERROR_PAGE); 
	}
}