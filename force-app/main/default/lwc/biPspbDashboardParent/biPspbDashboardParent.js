/* The provided Lightning web component creates a dashboard layout featuring user notifications, reminders, challenges, and articles. It utilizes Lightning Layout for responsive design, organizing components into rows and columns */
import { LightningElement } from "lwc";

export default class BiPspbDashboardParent extends LightningElement 
{
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
// Method to handle when the child component starts loading or during some process
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

// Method to handle when the child component has finished loading
handleComponentLoad() {
   
    if (typeof window !== 'undefined') {
        this.handleComponent(); 
        }
}

handleComponent() {
    this.showSpinner = true;
}


}