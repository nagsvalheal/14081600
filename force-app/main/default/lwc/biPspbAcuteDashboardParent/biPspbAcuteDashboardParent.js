//This Lwc  is used to display Widgets,Notification pannel,Welcome Avatar,Article for acute patient Dashboard Page
import { LightningElement } from 'lwc';
export default class BiPspbAcuteDashboardParent extends LightningElement {
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
    // Ensure this code only runs on the client side
    if (typeof window !== 'undefined') {
        // Hide the spinner once the child component has loaded
        this.handleComponent();
    }
}
handleComponent() {
    this.showSpinner = true;
}
}