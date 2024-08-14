//This component get the patients status and show the case created date ,type ,status,and discriptions
// To import libraries
import { LightningElement } from 'lwc';
//To Import apex clases
import CASE_FILES from '@salesforce/apex/BI_PSPB_PatientPrescriptionCtrl.getCasesForPatient';
// To Import Custom Labels
import { LABELS } from 'c/biPspbLabelForUpdatePrescription';

export default class BiPspbPrescriptionStatus extends LightningElement {
	cases;
	caseStatus;
	noPresription = false;
	withPrescription = true;
	mobilePrescrition = true;
	headingOnly = true;
	validationLabel = LABELS.PRESCRIPTION_VALIDATION_LABEL;
	noPrescriptionLabel = LABELS.NO_PRESCRIPTION_LABEL;
	brandedUrl = LABELS.BRANDED_URL;
	unassignedUrl = LABELS.UNASSIGNED_URL;
	brandedUrlNavi = LABELS.BRANDED_URL_NAVI;
	unAssignedUrlNavi = LABELS.UNASSIGNED_URL_NAVI;
	Statusoptions = [
		// Define options for status
		{ label: LABELS.SUBMITTED, value: LABELS.SUBMITTED },
		{
			label: LABELS.PRESCRIPTION_UNDER_VERIFICATION,
			value: LABELS.PRESCRIPTION_UNDER_VERIFICATION
		},
		{ label: LABELS.PRESCRIPTION_VERIFIED, value: LABELS.PRESCRIPTION_VERIFIED },
		{ label: LABELS.INVALID_PRESCRIPTION, value: LABELS.INVALID_PRESCRIPTION }
	];
	descriptionLabel = LABELS.DESCRIPTION_LABEL;
	statusLabel = LABELS.STATUS;
	typeLabel = LABELS.TYPE;
	dateLabel = LABELS.DATE;

	connectedCallback(){
		try{
			this.getCaseRecords(); // Call the function to fetch cases
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[this.brandedUrl.toLowerCase(), this.unassignedUrl.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENTS.toLowerCase() === this.brandedUrl.toLowerCase()) {
				this.urlq = this.brandedUrlNavi;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}
		}
		catch(err){
			// Log any errors that occur within the try block
			this.navigateToErrorPage(err.message);
		}
	}

	// Function to fetch all cases
	getCaseRecords() {
			CASE_FILES({ caseStatus: '' }) // Call Apex method to get cases
				.then((result) => {
					if (result && result.length === 0) {
						this.noPresription = true;
						this.withPrescription = false;
						this.mobilePrescrition = false;
						this.headingOnly = false;
					}

					this.cases = result.map((caseRecord) => {
						// Map each case record
						this.getSelectedStatus(caseRecord.Status);
						return {
							...caseRecord, // Spread existing case record properties
							FormattedDate: this.formatDate(caseRecord.CreatedDate), // Format created date
							status: this.caseStatus // Set the status property
						};
					});
				})
				.catch((error) => {
					this.navigateToErrorPage(error.message);
				});
	}

	// Format date function
	formatDate(createdDate) {
		const DATE_OBJECT = new Date(createdDate); // Create date object from created date
		const MONTH = (DATE_OBJECT.getMonth() + 1).toString(); // Get MONTH without padding zero
		const DAY = DATE_OBJECT.getDate().toString().padStart(2, '0'); // Get DAY and pad with zero if needed
		const year = DATE_OBJECT.getFullYear(); // Get full year
		const FORMATTED_DATE = `${MONTH}/${DAY}/${year}`; // Construct date string in 'Month/Date/Year' format
		return FORMATTED_DATE; // Return formatted date
	}

	// Handle status change
	handleChange(event) {
		const selectedValue = event.target.value; // Get selected value
		this.actionfunc(selectedValue); // Call function to handle action based on selected value
	}

	// Fetch cases based on selected status
	actionfunc(selectedValue) {
		try {
			CASE_FILES({ caseStatus: selectedValue }) // Call Apex method to get cases based on selected status
				.then((result) => {
					if (result && result.length === 0) {
						this.noPresription = true;
						this.withPrescription = true;
						this.mobilePrescrition = false;
						this.headingOnly = false;
					} else {
						this.noPresription = false;
						this.headingOnly = true;
						this.mobilePrescrition = true;
					}

					this.cases = result.map((caseRecord) => {
						// Map each case record
						this.getSelectedStatus(caseRecord.Status);
						return {
							...caseRecord, // Spread existing case record properties
							FormattedDate: this.formatDate(caseRecord.CreatedDate), // Format created date
							status: this.caseStatus // Adding the 'status' property to each caseRecord
						};
					});
				})
				.catch((error) => {
					this.navigateToErrorPage(error.message); // Log error if fetching cases fails
				});
		} catch (err) {
			// Handle any errors that occur within the try block
			this.navigateToErrorPage(err.message);
		}
	}

	// Function to get status based on selected value
	getSelectedStatus(selectedStatus){
			// Switch case to determine status
			switch (selectedStatus) {
				case LABELS.SUBMITTED:
					this.caseStatus = 'Submitted';
					break;
				case LABELS.PRESCRIPTION_UNDER_VERIFICATION:
					this.caseStatus = 'Prescription';
					break;
				case LABELS.PRESCRIPTION_VERIFIED:
					this.caseStatus = 'Verified';
					break;
				case LABELS.INVALID_PRESCRIPTION:
					this.caseStatus = 'Invalid';
					break;
				default:
					this.caseStatus = 'Unknown';
			}
	}
	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.urlq + LABELS.ERROR_PAGE;
	}
}