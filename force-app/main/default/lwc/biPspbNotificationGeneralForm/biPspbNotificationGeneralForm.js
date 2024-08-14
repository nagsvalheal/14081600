//This component is used to Display Tasks based on the General notification on clicking the Notification icon from the Dashboard.
//To import the libraries
import { LightningElement} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
//To import the Apex class
import GENERAL_TASK from '@salesforce/apex/BI_PSPB_MessageCenterCtrl.getGeneralNotifyRecords';
import TASK_UPDATE from '@salesforce/apex/BI_PSPB_NotificationStatusCtrl.markTaskRead';
import {resources} from 'c/biPspbNotificationReminderResources';

export default class BiPspbNotificationGeneralForm extends NavigationMixin(LightningElement)
{
	// Declaration of variables
	userId = resources.ID;
	allData = [];
	activeMenuItem = resources.GENERAL;
	noNotifications = resources.NO_NOTIFICATIONS;
	notificationHeading = resources.NOTIFICATION_HEADING;
	symptomButton = resources.SYMPTOM_BUTTON;
	startButton = resources.START_BUTTON;
	readButton = resources.READ_BUTTON
	postButton = resources.POST_BUTTON
	commentButton = resources.COMMENT_BUTTON
	reactionButton = resources.REACTION_BUTTON
	followButton = resources.FOLLOWER_BUTTON
	watchButton = resources.WATCH_BUTTON
	loadMoreButton = resources.LOAD_MORE;
	alternateForSymptoms = resources.ALTERNATE_SYMPTOMS;
	alternateForChallenges = resources.ALTERNATE_CHALLENGES;
	alternateForQuestions = resources.ALTERNATE_QUESTIONS;
	alternateForReminders = resources.ALTERNATE_REMINDERS;
	alternateForCommunity = resources.ALTERNATE_COMMUNITY;
	value;
	trackButton;
	viewButton;
	general = true;
	accountName;
	generalValue = [];
	displayCount = 3;
	showLoadMoreButton = false;
	noRecords = false;
	categoryType;
	selectedId;
	chatterType;
	chatterFeedId;
	filteredData = [];
	showSpinner = true;
	// Declaration of variables and assigning image
	questionImg = resources.NOTIFY_QUESTION_IMG;
	contentImg = resources.NEW_CONTENT_IMAGE;
	symptomImg = resources.AVATAR_IMAGE;
	challengeImg = resources.CHALLENGES_IMG;
	communityImg = resources.COMMUNITY_IMAGE;
	treatmentImg = resources.NEW_CONTENT_IMAGE;
	treatmentVideoImg = resources.NEW_CONTENT_IMAGE;
	// Called when the component is inserted into the DOM
	connectedCallback() {
		try {
			this.determineSiteUrl();
			this.fetchData();
		} catch(error) {
			this.handleError(error.body.message);
		}
	}
	// Determine the site URL and set options based on the site
	determineSiteUrl() {
		try{
			let globalThis = window;
			let CURRENT_URL = globalThis.location?.href;
			const URL_OBJECT = new URL(CURRENT_URL);
			const PATH = URL_OBJECT.pathname;
			const PATH_COMPONENTS = PATH.split('/');
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[resources.BRANDED_SITE_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);

			if (DESIRED_COMPONENT.toLowerCase() === resources.BRANDED_SITE_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_SITE_URL;
				this.options = [
					{ label: resources.ALL, value: resources.ALL },
					{ label: resources.CHALLENGES, value: resources.CHALLENGES },
					{ label: resources.SYMPTOM, value: resources.SYMPTOM },
					{ label: resources.NEW_CONTENT, value: resources.NEW_CONTENT },
					{ label: resources.COMMUNITY, value: resources.COMMUNITY },
					{ label: resources.TREATMENT_REMINDERS, value: resources.TREATMENT_REMINDERS },
					{ label: resources.TREATMENT_VIDEO, value: resources.TREATMENT_VIDEO}
				];
			} else {
				this.urlq = resources.UNASSIGNED_SITE_URL;
				this.options = [
					{ label: resources.ALL, value: resources.ALL },
					{ label: resources.CHALLENGES, value: resources.CHALLENGES },
					{ label: resources.SYMPTOM, value: resources.SYMPTOM },
					{ label: resources.NEW_CONTENT, value: resources.NEW_CONTENT },
					{ label: resources.COMMUNITY, value: resources.COMMUNITY },
					{ label: resources.TREATMENT_VIDEO, value: resources.TREATMENT_VIDEO}
				];
			}
		} catch (error){
			this.handleError(resources.URL_TYPE_ERROR);
		}
	}
	// Fetch all general records
	fetchData() {
			GENERAL_TASK()
				.then(result => {
					this.showSpinner = false;
					this.allData = result;
					if (this.allData && this.allData.length > 3) {
						this.showLoadMoreButton = true;
					} else {
						this.showLoadMoreButton = false;
					}
		
					if (this.allData && this.allData.length > 0) {
						this.noRecords = false;
					} else {
						this.noRecords = true;
					}
		
					this.generalValue = this.allData.map(obj => ({
						...obj,
						trackButton: obj.BI_PSP_Category__c === resources.SYMPTOM,
						Readbutton: obj.BI_PSP_Category__c === resources.NEW_CONTENT,
						contentsimg: obj.BI_PSP_Category__c === resources.NEW_CONTENT,
						Comunityimage: obj.BI_PSP_Category__c === resources.COMMUNITY,
						Combutton: obj.BI_PSP_Category__c === resources.COMMUNITY && obj.BI_PSP_ChatterType__c === resources.CREATE_POST,
						Follwersbutton: obj.BI_PSP_Category__c === resources.COMMUNITY && obj.BI_PSP_ChatterType__c === resources.FOLLOW,
						Reactionbutton: obj.BI_PSP_Category__c === resources.COMMUNITY && obj.BI_PSP_ChatterType__c === resources.REACTION,
						Commentsbutton: obj.BI_PSP_Category__c === resources.COMMUNITY && obj.BI_PSP_ChatterType__c === resources.COMMENT,
						treatmentVideoButton: obj.BI_PSP_Category__c === resources.TREATMENT_VIDEO,
						sympimg: obj.BI_PSP_Category__c === resources.SYMPTOM,
						viewButton: obj.BI_PSP_Category__c === resources.CHALLENGES,
						challimg: obj.BI_PSP_Category__c === resources.CHALLENGES,
						Treatmentimg: obj.BI_PSP_Category__c === resources.TREATMENT,
						treatmentVideoImg: obj.BI_PSP_Category__c === resources.TREATMENT_VIDEO,
						FormattedDate: this.formatDate(obj.CreatedDate)
					}));
				})
				.catch((error) => {
					this.handleError(error.body.message);
				});
	}
	// To display recent 3 records, on clicking Load More, shows all the records
	get displayedGeneralValue() {
		return this.generalValue.slice(0, this.displayCount);
	}
	//This Function is used to load more notification
	loadMore() {
		this.displayCount = this.generalValue.length;
		this.showLoadMoreButton = false;
	}
	// To display the Date in the short format
	formatDate(createdDate) {
		const DATE_OBJECT = new Date(createdDate);
		// Get the day and month
		const DAY = DATE_OBJECT.getDate();
		const MONTH = DATE_OBJECT.toLocaleString('default', { month: 'short' });
		// Get the year in a 2-digit format
		const YEAR = DATE_OBJECT.getFullYear().toString().slice(-2);
		// Format the date
		const FORMATTED_DATE = `${DAY} ${MONTH}’ ${YEAR}`;
		return FORMATTED_DATE;
	}
	//This is onchange function for filter the general notification
	handleChange(event) {
		this.value = event.target.value;
		this.displayCount = 3;	
		switch (this.value) {
			case resources.ALL:
				this.fetchData();
				break;	
			case resources.SYMPTOM:
				this.handleCategory(this.allData, resources.SYMPTOM, {
					trackButton: true,
					sympimg: true
				});
				break;	
			case resources.CHALLENGES:
				this.handleCategory(this.allData, resources.CHALLENGES, {
					viewButton: true,
					challimg: true
				});
				break;	
			case resources.NEW_CONTENT:
				this.handleCategory(this.allData, resources.NEW_CONTENT, {
					Readbutton: true,
					contentsimg: true
				});
				break;	
			case resources.COMMUNITY:
				this.handleCategory(this.allData, resources.COMMUNITY, {
					Comunityimage: true,
					Combutton: (obj) => obj.BI_PSP_ChatterType__c === resources.CREATE_POST,
					Follwersbutton: (obj) => obj.BI_PSP_ChatterType__c === resources.FOLLOW,
					Reactionbutton: (obj) => obj.BI_PSP_ChatterType__c === resources.REACTION,
					Commentsbutton: (obj) => obj.BI_PSP_ChatterType__c === resources.COMMENT
				});
				break;	
			case resources.TREATMENT_REMINDERS:
				this.handleCategory(this.allData, resources.TREATMENT, {
					Treatmentimg: true
				});
				break;
			case resources.TREATMENT_VIDEO:
				this.handleCategory(this.allData, resources.TREATMENT_VIDEO, {
					treatmentVideoImg: true,
					treatmentVideoButton: true
				});
				break;
			default:
				break;
		}
	}
	// Fetch general notifications based on the category
	handleCategory(data, category, additionalOptions = {}) {
		this.filteredData = data.filter(obj =>
			obj.BI_PSP_Category__c === category
		);	
		this.showLoadMoreButton = this.filteredData.length > 3;
		this.noRecords = this.filteredData.length === 0;
		this.generalValue = this.filteredData.map(obj => {
			const item = {
				...obj,
				FormattedDate: this.formatDate(obj.CreatedDate)
			};
			const keys = Object.keys(additionalOptions);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const value = additionalOptions[key];
				switch (key) {
					case 'Combutton':
					case 'Follwersbutton':
					case 'Reactionbutton':
					case 'Commentsbutton':
						item[key] = value(obj);
						break;
					default:
						if (value === true) {
							item[key] = true;
						}
				}
			}	
			return item;
		});
	}	
	//Navigate to respective page based on the category type
	updategeneraltask(event) {
			this.selectedId = event.currentTarget.dataset.taskId;
			TASK_UPDATE({ taskId: this.selectedId })
				.then(result => {
					this.categoryType = result[0].BI_PSP_Category__c;
					this.chatterType = result[0].BI_PSP_ChatterType__c;
					this.chatterFeedId = result[0].BI_PSP_ChatterFeedId__c;
					switch (this.categoryType) {
						case resources.SYMPTOM:
							this.navigatesymptom();
							break;
						case resources.CHALLENGES:
							this.navigatetochallnge();
							break;
						case resources.NEW_CONTENT:
							this.navigatetonewcontent();
							break;
						case resources.COMMUNITY:
							switch (this.chatterType) {
								case resources.FOLLOW:
									this.navtofollow();
									break;
								case resources.CREATE_POST:
									this.navtopost();
									break;
								case resources.COMMENT:
									this.navtocomments();
									break;
								case resources.REACTION:
									this.navtoreaction();
									break;
								default:
									break;
							}
							break;
						case resources.TREATMENT_VIDEO:
							this.navtovideo();
							break;
						default:
							break;
					}
				})
				.catch((error) => {
					this.handleError(error.body.message);
				});
	}
	//Navigate to followers page
	navtofollow() {
		let globalThis = window;
		globalThis.location?.assign(resources.CHATTER_FOLLOWER);
	}
	// Navigate to my post page
	navtopost() {
		let globalThis = window;
		globalThis.localStorage?.setItem('selectedItemIdforCreatepost', this.chatterFeedId);
		globalThis.location?.assign(resources.ALL_POST_URL);
	}
	// Navigate to my post page
	navtocomments() {
		let globalThis = window;
		globalThis.localStorage?.setItem('selectedItemIdforComment', this.chatterFeedId);
		globalThis.location?.assign(resources.CHATTER_MY_POST);
	}
	// Navigate to my post page
	navtoreaction() {
		let globalThis = window;
		globalThis.localStorage?.setItem('selectedItemId', this.chatterFeedId);
		globalThis.location?.assign(resources.CHATTER_MY_POST);
	}
	// Navigate to symptom page
	navigatesymptom() {
		let globalThis = window;
		globalThis.location?.assign(resources.SYMPTOM_TRACKER_MAIN);
	}
	// Navigate to Outstanding questionnaire page
	navigatetonewcontent() {
		let globalThis = window;
		globalThis.location?.assign(resources.OUTSTANDING_QUESTIONNAIRE_URL);
	}
	// Navigate to challenges page
	navigatetochallnge() {
		let globalThis = window;
		globalThis.location?.assign(resources.CHALLENGES_URL);
	}
	// Navigate to treatment video page
	navtovideo() {
		let globalThis = window;
		globalThis.location?.assign(resources.INFORMATION_CENTER_URL);
	}
	handleError(error){
		let globalThis=window;
		globalThis.location.href = resources.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
}