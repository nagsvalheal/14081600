// This Lightning Web Component defines a layout structure with two sections for reminder setup and notification settings, utilizing the Lightning Design System components
//To import library
import { LightningElement } from 'lwc';
export default class BiPspbReminderSetupParent extends LightningElement 

{
    showSpinner=true;
     handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
}