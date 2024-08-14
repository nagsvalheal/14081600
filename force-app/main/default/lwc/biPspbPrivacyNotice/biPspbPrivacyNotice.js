//This lighting web component is used to view information about Boehringer Ingelheim through social media channels
// To import Libraries
import { LightningElement } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceGeneral';
// To import Custom Labels


export default class BiPspbPrivacyNotice extends LightningElement {
	// Declaration of Global variables
	ImPrint = resources.BI_PSPB_IMPRINT;
	Data = resources.BI_PSPB_DATA;
	Registration = resources.BI_PSPB_REGISTRATION;
	Log = resources.BI_PSPB_LOG;
	Cookies = resources.BI_PSPB_COOKIES;
	Offerings = resources.BI_PSPB_OFFERINGS;
	Listening = resources.BI_PSPB_LISTENING;
	PharmaCoVigilance = resources.BI_PSPB_PHARMACOVIGILANCE;
	Further = resources.BI_PSPB_FURTHER;
	Processor = resources.BI_PSPB_PROCESSOR;
	Companies = resources.BI_PSPB_COMPANIES;
	Transfer = resources.BI_PSPB_TRANSFER;
	Pharmaceutical = resources.BI_PSPB_PHARMACEUTICAL;
	Content = resources.BI_PSPB_CONTENT;
	Recipients = resources.BI_PSPB_RECIPIENTS;
	Retention = resources.BI_PSPB_RETENTION;
	Rights = resources.BI_PSPB_RIGHTS;
	Questions = resources.BI_PSPB_QUESTIONS;
	ChangesPrivacy = resources.BI_PSPB_CHANGESPRIVACY;
	Facebook = resources.BI_PSPB_FACEBOOK;
	Legal = resources.BI_PSPB_LEGAL;
	Twitter = resources.BI_PSPB_TWITTER;
	Linkedin = resources.BI_PSPB_LINKEDIN;
	Controller = resources.BI_PSPB_CONTROLLER;
	Addendum = resources.BI_PSPB_ADDENDUM;
}