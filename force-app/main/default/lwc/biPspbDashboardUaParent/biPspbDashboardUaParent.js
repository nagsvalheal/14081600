//This is a consolidated component that creates a dashboard layout featuring user notifications, update prescription, challenges, and articles. It utilizes Lightning Layout for responsive design, organizing components into rows and columns
//To import Libraries
import { LightningElement} from 'lwc';

import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbDashboardUaParent extends LightningElement 
{
userId = resource.ID;
// Initial state of spinner
showSpinner = true;
avatarLoader=true;
articleLoader=true;

get finalLoaderStatus(){
    if(!this.avatarLoader && !this.articleLoader)
    {
        this.showSpinner=false;
    }
    return this.showSpinner;
}

startLoading() {
    // Set spinner to true when the loading process begins
    this.showSpinner = true;
}

avatarLoading(){
    this.avatarLoader = false;
}

articleLoading(){
    this.articleLoader=false;
}

handleComponentLoad() {
    // Ensure this code only runs on the client side
    if (typeof window !== 'undefined') {
        this.handleComponent();  
    }
}

handleComponent() {
    this.showSpinner = true;
}

}