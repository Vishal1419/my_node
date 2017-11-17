/**
 * Created by ravimodha on 15/08/16.
 */

module.exports = {
    OPENSSL_METHOD:"AES-256-CBC",
    CUSTOMER_ID_ENCRYPT_KEY:"e29fc4f7a84be79085cd454ab0250bdd",
    TOKEN_ENCRYPTION_KEY:"supersecretkeyyoushouldnotcommittogithub",
    MESSAGE:{
        EXISTING_USER_INVITATION:"User already exists. Invite has been successfully sent."
    },
    ERROR_MESSAGES:{
        USERNAME_REQUIRED:"Username required.",
        PASSWORD_REQUIRED:"Password required.",
        USER_NOT_EXIST:"User not found.",
        INVALID_USERNAME:"Invalid username.",
        INVALID_PASSWORD:"Invalid password.",
        INVALID_USER_TYPE:"Please log in using your SOCIAL_TYPE account",
        INVALID_OLD_PASSWORD:"Invalid old password.",
        TOKEN_EXPIRED:"Token is expired.",
        CURRENT_LOCATION_REQUIRED:"Current location required.",
        RESTAURANT_ID_REQUIRED:"Restaurant id required.",
        RESTAURANT_ID_INV:"Invalid value for restaurant id.",
        SEARCH_ID_REQUIRED:"Search id required.",
        TOKEN_NOT_FOUND:"Access token required.",
        INVALID_TOKEN:"Invalid token.",
        USERNAME_INVALID_DT:"Username must be string",
        PASSWORD_INVALID_DT:"Password must be string",
        LATITUDE_INVALID_DT:"Latitude must be number",
        LATITUDE_REQUIRED:"Latitude required",
        LONGITUDE_INVALID_DT:"Longitude must be number",
        LONGITUDE_REQUIRED:"Longitude required",
        RESTAURANT_ID_INVALID_DT:"Restaurant id must be number",
        SEARCH_ID_INVALID_DT:"Search id must be number",
        SEARCH_STRING_DT:'Search string must be string',
        SEARCH_STRING_REQUIRED:'Search string required',
        RESTAURANT_NOT_FOUND:"Restaurant not found.",
        CUISINE_DT:"Cusisine must be string",
        RESTAURANT_NAME_INVALID_DT:"Restaurant name must be string",
        RESTAURANT_NAME_REQUIRED:"Restaurant name required",
        WINE_COLOR_DT:"Wine color must be string",
        WINE_COLOR_REQUIRED:"Wine color required",
        WINE_REGION_DT:"Wine region must be string",
        WINE_NAME_INVALID_DT:"Wine name must be string",
        WINE_NAME_REQUIRED:"Wine name required",
        WINE_MIN_PRICE_DT:"Wine min price must be number",
        WINE_MAX_PRICE_DT:"Wine max price must be number",
        IS_FAVORITE_DT:"Is favorite must be boolean",
        IS_FAVORITE_OUB:"Is favorite must be either 0 or 1",
        ARCHIVE_WINE_NOT_FOUND:"Wine is not in your archive",
        WINE_ID_INVALID_DT:"Wine id must be number",
        WINE_ID_REQUIRED:"Wine id required.",
        NOTE_INVALID_DT:"Note must be string",
        NOTE_REQUIRED:"Note required.",
        SEARCH_STR_INVALID_DT:"Search str must be string",
        SEARCH_STR_REQUIRED:"Search str required.",
        LOCATION_ID_INVALID_DT:"Location id must be number.",
        ARCHIVE_RECORD_NOT_FOUND:"No wine found in your archive.",
        RATE_INVALID_DT:"Rate must be number",
        RATE_REQUIRED:"Rate required.",
        RATE_INV:"Rate must be between 0 and 5.",
        CITY_AREA_INVALID_DT:'City area must be string',
        CITY_AREA_REQUIRED:'City area required',
        CITY_STRING_INVALID_DT:'City string must be string',
        CITY_STRING_REQUIRED:'City required',
        ARCHIVE_TYPE_INVALID_DT:"Archive type must be string",
        ARCHIVE_TYPE_REQUIRED:"Archive type required.",
        ARCHIVE_TYPE_INV:"Invalid value for archive type.",
        WINE_PIC_REQUIRED:"Wine pic is required.",
        WINE_IDS_INVALID_DT:"Wine ids must be number.",
        WINE_IDS_REQUIRED:"Wine ids required.",
        COUNTRY_INVALID_DT:"Country must be string",
        COUNTRY_REQUIRED:"Country required.",
        GRAPE_INVALID_DT:"Grape must be string",
        GRAPE_REQUIRED:"Grape required.",
        VINTAGE_INVALID_DT:"Vintage must be number",
        VINTAGE_REQUIRED:"Vintage required",
        MENU_ID_INVALID_DT:"Menu id must be number",
        VIN_TYPE_INVALID_DT:"Vin type must be string",
        VIN_TYPE_INV:"Invalid value for vin type.",
        QUESTIONS_INVALID_DT:"Questions must be an array.",
        QUESTIONS_REQUIRED:"Questions required.",
        QUESTIONS_DETAILS_REQUIRED:"Answers details required.",
        QUESTION_ID_INVALID_DT:"Question id must be number",
        QUESTION_ID_REQUIRED:"Question id required",
        QUESTION_TYPE_DT:"Question type must be number",
        QUESTION_TYPE_REQUIRED:"Question type required",
        QUESTION_TYPE_INV:"Invalid value for question type.",
        ANSWERS_INVALID_DT:"Answers must be an array.",
        ANSWERS_REQUIRED:"Answers required.",
        ANSWERS_DETAILS_REQUIRED:"Answers details required.",
        ANSWER_ID_INVALID_DT:"Answer id must be number",
        ANSWER_ID_REQUIRED:"Answer id required",
        ANSWER_INVALID_DT:"Answer must be string",
        ANSWER_REQUIRED:"Answer required",
        RESTAURANT_IDS_INVALID_DT:"Restaurant ids must be an array of numbers.",
        RESTAURANT_IDS_REQUIRED:"Restaurant ids required.",
        PROFILE_PIC_REQUIRED:"Profile pic is required.",
        EMAIL_EXIST:"Email already exists.",
        FIRST_NAME_INVALID_DT:"First name must be string",
        FIRST_NAME_REQUIRED:"First name required",
        LAST_NAME_INVALID_DT:"Last name must be string",
        LAST_NAME_REQUIRED:"Last name required",
        EMAIL_INVALID_DT:"Email must be string",
        EMAIL_INV:"Invalid value for email.",
        EMAIL_REQUIRED:"Email required",
        BIRTHDATE_INVALID_DT:"Email must be string",
        BIRTHDATE_REQUIRED:"Birthdate required.",
        BIRTHDATE_INV:"Invalid value for birthdate.",
        LINKED_IN_ID_INVALID_DT:"LinkedIn id must be string.",
        LINKED_IN_ID_REQUIRED:"LinkedIn id required.",
        ADDRESS_INVALID_DT:"Address must be string",
        ADDRESS_REQUIRED:"Address required.",
        ADDRESS_2_INVALID_DT:"Address 2 must be string",
        ADDRESS_2_REQUIRED:"Address 2 required.",
        CITY_INVALID_DT:"City must be string",
        CITY_REQUIRED:"City required.",
        STATE_INVALID_DT:"State must be string",
        STATE_REQUIRED:"State required.",
        ZIP_INVALID_DT:"Zip must be number",
        ZIP_REQUIRED:"Zip required.",
        INVITE_LIMIT_REACHED:"Maximum number of invites reached",
        INVALID_INVITATION_CODE:"Invalid invitation code.",
        INVITE_CODE_INVALID_DT:"Medium must be string",
        INVITATION_CODE_INVALID_DT:"Invitation code must be string",
        INVITATION_CODE_REQUIRED:"Invitation code required.",
        LOWER_PRICE_INVALID_DT:"Lower price must be number",
        UPPER_PRICE_INVALID_DT:"Upper price must be number",
        FOOD_CATEGORY_INVALID_DT:"Food category must be number",
        FOOD_ID_INVALID_DT:"Food id must be number",
        INVITE_CODE_MEDIUM_INVALID_DT:"Medium must be string",
        INVITE_CODE_MEDIUM_REQUIRED:"Medium required.",
        INVITE_CODE_MEDIUM_INV:"Invalid value for medium.",
        OLD_PASSWORD_INVALID_DT:"Old password must be string",
        OLD_PASSWORD_REQUIRED:"Old password required.",
        NEW_PASSWORD_INVALID_DT:"New password must be string",
        NEW_PASSWORD_REQUIRED:"New password required.",
        MOBILE_PHONE_INVALID_DT:"Mobile number must be number",
        MOBILE_PHONE_REQUIRED:"Mobile number required",
        FRIEND_EXISTS:"User is already in your friendlist.",
        STYLE_DT:"Style must be string",
        STYLE_REQUIRED:"Style required.",
        FOOD_INVALID_DT:"Food must be string",
        FOOD_REQUIRED:"Food required.",
        FOOD_CATEGORY_NAME_INVALID_DT:"Food category must be string",
        FOOD_CATEGORY_REQUIRED:"Food category required.",
        PIN_TYPE_DT:"Pin type must be string",
        PIN_TYPE_REQUIRED:"Pin type required.",
        PIN_COLOR_DT:"Pin color must be string",
        PIN_COLOR_REQUIRED:"Pin color required.",
        NO_OF_WINES_DT:"No of wines must be number",
        NO_OF_WINES_REQUIRED:"No of wines required.",
        WINE_TYPE_DT:"Wine type must be string",
        WINE_TYPE_REQUIRED:"Wine type required.",
        WINE_PRODUCER_DT:"Wine producer must be string",
        WINE_PRODUCER_REQUIRED:"Wine producer required.",
        WINE_VINTAGE_DT:"Wine vintage must be number",
        WINE_VINTAGE_REQUIRED:"Wine vintage required.",
        IMAGE_HEIGHT_DT:"Image height must be number",
        IMAGE_HEIGHT_REQUIRED:"Image height required.",
        IMAGE_WIDTH_DT:"Image width must be number",
        IMAGE_WIDTH_REQUIRED:"Image width required.",
        SUBMISSION_TYPE_INVALID_DT:"Submission type must be string",
        SUBMISSION_TYPE_REQUIRED:"Submission type required.",
        SUBMISSION_TYPE_INV:"Invalid value for submission type.",
        IMAGE_TYPE_INVALID_DT:"Image type must be string",
        IMAGE_TYPE_REQUIRED:"Image type required.",
        IMAGE_TYPE_INV:"Invalid value for image type.",
        RESTAURANT_LIST_INVALID_DT:"Restaurant list must be an array.",
        RESTAURANT_LIST_REQUIRED:"Restaurant list required.",
        GROUP_NAME_REQUIRED:"Group name required.",
        GROUP_NAME_INVALID_DT:"Image type must be string",
        DELAY_REQUIRED:"Delay required.",
        DELAY_INVALID_DT:"Delay must be number",
        NOTI_DELAY_GRP_RECORD_NOT_FOUND:"No group found.",
        GROUP_ID_REQUIRED:"Group id required.",
        GROUP_ID_INVALID_DT:"Group id must be number",
        NOTI_DELAY_DEFAULT_GRP:"Default group cannot be edited.",
        PAGE_NO_REQUIRED:"Page no required.",
        PAGE_NO_INVALID_DT:"Page no must be number",
        NO_OF_RECORDS_REQUIRED:"No of records required.",
        NO_OF_RECORDS_INVALID_DT:"No of records must be number",
        GROUP_IDS_INVALID_DT:"Group ids must be an array of numbers.",
        GROUP_IDS_REQUIRED:"Group ids required.",
        DEVICE_TOKEN_REQUIRED:"Device token required.",
        DEVICE_TOKEN_INVALID_DT:"Device token must be string",
        SESSION_ID_REQUIRED:"Session id required.",
        SESSION_ID_INVALID_DT:"Session id must be string",
        DEVICE_TOKEN_NOT_FOUND:"Device token not found.",
        WIN_RATE_INVALID_DT:"Wine rate must be number",
        WINE_RATE_REQUIRED:"Wine rate required.",
        WINE_RATE_INV:"Wine rate must be between 0 and 5.",
        FOOD_WINE_RATE_INVALID_DT:"Food wine rate must be number",
        FOOD_WINE_RATE_REQUIRED:"Food wine rate required.",
        FOOD_WINE_RATE_INV:"Food wine rate must be between 0 and 5.",
        NOTIFICATION_OPEN_DATETIME_INVALID_DT:"Notification open datetime must be number",
        NOTIFICATION_OPEN_DATETIME_REQUIRED:"Notification open datetime required.",
        SUBMITTED_DATETIME_INVALID_DT:"Submitted datetime must be number",
        SUBMITTED_DATETIME_REQUIRED:"Submitted datetime required.",
        IMAGE_PATH_INVALID_DT:"Image path must be string",
        IMAGE_PATH_REQUIRED:"Image path required.",
        NO_RECORD_FOUND:"No record found.",
        NOTIFICATION_ID_REQUIRED:"Message id required.",
        NOTIFICATION_ID_INVALID_DT:"Message id must be number",
        NOTIFICATION_IDS_INVALID_DT:"Notification ids must be an array of numbers.",
        NOTIFICATION_IDS_REQUIRED:"Notification ids required."
    },
    USER_ARCHIVE_TYPE:{
        VIN_OUT:"VIN_OUT",
        VIN_IN:"VIN_IN",
        MY_SELECT:'MY_SELECT',
        MY_WISH:'MY_WISH',
        WINE_CLUB:'WINE_CLUB',
        MY_FAVORITE:'MY_FAVORITE',
        MY_PLACE:"MY_PLACE",
        MY_REMEMBER:"MY_REMEMBER",
        MANUALLY:"MANUALLY"
    },
    DEVICE_TYPE:{
        IPHONE:"iphone",
        ANDROID:"android",
        WEB:"web"
    },
    MOBILE_PLATFORM_TYPE:{
        IOS:"IOS",
        ANDROID:"ANDROID"
    },
    SOURCE_TYPE:{
        MOBILE:"mobile",
        WEB:"web"
    },
    IMAGE_PATH:{
        BASE_PATH:"https://media.staging.vincompass.com",
        RESTAURANT_THUMB_PATH:"/photos/restaurants/thumbs",
        RESTAURANT_ORIGINAL_PATH:"/photos/restaurants/original",
        MY_WINES_THUMB_PATH:"/photos/my_wines/thumbs",
        MY_WINES_ORIGINAL_PATH:"/photos/my_wines/original",
        WINE_THUMB_PATH:"/products/thumbs",
        WINE_ORIGINAL_PATH:"/photos/products/original",
        USER_PROFILE_PIC_THUMB:"/photos/profile_pics/thumbs",
        USER_PROFILE_PIC_ORIGINAL:"/photos/profile_pics/original"
    },
    PHYSICAL_IMAGE_PATH:{
        RESTAURANT_THUMB_PATH:"/assets/photos/restaurants/thumbs",
        RESTAURANT_ORIGINAL_PATH:"/assets/photos/restaurants/original",
        MY_WINES_THUMB_PATH:"/assets/photos/my_wines/thumbs",
        MY_WINES_ORIGINAL_PATH:"/assets/photos/my_wines/original",
        WINE_THUMB_PATH:"/assets/products/thumbs",
        WINE_ORIGINAL_PATH:"/assets/photos/products/original",
        USER_PROFILE_PIC_THUMB:"/assets/photos/profile_pics/thumbs",
        USER_PROFILE_PIC_ORIGINAL:"/assets/photos/profile_pics/original"
    },
    GAMIFICATION_EVENT_TYPE:{
        QUESTIONS:"QUESTIONS",
        RESTAURANT_ARCHIVE:"RESTAURANT_ARCHIVE",
        WINE_ARCHIVE:"WINE_ARCHIVE",
        WINE_RATED:"WINE_RATED",
        FAVORITE_RESTAURANT:"FAVORITE_RESTAURANT",
        FAVORITE_WINE:"FAVORITE_WINE",
        FRIEND_INVITED:"FRIEND_INVITED"
    },
    GAMIFICATION:{
        NO_OF_EVENTS:5,
        FULL_BOTTLE_POINTS:5,
        FULL_CASE:12
    },
    SURVEY_QUESTION_TYPES:{
        RADIO:"radio",
        CHECKBOX:"checkbox"
    },
    CUSTOMER_TYPE:{
        NORMAL:"NORMAL",
        LINKED_IN:"LINKEDIN"
    },
    PRICE_DIRECTION:{
        BEST:"best",
        LOW_TO_HIGH:"low_to_high",
        HIGH_TO_LOW:"high_to_low"
    },
    USER_TYPE:{
        NORMAL:"NORMAL",
        LINKED_IN:"LINKED_IN",
        AFFLUENCE:"AFFLUENCE"
    },
    INVITE_CODE_TYPE:{
        NORMAL:"NORMAL",
        FRIEND_INVITE:"FRIEND_INVITE"
    },
    INVITE_MEDIUM:{
        EMAIL:"EMAIL",
        SMS:"SMS",
        NONE:"NONE"
    },
    RADIUS_DEFAULTS:{
        RADIUS:5,
        RECORD_LIMIT:50
    },
    AFFLUENCE:{
        AUTHORIZE_APP_URL:"http://www.affluence.org/api/vincompass/authorize/application",
        AUTHORIZE_USER_URL:"http://www.affluence.org/api/vincompass/authorize/user",
        KEY:"65d880d7de0d89b0b011f48536e67717",
        SECRET:"f0b5009a007a793af924f5f832d377ce"
    },
    ANALYTIC_TYPES:{
        WINE_WIZARD:"WINE_WIZARD",
        SELECTED_MAP_PINS:"SELECTED_MAP_PINS",
        WINE_ARCHIVE:"WINE_ARCHIVE",
        RESTAURANT_ARCHIVE:"RESTAURANT_ARCHIVE",
        DATA_FACTORY:"DATA_FACTORY",
        RESTAURANT_LIST:"RESTAURANT_LIST",
        FOOD_WINE_PAIRING:"FOOD_WINE_PAIRING",
        WINE_SELECTION_NOTIFICATION:"WINE_SELECTION_NOTIFICATION"
    },
    DATA_FACTORY_SUBMISSION_TYPE:{
        WINE_LABEL:"WINE_LABEL",
        WINE_LIST:"WINE_LIST"
    },
    DATA_FACTORY_IMAGE_TYPE:{
        JPEG:"JPEG",
        PNG:"PNG"
    },
    AWS:{
        ACCESS_KEY:"AKIAJNILOVTFRDAILR5A",
        SECRET_ACCESS_KEY:"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",
        REGION:"us-west-1"
    },
    NOTIFICATION_TYPE:{
        SELECT_WINE:"SELECT_WINE"
    },
    NOTIFICATION_STATUS:{
        NEW:"NEW",
        IN_PROGRESS:"IN-PROGRESS",
        SENT:"SENT"
    },
    MIN_AGE:21,
    SURVEY_QUESTION_GROUP:99,
    ALL:"ALL",
    DEFAULT_NOTI_DELAY_GROUP_ID:1
};