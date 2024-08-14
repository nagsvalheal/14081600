// This lightning web component is used to display the Post created by them in the Patient Community (MyPosts) Page
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import COMMENT_OPTIONS from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.getCommentOptions";
import CHECK_FOLLOW_STATUS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.checkFollowingStatus";
import EDIT_COMMENT from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.editComment";
import FOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.followUser";
import HARDDELETE_EMOJI_REACTION from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.deleteEmojiReaction";
import MY_POST_FEED from "@salesforce/apex/BI_PSPB_FeedItemCtrl.fetchMyPost";
import REACTIONSBY_FEED_ID from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.getReactionsByFeedItemId";
import SAVE_EMOJI from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.saveEmoji";
import SOFTDELETE_FEEDITEM from "@salesforce/apex/BI_PSPB_FeedItemCtrl.softDeleteFeedItem";
import SOFTDELETE_COMMENT_ITEM from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.softDeleteFeedCommentItem";
import SAVE_COMMENT_OPTION from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.insertComment";
import TOTAL_REACTIONS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalReactionsByType";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
import VIEW_COMMENTS from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.viewComments";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';
import { COMMENT_OPTIONS_MAP } from 'c/biPspbCommunityCommentOptions';

export default class BiPspbMyPost extends LightningElement {
	// Declaration of variables with   
	enrolleeId;
	userEnrolleeId;
	loggedUserAvatar;
	navigationFromNotificationCommentId;
	navigationFromNotificationReactionId;
	feedItemIdToDelete;
	followUserName;
	countRecord;
	showSpinner;
	thumbsUpResult;
	smileResult;
	foldedHandsResult;
	heartResult;
	thinkingFaceResult;
	enrolleeIdForFollow;
	avatarDataForReaction;
	feedItemIdEmoji;
	emojiText;
	emojiTextSmile;
	emojiTextHands;
	emojiTextHeart;
	emojiTextThinking;
	editComment;
	categoryTitle;
	phraseBody;
	showEditTheComment;
	commentId;
	commentBox;
	feedCommentItemIdToDelete;
	editTheCommentTxt = "editTheCommentTxt"; //css attribute call
	displayHide = "";
	commentResult = false;
	showPostDetails = false;
	ToastMsg = '';
	showToastMsg = false;
	showDeleteToastMsg = false;
	isNewPopupOpen = false;
	emojiFollowing = false;
	emojiFollowProfile = false;
	emojiFollowPopup = false;
	emojiFollowingPopup = false;
	noReactionForThisEmoji = false;
	showEmojiPopup = false;
	displayTemplateThumbsUp = true;
	displayTemplateSmile = false;
	displayTemplateFoldedHands = false;
	displayTemplateHeart = false;
	displayTemplateThinkingFace = false;
	isThreeDotClassOpen = false;
	isSecondPopupOpen = false;
	isFirstPopupOpen = false;
	showDeleteToastMsgForComment = false;
	displayComment = [];
	saveEmojiResult = [];
	postDetails = [];
	followAvatar;
	//Declaration of variables
	userId = label.ID;
	editImg = label.EDIT_ICON;
	isCurrentUserCommentCreator = false;
	comment = "";
	commentOption = [];
	imgThumbs = label.THUMBS_UP_IMG;
	imgSmile = label.SMILE_IMG;
	imgHands = label.HANDS_FOLDED_IMG;
	imgLike = label.HEART_IMG;
	imgThought = label.THOUGHTFUL_IMG;
	deleteImg = label.DELETE_ICON_IMG;
	allPostImg = label.NO_FEED_IMG;
	deleteToast = label.TICK_ICON;
	noComment = label.NO_COMMENT_IMG;
	handleResizeBound;
	avatarContent=label.AVATAR_CONTENT;
	myPostLabel= label.MY_POST_LABEL;
	createNewPost = label.CREATE_NEW_POST;
	thumbsUpLabel = label.THUMBS_UP_LABEL;
	smileLabel =label.SMILE_LABEL;
	handsFoldedLabel =label.HANDS_FOLDED_LABEL;
	heartLabel =label.HEART_LABEL;
	thoughtfulLabel =label.THOUGHT_LABEL;
	no = label.NO;
	yes = label.YES;
	commentToastContent = label.COMMENT_TOAST_TEXT;
	reactionsLabel =label.REACTIONS_LABEL;
	commentLabel =label.COMMENT_LABEL;
	commentsLabel =label.COMMENTS_LABEL;
	reactLabel =label.REACT_LABEL;
	noReactionYet = label.NO_REACTION_YET;
	noCommentYet = label.NO_COMMENTS_YET;
	selectComment = label.SELECT_COMMENT;
	selectLabel = label.SELECT;
	actionLabel =label.ACTION_LABEL;
	editCommentLabel =label.EDIT_COMMENT;
	deleteCommentLabel=label.DELETE_COMMENT_LABEL;
	deleteCommentConfirmationText =label.DELETE_POPUP_CONFIRMATION;
	deletePostLabel =label.DELETE_POST_LABEL;
	deletePostConfirmationText =label.DELETE_POST_CONFIRMATION;
	noMyPostContent =label.NO_MY_POST_CONTENT;
	deletedPostToastText = label.POST_TOAST_TEXT;
	hideLabel = label.HIDE_LABEL;
	youLabel = label.YOU_LABEL;
	followLabel = label.FOLLOW_LABEL;
	followingLabel = label.FOLLOWING_LABEL;
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
	alternateTextForTick = label.ALTERNATE_TICK;
	alternateTextForAvatar = label.ALTERNATE_AVATAR;
	alternateForPost = label.ALTERNATE_POST;
	alternateForUserAvatar = label.ALTERNATE_USER_AVATAR;
	alternateForReaction = label.ALTERNATE_REACTION;
	alternateForComment = label.ALTERNATE_COMMENT;
	alternateForEditComment = label.ALTERNATE_EDIT_COMMENT;
	alternateDeleteComment = label.ALTERNATE_DELETE_COMMENT;
	

//This connected callback used to get Avatar for reaction,post and comments,get localstorage value from notification navigation and set toastmessage template as false
	connectedCallback() {
		try {
			this.initializeEventListeners();
			this.handleNavigationFromNotification();
			this.initializeComponentStates();
			this.processCurrentPageUrl();
		} catch (error) {
			this.handleError(error.body.message) // Catching Potential Error
		}
	}
	initializeEventListeners() {
		let global =window;
		this.handleResizeBound = this.handleResize.bind(this);
		global.addEventListener("resize", this.handleResizeBound);
	}
	handleNavigationFromNotification() {
		this.handleNavigationToReactedEmoji();
		this.handleNavigationToComments();
	}
	
	handleNavigationToReactedEmoji() {
		let global =window;
		const selectedItemId = global.localStorage.getItem("selectedItemId");
		if (selectedItemId) {
			this.navigationFromNotificationReactionId = selectedItemId;
			this.viewReactionfromnavigation(this.navigationFromNotificationReactionId);
		}
	}
	
	handleNavigationToComments() {
		let global =window;
		const selectedItemIdForComment = global.localStorage.getItem("selectedItemIdforComment");
		if (selectedItemIdForComment) {
			this.navigationFromNotificationCommentId = selectedItemIdForComment;
			this.commentBtnFromNavigation(this.navigationFromNotificationCommentId);
		}
	}
	initializeComponentStates() {
		this.avatarImgLeftSide();
		this.detectBrandedOrUnassigned();
		this.fetchPostData();
		this.checkAllReactions();
		this.commentResult = false;
		this.isDesktop = this.isDesktopView();
	}
	processCurrentPageUrl() {
		let global =window;
		this.currentPageUrl = global.location.href;
		this.urlSegments = this.currentPageUrl.split(label.SLASH);
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
	}
	// To get avatar of the logged in user
	avatarImgLeftSide() {
		USER_AVATAR()
			.then((result) => {
				if (result && result.length > 0 ) {
					this.userEnrolleeId = result[0].Id;
					this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
				}
			})
			.catch((error) => {
				this.handleError(error.body.message) // Catching Potential Error
			});
}
	fetchPostData() {	
		this.showSpinner = true;	
		// get all records for mypost
		MY_POST_FEED()
			.then(data => {
				if (data && data.length > 0) {
					this.processData(data);
				} else if ((data && data.length === 0) || data === null) {
					this.showPostDetails = false;
					this.showSpinner = false;
				} else {
					this.showSpinner = false;
					this.handleError(label.POST_ERROR);
				}
			})
			.catch(error => {	
				this.showSpinner = false;
				this.handleError(error.body.message) // Catching Potential Error
			});
	}
		processData(data) {
			this.showPostDetails = true;
			this.showSpinner = false;
			this.postDetails = this.mapPostDetails(data);
			this.checkAllReactions();
			this.commentBox = true;
			this.handleNotificationNavigation();
		}
	
		mapPostDetails(data) {
			return data.map((post) => ({
				...post,
				formattedTimeDifference: this.calculateTimeDifference(post.CreatedDate),
				commentCount: post.BI_PSP_FeedComment__r ? post.BI_PSP_FeedComment__r.length : 0,
				countEmoji: post.BI_PSP_EmojiReactionController__r ? post.BI_PSP_EmojiReactionController__r.length : 0,
				toReact: true,
				reactionResult: "",
				showEmojiPopup: false,
				emojiYouReacted: "",
				commentBox:
					this.navigationFromNotificationCommentId && post.Id === this.navigationFromNotificationCommentId
						? !post.commentBox
						: false,
				secondPopupClass:
					this.navigationFromNotificationReactionId && post.Id === this.navigationFromNotificationReactionId
						? "second-popup"
						: "second-popup hidden"
			}));
		}
	
		handleNotificationNavigation() {
			const globalThis = window;
			if (this.navigationFromNotificationReactionId) {
				globalThis.localStorage.removeItem("selectedItemId");
			}
			if (this.navigationFromNotificationCommentId) {
				globalThis.localStorage.removeItem("selectedItemIdforComment");
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
		const globalThis = window;
		const VIEWPORT_PATH = globalThis.innerWidth;
		return VIEWPORT_PATH <= 2024 || VIEWPORT_PATH >= 200;
	}
	//After clicking create a new post go to createPost page with checking communityUsername
	goToCreatePost() {
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					const globalThis = window;
					if (result === true) {
						globalThis.location.assign(label.SLASH + this.urlName + label.CREATEPOST_URL);
					} else if (result === false) {
						globalThis.location.assign(
							label.SLASH + this.urlName + label.COMMUNITY_USERNAME_URL
						);
					} else {
						this.handleError(label.ERROR_MESSAGE); // Catching Potential Error
					}
				})
				.catch((error) => {
					this.handleError(error.body.message) // Catching Potential Error
				});
	}

	// Formate the Date with Created Dated like 2 YEARSAgo,30 MINUTES ago,etc
	calculateTimeDifference(createdDate) {
		const timeUnits = this.calculateTimeUnits(createdDate);
		return this.getTimeDifferenceStringBasedOnUnits(timeUnits);
	}
	
	calculateTimeUnits(createdDate) {
		const CURRENT_TIME = new Date();
		const POST_TIME = new Date(createdDate);
		const TIME_DIFFERENCE = CURRENT_TIME - POST_TIME;
	
		const SECONDS = Math.floor(TIME_DIFFERENCE / 1000);
		const MINUTES = Math.floor(SECONDS / 60);
		const HOURS = Math.floor(MINUTES / 60);
		const DAYS = Math.floor(HOURS / 24);
		const MONTHS = Math.floor(DAYS / 30);
		const YEARS = Math.floor(DAYS / 365);
	
		return { SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS };
	}
	
	getTimeDifferenceStringBasedOnUnits(timeUnits) {
		const { SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS } = timeUnits;
	
		switch (true) {
			case YEARS > 0:
				return this.getTimeDifferenceString(YEARS, label.CHATTER_YEAR, label.CHATTER_YEARS);
			case MONTHS > 0:
				return this.getTimeDifferenceString(MONTHS, label.CHATTER_MONTH, label.CHATTER_MONTHS);
			case DAYS > 0:
				return this.getTimeDifferenceString(DAYS, label.CHATTER_DAY, label.CHATTER_DAYS);
			case HOURS > 0:
				return this.getTimeDifferenceString(HOURS, label.CHATTER_HOUR, label.CHATTER_HOURS);
			case MINUTES > 0:
				return this.getTimeDifferenceString(MINUTES, label.CHATTER_MINUTE, label.CHATTER_MINUTES);
			default:
				return this.getTimeDifferenceString(SECONDS, label.CHATTER_SECOND, label.CHATTER_SECONDS);
		}
	}
	
	getTimeDifferenceString(value, singularLabel, pluralLabel) {
		return `${value} ${value === 1 ? singularLabel : pluralLabel} ${label.CHATTER_AGO}`;
	}


	// close the Toast message for delete post
	closeToastMsg() {
		this.showToastMsg = false;
	}

	// close the Toast message for delete post
	closeToastMsgForComment() {
		this.showDeleteToastMsgForComment = false;
	}

	// after calling this function for used to open the delete post popup from below
	get newPopupClass() {
		return this.isNewPopupOpen
			? "new-popup-container"
			: "new-popup-container hidden";
	}

	// To open a popup to delete the post
	openNewPopup(event) {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));
		this.feedItemIdToDelete = event.currentTarget.dataset.customFeeditemId;

		this.isNewPopupOpen = true;
		this.isDesktopHandle();
	}
	isDesktopHandle() {
		if (this.isDesktop) {
			this.DocumentStyleHidden();
		} else {
			this.DocumentStyle();
		}
	}
	DocumentStyleHidden() {
		document.body.style.overflow = "hidden";
	}
	DocumentStyle() {
		document.body.style.overflow = "";
	}
	//close the delete post popup toast message
	closeNewPopup() {
		this.isNewPopupOpen = false;
		this.DocumentStyle();
	}

	// To delete a post
	handleDeletePost() {
			this.softDeleteFeedItem(this.feedItemIdToDelete)
				.then(() => {
					this.updatePostDetails();
					this.closePopup();
					this.updateDocumentStyle();
					this.scrollToTop();
					this.setToastMessages();
					if (this.postDetails.length === 0) {
						this.redirectToMyPosts();
					}
				})
				.catch((error) => {
					this.handleError(error.body.message) // Catching Potential Error
				});
	}

	softDeleteFeedItem(feedItemId) {
		return SOFTDELETE_FEEDITEM({ feedItemId });
	}

	updatePostDetails() {
		this.postDetails = this.postDetails.filter(
			(post) => post.Id !== this.feedItemIdToDelete
		);
	}

	closePopup() {
		this.isNewPopupOpen = false;
	}

	updateDocumentStyle() {
		this.DocumentStyle();
	}

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	setToastMessages() {
		this.showToastMsg = true;
		this.ToastMsg = this.deletedPostToastText;
	}

	redirectToMyPosts() {
		window.location.assign(label.SLASH + this.urlName + label.MY_POST_URL);
	}

	// To check whether the user is being followed or not
	profileFollowUnfollow(event) {
		this.followAvatar = event.currentTarget.dataset.avat;
		this.followUserName = event.currentTarget.dataset.name;
		this.enrolleeIdForFollow = event.currentTarget.dataset.enrollee;
		this.checkFollowStatus();
	}

	checkFollowStatus() {
		CHECK_FOLLOW_STATUS({
			loggedEnrolleeId: this.userEnrolleeId,
			otherEnrolleeId: this.enrolleeIdForFollow
		})
			.then((result) => {
				this.handleFollowResult(result);
			})
			.catch((error) => {
				this.handleError(error.body.message) // Catching Potential Error
			});
	}

	handleFollowResult(result) {
		if (this.userEnrolleeId === this.enrolleeIdForFollow) {
			this.handleSelfFollow();
		} else if (result && result.length > 0) {
			this.countRecord = result.length;
			if (result[0].BI_PSP_Type__c === label.FOLLOWING_LABEL) {
				this.handleFollowing();
			} else {
				this.handleFollowProfile();
			}
		} else {
			this.handleFollowProfile();
		}
		return result;
	}

	handleSelfFollow() {
		this.emojiFollowProfile = false;
		this.emojiFollowing = false;
		this.DocumentStyle();
	}

	handleFollowing() {
		this.emojiFollowing = true;
		this.isDesktopHandle();
	}

	handleFollowProfile() {
		this.emojiFollowProfile = true;
		this.isDesktopHandle();
	}

	//open the follow/unfollow popup with fixed screen
	emojiFollowPopupButtonClick() {
		this.emojiFollowPopup = true;
		this.emojiFollowProfile = false;
		this.isDesktopHandle();
	}

	//close the follow/unfollow popup
	emojiCloseFollowPopup() {
		this.emojiFollowProfile = false;
		this.emojiFollowPopup = false;
		this.emojiFollowing = false;
		this.emojiFollowingPopup = false;
		if (this.isSecondPopupOpen === true) {
			this.DocumentStyleHidden();
		} else {
			this.DocumentStyle();
		}
	}

	// To follow the user
	emojiFollowConfirmationPopup() {
			FOLLOW_USER({
				enrolleeIdToFollow: this.enrolleeIdForFollow
			})
				.then(() => {
					this.showToastMsg = true;
					this.ToastMsg = this.followingToastContent + ' ' + this.followUserName + '.';
					window.scrollTo({ top: 0, behavior: "smooth" });
				})
				.catch((error) => {
					this.handleError(error.body.message) // Catching Potential Error
					return false;
				});
			this.emojiFollowProfile = false;
			this.emojiFollowPopup = false;
			this.DocumentStyle();
	}

	//open the following popup with fixed screen
	emojiFollowingPopupButtonClick() {
		this.emojiFollowingPopup = true;
		this.emojiFollowing = false;
		this.isDesktopHandle();
	}

	// To unfollow the user
	emojiUnfollowConfirmationPopup() {
			UNFOLLOW_USER({
				enrolleeIdToUnFollow: this.enrolleeIdForFollow
			})
				.then(() => {
					this.showToastMsg = true;
					this.ToastMsg = this.unFollowingToastContent + ' ' + this.followUserName + ' ' + this.unFollowingPartToastContent;
					window.scrollTo({ top: 0, behavior: "smooth" });
				})
				.catch((error) => {
					this.handleError(error.body.message) // Catching Potential Error
					return false;
				});
			this.emojiFollowing = false;
			this.emojiFollowingPopup = false;
			this.DocumentStyle();
	}

	//After clicking the react button show the popup with 5 emoji's (only clicked post's emoji button)
	reactPopupButton(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			showEmojiPopup: post.Id === POST_ID ? !post.showEmojiPopup : false,
			commentBox: false,
			displayHide: ""
		}));
	}

	// After cliking the Emoji's  save the details
	userReactedEmoji(event) {
		// Show loading spinner for react
		this.showSpinner = true;
		const FEED_ID = event.currentTarget.dataset.customFeeditemId;
		const EMOJI_REACTION_TYPE = event.currentTarget.dataset.reactionType;
		// Call apex to store emoji saved information
		this.saveEmojiReaction(FEED_ID, EMOJI_REACTION_TYPE);
		
	}

	saveEmojiReaction(feedItemId, reactionType) {
		SAVE_EMOJI({ reactions: reactionType, feedItemId })
			.then((result) => {
				this.showSpinner = false;
				this.handleSuccessfulReaction(feedItemId, result);
			})
			.catch((error) => {
				this.showSpinner = false;
				this.postDetailsCatch();
				this.handleError(error.body.message);
			});
	}

	handleSuccessfulReaction(feedItemId, result) {
		this.saveEmojiResult = Array.isArray(result) ? result : [result];
		if (this.saveEmojiResult && this.saveEmojiResult.length > 0) {
			this.updatingPostDetails(feedItemId, result);
		} else {
		this.postDetailsCatch();
		this.handleError(label.UNABLE_TO_REACT)
		}
	}

	updatingPostDetails(feedItemId, result) {
		this.postDetails = this.postDetails.map((post) => {
			if (post.Id === feedItemId) {
				return {
					...post,
					showEmojiPopup: false,
					toReact: false,
					emojiYouReacted: this.getResultEmoji(result.BI_PSP_ReactionResult__c), // Change the react button to the emoji name that you reacted
					countEmoji: post.countEmoji + 1, // After emoji inserted increase emoji count by 1
					emojiReactedImg: this.getResultEmojiImg(result.BI_PSP_ReactionResult__c)
				};
			}
			return post;
		});
	}

	postDetailsCatch() {
		this.showSpinner = false;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			showEmojiPopup: false
		}));
	}
	// after insert update the emojibox
	getReactionData(reactionResult) {
		const reactionMap = {
			[label.THUMSUP_VALUE]: { name: label.THUMSUP_NAME, img: this.imgThumbs },
			[label.SMILE_VALUE]: { name: label.SMILE_NAME, img: this.imgSmile },
			[label.HANDSFOLDED_VALUE]: { name: label.HANDSFOLDED_NAME, img: this.imgHands },
			[label.HEART_VALUE]: { name: label.HEART_NAME, img: this.imgLike },
			[label.THOUGHTFUL_VALUE]: { name: label.THOUGHTFUL_NAME, img: this.imgThought }
		};
	
		return reactionMap[reactionResult] || { name: "", img: "" };
	}
	
	getResultEmoji(reactionResult) {
		const reactionData = this.getReactionData(reactionResult);
		return reactionData.name;
	}
	
	// after insert update the emojibox image
	getResultEmojiImg(reactionResult) {
		const reactionData = this.getReactionData(reactionResult);
		return reactionData.img;
	}
	

	//check the reactions if already reacted or not (if any changes made in mypost page)
	checkAllReactions() {
		this.postDetails.forEach((post) => {
			this.checkReactions(post.Id);
		});
	}

	// get the id of the post and do the changes accordingly
	checkReactions(postId) {
		REACTIONSBY_FEED_ID({ feedItemId: postId })
			.then(result => this.processReactionResult(postId, result))
			.catch(error => this.handleError(error.body.message));
	}

	processReactionResult(postId, result) {
		const REACTION_TYPE = parseInt(result, 10); // Assuming result is a numeric string
		const EMOJI_MAP = {
			1: label.THUMSUP_NAME,
			2: label.SMILE_NAME,
			3: label.HANDSFOLDED_NAME,
			4: label.HEART_NAME,
			5: label.THOUGHTFUL_NAME
		};

		this.updatePostDetailsWithReactions(postId, REACTION_TYPE, EMOJI_MAP);
	}

	updatePostDetailsWithReactions(postId, reactionType, emojiMap) {
		this.postDetails = this.postDetails.map((post) => {
			if (post.Id === postId) {
				post.toReact = reactionType === undefined || isNaN(reactionType);
				post.emojiYouReacted = emojiMap[reactionType] || "None";

				switch (post.emojiYouReacted) {
					case label.THUMSUP_NAME:
						post.emojiReactedImg = this.imgThumbs || "👍";
						break;
					case label.SMILE_NAME:
						post.emojiReactedImg = this.imgSmile || "😊";
						break;
					case label.HANDSFOLDED_NAME:
						post.emojiReactedImg = this.imgHands || "🙏";
						break;
					case label.HEART_NAME:
						post.emojiReactedImg = this.imgLike || "❤️";
						break;
					case label.THOUGHTFUL_NAME:
						post.emojiReactedImg = this.imgThought || "🤔";
						break;
					default:
						post.emojiReactedImg = "";
						break;
				}
			}
			return post;
		});
	}

	// To unReact the post
	unReact(event) {
		this.closeAllCommentBoxes();
		this.showSpinner = true;
		this.showEmojiPopup = false;
		const FEED_ID = event.currentTarget.dataset.customFeeditemId;
		this.handleUnreact(FEED_ID);
	}

	closeAllCommentBoxes() {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: false
		}));
	}

	handleUnreact(feedItemId) {
		HARDDELETE_EMOJI_REACTION({ feedItemId })
			.then(() => this.handleUnreactSuccess(feedItemId))
			.catch((error) => this.handleUnreactError(error.body.message));
	}

	handleUnreactSuccess(feedItemId) {
		this.updatePostDetailsAfterUnreact(feedItemId);
		this.showSpinner = false;
	}

	handleUnreactError(error) {
		this.showSpinner = false;
		this.handleError(error) // Catching Potential Error
		this.checkAllReactions();
	}

	updatePostDetailsAfterUnreact(feedItemId) {
		this.postDetails = this.postDetails.map((post) => {
			if (post.Id === feedItemId) {
				return {
					...post,
					toReact: true,
					countEmoji: post.countEmoji - 1 // Decrease the emoji count
				};
			}
			return post;
		});
	}

	// this popup has the information about the reacted user's for the particular post
	closeSecondPopup(event) {
	this.displayTemplateThumbsUp = true;
	this.displayTemplateSmile = false;
	this.displayTemplateFoldedHands = false;
	this.displayTemplateHeart = false;
	this.displayTemplateThinkingFace = false;
	this.noReactionForThisEmoji = false;
	this.isSecondPopupOpen = false;
	document.body.style.overflow = "";
	this.currentPostId = null;
	const CLICKED_POST_ID = event.currentTarget.dataset.customFeeditemId;
	this.postDetails = this.postDetails.map((post) => ({
		...post,
		secondPopupClass: post.Id === CLICKED_POST_ID ? "!second-popup" : "second-popup hidden"
	}));
}
	//open the particular reaction popup
	get secondPopupClass() {
		return this.isSecondPopupOpen ? "!second-popup" : "second-popup hidden";
	}

	// After clicking show the thumbsup emoji reacted users
	viewReaction(event) {
		this.resetEmojiTextClasses();
		this.emojiText = "emojiTextBox";
		this.feedItemIdEmoji = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.updatePostPopupState(this.feedItemIdEmoji);
		this.isSecondPopupOpen = true;
		this.setBodyOverflowStyle();
		this.displayTemplateThumbsUp = true;
		this.fetchThumbsUpReactions();
	}
	resetEmojiTextClasses() {
		this.emojiText = "emojiText";
		this.emojiTextSmile = "emojiText";
		this.emojiTextHands = "emojiText";
		this.emojiTextHeart = "emojiText";
		this.emojiTextThinking = "emojiText";
	}
	// Set the overflow style for the body based on device type
	setBodyOverflowStyle() {
		document.body.style.overflow = this.isDesktop ? "hidden" : "";
	}
	// Update the popup state for posts
	updatePostPopupState(feedItemId) {
		return this.postDetails.map((post) => ({
			...post,
			secondPopupClass:
			post.Id === feedItemId ? "second-popup" : "second-popup hidden",
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));
	}
	// Fetch thumbs-up reactions from the server
	fetchThumbsUpReactions() {
    TOTAL_REACTIONS({
		feedItemId: this.feedItemIdEmoji,reactionType: label.THUMSUP_VALUE})
		.then((result) => {
        if (result && result.length > 0) {
        this.processThumbsUpResults(result);
        } else {
        this.handleNoReactions();
        }
	})
    .catch((error) => {
		this.handleError(error) // Catching Potential Error
        this.noReactionForThisEmoji = true;
    });
	}
	// Handle the case when there are no reactions
	handleNoReactions() {
		this.noReactionForThisEmoji = true;
		this.displayTemplateThumbsUp = false;
		this.displayTemplateSmile = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateHeart = false;
		this.displayTemplateThinkingFace = false;
	}
	// Process the thumbs-up results from the server
	processThumbsUpResults(result) {
		this.noReactionForThisEmoji = false;
		this.displayTemplateThumbsUp = true;
		this.displayTemplateSmile = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateHeart = false;
		this.displayTemplateThinkingFace = false;
		this.thumbsUpResult = this.updateReactionResults(
		result,
		this.userEnrolleeId
		);
	}
	updateReactionResults(result, userEnrolleeId) {
		return result.map((item) => ({
			...item,
			avatarDataForReaction: item.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
			reactionYouName: userEnrolleeId === item.BI_PSP_CareProgramEnrolleeEmoji__c ?
				label.YOU_LABEL : item.BI_PSP_CareProgramEnrolleeEmoji__r
				.BI_PSP_CommunityUsername__c || label.NO_USERNAME_LABEL
		}));
	}

	fetchAndHandleReactions(reactionType, emojiTextClass) {
			this.resetEmojiTextClasses();
			this[emojiTextClass] = "emojiTextBox";
			TOTAL_REACTIONS({
					feedItemId: this.feedItemIdEmoji,
					reactionType: reactionType
				})
				.then((result) => this.handleReactionResult(result, reactionType))
				.catch((error) => {
					this.noReactionForThisEmoji = true;
					this.handleError(error.body.message) // Catching Potential Error
				});
	}
	handleReactionResult(result, reactionType) {
		if (result && result.length > 0) {
			this.noReactionForThisEmoji = false;
			this.displayTemplateThumbsUp = reactionType === label.THUMSUP_VALUE;
			this.displayTemplateSmile = reactionType === label.SMILE_VALUE;
			this.displayTemplateFoldedHands =
				reactionType === label.HANDSFOLDED_VALUE;
			this.displayTemplateHeart = reactionType === label.HEART_VALUE;
			this.displayTemplateThinkingFace =
				reactionType === label.THOUGHTFUL_VALUE;
			const reactionTypeMap = {
				1: "thumbsUpResult",
				2: "smileResult",
				3: "foldedHandsResult",
				4: "heartResult",
				5: "thinkingFaceResult"
			};
			const propertyName = reactionTypeMap[reactionType];
			this[propertyName] = this.updateReactionResults(
				result,
				this.userEnrolleeId
			);
		}
		else {
			this.handleNoReactions();
		}
	}
	handleShowTemplateThumbsup() {
		this.fetchAndHandleReactions(label.THUMSUP_VALUE, "emojiText");
	}
	handleShowTemplateSmile() {
		this.fetchAndHandleReactions(label.SMILE_VALUE, "emojiTextSmile");
	}
	handleShowTemplateFoldedhands() {
		this.fetchAndHandleReactions(label.HANDSFOLDED_VALUE, "emojiTextHands");
	}
	handleShowTemplateHeart() {
		this.fetchAndHandleReactions(label.HEART_VALUE, "emojiTextHeart");
	}
	handleShowTemplateThinkingFace() {
		this.fetchAndHandleReactions(label.THOUGHTFUL_VALUE, "emojiTextThinking");
	}
	//show these three dot at only mobile view
	get threedotClass() {
		return this.isThreeDotClassOpen
			? "threedot-container"
			: "threedot-container hidden";
	}

	threedotOpen(event) {
		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			threedotClass:
				comment.Id === this.commentId ? !comment.threedotClass : false
		}));
		this.isThreeDotClassOpen = true;
		this.DocumentStyleHidden();
	}

	//close the action popup
	closeThreedotActionPopup() {
		this.isThreeDotClassOpen = false;
		this.DocumentStyle();
	}

	get firstPopupClass() {
		return this.isFirstPopupOpen ? "popup-container" : "popup-container hidden";
	}

	//OPEN THE ACTION POPUP after clicking the threedots
	openFirstPopup(event) {
		this.isThreeDotClassOpen = false;
		this.DocumentStyle();
		this.feedCommentItemIdToDelete =
			event.currentTarget.dataset.customFeeditemId;
		this.postitemid = event.currentTarget.dataset.customPostitemId;
		this.isFirstPopupOpen = true;
		this.DocumentStyleHidden();
	}

	//close the delete comment confirmation popup
	closeFirstPopup() {
		this.isFirstPopupOpen = false;
		this.DocumentStyle();
	}

	// To delete the comment
	handleDeleteComment() {
		this.isFirstPopupOpen = false;
		this.DocumentStyle();
			SOFTDELETE_COMMENT_ITEM({
				feedCommentItemId: this.feedCommentItemIdToDelete
			})
				.then(() => {
					this.displayComment = this.displayComment.filter(
						(comment) => comment.Id !== this.feedCommentItemIdToDelete
					);
					this.postDetails = this.postDetails.map((post) => {
						if (post.Id === this.postitemid) {
							return {
								...post,
								commentCount: post.commentCount - 1
							};
						}
						return post;
					});
					// Check if there are no comments left
					this.commentResult = this.displayComment.length > 0;
					window.scrollTo({ top: 0, behavior: "smooth" });
					this.showToastTrue();
				})
				.catch((error) => {
					this.handleError(error.body.message) // Catching Potential Error
				});
	}
	showToastTrue() {
		this.showToastMsg = true;
		this.ToastMsg = this.commentToastContent;
	}
	//close the commentbox
	commentCancelButton() {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: false,
			displayHide: ""
		}));
		this.emptyCommand();
		this.commentOption = [];
	}
	emptyCommand() {
		this.comment = "";
	}
	editCommand() {
		this.editComment = "";
	}
	// To comment on a post
	handleCommentChange(event) {
		this.comment = event.target.value;
			if (this.comment && this.comment !== label.NO_COMMENTS) {
				const FEED_ITEM_ID = event.currentTarget.dataset.customFeeditemId;
				SAVE_COMMENT_OPTION({
					commentContent: this.comment,
					postId: FEED_ITEM_ID
				})
					.then(() => {
						this.emptyCommand();
						this.postDetails = this.postDetails.map((post) => {
							if (post.Id === FEED_ITEM_ID) {
								return {
									...post,
									commentCount: post.commentCount + 1,
									commentBox:
										post.Id === FEED_ITEM_ID ? !post.commentBox : false,
									displayHide:
										post.Id === FEED_ITEM_ID && !post.commentBox ? "Hide" : ""
								};
							}
							return post;
						});
						this.emptyCommand();
					})
					.catch((error) => {
						this.handleToast(error.body.message); // Catching Potential Error

					});
			} else {
				this.emptyCommand();
			}
	}

	// To edit the comment for a post
	editTheComment(event) {
		this.editTheCommentTxt = "editTheCommentTxt";
		this.isThreeDotClassOpen = false;
		this.DocumentStyle();

		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			showEditTheComment:
				comment.Id === this.commentId ? !comment.showEditTheComment : false
		}));
	}

	//Hide the edit dropdown
	closeShowEditTheComment() {
		this.editTheCommentTxt = "HideeditTheCommentTxt";
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			showEditTheComment: false
		}));
	}

	//To update the comment
	handleCommentChangeEdit(event) {
			this.editComment = event.target.value;
			this.commentId = event.currentTarget.dataset.customFeeditemId;
			if (this.editComment && this.editComment !== label.NO_COMMENTS) {
				EDIT_COMMENT({
					commentToUpdate: this.editComment,
					commentId: this.commentId
				})
					.then((result) => {
						if (result && result !== null) {
							this.displayComment = this.displayComment.map((comment) => {
								if (comment.Id === this.commentId) {
									return {
										...comment,
										BI_PSP_Comment__c: result.BI_PSP_Comment__c,
										showEditTheComment: false
									};
								}
								return comment;
							});
							this.editCommand();
							this.emptyCommand();
						} else {
							this.editCommand();
							this.emptyCommand();
							this.handleToast(label.ERROR_MESSAGE); // Catching Potential Error
						}
					})
					.catch((error) => {
						this.handleError(error.body.message) // Catching Potential Error
						this.editCommand();
						this.emptyCommand();

					});
			}
	}
	handleToast(error) {
		this.handleError(error.body.message) // Catching Potential Error
	}
	// To calculate time difference for comments from creaed time
	calculateTimeDifferenceForComment(createdDate) {
		const timeUnits = this.calculateTimeUnits(createdDate);
		return this.formatTimeDifferenceBasedOnUnits(timeUnits);
	}
	
	formatTimeDifferenceBasedOnUnits(timeUnits) {
		const { SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS } = timeUnits;
	
		switch (true) {
			case YEARS > 0:
				return this.formatTimeDifference(YEARS, label.CHATTER_YEAR, label.CHATTER_YEARS);
			case MONTHS > 0:
				return this.formatTimeDifference(MONTHS, label.CHATTER_MONTH, label.CHATTER_MONTHS);
			case DAYS > 0:
				return this.formatTimeDifference(DAYS, label.CHATTER_DAY, label.CHATTER_DAYS);
			case HOURS > 0:
				return this.formatTimeDifference(HOURS, label.CHATTER_HOUR, label.CHATTER_HOURS);
			case MINUTES > 0:
				return this.formatTimeDifference(MINUTES, label.CHATTER_MINUTE, label.CHATTER_MINUTES);
			default:
				return this.formatTimeDifference(SECONDS, label.CHATTER_SECOND, label.CHATTER_SECONDS);
		}
	}
	
	formatTimeDifference(value, singularLabel, pluralLabel) {
		return `${value} ${value === 1 ? singularLabel : pluralLabel} ${label.CHATTER_AGO}`;
	}

	//comment button and show the comments (users who commented for the post with date,name,comment etc...)
	closecomment(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: post.Id === POST_ID ? !post.commentBox : false,
			displayHide: ""
		}));
		this.commentBox = true;
	}

	// Toggles the visibility of the comment box
	toggleCommentBox(POST_ID) {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: post.Id === POST_ID ? !post.commentBox : false,
			displayHide: post.Id === POST_ID && !post.commentBox ? "Hide" : "",
			showEmojiPopup: false
		}));
		this.commentBox = true;
	}

	// Fetches comments from the server and updates the component state
	fetchComments(POST_ID) {
		VIEW_COMMENTS({ feedItemId: POST_ID })
			.then((result) => this.processComments(result))
			.catch((error) => this.handleCommentError(error.body.message));
	}

	// Processes and formats the fetched comments
	processComments(result) {
		if (result && result.length > 0) {
			this.displayComment = result.map((post) => ({
				...post,
				formattedTimeDifferenceForComment: this.calculateTimeDifference(post.CreatedDate),
				isCurrentUserCommentCreator: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c,
				avatarDataForComment: post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c,
				youname:this.getUsername(post),
			}));
			this.commentResult = true;
		} else {
			this.commentResult = false;
		}
	}

	getUsername(post) {
	if (this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c) {
        return label.YOU_LABEL;
    } 
        return post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c !== null
            ? post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c
            : label.NO_USERNAME_LABEL;
	}

	// Handles errors when fetching comments
	handleCommentError(error) {
		this.handleError(error) // Catching Potential Error
		this.commentResult = false;
	}

	// Defines comment options based on TITLE and BODY
	setCommentOptions(TITLE, BODY) {
		// Set the comment options based on the TITLE and BODY
			if (COMMENT_OPTIONS_MAP[TITLE]?.[BODY]) {
				this.commentOption = this.mapLabelsToOptions(
					COMMENT_OPTIONS_MAP[TITLE][BODY]
				);
			}
			else {
				this.commentOption = [{
					label: label.NO_COMMENTS,
					value: label.NO_COMMENTS
				}];
			}
			
	}
	mapLabelsToOptions(labels) {
		return labels.map((options) => ({ label: options, value: options }));
	}
	// Main method called when the comment button is clicked
	commentBtn(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		const TITLE = event.currentTarget.dataset.customFeeditemTitle;
		const BODY = event.currentTarget.dataset.customFeeditemBody;

		this.toggleCommentBox(POST_ID);
		this.fetchComments(POST_ID);
		this.setCommentOptions(TITLE, BODY);
	}

	//after clicking the reactions button on the notification components it redirect to mypost, so open the particular reacted post
	//scroll to the particular post and open the viewReaction popup
	viewReactionfromnavigation(navigationFromNotificationReactionId) {
		this.resetEmojiTextClasses();
		this.emojiText = "emojiTextBox";
		const CLICKED_POST_ID = navigationFromNotificationReactionId;
		this.postDetails = this.updatePostPopupState(CLICKED_POST_ID);
		this.isSecondPopupOpen = true;
		this.isDesktopHandle();
		this.currentPostId = CLICKED_POST_ID;
		this.displayTemplateThumbsUp = true;
		this.feedItemIdEmoji = CLICKED_POST_ID;
		this.fetchThumbsUpReactions();
		// Use MutationObserver to observe changes in the DOM
		this.openCommentByClickId(CLICKED_POST_ID);
	}
	openCommentByClickId(CLICKED_POST_ID) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				let postElementbyclass = this.template.querySelector(
					"." + CLICKED_POST_ID
				);
				if (postElementbyclass) {
					postElementbyclass.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
					observer.disconnect(); // Stop observing once the element is found
				}
			});
		});
		// Start observing the target node for configured mutations
		observer.observe(this.template, { childList: true, subtree: true });
	}
	//scroll to the particular comment and open the commentBox
	commentBtnFromNavigation(navigationFromNotificationCommentId) {
		this.openCommentById(navigationFromNotificationCommentId);
		this.fetchCommentsNavi(navigationFromNotificationCommentId);
		this.fetchCommentOptions(navigationFromNotificationCommentId);
	}

	openCommentById(postId) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				let postElementbyclass = this.template.querySelector("." + postId);
				if (postElementbyclass) {
					postElementbyclass.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
					observer.disconnect(); // Stop observing once the element is found
				}
			});
		});
		observer.observe(this.template, { childList: true, subtree: true });
	}

	fetchCommentsNavi(postId) {
		VIEW_COMMENTS({ feedItemId: postId })
			.then((result) => {
				if (result && result.length > 0) {
					this.displayComment = result.map((post) => ({
						...post,
						formattedTimeDifferenceForComment: this.calculateTimeDifference(post.CreatedDate),
						isCurrentUserCommentCreator: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c,
						avatarDataForComment: post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c,
						youname: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c ? label.YOU_LABEL : post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c
					}));
					this.commentResult = true;
				} else {
					this.commentResult = false;
				}
			})
			.catch((error) => {
				this.handleError(error.body.message) // Catching Potential Error
				this.commentResult = false;
			});
	}

	fetchCommentOptions(postId) {
		COMMENT_OPTIONS({ feedItemId: postId })
			.then((result) => {
				if (result && result.length > 0) {
					this.categoryTitle = result[0].BI_PSP_Category__c;
					this.phraseBody = result[0].BI_PSP_Phrase__c;
					this.setCommentOptions(this.categoryTitle, this.phraseBody);
				}
			})
			.catch((error) => {
				this.handleError(error.body.message) // Catching Potential Error
			});
	}
	// Handle errors and display a toast message
	handleError(error) {
		let globalThis=window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
	// To detect the site is branded or unassigned
	detectBrandedOrUnassigned() {
		try{
		let globalThis=window;
		const CURRENT_URL = globalThis.location.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split("/");
		const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
			[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(
				component.toLowerCase()
			)
		);
		if (
			DESIRED_COMPONENTS &&
			DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
		) {
			this.urlName = label.BRANDED_URL;
		}
		//set the url and navigations are done within unassigned site
		else {
			this.urlName = label.UNASSIGNED_URL;
		}
	} catch (error) {
		this.handleError(error.body.message) // Catching Potential Error
	}
	}

	// show the Toast message if the catch runs
	showToast(title, message, variant) {
		if (typeof window !== "undefined") {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}