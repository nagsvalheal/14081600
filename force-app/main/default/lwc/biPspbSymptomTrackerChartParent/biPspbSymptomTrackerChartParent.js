//This LWC is used User Fatiguesymptoms insert values
import { LightningElement } from 'lwc';
export default class BiPspbSymptomTrackerChartParent extends LightningElement {
    showSpinner = true;
    handleComponentLoad() {
        // Once the child component has finished loading, hide the spinner
        this.showSpinner = false;
    }
    handleAvatarData() {
        this.showSpinner = false;
    }
}