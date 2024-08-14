//This lighting web component is used in "Contact Us" section, redirecting users to the Boehringer Ingelheim portal.
// To import Libraries
import { LightningElement } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceGeneral';

export default class BiPspbContactUs extends LightningElement {
    contactUs = resources.CONTACT_US_LABEL;
    redirectionLabel = resources.REDIRECTION_LABEL;
 }