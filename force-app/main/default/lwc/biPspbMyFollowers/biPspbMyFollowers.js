//This component is used to display all followers Who are following the logedUser and the user can follow and unfollow others.
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import FOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.followUser";
import DISPLAY_FOLLOWERS from "@salesforce/apex/BI_PSPB_FollowUserCtrl.getMyFollowers";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';
export default class BiPspbMyFollowers extends LightningElement {
  // Declaration of variables with @track
  userNames;
  numberOfFollowers = 0;
  followingPopup = false;
  followingPopupConfirmation = false;
  followOrUnfollowButton = false;
  follow = false;
  following = false;
  selectedUserId;
  popup = false;
  selectedUser;
  avatarFollow;
  isLoading;
  loggedUserAvatar;
  isDesktop = false;
  button;
  handleResizeBound;
  showToastMsg = false;
  ToastMsg = '';
  followPopup = false;
  followPopupConfirmation = false;
  followersCount = false;
  //Declaration of variables
  tickIcon = label.TICK_ICON;
  allpostImg = label.ALL_POST;
  avatarContent=label.AVATAR_CONTENT;
  followLabel = label.FOLLOW_LABEL;
  followingLabel = label.FOLLOWING_LABEL;
  myFollowersLabel= label.MY_FOLLOWERS_POST_LABEL;
  yes = label.YES;
  no = label.NO;
  followingToastContent =label.FOLLOWING_TOAST;
  unFollowingToastContent = label.UNFOLLOW_TOAST;
  unFollowingPartToastContent = label.UNFOLLOW_PART_TOAST;
  noFollowersContent =label.NO_FOLLOWERS_CONTENT;
  profileLabel = label.PROFILE_LABEL;
  followUserText = label.FOLLOW_USER;
  followPopupHeading = label.FOLLOW_POPUP_HEADING;
  followPopupContent = label.FOLLOW_POPUP_CONTENT;
  unFollowUserText = label.UNFOLLOW_USER;
  unFollowPopupHeading = label.UNFOLLOW_POPUP_HEADING;
  unFollowPopupContent = label.UNFOLLOW_POPUP_CONTENT;
  alternateTextForAvatar = label.ALTERNATE_AVATAR;
  alternateTextForTick = label.ALTERNATE_TICK;
	alternateForPost = label.ALTERNATE_POST;
	alternateForUserAvatar = label.ALTERNATE_USER_AVATAR;
  //This connected callback used to get Avatar,Get followers list and resize the desktop view when popup opens
  connectedCallback() {
    try {
      this.retrieveFollowers();
      this.retrieveAvatar();
      this.detectBrandedOrUnassigned();
      this.isDesktop = this.isDesktopView();
      // Bind the event handler once and store it in a variable
      this.handleResizeBound = this.handleResize.bind(this);
      let globalThis = window;
      // Add the event listener using the bound handler
      globalThis.addEventListener("resize", this.handleResizeBound);
    } catch (error) {
      this.handleError(error.body.message) // Catching Potential Error
    }
  }

  //Used to remove the Event from the fixed screen
  disconnectedCallback() {
      window.removeEventListener("resize", this.handleResizeBound);
  }

  //set the desktop view to fix the screen for popup
  handleResize() {
    this.isDesktop = this.isDesktopView();
  }

  // This function used to Fix the screen as static if the popup opens as per requirement
  isDesktopView() {
    let globalThis = window;
    return globalThis.innerWidth <= 2024 || globalThis.innerWidth >= 200;
  }


  // To get avatar of the users
  retrieveAvatar() {
      USER_AVATAR()
        .then((result) => {
          if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
            this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
          }
        })
        .catch((error) => {
          this.handleError(error.body.message) // Catching Potential Error for then-catch
        });
  }

  // To retrieve all followers list
  retrieveFollowers() {
    this.isLoading = true;
    DISPLAY_FOLLOWERS()
        .then((result) => {
            if (result && result.length > 0) {
                let followers = result.filter(follower => follower?.BI_PSP_Type__c === label.FOLLOWER_LABEL);
                let followingList = result.filter(follower => follower?.BI_PSP_Type__c === label.FOLLOWING_LABEL);

                this.numberOfFollowers = followers.length;
                this.followersCount = this.numberOfFollowers > 0;

                if (this.numberOfFollowers > 0) {
                    this.userNames = followers.map((follower) => ({
                        ...follower,
                        followOrUnfollowButton: followingList.some(
                            (obj) => obj.BI_PSP_CareProgramEnrolleeFollow__c === follower?.BI_PSP_CareProgramEnrolleeFollow__c
                        ) ? label.FOLLOWING_LABEL : label.FOLLOW_LABEL,
                        userAvatarForEnrollee: follower.BI_PSP_CareProgramEnrolleeFollow__r?.BI_PSP_AvatarUrl__c || this.loggedUserAvatar
                    }));
                }
            } else {
                this.numberOfFollowers = 0;
                this.followersCount = false;
            }
            this.isLoading = false;
        })
        .catch((error) => {
            this.isLoading = false;
            this.handleError(error.body.message)
        });
}

  // To unfollow the user
  handleUnFollowConfirmation() {
      this.isLoading = true;
      UNFOLLOW_USER({
        enrolleeIdToUnFollow: this.enrolleeIdToFollow
      })
        .then(() => {
          this.userNames = this.userNames.map((follower) => ({
            ...follower,
            followOrUnfollowButton:
              follower.BI_PSP_CareProgramEnrolleeFollow__c === this.enrolleeIdToFollow
                ? label.FOLLOW_LABEL
                : follower.followOrUnfollowButton
          }));
          this.showToastMsg = true;
          this.ToastMsg = this.unFollowingToastContent + ' '+ this.selectedUser + ' ' + this.unFollowingPartToastContent;
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.handleError(error.body.message) // Catching Potential Error for then-catch
        });
      this.followingPopup = false;
      this.followingPopupConfirmation = false;
      document.body.style.overflow = "";
  }
  // To follow the user
  handleFollowConfirmation() {
      this.isLoading = true;      
      FOLLOW_USER({
        enrolleeIdToFollow: this.enrolleeIdToFollow
      })
        .then(() => {          
          this.userNames = this.userNames.map((follower) => ({
            ...follower,
            followOrUnfollowButton:
              follower.BI_PSP_CareProgramEnrolleeFollow__c === this.enrolleeIdToFollow
                ? label.FOLLOWING_LABEL
                : follower.followOrUnfollowButton
          }));
          this.showToastMsg = true;
          this.ToastMsg = this.followingToastContent + ' '+ this.selectedUser + '.';
          this.showToastForFollowing = true;
          this.showToastForUnfollow = false;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log('catch');
          this.isLoading = false;
          this.handleError(error.body.message) // Catching Potential Error for then-catch
        });
      this.followPopup = false;
      this.followPopupConfirmation = false;
      document.body.style.overflow = "";
  }
  // To close the popups
  closePopup() {
    this.followPopup = false;
    this.followPopupConfirmation = false;
    this.followingPopup = false;
    this.followingPopupConfirmation = false;
    document.body.style.overflow = "";
  }

  // To open popup when follow button is clicked
  handleFollowPopupButtonClick() {
    this.follow = false;
    this.followPopup = false;
    this.followPopupConfirmation = true;
  }

  // To close toast message
  closeToastMsg() {
    this.showToastMsg = false;
  }

  // To handle following button when clicked
  handleFollowingPopupButtonClick() {
    this.following = false;
    this.followingPopup = false;
    this.followingPopupConfirmation = true;
    document.body.style.overflow = this.isDesktop ? "hidden" : "";
  }

  // To open popup when following button is clicked
  handleFollowingButtonClick(event) {
    this.selectedUserId = event.target.dataset.id;
    this.selectedUser = event.target.dataset.username;
    this.enrolleeIdToFollow = event.target.dataset.enrollee;
  }
  handleFollowButtonClick(event) {
    this.handleButtonClick(event, false);
  }
  
  handleFollowUserButton(event) {
    this.handleButtonClick(event, true);
  }
  handleButtonClick(event, isConfirmation) {
    this.selectedUserId = event.target.dataset.id;
    this.selectedUser = event.target.dataset.username;
    this.enrolleeIdToFollow = event.target.dataset.enrollee;
    this.button = event.target.dataset.following;
    this.avatarFollow = event.target.dataset.avatar;
    
    // Determine the state of follow or following
    let isFollow = this.button === label.FOLLOW_LABEL;
    
    // Set the popup state based on whether it's a confirmation popup or not
    if (isFollow) {
      this.follow = !isConfirmation;
      this.followPopup = !isConfirmation;
      this.followPopupConfirmation = isConfirmation;
    } else {
      this.following = !isConfirmation;
      this.followingPopup = !isConfirmation;
      this.followingPopupConfirmation = isConfirmation;
    }
    // Adjust the body overflow based on the device type
    document.body.style.overflow = this.isDesktop ? "hidden" : "";
  }
  // Handle errors and display a toast message
	handleError(error) {
		let globalThis=window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
  // To detect the site is branded or unassigned
	detectBrandedOrUnassigned() {
		try {
			let globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL);
			const PATH = URL_OBJECT.pathname;
			const PATH_COMPONENTS = PATH.split("/");
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[
					label.BRANDED_URL.toLowerCase(),
					label.UNASSIGNED_URL.toLowerCase()
				].includes(component.toLowerCase())
			);
			if (
				DESIRED_COMPONENTS &&
				DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
			) {
				this.urlq = label.BRANDED_URL;
			}
			//Set the url and navigations are done within unassigned site
			else {
				this.urlq = label.UNASSIGNED_URL;
			}
		} catch (error) {
			this.handleError(label.URL_ERROR);
		}
	}
  // show the Toast message if the catch runs
  showToast(title, message, variant) {
    if (typeof window !== "undefined") {
      let event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
      this.dispatchEvent(event);
    }
  }
}