// This lightning web component is used for display the personalized messages based on category of the article selected
// To import Libraries
import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
// To import Apex Classes
import GET_CATEGORY_MESSAGES from '@salesforce/apex/BI_PSPB_PersonalizedMessagesCtrl.getCategoryMessages';
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbArticleContentAvatar extends LightningElement {
	@api siteUrlq;
	generalMessages = [];
	genMessageRecord = '';
	randomNum = '';
	currentUserName = '';
	articleTitle = '';
	categoryRecord = '';
	cardImage = '';

	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
					this.currentUserName = data.length > 0 ? data[0]?.Account.Name : '';
					this.cardImage = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_IMG;
					this.replacePlaceholders()
				}
			else if (error) {
				this.navigateToErrorPage(error.body.message);
			}
		} catch (err) {
			this.navigateToErrorPage(err.message);
		}
	}

	// To clear the search input
	clearInput() {
		let inputElement = this.template.querySelector(".search-bar");
		if (inputElement) {
			inputElement.value = "";
		}
	}

	secureRandom() {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array); // Generate a random value
		return array[0] / (0xFFFFFFFF + 1); // Normalize to 0 to 1
	}
	// Generate a random decimal between 0 (inclusive) and 1 (exclusive)
	getRandomNumber(min, max) {
		let randomDecimal = this.secureRandom();

		// Scale the random decimal to the range [min, max)
		let randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

		return randomNumber;
	}

	// Wire method to capture the current page reference and extract the state id value
	@wire(CurrentPageReference)
	pageReference({ state }) {
		try {
			if (state?.id) {
				this.articleTitle = state.id;
				this.findCategory();
				this.loadCategoryMessages();
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error
		}
	}

	// Function to find the category of the given article
	findCategory() {
		try {
			let categoryArticles = {
				[LABELS.GEN_CATEGORY]: [
					LABELS.WHAT_GPP_LABEL,
					LABELS.FACTS_GPP_LABEL,
					LABELS.RARE_GPP_LABEL,
					LABELS.WHY_DO_I_HAVE_GPP_LABEL,
					LABELS.DIAGNOSIS_GPP_LABEL
				],
				[LABELS.SOCIAL_LIFE_CATEGORY]: [
					LABELS.GPP_CONTAGIOUS_LABEL,
					LABELS.FRIENDS_FAMILY_LABEL,
					LABELS.FEELING_EXCLUDED_LABEL,
					LABELS.GPP_INTIMACY_LABEL
				],
				[LABELS.MANAGEMENT_CATEGORY]: [
					LABELS.GPP_PREGNANCY_LABEL,
					LABELS.MANAGE_FLARE_LABEL,
					LABELS.GPP_COMORBIDITIES_LABEL,
					LABELS.MANAGE_GPP_SYMPTOMS_LABEL,
					LABELS.ASK_DOCTOR_LABEL,
					LABELS.SEEK_MEDICARE_LABEL,
					LABELS.SEEK_EMERGENCY_LABEL,
					LABELS.MANAGE_SCARS_LABEL,
					LABELS.COMPLICAT_GPP_LABEL,
					LABELS.RECOGNIZING_FLARES_LABEL,
					LABELS.VISIT_DOCTOR_LABEL,
					LABELS.DERMATOLOGIST_LABEL,
					LABELS.TREATING_GPP_LABEL,
					LABELS.SPEVIGO_INFUSION_LABEL,
					LABELS.PREVENTION_GPP_LABEL,
					LABELS.SPEVIGO_INJECTION_LABEL,
					LABELS.WORK_IN_GPP_LABEL
				],
				[LABELS.MENTAL_HEALTH_CATEGORY]: [LABELS.TALK_GPP_LABEL, LABELS.NOT_ALONE_LABEL],
				[LABELS.HEALTHY_LIFE_CATEGORY]: [LABELS.POSITIVE_CHOICES_LABEL]
			};

			// Input article
			let article = this.articleTitle;
			for (let category in categoryArticles) {
				if (categoryArticles[category].includes(article)) {
					this.categoryRecord = category;
					break;
				}
			}
			if (this.categoryRecord.length === 0) {
				this.categoryRecord = LABELS.GEN_CATEGORY;
			}
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
			// Handle the error as needed
		}
	}

	replacePlaceholders() {
		if (this.currentUserName !== ''  && this.genMessageRecord!=='') {
			const placeholders = ['{!username}', 'XXX'];
			placeholders.forEach(placeholder => {
				if (this.genMessageRecord.includes(placeholder)) {
					this.genMessageRecord = this.genMessageRecord.replace(
						placeholder,
						this.currentUserName
					);
				}
			});
		}
	}	

	// To retrieve personalized message based on selected article's category
    loadCategoryMessages() {
        GET_CATEGORY_MESSAGES({ category: this.categoryRecord })
            .then((data) => {
                this.generalMessages = data;
                let globalThis = window;
                let previousMessage = globalThis.sessionStorage.getItem('message');
                // Remove the previous message if it exists in the list.
                if (previousMessage) {
                    this.generalMessages = this.generalMessages.filter(
                        message => message !== previousMessage
                    );
                }

                this.randomNum = this.getRandomNumber(0, this.generalMessages.length - 1);
                this.genMessageRecord = this.generalMessages[this.randomNum];

                if (this.genMessageRecord === '') {
                    this.genMessageRecord = this.generalMessages[this.randomNum - 1];
                }
                globalThis.sessionStorage.setItem('message', this.genMessageRecord);
                this.replacePlaceholders();
                this.dispatchEvent(new CustomEvent('avatarloaded'));
            })
            .catch((error) => {
                this.navigateToErrorPage(error.message); // Catching potential error from LWC
            });
    }

	// To navigate information center search randomNums page
	handleSearch(event) {
		let searchTerm = event.target.value.toLowerCase();
		this.searchitems = [];
		if (event.key === LABELS.ENTER_EVENT && searchTerm) {
			window.location.assign(this.siteUrlq + LABELS.SEARCH_PAGE + searchTerm);
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
		).style.borderColor = "rgba(111, 81, 29, 1)";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderWidth = "2px";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.transition = "0.1s";
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + LABELS.ERROR_PAGE);
	}
}