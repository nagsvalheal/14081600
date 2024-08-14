//This Lwc display the completed questionnaires Dlqi,Wapi,pss summarize
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/BI_PSP_ChartJs';
//To get current user id
import Id from '@salesforce/user/Id';
//To import syatic resources
import RED_CIRCLE from '@salesforce/resourceUrl/BI_PSP_RedCircle';
import YELLOW_CIRCLE from '@salesforce/resourceUrl/BI_PSP_YellowCircle';
import ORANGE_CIRCLE from '@salesforce/resourceUrl/BI_PSP_OrangeCircle';
import GREEN_CIRCLE from '@salesforce/resourceUrl/BI_PSP_GreenCircle';
import GREY_CIRCLE from '@salesforce/resourceUrl/BI_PSP_GreyCircle';
import CORRECT from '@salesforce/resourceUrl/BI_PSP_Correct';
import WRONG from '@salesforce/resourceUrl/BI_PSP_Wrong';
import NOT_APPLICABLE from '@salesforce/resourceUrl/BI_PSP_NotApplicable';
import NA from '@salesforce/resourceUrl/BI_PSP_NA';
import LINE_GREY from '@salesforce/resourceUrl/BI_PSP_LineGrey';
import LINE_YELLOW from '@salesforce/resourceUrl/BI_PSP_LineYellow';
import LINE_BROWN from '@salesforce/resourceUrl/BI_PSP_LineBrown';
//To import apex classess
import GET_ENROLLE from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import GET_ASSESSMENT_DETAILS from '@salesforce/apex/BI_PSP_QuestionnaireGraphCtrl.getQuestionnaireDetails';
import GET_LAST_QUESTION from '@salesforce/apex/BI_PSP_QuestionnaireGraphCtrl.getQuestionnaireLast';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';
export default class BiPspbQuestionnarieSumChart extends LightningElement {
	assessmentResponse;
	@track dlqiFirstQuestion = [];
	@track dlqiSecondQuestion = [];
	@track dlqiFifthQuestion = [];
	@track pss = [];
	@track dlqiThirdQuestion = [];
	@track dlqiFourthQuestion = [];
	pssShow;
	dlqiShowValue;
	dlqiShowValueTwo;
	dlqiShowValueThree;
	dlqiShowValueFour;
	dlqiShowValueFive;
	wpaiShow;
	cancelBtn=labels.CANCEL_BTN;
	entryTxt=labels.ENTRY_TXT;
	downloadMessage=labels.DOWNLOAD_MESSAGE
	hrTxt=labels.HOUR_TXT_SUMMARY
	effectGppTxt=labels.EFFECT_GPP_TXT
	breakDownTxt=labels.BREAK_DOWN_TXT
	dlqiShortTxt=labels.DLQI_TXT
	timePeriod=labels.TIME_PERIOD;
	downloadTxt=labels.DOWNLOAD_TXT;
	monthTxt=labels.MONTH_TXT_SUMMARY;
	productivtyTxt=labels.PRODUCTIVITY_TXT
	psoriasisTxt=labels.PSORIASIS_SYMPTOMS_TXT
	veryMuchTxt=labels.VERY_MUCH
	alotTxt=labels.ALOT_TXT
	notApplicabeTxt=labels.NOT_APPLICABLE_TXT
	notAtAllTxt=labels.NOT_AT_ALL_TXT
	aLittleTxt=labels.A_LITTLE_TXT;
	skinIssue=labels.OVER_TIME_SKIN;
	preventSkin=labels.PREVENT_SKIN;
	notReleventTxt=labels.NOT_RELEVANT_TXT;
	selectMonth=labels.SELECT_MONTH_TXT
	durationTxt=labels.DURATION_TXT
	rangeTxt=labels.Range_OF_MONTHS
	questionnaire=labels.QUESTIONNAIRE_Text
	selectQuestionnaire=labels.SELECT_QUESTIONNAIRE
	letPersonalizeTxt=labels.LET_PERSONALIZE
	outStandingLabel=labels.OUT_STANDING
	@track wpaiFirst = [];
	wpaiSecond = [];
	@track wpaiThird = [];
	@track selectedCategory;
	@track transformedData = [];
	showPopup;
	calculatedMonths;
	onPrint = false;
	chartInitialized = false;
	wpaiFirstshow;
	gotData = true;
	showDlqiBottom;
	showPssBottom;
	showWapiBottom;
	completedTxt=labels.COMPLETED_TXT;
	summaryTxt=labels.SUMMARY;
	wpaiStartText = labels.WPAI_STAR_TEXT;
	defaultOptionValue = this.BI_PSP_DLQI_ShortDescription;
	thirdDlqiText = labels.DLQI_TXT;
	dlqiBottom = labels.DLQI_BOTTOM;
	dlqiBottomTwo = labels.DLQI_BOTTOM_TEXT_TWO;
	dlqiBottomThree = labels.DLQI_BOTTOM_TXT_TWO;
	dlqiBottomFour = labels.BI_PSP_dlqibottom4;
	pssBottomTxt = labels.PSS_BOTTOM_TXT;
	wpaiBottomTxt = labels.WAPI_BOTTOM_TXT;
	outStandingUrl = labels.OUT_STANDING_URL;
	siteUrlBranded = labels.BRANDED_URL;
	lineGrey = LINE_GREY;
	lineYellow = LINE_YELLOW;
	lineBrown = LINE_BROWN;
	redCircle = RED_CIRCLE;
	yellowCircle = YELLOW_CIRCLE;
	orangeCircle = ORANGE_CIRCLE;
	greenCircle = GREEN_CIRCLE;
	greyCircle = GREY_CIRCLE;
	correctTxt = CORRECT;
	wrongTxt = WRONG;
	notApplicableTxt = NOT_APPLICABLE;
	naTxtImg = NA;
	pssShortDescription = labels.PSS_SHORT_TXT;
	dlqiShortDescription = labels.DLQI_CATEGORY;
	veryServereDescription = labels.VERY_SERVERE_SHORT_TXT;
	servereDescription = labels.SEVERE;
	moderateDescription = labels.MODERATE;
	mildDescription = labels.MILD;
	noneDescription = labels.NONE;
	veryMuchDescription = labels.VERY_MUCH;
	aLotDescription = labels.A_LOT_MUCH_SHORT_TXT;
	aLittleDescription = labels.A_LITTLE_MUCH_SHORT_TXT;
	notAtAllDescription = labels.NOT_AT_ALL_SHORT_TXT;
	notRelevantDescription = labels.NOT_RELEVENT_ALL_SHORT_TXT;
	softDeleteDescription = labels.SOFT_DELETE_ALL_SHORT_TXT;
	noShortDescription = labels.NO_SHORT_TXT;
	skinConditionDescription = labels.SKIN_CONDITION_SHORT_TXT;
	skinQuestionDescription = labels.SKIN_QUESTION_SHORT_TXT;
	shortQuestionOneDescription = labels.SHORT_QUESTION_SHORT_TXT;
	shortQuestionTwoDescription = labels.SHORT_QUESTION_TWO_SHORT_TXT;
	shortQuestionThreeDescription = labels.SHORT_QUESTION_THREE_SHORT_TXT;
	shortQuestionFourDescription = labels.SHORT_QUESTION_FOUR_SHORT_TXT;
	shortQuestionFiveDescription = labels.SHORT_QUESTION_FIVE_SHORT_TXT;
	shortQuestionSixDescription = labels.SHORT_QUESTION_SIX_SHORT_TXT;
	shortQuestionSevenDescription = labels.SHORT_QUESTION_SEVEN_SHORT_TXT;
	shortQuestionEightDescription = labels.SHORT_QUESTION_EIGHT_SHORT_TXT;
	shortQuestionNineDescription = labels.SHORT_QUESTION_NINE_SHORT_TXT;
	shortQuestionTenDescription = labels.SHORT_QUESTION_TEN_SHORT_TXT;
	shortQuestionEleventhDescription = labels.SHORT_QUESTION_ELEVEN_SHORT_TXT;
	shortQuestionTwelethDescription = labels.SHORT_QUESTION_TWELVE_SHORT_TXT;
	shortQuestionThirteenDescription = labels.SHORT_QUESTION_THIRTEEN_SHORT_TXT;
	shortQuestionFourteenDescription = labels.SHORT_QUESTION_FOURTEEN_SHORT_TXT;
	shortQuestionFifteenDescription = labels.SHORT_QUESTION_FIFTEEN_SHORT_TXT;
	notApplicableDescription = labels.SHORT_NOT_APPLICABLE_SHORT_TXT;
	painDescription = labels.PAIN_SHORT_TXT;
	rednessDescription = labels.REDNESS_SHORT_TXT;
	itchingDescription = labels.ITCHING_SHORT_TXT;
	burningDescription = labels.BURNING_SHORT_TXT;
	wpaiDescription = labels.WPAI_CATEGORY_SHORT_TXT;
	lineDescription = labels.LINE_SHORT_TXT;
	oneMonthLabel = labels.ONE_MONTH_TXT;
	lastThreeMonthLabel = labels.LAST_THREE_MONTHS;
	lastSixMonthLabel = labels.LAST_SIX_MONTHS;
	lastTweleveMonthLabel = labels.LAST_TWELVE_MONTHS;
	patientName = labels.PATIENT_NAME;
	assessmentData;
	userId = Id;
	showChart;
	chartDatachartData;
	monthsToDisplay;
	bubbles = '';
	selectedMonthValue = '';
	showMonthSelector;
	selectedSingleMonth;
	storeWpai;
	storePss;
	storeDlqi;
	storeQsq;
	urlq;
	formattedDate;
	endDate;
	previousMonths = [];
	currentPageUrl;
	urlSegments;
	baseUrl;
	showTabMenu;
	count;
	wpaiThirdshow;
	storeAssessmentvalue;
	placeholder = labels.SELECT_QUESTION;
	picklistOptions = [];
	placeholderdate = labels.RANGE_OF_MONTHS;
	chartInstance = null;
	dlqiValue=false;
	enrolleName;

	picklistOptionsdate = [
		{ label: this.oneMonthLabel, value: this.oneMonthLabel },
		{ label: this.lastThreeMonthLabel, value: this.lastThreeMonthLabel },
		{ label: this.lastSixMonthLabel, value: this.lastSixMonthLabel },
		{ label: this.lastTweleveMonthLabel, value: this.lastTweleveMonthLabel }
	];
	placeholderMonth = labels.SELECT_MONTH;
	picklistOptionsMonth = [
		{ label: labels.JANUARY, value: labels.JANUARY },
		{ label: labels.FEBRUARY, value: labels.FEBRUARY },
		{ label: labels.MARCH, value: labels.MARCH },
		{ label: labels.APRIL, value: labels.APRIL },
		{ label: labels.MAY, value: labels.MAY },
		{ label: labels.JUNE, value: labels.JUNE },
		{ label: labels.JULY, value: labels.JULY },
		{ label: labels.AUGUST, value: labels.AUGUST },
		{ label: labels.SEPTEMBER, value: labels.SEPTEMBER },
		{ label: labels.OCTOBER, value: labels.OCTOBER },
		{ label: labels.NOVEMEBER, value: labels.NOVEMEBER },
		{ label: labels.DECEMBER, value: labels.DECEMBER }
	];
	showSpinner = true;
	

	//This method is used to get the AssessmentResponses of the questionnaire
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {

		if (data && data !== null) {
			try {
				this.count = data;
				if (this.count[0] !== 0 || this.count[1] !== 0 || this.count[2] !== 0 || this.count[3] !== 0) {
					this.showTabMenu = true;
					this.storeWpai = this.count[0];
					this.storePss = this.count[1];
					this.storeDlqi = this.count[2];
					this.storeQsq = this.count[3];
				}
				else {
					this.showTabMenu = false;
				}
			} catch (err) {

				this.showToast(err.message, labels.ERROR_VARIANT);
			}
		}
		else if (error) {
			this.showToast(error.message, labels.ERROR_VARIANT);
			this.showTabMenu = false;
		}
	}

	// Getter to extract unique months from transformedData
	get months() {
		let uniqueMonths = new Set();
		this.transformedData.forEach(item => {
			item.months.forEach(monthItem => {
				uniqueMonths.add(monthItem.Month);
			});
		});

		// Convert the set to an array and sort the months
		let sortedMonths = Array.from(uniqueMonths).sort((a, b) => {
			let dateA = new Date(a);
			let dateB = new Date(b);
			return dateA - dateB;
		});
		return sortedMonths;
	}
	get wpaiChanges() {
		if (this.selectedCategory === this.wpaiDescription || this.selectedCategory === this.wpaiStartText) {
			this.dlqiValue=false;
			return 'bubblecenterWapi';
		}
		return 'bubblecenter';
	}
	get dlqiChanges() {
		if (this.selectedCategory === this.dlqiShortDescription) {
			this.dlqiValue=true;
			return 'bubblecenterDlqi';
		}
		return 'bubblecenter';
	}

	// Used to get the care program enrollee and decide the rendering part of the graph modules
	connectedCallback() {
		let globalThis = window;
		let CurrentPage = globalThis.location?.href;
		try {
			this.currentPageUrl = CurrentPage;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			GET_ENROLLE()
				.then(result => {
					if (result[0].id !== null) {
						this.enrolleId = result[0].Id;
						this.enrolleName=result[0].Account.Name;
						this.getlastElevenMonths();
					}
				})

				.catch(error => {
					this.showToast(error.message, labels.ERROR_VARIANT);
				})

			let currentURL = globalThis.location.href;
			let urlObject = new URL(currentURL);
			let path = urlObject.pathname;
			let pathComponents = path.split('/');
			let desiredComponent = pathComponents.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_URL_NAVI;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
			}
		}
		catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT);
		}
	}

	// Used to get the particular questionnaire for the chosen month
	GET_LAST_QUESTION(months) {
		GET_LAST_QUESTION({ erolleId: this.enrolleId, selectedMonths: months })
			.then(results => {
				this.storeAssessmentvalue = results;
				let uniqueOptions = [];
				let modifiedOptions = [];
				let defaultOptionValue = this.defaultOptionValue;
				results.forEach(item => {
					let itemName = item.Name;
					// Check if itemName matches "Work & Activity Impairment (WPAI)" and replace it
					if (itemName === this.wpaiDescription) {
						itemName = this.wpaiStartText;
					}

					// Check if an object with the same label already exists in uniqueOptions
					let existingIndex = uniqueOptions.findIndex(option => option.label === itemName);

					// If no object with the same label exists, add the current item to uniqueOptions
					if (existingIndex === -1) {
						let newOption = {
							label: itemName,
							value: itemName,
							selected: false
						};
						uniqueOptions.push(newOption);
						modifiedOptions.push(newOption);
					} else {
						// If an object with the same label exists, update the selected property
						uniqueOptions[existingIndex].selected = uniqueOptions[existingIndex].selected || (itemName === defaultOptionValue);
					}
				});


				this.picklistOptions = uniqueOptions;


				this.picklistOptions.forEach(option => {
					if (option.value === this.defaultOptionValue) {
						option.selected = true;
					}
				});

				this.picklistOptions.sort((a, b) => {
					let labelA = a.label.toLowerCase();

					let labelB = b.label.toLowerCase();

					if (labelA < labelB) {
						return -1;
					}
					if (labelA > labelB) {
						return 1;
					}
					return 0;
				});

				if (this.picklistOptions.length > 0) {
					this.picklistOptions.forEach(option => {
						if (option.label === this.wpaiStartText) {
							option.value = this.wpaiDescription;
						}
					});
					this.selectedCategory = this.picklistOptions[0].value;

					if (this.selectedCategory) {
						if (this.selectedCategory === this.dlqiShortDescription) {
							this.showDlqiBottom = true;
							this.showPssBottom = false;
							this.showWapiBottom = false;
						} else if (this.selectedCategory === this.pssShortDescription) {
							this.showDlqiBottom = false;
							this.showPssBottom = true;
							this.showWapiBottom = false;
						} else if (this.selectedCategory === this.wpaiDescription) {
							this.showDlqiBottom = false;
							this.showPssBottom = false;
							this.showWapiBottom = true;
						}
					}
					this.selectedMonthValue = this.oneMonthLabel;
					this.handleDefaultMonth();
				}
			})
			.catch(error => {
				this.showToast(error.message, labels.ERROR_VARIANT);
			})
	}


	// To display completed questionnarie
	getlastElevenMonths() {
		// Get current date
		let currentDate = new Date();

		// Get current month and year
		let currentMonth = currentDate.getMonth();
		let currentYear = currentDate.getFullYear();

		// Array to hold month names
		let monthNames = [labels.JANUARY, labels.FEBRUARY, labels.MARCH, labels.APRIL, labels.MAY, labels.JUNE, labels.JULY, labels.AUGUST, labels.SEPTEMBER, labels.OCTOBER, labels.NOVEMEBER, labels.DECEMBER];

		// Array to hold current and previous 11 months


		// Add current month
		this.previousMonths.push(`${monthNames[currentMonth]} ${currentYear}`);

		// Calculate and store previous 11 months
		for (let i = 1; i <= 10; i++) {
			// Calculate the index of the previous month
			let prevMonthIndex = (currentMonth - i + 12) % 12;

			// Get the name of the previous month
			let prevMonthName = monthNames[prevMonthIndex];

			// Calculate the year for the previous month
			let prevYear = currentYear - (i <= currentMonth ? 0 : 1);

			// Construct the name including the year
			let prevMonthFullName = `${prevMonthName} ${prevYear}`;

			// Push the name to the array
			this.previousMonths.push(prevMonthFullName);
		}

		this.GET_LAST_QUESTION(JSON.stringify(this.previousMonths));
		// Log the array with the names of the previous 11 months including the year

	}

	//Used for higlighting the background
	highlightbackground() {
		if (this.bubbles === null) {
			this.bubbles = labels.HIGHLIGHT_BACK_TXT; //This is a css proterty
		} else {
			this.bubbles = '';
		}
	}
	//This is used for rendering the popup screen for download confirmation
	captureComponent() {
		if (this.enrolleId !== null && this.selectedCategory !== null && JSON.stringify(this.calculatedMonths) !== null && this.assessmentResponse !== null) {
			this.showPopup = true;
		} else {
			this.showPopup = false;
		}
		this.onPrint = true;
		if (this.selectedCategory === this.wpaiDescription) {
			this.selectedCategory = this.wpaiStartText;
		}

	}
	//This method is used for calculatring the number of months for the charts
	handleCalculateMonths(numberOfMonths) {
		let currentDate = new Date();
		let currentYear = currentDate.getFullYear();
		let startMonth, endMonth;


		if (numberOfMonths === 1) {
			// If only one month is needed, both start and end months are the current month
			startMonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed month
			endMonth = startMonth;
		} else if (numberOfMonths > 1 && numberOfMonths <= 11) {
			// If more than one month is needed but less than or equal to 11 months
			startMonth = currentDate.getMonth() - numberOfMonths + 1;
			if (startMonth <= 0) {
				startMonth += 12; // Adjusting if start month goes below 1 (JANUARY)
			}
			endMonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed month
		} else {
			// If more than 11 months are needed, take the entire previous year
			startMonth = 1; // JANUARY of the current year
			endMonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed month
		}

		this.calculatedMonths = this.getMonthsInRange(startMonth, endMonth, currentYear);
		this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.calculatedMonths));
		this.transformedData = [];
		this.dlqiFirstQuestion = [];
		this.dlqiSecondQuestion = [];
		this.dlqiFifthQuestion = [];
		this.pss = [];
		this.dlqiThirdQuestion = [];
		this.dlqiFourthQuestion = [];
		this.wpaiSecond = [];
		this.wpaiFirst = [];
		this.wpaiThird = [];

	}
	//This is used for calculating the month range dynamically
	getMonthsInRange(start, end, year) {
		let months = [];
		if (start <= end) {
			for (let i = start; i <= end; i++) {
				months.push(`${this.currentMonthName(i)} ${year}`);
			}
		} else {
			for (let i = start; i <= 12; i++) {
				months.push(`${this.currentMonthName(i)} ${year - 1}`);
			}
			for (let i = 1; i <= end; i++) {
				months.push(`${this.currentMonthName(i)} ${year}`);
			}
		}
		return months;
	}
	//This is used to get the current month
	currentMonthName(monthIndex) {
		let monthNames = [labels.JANUARY, labels.FEBRUARY, labels.MARCH, labels.APRIL, labels.MAY, labels.JUNE,
			labels.JULY, labels.AUGUST, labels.SEPTEMBER, labels.OCTOBER, labels.NOVEMEBER, labels.DECEMBER];
		return monthNames[monthIndex - 1];
	}
	//Used for formatting the date to our desired format
	formatDate(dateString) {
		let date = new Date(dateString);
		let month = date.toLocaleString('default', { month: 'long' });
		let year = date.getFullYear();
		return `${month} ${year}`;
	}
	//Used for handling, after changing the month values
	handleSingleMonthChange(event) {
		this.selectedSingleMonth = event.target.value;
		this.calculatedMonths = this.formatDate(this.selectedSingleMonth);

		this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.selectedSingleMonth));
		this.transformedData = [];
		this.dlqiFirstQuestion = [];
		this.dlqiSecondQuestion = [];
		this.dlqiFifthQuestion = [];
		this.pss = [];
		this.dlqiThirdQuestion = [];
		this.dlqiFourthQuestion = [];
		this.wpaiSecond = [];
		this.wpaiFirst = [];
		this.wpaiThird = [];
	}
	//Used for handling, after changing the category values
	handleCategoryChange(event) {
		this.selectedCategory = event.target.value;

		if (this.storeAssessmentvalue.length > 0 && this.selectedCategory !== null && this.selectedMonthValue === this.oneMonthLabel) {
			let uniqueOptions = [];
			this.storeAssessmentvalue.forEach(item => {
				if (item.Name === this.selectedCategory) {
					uniqueOptions.push({
						label: item.BI_PSP_DateForCQ__c,
						value: item.BI_PSP_DateForCQ__c,
						selected: false
					});
				}
			});
			this.previousMonths = uniqueOptions;
			if (this.previousMonths.length > 0) {
				this.previousMonths[0].selected = true;
				this.calculatedMonths = this.formatDate(this.previousMonths[0].value);
				this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.previousMonths[0].value));
			}
		}
		else {
			this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.calculatedMonths));
		}
		if (this.selectedCategory) {
			if (this.selectedCategory === this.dlqiShortDescription) {
				this.showDlqiBottom = true;
				this.showPssBottom = false;
				this.showWapiBottom = false;
			} else if (this.selectedCategory === this.pssShortDescription) {
				this.showDlqiBottom = false;
				this.showPssBottom = true;
				this.showWapiBottom = false;
			}
			else if (this.selectedCategory === this.wpaiDescription) {
				this.showDlqiBottom = false;
				this.showPssBottom = false;
				this.showWapiBottom = true;
			}
		}
		this.transformedData = [];
		this.dlqiFirstQuestion = [];
		this.dlqiSecondQuestion = [];
		this.dlqiFifthQuestion = [];
		this.pss = [];
		this.dlqiThirdQuestion = [];
		this.dlqiFourthQuestion = [];
		this.wpaiSecond = [];
		this.wpaiFirst = [];
		this.wpaiThird = [];
	}
	//Used for handling, after changing the number month values
	handleMonthChange(event) {
		this.selectedMonthValue = event.target.value;
		if (this.selectedMonthValue === this.oneMonthLabel) {
			this.handleDefaultMonth();
		} else {
			this.showMonthSelector = false;
			this.endDate = parseInt(this.selectedMonthValue.match(/\d+/u)[0], 10);
			if (this.endDate) {
				this.handleCalculateMonths(this.endDate);
			}
		}

	}
	//This is used for handling the default month value for the selected category
	handleDefaultMonth() {
		this.showMonthSelector = true;
		if (this.storeAssessmentvalue.length > 0 && this.selectedCategory !== null && this.selectedMonthValue === this.oneMonthLabel) {
			let uniqueOptions = [];
			this.storeAssessmentvalue.forEach(item => {
				if (item.Name === this.selectedCategory) {
					uniqueOptions.push({
						label: item.BI_PSP_DateForCQ__c,
						value: item.BI_PSP_DateForCQ__c,
						selected: false
					});
				}

			});
			this.previousMonths = [];
			this.previousMonths = uniqueOptions;
			if (this.previousMonths.length > 0) {
				this.previousMonths[0].selected = true;
				this.calculatedMonths = this.formatDate(this.previousMonths[0].value);
				this.transformedData = [];
				this.dlqiFirstQuestion = [];
				this.dlqiSecondQuestion = [];
				this.dlqiFifthQuestion = [];
				this.pss = [];
				this.dlqiThirdQuestion = [];
				this.dlqiFourthQuestion = [];
				this.wpaiSecond = [];
				this.wpaiFirst = [];
				this.wpaiThird = [];
				this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.previousMonths[0].value));
			}
		}
	}
	getQuestionnaireAssesmentResponse(enrolles, categoryvalues, rangeofMonths) {
		if (!(enrolles && categoryvalues && rangeofMonths)) {
			return; // Exit early if any required parameter is missing
		}
		GET_ASSESSMENT_DETAILS({ erolleId: enrolles, questionnaireCategory: categoryvalues, selectedMonths: rangeofMonths })
			.then(result => {
				if (result !== null) {
					this.showSpinner = false;
					this.assessmentResponse = result;
					this.showChart = true;
					this.gotData = true;
					this.transformedData = []; // Clear transformedData before populating

					for (let monthKey in this.assessmentResponse) {
						if (Object.hasOwnProperty.call(this.assessmentResponse, monthKey)) {
							let month = this.assessmentResponse[monthKey];

							for (let i = 0; i < month.length; i++) {
								let question = month[i];
								let existingQuestion = this.transformedData.find(item => item.Question === question.AssessmentQuestion.BI_PSP_shortQuestionText__c);

								if (!existingQuestion) {
									existingQuestion = {
										Question: question.AssessmentQuestion.BI_PSP_shortQuestionText__c,
										months: []
									};
									this.transformedData.push(existingQuestion);
								}

								let monthValue = {
									Month: monthKey,
									...this.getResponseValue(question, categoryvalues)
								};

								existingQuestion.months.push(monthValue);
							}
						}
					}

					this.updateTransformedData(categoryvalues);

					if (this.wpaiShow === true && this.wpaiSecond !== null) {
						this.lineChart();
					}
					if (this.wpaiThirdshow === true && this.wpaiThird !== null) {
						this.lineChart1();
					}
				} else {
					this.showChart = false;
					this.gotData = false;
					this.assessmentResponse = null;
				}
			})
			.catch(error => {
				this.showChart = false;
				this.showToast(error.message, labels.ERROR_VARIANT);
			});

	}

	getResponseValue(question, categoryvalues) {
		switch (categoryvalues) {
			case this.pssShortDescription:
				return this.getPSSResponseValue(question);
			case this.dlqiShortDescription:
				return this.getDLQIResponseValue(question);
			case this.wpaiDescription:
				return this.getWPAIResponseValue(question);
			default:
				return {
					Value: question.ResponseText,
					borderColor: ''
				};
		}
	}

	getPSSResponseValue(question) {
		switch (question.ResponseText) {
			case this.veryServereDescription:
				return {
					Value: this.redCircle,
					borderColor: ''
				};
			case this.servereDescription:
				return {
					Value: this.orangeCircle,
					borderColor: ''
				};
			case this.moderateDescription:
				return {
					Value: this.yellowCircle,
					borderColor: ''
				};
			case this.mildDescription:
				return {
					Value: this.greenCircle,
					borderColor: ''
				};
			case this.noneDescription:
				return {
					Value: this.greyCircle,
					borderColor: ''
				};
			default:
				return {
					Value: this.naTxtImg,
					borderColor: ''
				};
		}
	}

	// Helper method to get DLQI response value and border color
	getDLQIResponseValue(question) {
		const { AssessmentQuestion, ResponseText } = question;
		const questionText = AssessmentQuestion.BI_PSP_shortQuestionText__c;

		switch (questionText) {
			case this.skinConditionDescription:
			case this.skinQuestionDescription:
			case this.shortQuestionOneDescription:
			case this.shortQuestionTwoDescription:
			case this.shortQuestionThreeDescription:
			case this.shortQuestionFourDescription:
			case this.shortQuestionSevenDescription:
			case this.shortQuestionEightDescription:
			case this.shortQuestionNineDescription:
				return {
					Value: this.handleDLQIResponseValue(ResponseText, [this.veryMuchDescription, this.aLotDescription, this.aLittleDescription, this.notAtAllDescription, this.notRelevantDescription], [this.redCircle, this.orangeCircle, this.yellowCircle, this.greenCircle, this.greyCircle]),
					borderColor: ''
				};
			case this.thirdDlqiText:
				return {
					Value: ResponseText === this.noShortDescription ? this.wrongTxt
						: ResponseText === this.notRelevantDescription ? this.notApplicableTxt
							: this.naTxtImg,
					borderColor: ''
				};
			case this.shortQuestionSixDescription:
				return {
					Value: ResponseText === this.aLotDescription ? this.orangeCircle
						: ResponseText === this.aLittleDescription ? this.yellowCircle
							: ResponseText === this.notAtAllDescription ? this.greenCircle
								: ResponseText === this.notApplicableDescription ? this.notApplicableTxt
									: this.naTxtImg,
					borderColor: ''
				};
			default:
				return {
					Value: this.naTxtImg,
					borderColor: ''
				};
		}
	}

	// Helper method to handle DLQI response value based on response text
	handleDLQIResponseValue(responseText, validResponses, values) {
		const index = validResponses.indexOf(responseText);
		return index !== -1 ? values[index] : this.naTxtImg;
	}

	getWPAIResponseValue(question) {
		switch (question.AssessmentQuestion.BI_PSP_shortQuestionText__c) {
			case this.shortQuestionTenDescription:
				return {
					Value: question.ResponseText === this.softDeleteDescription ? this.correctTxt
						: question.ResponseText === this.noShortDescription ? this.wrongTxt
							: this.naTxtImg,
					borderColor: question.ResponseText === this.softDeleteDescription ? '#403A60'
						: question.ResponseText === this.noShortDescription ? '#403A60'
							: ''
				};
			case this.shortQuestionThirteenDescription:
			case this.shortQuestionTwelethDescription:
				return {
					Value: question.ResponseText !== null ? question.ResponseText : 0,
					borderColor: '#403A60'
				};
			case this.shortQuestionEleventhDescription:
				return {
					Value: question.ResponseText !== null ? question.ResponseText : 0,
					borderColor: '#ECDCA8'
				};
			case this.shortQuestionFourteenDescription:
			case this.shortQuestionFifteenDescription:
				return {
					Value: question.ResponseText !== null ? question.ResponseText : 0,
					borderColor: '#926B45'
				};
			default:
				return {
					Value: this.naTxtImg,
					borderColor: ''
				};
		}
	}
	//Updating processed data by categoryvalues to show as graph
	updateTransformedData(categoryvalues) {
		if (this.transformedData.length === 0) {
			return;
		}

		if (categoryvalues === this.dlqiShortDescription) {
			this.updateDLQIQuestions();
		} else if (categoryvalues === this.pssShortDescription) {
			this.updatePSSQuestions();
		} else if (categoryvalues === this.wpaiDescription) {
			this.updateWPAIQuestions();
		}
	}

	updateDLQIQuestions() {
		this.addToDLQIQuestions(this.skinConditionDescription, this.dlqiFirstQuestion);
		this.addToDLQIQuestions(this.skinQuestionDescription, this.dlqiFirstQuestion);
		this.addToDLQIQuestions(this.shortQuestionOneDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.shortQuestionTwoDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.shortQuestionThreeDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.shortQuestionFourDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.thirdDlqiText, this.dlqiThirdQuestion);

		if (this.dlqiThirdQuestion.length > 0 && this.dlqiThirdQuestion[0].value !== this.softDeleteDescription) {
			this.addToDLQIQuestions(this.shortQuestionSixDescription, this.dlqiFourthQuestion);
		}

		this.addToDLQIQuestions(this.shortQuestionSevenDescription, this.dlqiFifthQuestion);
		this.addToDLQIQuestions(this.shortQuestionEightDescription, this.dlqiFifthQuestion);
		this.addToDLQIQuestions(this.shortQuestionNineDescription, this.dlqiFifthQuestion);

		this.dlqiFirstQuestion = this.updateQuestionVisibilityDlqi(this.dlqiFirstQuestion, 'dlqiShowValue');
		this.dlqiSecondQuestion = this.updateQuestionVisibilityDlqi(this.dlqiSecondQuestion, 'dlqiShowValueTwo');
		this.dlqiThirdQuestion = this.updateQuestionVisibilityDlqi(this.dlqiThirdQuestion, 'dlqiShowValueThree');
		this.dlqiFourthQuestion = this.updateQuestionVisibilityDlqi(this.dlqiFourthQuestion, 'dlqiShowValueFour');
		this.dlqiFifthQuestion = this.updateQuestionVisibilityDlqi(this.dlqiFifthQuestion, 'dlqiShowValueFive');
	}

	updatePSSQuestions() {
		this.addToArrayIfFound(this.painDescription, this.pss);
		this.addToArrayIfFound(this.rednessDescription, this.pss);
		this.addToArrayIfFound(this.itchingDescription, this.pss);
		this.addToArrayIfFound(this.burningDescription, this.pss);

		this.pss = this.updateQuestionVisibilityPss(this.pss, 'pssShow');
	}

	updateWPAIQuestions() {
		this.addToArrayIfFound(this.shortQuestionTenDescription, this.wpaiFirst);
		this.addToArrayIfFound(this.shortQuestionEleventhDescription, this.wpaiSecond);
		this.addToArrayIfFound(this.shortQuestionFifteenDescription, this.wpaiSecond);
		this.addToArrayIfFound(this.shortQuestionThirteenDescription, this.wpaiSecond);
		this.addToArrayIfFound(this.shortQuestionTwelethDescription, this.wpaiThird);
		this.addToArrayIfFound(this.shortQuestionFourteenDescription, this.wpaiThird);

		this.wpaiFirst = this.updateQuestionVisibilityWpai(this.wpaiFirst, 'wpaiFirstshow');
		this.wpaiSecond = this.updateQuestionVisibilityWpai(this.wpaiSecond, 'wpaiShow');
		this.wpaiThird = this.updateQuestionVisibilityWpai(this.wpaiThird, 'wpaiThirdshow');
	}

	addToDLQIQuestions(questionDescription, targetArray) {
		let desiredQuestion = this.transformedData.find(question =>
			question.Question === questionDescription
		);
		if (desiredQuestion) {
			targetArray.push(desiredQuestion);
		}
	}

	addToArrayIfFound(questionDescription, targetArray) {
		let desiredQuestion = this.transformedData.find(question =>
			question.Question === questionDescription
		);
		if (desiredQuestion) {
			targetArray.push(desiredQuestion);
		}
	}
	updateQuestionVisibilityDlqi(questionArray, visibilityFlag) {
		let questionArrayDlqi = questionArray.filter(item => item !== null);
		if (questionArrayDlqi.length > 0) {
			this[visibilityFlag] = true;
			this.pssShow = false;
			this.wpaiShow = false;
			this.wpaiFirstshow = false;
			this.wpaiThirdshow = false;
		}
		return questionArrayDlqi;
	}
	updateQuestionVisibilityWpai(questionArray, visibilityFlag) {
		let questionArrayWapi = questionArray.filter(item => item !== null);
		if (questionArrayWapi.length > 0) {
			this[visibilityFlag] = true;
			this.pssShow = false;
			this.dlqiShowValue = false;
			this.dlqiShowValueTwo = false;
			this.dlqiShowValueFive = false;
			this.dlqiShowValueThree = false;
			this.dlqiShowValueFour = false;
		}
		return questionArrayWapi;
	}
	updateQuestionVisibilityPss(questionArray, visibilityFlag) {
		let questionArrayPss = questionArray.filter(item => item !== null);
		if (questionArrayPss.length > 0) {
			this[visibilityFlag] = true;
			this.pssShow = true;
			this.dlqiShowValue = false;
			this.dlqiShowValueTwo = false;
			this.dlqiShowValueFive = false;
			this.dlqiShowValueThree = false;
			this.dlqiShowValueFour = false;
			this.wpaiShow = false;
			this.wpaiFirstshow = false;
			this.wpaiThirdshow = false;
		}
		return questionArrayPss;
	}

	// Consolidated method to load and render line charts
	lineChart() {
		loadScript(this, chartjs)
			.then(() => {
				this.renderLineChart('.line-chart', this.wpaiSecond);
			})
			.catch(error => {
				this.showToast(error.message, labels.ERROR_VARIANT);
			});
	}

	lineChart1() {
		loadScript(this, chartjs)
			.then(() => {
				this.renderLineChart('.line-chart1', this.wpaiThird);
			})
			.catch(error => {
				this.showToast(error.message, labels.ERROR_VARIANT);
			});
	}
	// Consolidated method to render line charts
	renderLineChart(canvasSelector, dataToRender) {
		let canvas = this.template.querySelector(canvasSelector);
		let ctx = canvas.getContext('2d');

		let allMonths = [...new Set([].concat(...dataToRender.map(question => question.months.map(month => month.Month))))];
		allMonths.sort((a, b) => new Date(a) - new Date(b));

		let datasets = dataToRender.map(question => ({
			/*label: question.Question,*/
			data: [null, ...allMonths.map(month => {
				let foundMonth = question.months.find(qMonth => qMonth.Month === month);
				return foundMonth ? foundMonth.Value : 0;
			}), null],
			borderColor: question.months[0].borderColor,
			fill: false
		}));

		let data = {
			labels: ['', ...allMonths, ''],
			datasets: datasets
		};

		let options = {
			legend: {
				display: false
			},
			scales: {
				yAxes: [
					{
						ticks: {
							stepSize: canvasSelector === '.line-chart' ? 20 : 2,  // Adjust step size based on canvas selector
							min: 0,
							max: canvasSelector === '.line-chart' ? 180 : 10,  // Adjust max value based on canvas selector
						},
					},
				],
			},
		};

		let globalThis = window;
		this.chartInstance = new globalThis.Chart(ctx, {
			type: 'line',
			data: data,
			options: options
		});

		// Clear the respective data array after rendering
		if (canvasSelector === '.line-chart') {
			this.wpaiSecond = [];
		} else if (canvasSelector === '.line-chart1') {
			this.wpaiThird = [];
		}
	}
	//Navigation
	openOutQuestionnaires() {
		window.location.assign(this.urlq + this.outStandingUrl);
	}
	openSummary() {
		window.location.assign(this.urlq + labels.SUMMARY_URL);
	}
	// navigation for all Completed Questionnaire by checking conditions
	openComQuestionnaires() {
		if (this.storeDlqi > 0) {
			window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
		} else if (this.storePss > 0) {
			window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
		} else if (this.storeWpai > 0) {
			window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
		} else if (this.storeQsq > 0) {
			if (this.targetDate14 !== null) {
				if (this.status === labels.COMPLETED_LABEL || this.status === labels.EXPIRED) {
					window.location.assign(
						this.urlq + labels.QUALITATIVE_COMPLETED_FOURTEEN_WEEKS
					);
				} else {
					window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
				}
			} else {
				window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
		}
	}
	openPersonalize() {
		window.location.assign(this.urlq + labels.LETSPERSONLIZE_URL);
	}
	cancelDownload() {
		this.showPopup = false;
		this.onPrint = false;
	}

	yesDownload() {
		window.print();
		this.cancelDownload()
		this.onPrint = false;
	}



	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq +labels.ERROR_PAGE);
	}
}