/**
 *  The Lightning Web Component displays All posts, providing a concise overview of each post's content.
 */
// To import Custom labels and static resources
import * as label from "c/biPspbLabelAndResourceCommunity";
import { COMMENT_OPTIONS_MAP } from 'c/biPspbCommunityCommentOptions';

// To import Libraries
import { LightningElement, wire } from "lwc";
//  To import Apex Classes
import ALL_POST_FEED from "@salesforce/apex/BI_PSPB_FeedItemCtrl.getAllPost";
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import CHECK_FOLLOW_STATUS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.checkFollowingStatus";
import EDIT_COMMENT from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.editComment";
import FOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.followUser";
import HARDDELETE_EMOJI_REACTION from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.deleteEmojiReaction";
import REACTIONSBY_FEED_ID from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.getReactionsByFeedItemId";
import SAVE_COMMENT_OPTION from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.insertComment";
import SAVE_EMOJI from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.saveEmoji";
import SOFTDELETE_COMMENT_ITEM from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.softDeleteFeedCommentItem";
import TOTAL_REACTIONS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalReactionsByType";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
import USER_ENROLLEE_ID from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import VIEW_COMMENTS from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.viewComments";

export default class BiPspbAllPost extends LightningElement {
	// Declaration of variables
	navigationCreatePostId;
	editTheCommentTxt = "editTheCommentTxt";
	userId = label.ID;
	userEnrolleeId;
	allPost = [];
	enrolleeId;
	followAvatar;
	loggedUserAvatar;
	saveEmojiResult = [];
	editComment;
	commentId;
	postItemId;
	feedCommentItemIdToDelete;
	followFollowingBtn;
	commentBox;
	displayComment = [];
	avatarDataForReaction;
	emojiText;
	emojiTextSmile;
	emojiTextHands;
	emojiTextHeart;
	emojiTextThinking;
	postIdForFollow;
	showSpinner;
	thumbsUpResult;
	smileResult;
	foldedHandsResult;
	heartResult;
	thinkingFaceResult;
	feedItemIdEmoji;
	displayHide = "";
	selectedUserId;
	checkFollowBtn;
	followEnrolleeId;
	followAvatarResult;
	countRecord;
	getComments = false;
	isFirstPopupOpen = false;
	showEditTheComment = false;
	isThreeDotClassOpen = false;
	emojiUnfollowConfirmation = false;
	noReactionForThisEmoji = false;
	isSecondPopupOpen = false;
	emojiFollowingProfile = false;
	emojiFollowProfile = false;
	isDesktop = false;
	emojiFollowConfirmation = false;
	showAllPost = false;
	followPopupAtFeed = false;
	followingPopupAtFeed = false;
	followPopupConfirmationAtFeed = false;
	followingPopupConfirmationAtFeed = false;
	showToastMsg;
	ToastMsg = '';
	showEmojiPopup = false;
	displayTemplateThumbsUp = true;
	displayTemplateSmile = false;
	displayTemplateFoldedHands = false;
	displayTemplateHeart = false;
	displayTemplateThinkingFace = false;
	//Declaration of variables
	imgThumbs = label.THUMBS_UP_IMG;
	imgSmile = label.SMILE_IMG;
	imgHands = label.HANDS_FOLDED_IMG;
	imgLike = label.HEART_IMG;
	imgThought = label.THOUGHTFUL_IMG;
	deleteImg = label.DELETE_ICON_IMG;
	allPostImg = label.NO_FEED_IMG;
	noComment = label.NO_COMMENT_IMG;
	avatarContent = label.AVATAR_CONTENT;
	allPostLabel = label.ALL_POST_LABEL;
	createNewPost = label.CREATE_NEW_POST;
	thumbsUpLabel = label.THUMBS_UP_LABEL;
	smileLabel = label.SMILE_LABEL;
	handsFoldedLabel = label.HANDS_FOLDED_LABEL;
	heartLabel = label.HEART_LABEL;
	thoughtfulLabel = label.THOUGHT_LABEL;
	alternateTextForTick = label.ALTERNATE_TICK;
	alternateTextForAvatar = label.ALTERNATE_AVATAR;
	alternateForPost = label.ALTERNATE_POST;
	alternateForUserAvatar = label.ALTERNATE_USER_AVATAR;
	alternateForReaction = label.ALTERNATE_REACTION;
	alternateForComment = label.ALTERNATE_COMMENT;
	alternateForEditComment = label.ALTERNATE_EDIT_COMMENT;
	alternateDeleteComment = label.ALTERNATE_DELETE_COMMENT;
	no = label.NO;
	yes = label.YES;
	commentToastContent = label.COMMENT_TOAST_TEXT;
	noAllPost = label.NO_ALL_POST_CONTENT;
	reactionsLabel = label.REACTIONS_LABEL;
	commentLabel = label.COMMENT_LABEL;
	commentsLabel = label.COMMENTS_LABEL;
	reactLabel = label.REACT_LABEL;
	noReactionYet = label.NO_REACTION_YET;
	noCommentYet = label.NO_COMMENTS_YET;
	selectComment = label.SELECT_COMMENT;
	selectLabel = label.SELECT;
	actionLabel = label.ACTION_LABEL;
	editCommentLabel = label.EDIT_COMMENT;
	deleteCommentLabel = label.DELETE_COMMENT_LABEL;
	deleteCommentConfirmationText = label.DELETE_POPUP_CONFIRMATION;
	hideLabel = label.HIDE_LABEL;
	followLabel = label.FOLLOW_LABEL;
	followingLabel = label.FOLLOWING_LABEL;
	followingToastContent = label.FOLLOWING_TOAST;
	unFollowingToastContent = label.UNFOLLOW_TOAST;
	unFollowingPartToastContent = label.UNFOLLOW_PART_TOAST;
	noFollowersContent = label.NO_FOLLOWERS_CONTENT;
	profileLabel = label.PROFILE_LABEL;
	followUserText = label.FOLLOW_USER;
	followPopupHeading = label.FOLLOW_POPUP_HEADING;
	followPopupContent = label.FOLLOW_POPUP_CONTENT;
	unFollowUserText = label.UNFOLLOW_USER;
	unFollowPopupHeading = label.UNFOLLOW_POPUP_HEADING;
	unFollowPopupContent = label.UNFOLLOW_POPUP_CONTENT;
	comment = "";
	commentOption = [];
	editImg = label.EDIT_ICON;
	handleResizeBound;
	isCurrentUserCommentCreator = false;
	toReact;
	// To fetch the enrollee Id of the user
	@wire(USER_ENROLLEE_ID)
	wiredGetEnrolleeId({ data }) {
		try {
			if (data && data.length > 0) {
				this.userEnrolleeId = data[0].Id;
				this.loggedUserAvatar = data[0].BI_PSP_AvatarUrl__c;
				this.getAllPosts();
			}
		} catch {
			this.handleError(label.ACCOUNT_NOT_FOUND);
		}
	}
	// This connected callback used to get Avatar for reaction,post and comments,get local storage value from notification navigation and detect the site Branded or Unbranded
	connectedCallback() {
		try {
			this.getComments = false;
			this.showToastMsg = false;
			this.handleResize();
			this.getAllPosts();
			this.detectBrandedOrUnassigned();
			this.checkAllReactions();
			this.setupEventListeners();
		} catch {
			this.handleError(label.POST_FETCH_ERROR);
		}
	}
	// Setup necessary event listeners
	setupEventListeners() {
		this.handleResizeBound = this.handleResize.bind(this);
		let globalThis = window;
		globalThis.addEventListener("resize", this.handleResizeBound);
		// Navigation from Notification to view the following user Creates the Post
		let selectedItemIdforCreatepost = globalThis.localStorage.getItem(
			"selectedItemIdforCreatepost"
		);
		if (selectedItemIdforCreatepost) {
			this.navigationCreatePostId = selectedItemIdforCreatepost;
			globalThis.localStorage.removeItem("selectedItemIdforCreatepost");
		}
	}
	// Observe changes in the DOM
	observeDomChanges() {
		// Use MutationObserver to observe changes in the DOM
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				const POST_ELEMENT_BY_CLASS = this.template.querySelector(
					"." + this.navigationCreatePostId
				);
				// Stop observing once the element is found
				if (POST_ELEMENT_BY_CLASS) {
					POST_ELEMENT_BY_CLASS.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
					observer.disconnect();
				}
			});
		});
		// Start observing the target node for configured mutations
		observer.observe(this.template, { childList: true, subtree: true });
	}
	//Used to remove the Event from the fixed screen
	disconnectedCallback() {
		window.removeEventListener("resize", this.handleResizeBound);
	}

	//Set the desktop view to fix the screen for popup
	handleResize() {
		this.isDesktop = this.isDesktopView();
	}

	// This function used to Fix the screen as static if the popup opens as per requirement
	isDesktopView() {
		let globalThis = window;
		const VIEWPORT_PATH = globalThis.innerWidth;
		return VIEWPORT_PATH <= 2024 || VIEWPORT_PATH >= 200;
	}

	// Get all posts
	getAllPosts() {
			this.showSpinner = true;
			ALL_POST_FEED()
				.then((data) => {
					this.handlePostData(data);
				})
				.catch((error) => {
					this.handleError(error.body.message);
				});
	}

	// Handle post data received from the server
	handlePostData(data) {
		if (!data || data.length === 0) {
			this.showAllPost = false;
			this.showSpinner = false;
			return;
		}
		this.showAllPost = true;
		this.allPost = this.formatPostData(data);
		this.checkAllReactions();
		this.showSpinner = false;
		this.commentBox = true;
	}

	// Format post data for display
	formatPostData(data) {
		return data.map((post) => ({
			...post,
			checkFollowBtn:
				post.BI_PSP_FollowStatus__c === label.FOLLOWING_LABEL
					? label.FOLLOWING_LABEL
					: label.FOLLOW_LABEL,
			checkFollowStatusButton:
				this.userEnrolleeId !== post.BI_PSP_CareProgramEnrollee__c,
			commentBox: false,
			CommentCount: post.BI_PSP_FeedComment__r
				? post.BI_PSP_FeedComment__r.length
				: 0,
			CountEmoji: post.BI_PSP_EmojiReactionController__r
				? post.BI_PSP_EmojiReactionController__r.length
				: 0,
			displayHide: "",
			emojiYouReacted: "",
			formattedTimeDifference: this.calculateTimeDifference(post.CreatedDate),
			imageAvatar: post.BI_PSP_CareProgramEnrollee__r.BI_PSP_AvatarUrl__c,
			postYouName:this.getUsername(post),
			reactionResult: "",
			showEmojiPopup: false,
			toReact: true
		}));
	}
	getUsername(post){
		if (this.userEnrolleeId === post.BI_PSP_CareProgramEnrollee__c) {
        return label.YOU_LABEL;
    } 
    return post.BI_PSP_CareProgramEnrollee__r.BI_PSP_CommunityUsername__c !== null
            ? post.BI_PSP_CareProgramEnrollee__r.BI_PSP_CommunityUsername__c
            : label.NO_USERNAME_LABEL;
	}
	// Handle errors and display a toast message
	handleError(error) {
		this.showSpinner = false;
		this.showSpinner = false;
		let globalThis=window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}

	//After clicking create a new post go to createPost page with checking communityUsername
	goToCreatePost() {
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					if (result === true) {
						window.location.assign(
							label.SLASH + this.urlq + label.CREATEPOST_URL
						);
					} else if (result === false) {
						window.location.assign(
							label.SLASH + this.urlq + label.COMMUNITY_USERNAME_URL
						);
					}
				})
				.catch((error) => {
					this.handleError(error.body.message);
				});
	}

	// Format the Date with Created Date like 2 years ago, 30 minutes ago, etc.
	calculateTimeDifference(createdDate) {
		const CURRENT_TIME = new Date();
		const POST_TIME = new Date(createdDate);
		const TIME_DIFFERENCE = CURRENT_TIME - POST_TIME;
		const SECONDS = Math.floor(TIME_DIFFERENCE / 1000);
		const MINUTES = Math.floor(SECONDS / 60);
		const HOURS = Math.floor(MINUTES / 60);
		const DAYS = Math.floor(HOURS / 24);
		const MONTHS = Math.floor(DAYS / 30);
		const YEARS = Math.floor(DAYS / 365);

		switch (true) {
			case YEARS > 0:
				return this.formatTimeDifference(
					YEARS,
					label.CHATTER_YEAR,
					label.CHATTER_YEARS
				);
			case MONTHS > 0:
				return this.formatTimeDifference(
					MONTHS,
					label.CHATTER_MONTH,
					label.CHATTER_MONTHS
				);
			case DAYS > 0:
				return this.formatTimeDifference(
					DAYS,
					label.CHATTER_DAY,
					label.CHATTER_DAYS
				);
			case HOURS > 0:
				return this.formatTimeDifference(
					HOURS,
					label.CHATTER_HOUR,
					label.CHATTER_HOURS
				);
			case MINUTES > 0:
				return this.formatTimeDifference(
					MINUTES,
					label.CHATTER_MINUTE,
					label.CHATTER_MINUTES
				);
			default:
				return this.formatTimeDifference(
					SECONDS,
					label.CHATTER_SECOND,
					label.CHATTER_SECONDS
				);
		}
	}

	// Helper function to format the time difference
	formatTimeDifference(value, singularLabel, pluralLabel) {
		return `${value} ${value === 1 ? singularLabel : pluralLabel} ${label.CHATTER_AGO}`;
	}

	//After clicking the react button show the popup with 5 emoji's (only clicked post's emoji button)
	ReactionBtn(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.allPost = this.allPost.map((post) => ({
			...post,
			showEmojiPopup: post.Id === POST_ID ? !post.showEmojiPopup : false,
			commentBox: false,
			displayHide: ""
		}));
	}

	// After clicking the Emoji's  save the details
	reactWith(event) {
			//Show loading spinner for react
			this.showSpinner = true;
			const FEED_ID = event.currentTarget.dataset.customFeeditemId;
			const EMOJI_TYPE = event.currentTarget.dataset.reactionType;
			//Call apex to store emoji saved information
			SAVE_EMOJI({
				reactions: EMOJI_TYPE,
				feedItemId: FEED_ID
			})
				.then((result) => {
					this.handleSaveEmojiSuccess(result, FEED_ID);
				})
				.catch((error) => {
					this.handleSaveEmojiError(error.body.message);
				});
	}
	// Handle emoji save error
	handleSaveEmojiError() {
		this.allPost = this.allPost.map((post) => ({
			...post,
			showEmojiPopup: false
		}));
		this.handleError(label.ERROR_ON_REACTING);
	}
	// Handle successful emoji save
	handleSaveEmojiSuccess(result, feedId) {
		this.showSpinner = false;
		this.saveEmojiResult = Array.isArray(result) ? result : [result];

		if (this.saveEmojiResult && this.saveEmojiResult.length > 0) {
			this.resultFinal = true;
			this.allPost = this.allPost.map((post) =>
				this.updatePostAfterReaction(post, feedId, result)
			);
		} else {
			this.handleSaveEmojiError({ message: label.UNABLE_TO_REACT });
		}
	}
	// Update post after reaction
	updatePostAfterReaction(post, feedId, result) {
		if (post.Id === feedId) {
			const emojiResult = this.getResultEmojiAndImg(
				result.BI_PSP_ReactionResult__c
			);
			return {
				...post,
				showEmojiPopup: false,
				toReact: false,
				emojiYouReacted: emojiResult.name,
				CountEmoji: post.CountEmoji + 1,
				emojiReactedImg: emojiResult.img
			};
		}
		return post;
	}

	// Get emoji name and image based on reaction result
	getResultEmojiAndImg(reactionResult) {
		switch (reactionResult) {
			case label.THUMSUP_VALUE:
				return { name: label.THUMSUP_NAME, img: this.imgThumbs };
			case label.SMILE_VALUE:
				return { name: label.SMILE_NAME, img: this.imgSmile };
			case label.HANDSFOLDED_VALUE:
				return { name: label.HANDSFOLDED_NAME, img: this.imgHands };
			case label.HEART_VALUE:
				return { name: label.HEART_NAME, img: this.imgLike };
			case label.THOUGHTFUL_VALUE:
				return { name: label.THOUGHTFUL_NAME, img: this.imgThought };
			default:
				return { name: "", img: "" };
		}
	}
	//check the reactions if already reacted or not (if any changes made in myPost page)
	checkAllReactions() {
		this.allPost.forEach((post) => {
			this.checkReactions(post.Id);
		});
	}

	// Check reactions for a given postId and update the post data accordingly
	checkReactions(postId) {
			REACTIONSBY_FEED_ID({ feedItemId: postId })
				.then((result) => this.handleReactionsResponse(result, postId))
				.catch((error) => this.handleError(error.body.message));
	}

	// Handle successful response from reactions API
	handleReactionsResponse(result, postId) {
		if (result && result.length > 0) {
			const REACTION = parseInt(result, 10); // Assuming result is a numeric string
			const EMOJI_DATA = {
				1: label.THUMSUP_NAME,
				2: label.SMILE_NAME,
				3: label.HANDSFOLDED_NAME,
				4: label.HEART_NAME,
				5: label.THOUGHTFUL_NAME
			};
			this.allPost = this.allPost.map((post) => {
				if (post.Id === postId) {
					post.toReact = REACTION === undefined || isNaN(REACTION);
					post.emojiYouReacted = EMOJI_DATA[REACTION] || "None";
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
		} else {
			this.handleError(label.POST_ERROR);
		}
	}

	// To unReact the post
	unreact(event) {
		this.allPost = this.allPost.map((post) => ({
			...post,
			commentBox: false
		}));
		//show loading spinner for unReact
		this.showSpinner = true;
		this.showEmojiPopup = false;
		const FEED_ID = event.currentTarget.dataset.customFeeditemId;
		//Delete the Emoji data
			HARDDELETE_EMOJI_REACTION({ feedItemId: FEED_ID })
				.then(() => {
					this.allPost = this.allPost.map((post) => {
						if (post.Id === FEED_ID) {
							return {
								...post,
								toReact: true,
								CountEmoji: post.CountEmoji - 1
							};
						}
						return post;
					});
					//Here it close spinner after unReact
					this.showSpinner = false;
				})
				.catch((error) => {
					this.handleError(error.body.message);
					this.checkAllReactions();
				});
	}

	//close the emoji reaction popup
	closeEmojiPopup() {
		this.allPost = this.allPost.map((post) => ({
			...post,
			showEmojiPopup: false
		}));
	}

	// Set the overflow style for the body based on device type
	setBodyOverflowStyle() {
		document.body.style.overflow = this.isDesktop ? "hidden" : "";
	}

	//open the particular reaction popup
	get secondPopupClass() {
		return this.isSecondPopupOpen ? "!second-popup" : "second-popup hidden";
	}

	// Update the popup state for posts
	updatePostPopupState(feedItemId) {
		return this.allPost.map((post) => ({
			...post,
			secondPopupClass:
				post.Id === feedItemId ? "second-popup" : "second-popup hidden",
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));
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
		this.allPost = this.allPost.map((post) => ({
			...post,
			secondPopupClass:
				post.Id === CLICKED_POST_ID ? "!second-popup" : "second-popup hidden"
		}));
	}

	// After clicking show the thumbsup emoji reacted users
	viewReaction(event) {
		this.resetEmojiTextClasses();
		this.emojiText = "emojiTextBox";
		this.feedItemIdEmoji = event.currentTarget.dataset.customFeeditemId;
		this.allPost = this.updatePostPopupState(this.feedItemIdEmoji);
		this.isSecondPopupOpen = true;
		this.setBodyOverflowStyle();
		this.displayTemplateThumbsUp = true;
		this.fetchThumbsUpReactions();
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

	resetEmojiTextClasses() {
		this.emojiText = "emojiText";
		this.emojiTextSmile = "emojiText";
		this.emojiTextHands = "emojiText";
		this.emojiTextHeart = "emojiText";
		this.emojiTextThinking = "emojiText";
	}

	// Fetch thumbs-up reactions from the server
	fetchThumbsUpReactions() {
			TOTAL_REACTIONS({
				feedItemId: this.feedItemIdEmoji,
				reactionType: label.THUMSUP_VALUE
			})
				.then((result) => {
					if (result && result.length > 0) {
						this.processThumbsUpResults(result);
					} else {
						this.handleNoReactions();
					}
				})
				.catch((error) => {
					this.handleError(error.body.message);
					this.noReactionForThisEmoji = true;
				});
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
					this.handleError(error.body.message);
				});
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
		} else {
			this.handleNoReactions();
		}
	}

	// Method to map and update reaction results
	updateReactionResults(result, userEnrolleeId) {
		return result.map((item) => ({
			...item,
			avatarDataForReaction:
				item.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
			reactionYouName:
				userEnrolleeId === item.BI_PSP_CareProgramEnrolleeEmoji__c
					? label.YOU_LABEL
					: item.BI_PSP_CareProgramEnrolleeEmoji__r
						.BI_PSP_CommunityUsername__c || label.NO_USERNAME_LABEL
		}));
	}

	//show these three dot at only mobile view
	get threeDotClass() {
		return this.isThreeDotClassOpen
			? "threedot-container"
			: "threedot-container hidden";
	}

	threedotOpenActionPopup(event) {
		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			threeDotClass:
				comment.Id === this.commentId ? !comment.threeDotClass : false
		}));
		this.isThreeDotClassOpen = true;
		this.setBodyOverflowStyle();
	}
	//close the action popup
	closeThreedot() {
		this.isThreeDotClassOpen = false;
		document.body.style.overflow = "";
	}

	//delete comment popup
	get firstPopupClass() {
		return this.isFirstPopupOpen ? "popup-container" : "popup-container hidden";
	}

	//OPEN THE ACTION POPUP after clicking the threedots
	openFirstPopup(event) {
		this.closeThreedot();
		this.feedCommentItemIdToDelete =
			event.currentTarget.dataset.customFeeditemId;
		this.postItemId = event.currentTarget.dataset.customPostitemId;
		this.isFirstPopupOpen = true;
		this.setBodyOverflowStyle();
	}

	//close the delete comment confirmation popup
	closeFirstPopup() {
		document.body.style.overflow = "";
		this.isFirstPopupOpen = false;
	}

	//close the toast message
	closeToastMsg() {
		this.ToastMsg = '';
		this.showToastMsg = false;
	}

	//close CommentBox
	closeCommentBox(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.allPost = this.allPost.map((post) => ({
			...post,
			commentBox: post.Id === POST_ID ? false : post.commentBox,
			displayHide: ""
		}));
		this.commentBox = true;
	}

	// close the edit dropdown comment
	closeshoweditthecomment(event) {
		this.editTheCommentTxt = "HideeditTheCommentTxt";
		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			showEditTheComment: false
		}));
	}

	// To delete the comment
	handleDeleteComment() {
			this.isFirstPopupOpen = false;
			document.body.style.overflow = "";
			SOFTDELETE_COMMENT_ITEM({
				feedCommentItemId: this.feedCommentItemIdToDelete
			})
				.then(() => {
					this.updateCommentsAndPosts(
						this.feedCommentItemIdToDelete,
						this.postItemId
					);
					this.showToastMsg = true;
					this.ToastMsg = this.commentToastContent;
					window.scrollTo({ top: 0, behavior: "smooth" });
				})
				.catch((error) => {
					this.handleError(error.body.message);
				});
	}
	// Method to update comments and posts after deletion
	updateCommentsAndPosts(feedCommentItemIdToDelete, postItemId) {
		this.displayComment = this.displayComment.filter(
			(comment) => comment.Id !== feedCommentItemIdToDelete
		);
		this.allPost = this.allPost.map((post) => {
			if (post.Id === postItemId) {
				return {
					...post,
					CommentCount: post.CommentCount - 1
				};
			}
			return post;
		});
		// Check if there are no comments left
		this.getComments = this.displayComment.length > 0;
	}

	//Close Comment Box
	commentCancel() {
		this.allPost = this.allPost.map((post) => ({
			...post,
			commentBox: false,
			displayHide: ""
		}));
		this.comment = "";
		this.commentOption = [];
	}
	//Insert a comment
	handleCommentChange(event) {
			this.comment = event.target.value;
			const FEED_ID = event.currentTarget.dataset.customFeeditemId;
			if (this.comment && this.comment !== label.NO_COMMENTS) {
				SAVE_COMMENT_OPTION({
					commentContent: this.comment,
					postId: FEED_ID
				})
					.then(() => {
						this.comment = "";
						this.allPost = this.allPost.map((post) => {
							if (post.Id === FEED_ID) {
								return {
									...post,
									CommentCount: post.CommentCount + 1,
									commentBox: post.Id === FEED_ID ? !post.commentBox : false,
									displayHide:
										post.Id === FEED_ID && !post.commentBox ? this.hideLabel : ""
								};
							}
							return post;
						});
						this.comment = "";
					})
					.catch((error) => {
						this.handleError(error.body.message);
						this.comment = "";
					});
			} else {
				this.comment = "";
			}
	}

	//Open the EditComment Dropdown
	editTheComment(event) {
		this.editTheCommentTxt = "editTheCommentTxt";
		this.closeThreedot();
		this.isThreeDotClassOpen = false;
		document.body.style.overflow = "";
		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			showEditTheComment: comment.Id === this.commentId
		}));
	}

	//Edit the Comment
	handleCommentChangeedit(event) {
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
										comment: "",
										showEditTheComment: false
									};
								}
								this.comment = "";
								return comment;
							});
							this.comment = "";
						} else {
							this.handleError(label.COMMENT_ERROR);
						}
					})
					.catch((error) => {
						this.handleError(error.body.message);
						this.comment = "";
					});
				this.showEditTheComment = false;
				this.comment = "";
			}
	}

	//Open  comment Box to view the All comments
	commentBoxOpen(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		const TITLE = event.currentTarget.dataset.customFeeditemTitle;
		const BODY = event.currentTarget.dataset.customFeeditemBody;

		this.allPost = this.allPost.map((post) => ({
			...post,
			commentBox: post.Id === POST_ID ? !post.commentBox : false,
			displayHide: post.Id === POST_ID && !post.commentBox ? this.hideLabel : "",
			showEmojiPopup: false
		}));
		this.commentBox = true;
			//Show other user comments for a post
			VIEW_COMMENTS({ feedItemId: POST_ID })
				.then((result) => {
					if (result && result.length > 0) {
						this.displayComment = result.map((post) => ({
							...post,
							formattedTimeDifferenceforcomment: this.calculateTimeDifference(
								post.CreatedDate
							),
							isCurrentUserCommentCreator:
								this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c,
							avatarDataforcomment:
								post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c,
							youname:this.getPostUserName(post),
						}));
						this.getComments = true;
					} else {
						this.getComments = false;
					}
				})
				.catch((error) => {
					this.handleError(error.body.message);
					this.getComments = false;
				});
		// Define the comment options based on TITLE and BODY
		// Set the comment options based on the TITLE and BODY
		if (COMMENT_OPTIONS_MAP[TITLE]?.[BODY]) {
			this.commentOption = this.mapLabelsToOptions(
				COMMENT_OPTIONS_MAP[TITLE][BODY]
			);
		} else {
			this.commentOption = [
				{ label: label.NO_COMMENTS, value: label.NO_COMMENTS }
			];
		}
	}
	mapLabelsToOptions(labels) {
		return labels.map((options) => ({ label: options, value: options }));
	}
	// Methods to handle the events, calling the combined method
	followUserpop(event) {
		this.handleFollowPopup(event, true);
	}

	buttonfollowUserpop(event) {
		this.handleFollowPopup(event, false);
	}
	getPostUserName(post){
		if (this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c) {
        return label.YOU_LABEL;
    }
        return post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c !== null
            ? post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c
            : label.NO_USERNAME_LABEL;
	}
	// Method to handle both profile avatar click and button click for follow popup
	handleFollowPopup(event, isProfileAvatarClick) {
		// Reset all post states
		this.allPost = this.allPost.map((post) => ({
			...post,
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));

		// Common assignments
		this.selectedUserId = event.target.dataset.id;
		this.username = event.target.dataset.username;
		this.followAvatar = event.target.dataset.avatar;
		this.enrolleeId = event.target.dataset.acc;
		this.followFollowingBtn = event.target.dataset.button;

		// Conditional assignment for profile avatar click
		if (isProfileAvatarClick) {
			this.postIdForFollow = event.currentTarget.dataset.customFeeditemId;
		}

		// Check if the user is viewing their own profile
		if (this.enrolleeId === this.userEnrolleeId) {
			this.followPopupAtFeed = false;
			this.followingPopupAtFeed = false;
			this.followPopupConfirmationAtFeed = false;
			this.followingPopupConfirmationAtFeed = false;
			document.body.style.overflow = "";
		} else if (this.followFollowingBtn === label.FOLLOW_LABEL) {
			if (isProfileAvatarClick) {
				this.followPopupAtFeed = true;
			} else {
				this.followPopupConfirmationAtFeed = true;
			}
			this.setBodyOverflowStyle();
		} else {
			if (isProfileAvatarClick) {
				this.followingPopupAtFeed = true;
			} else {
				this.followingPopupConfirmationAtFeed = true;
			}
			this.setBodyOverflowStyle();
		}
	}

	// To close popup for follow/unfollow
	closePopup() {
		this.followPopupAtFeed = false;
		this.followPopupConfirmationAtFeed = false;
		this.followingPopupAtFeed = false;
		this.followingPopupConfirmationAtFeed = false;
		document.body.style.overflow = "";
	}

	// open confirmation Following popup
	handleFollowingPopupButtonClick() {
		this.followingPopupConfirmationAtFeed = true;
		this.setBodyOverflowStyle();
		this.followingPopupAtFeed = false;
	}

	// open confirmation Follow popup
	handleFollowPopupButtonClick() {
		this.followPopupConfirmationAtFeed = true;
		this.setBodyOverflowStyle();
		this.followPopupAtFeed = false;
	}

	// To follow the user
	followUserYesBtn() {
			this.showSpinner = true;
			FOLLOW_USER({ enrolleeIdToFollow: this.enrolleeId })
				.then(() => {
					this.allPost = this.allPost.map((post) => ({
						...post,
						checkFollowBtn:
							post.BI_PSP_CareProgramEnrollee__c === this.enrolleeId
								? label.FOLLOWING_LABEL
								: post.checkFollowBtn
					}));
					this.showSpinner = false;
					this.followPopupAtFeed = false;
					this.followPopupConfirmationAtFeed = false;

					// Toast messages
					this.showToastMsg = true;
					this.ToastMsg = this.followingToastContent + ' ' + this.username  + '.';
					window.scrollTo({ top: 0, behavior: "smooth" });
				})
				.catch((error) => {
					this.handleError(error.body.message);
					return false;
				});
				document.body.style.overflow = "";
	}

	// To unfollow the user
	unfollowUserYesBtn() {
			this.showSpinner = true;
			UNFOLLOW_USER({ enrolleeIdToUnFollow: this.enrolleeId })
				.then(() => {
					this.allPost = this.allPost.map((post) => ({
						...post,
						checkFollowBtn:
							post.BI_PSP_CareProgramEnrollee__c === this.enrolleeId
								? label.FOLLOW_LABEL
								: post.checkFollowBtn
					}));
					this.showSpinner = false;
					this.followingPopupAtFeed = false;
					this.followingPopupConfirmationAtFeed = false;

					// Toast messages
					this.showToastMsg = true;
					this.ToastMsg = this.unFollowingToastContent + ' ' + this.username  + ' ' + this.unFollowingPartToastContent;
					window.scrollTo({ top: 0, behavior: "smooth" });
				})
				.catch((error) => {
					this.handleError(error.body.message);
					return false;
				});
				document.body.style.overflow = "";
	}

	//  to follow the user for emoji
	emojiFollowProfileBtn(event) {
			this.username = event.target.dataset.name;
			this.followEnrolleeId = event.currentTarget.dataset.enrollee;
			this.followAvatarResult = event.currentTarget.dataset.avat;
			CHECK_FOLLOW_STATUS({
				loggedEnrolleeId: this.userEnrolleeId,
				otherEnrolleeId: this.followEnrolleeId
			})
				.then((result) => {
					if (this.userEnrolleeId === this.followEnrolleeId) {
						this.emojiFollowProfile = false;
						this.emojiFollowingProfile = false;
						document.body.style.overflow = "";
					} else if (result && result.length > 0) {
						this.countRecord = result.length;
						if (result[0].BI_PSP_Type__c === label.FOLLOWING_LABEL) {
							this.emojiFollowingProfile = true;
							this.setBodyOverflowStyle();
						} else {
							this.emojiFollowProfile = true;
							this.setBodyOverflowStyle();
						}
					} else {
						this.emojiFollowProfile = true;
						this.setBodyOverflowStyle();
					}
					return result;
				})
				.catch((error) => {
					this.handleError(error.body.message);
				});
	}
	// Follow user for Emoji
	emojiFollowYesBtn() {
			this.emojiFollowConfirmation = false;
			FOLLOW_USER({ enrolleeIdToFollow: this.followEnrolleeId })
				.then(() => {
					this.allPost = this.allPost.map((post) => ({
						...post,
						checkFollowBtn:
							post.BI_PSP_CareProgramEnrollee__c === this.enrolleeId ||
								post.BI_PSP_CareProgramEnrollee__c === this.followEnrolleeId
								? label.FOLLOWING_LABEL
								: post.checkFollowBtn
					}));
					this.showSpinner = false;
					window.scrollTo({ top: 0, behavior: "smooth" });
					this.showToastMsg = true;
					this.ToastMsg = this.followingToastContent + ' ' + this.username  + '.';
				})
				.catch((error) => {
					this.handleError(error.body.message);
					return false;
				});
				document.body.style.overflow = "";
	}

	// Unfollow user for Emoji
	emojiUnfollowYesBtn() {
			this.emojiUnfollowConfirmation = false;
			UNFOLLOW_USER({ enrolleeIdToUnFollow: this.followEnrolleeId })
				.then(() => {
					this.allPost = this.allPost.map((post) => ({
						...post,
						checkFollowBtn:
							post.BI_PSP_CareProgramEnrollee__c === this.enrolleeId ||
								post.BI_PSP_CareProgramEnrollee__c === this.followEnrolleeId
								? label.FOLLOW_LABEL
								: post.checkFollowBtn
					}));
					this.showSpinner = false;
					window.scrollTo({ top: 0, behavior: "smooth" });
					this.showToastMsg = true;
					this.ToastMsg = this.unFollowingToastContent + ' ' + this.username  + ' ' + this.unFollowingPartToastContent;
				})
				.catch((error) => {
					this.handleError(error.body.message);
					return false;
				});
				document.body.style.overflow = "";
	}

	// open following  popup
	emojiFollowPopupButtonClick() {
		this.emojiFollowConfirmation = true;
		this.emojiFollowProfile = false;
		this.setBodyOverflowStyle();
	}

	//Close follow/following popup for Emoji
	emojiClosePopup() {
		this.emojiFollowProfile = false;
		this.emojiFollowConfirmation = false;
		this.emojiFollowingProfile = false;
		this.emojiUnfollowConfirmation = false;
		document.body.style.overflow = "";
	}

	// Follow/following popup for confirmation
	emojiFollowingPopupButtonClick() {
		this.emojiUnfollowConfirmation = true;
		this.emojiFollowingProfile = false;
		this.setBodyOverflowStyle();
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
			this.handleError(error.body.message);
		}
	}
}