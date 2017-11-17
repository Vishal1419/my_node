/**
 * Created by ravimodha on 02/09/16.
 */
const validate = require("validate.js");
const moment = require('moment');

const VccResponse = require(global.appRoot+'/common/vcc_response');

const constants = require(global.appRoot+'/common/constants');

const Utility = require(appRoot+'/common/utility');

function customSearchRestaurantValidator(data,schema,fn){
    if(!Utility.isNull(data.location_id) || (!Utility.isNull(data.latitude) && !Utility.isNull(data.longitude))){
        return fn(null,data);
    }else{
        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Either location id or Latitude and Longitude required."}},data);
    }
}

module.exports = {
    login:{
        type:Object,
        unknownKeys: 'allow',
        required:true,
        schema:{
            username:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.USERNAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.USERNAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.USERNAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.USERNAME_REQUIRED
                    }
                }
            },
            password:{
                type:String,
                required:true,
                trim:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.PASSWORD_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PASSWORD_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PASSWORD_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PASSWORD_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required"
            }
        }
    },
    linkedin_login:{
        type:Object,
        unknownKeys: 'allow',
        required:true,
        schema:{
            email:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.EMAIL_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required"
            }
        }

    },
    affluence_login:{
        type:Object,
        unknownKeys: 'allow',
        required:true,
        schema:{
            email:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.EMAIL_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required"
            }
        }

    },
    getRestaurantlist:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            latitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            longitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    checkIn:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            restaurant_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            search_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SEARCH_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_ID_REQUIRED
                    }
                }
            },
            latitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            longitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    restaurantLookUp:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            search_string:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SEARCH_STRING_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STRING_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STRING_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STRING_REQUIRED
                    }
                }
            },
            city_area:{
                type:String,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_AREA_INVALID_DT
                    }
                }
            },
            city:{
                type:String,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_STRING_INVALID_DT
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    favoriteRestaurant:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            restaurant_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    searchRestaurant:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            latitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            longitude:{
                type:Number,
                required:true,
                errors:{
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            cuisine:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CUISINE_DT
                    }
                }
            },
            city:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_INVALID_DT
                    }
                }
            },
            address:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.ADDRESS_INVALID_DT
                    }
                }
            },
            name:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    }
                }
            },
            wine_color:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_COLOR_DT
                    }
                }
            },
            wine_country:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.COUNTRY_INVALID_DT
                    }
                }
            },
            wine_name:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_NAME_INVALID_DT
                    }
                }
            },
            wine_min_price:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MIN_PRICE_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MIN_PRICE_DT
                    }
                }
            },
            wine_max_price:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MAX_PRICE_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MAX_PRICE_DT
                    }
                }
            },
            is_favorite:{
                type:Boolean,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.IS_FAVORITE_DT
                    },
                    range:{
                        errorCode:VccResponse.OUT_OF_BOUND,
                        message:constants.ERROR_MESSAGES.IS_FAVORITE_OUB
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    searchRestaurantToAddToFavorite:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    }
                }
            },
            cuisine:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CUISINE_DT
                    }
                }
            },
            city:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_INVALID_DT
                    }
                }
            },
            address:{
                type:String,
                trim:true,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.ADDRESS_INVALID_DT
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    addArchiveNote:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            wine_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            note:{
                type:String,
                required:true,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NOTE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTE_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTE_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    neighborhoodLookUp:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            search_str:{
                type:String,
                required:true,
                trim:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    addArchiveRate:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            wine_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            rate:{
                type:Number,
                required:true,
                range:"0-5",
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RATE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RATE_REQUIRED
                    },
                    range:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RATE_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RATE_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    removeArchive:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            wine_ids:{
                type:Array,
                schema:{
                    type:Number,
                    errors:{
                        type:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.WINE_IDS_INVALID_DT
                        },
                        allowNull:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.WINE_IDS_INVALID_DT
                        }
                    }
                },
                required:true,
                len:'1-',
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_IDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_IDS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_IDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_IDS_REQUIRED
                    }
                }
            },
            archive_type:{
                type:String,
                required:true,
                enum: [
                    constants.USER_ARCHIVE_TYPE.VIN_IN,
                    constants.USER_ARCHIVE_TYPE.VIN_OUT,
                    constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    constants.ALL
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    wineNameLookup:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            search_str:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    }
                }
            },
            country:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.COUNTRY_INVALID_DT
                    }
                }
            },
            region:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_REGION_DT
                    }
                }
            },
            grape:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.GRAPE_INVALID_DT
                    }
                }
            },
            vintage:{
                type:Number,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.VINTAGE_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.VINTAGE_INVALID_DT
                    }
                }
            },
            rest_city:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_STRING_INVALID_DT
                    }
                }
            },
            rest_cuisine:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CUISINE_DT
                    }
                }
            },
            rest_name:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    }
                }
            },
            min_price:{
                type:Number,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MIN_PRICE_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MIN_PRICE_DT
                    }
                }
            },
            max_price:{
                type:Number,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MAX_PRICE_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_MAX_PRICE_DT
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    addArchivePhoto:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            wine_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    searchWine:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            search_str:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SEARCH_STR_REQUIRED
                    }
                }
            },
            country:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.COUNTRY_INVALID_DT
                    }
                }
            },
            region:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_REGION_DT
                    }
                }
            },
            grape:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.GRAPE_INVALID_DT
                    }
                }
            },
            color:{
                type:String,
                trim:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_COLOR_DT
                    }
                }
            },
            vintage:{
                type:Number,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.VINTAGE_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.VINTAGE_INVALID_DT
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    addToArchive:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            menu_id:{
                type:Number,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.MENU_ID_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.MENU_ID_INVALID_DT
                    }
                }
            },
            wine_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            archive_type:{
                type:String,
                required:true,
                enum: [
                    constants.USER_ARCHIVE_TYPE.VIN_IN,
                    constants.USER_ARCHIVE_TYPE.VIN_OUT,
                    constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_REGION_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INV
                    }
                }
            },
            vin_type:{
                type:String,
                enum:[
                    constants.USER_ARCHIVE_TYPE.WINE_CLUB,
                    constants.USER_ARCHIVE_TYPE.MANUALLY
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.VINTAGE_INVALID_DT
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.VIN_TYPE_INV
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {
                if(data.archive_type == constants.USER_ARCHIVE_TYPE.VIN_IN){
                    if(validate.isEmpty(data.vin_type) == true){
                        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Vin type is required when archive type is VIN."}},data);
                    }
                }else if(data.archive_type == constants.USER_ARCHIVE_TYPE.VIN_OUT){
                    if(Utility.isNull(data.menu_id)==true || data.menu_id<=0){
                        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Menu id is required when archive type is VINOUT."}},data);
                    }
                }

                return fn(null,data);
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    saveSurveyAnswers:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            questions:{
                type:Array,
                required:true,
                len:'1-',
                schema:{
                    type:Object,
                    required:true,
                    schema:{
                        question_id:{
                            type:Number,
                            required:true,
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.QUESTION_ID_INVALID_DT
                                },
                                required:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.QUESTION_ID_REQUIRED
                                },
                                allowNull:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.QUESTION_ID_REQUIRED
                                }
                            }
                        },
                        question_type:{
                            type:String,
                            required:true,
                            enum:[
                                constants.SURVEY_QUESTION_TYPES.RADIO,
                                constants.SURVEY_QUESTION_TYPES.CHECKBOX
                            ],
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.QUESTION_TYPE_DT
                                },
                                required:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.QUESTION_TYPE_REQUIRED
                                },
                                allowNull:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.QUESTION_TYPE_REQUIRED
                                },
                                enum:{
                                    errorCode:VccResponse.INVALID_VALUE,
                                    message:constants.ERROR_MESSAGES.QUESTION_TYPE_INV
                                }
                            }
                        },
                        answers:{
                            type:Array,
                            required:false,
                            schema:{
                                type:Object,
                                required:true,
                                schema:{
                                    answer_id:{
                                        type:Number,
                                        required:true,
                                        errors:{
                                            type:{
                                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                                message:constants.ERROR_MESSAGES.ANSWER_ID_INVALID_DT
                                            },
                                            required:{
                                                errorCode:VccResponse.REQUIRED_FIELD,
                                                message:constants.ERROR_MESSAGES.ANSWER_ID_REQUIRED
                                            },
                                            allowNull:{
                                                errorCode:VccResponse.REQUIRED_FIELD,
                                                message:constants.ERROR_MESSAGES.ANSWER_ID_REQUIRED
                                            }
                                        }
                                    },
                                    answer:{
                                        type:String,
                                        trim:true,
                                        required:true,
                                        match:/^.{1,}$/,
                                        errors:{
                                            type:{
                                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                                message:constants.ERROR_MESSAGES.ANSWER_ID_INVALID_DT
                                            },
                                            required:{
                                                errorCode:VccResponse.REQUIRED_FIELD,
                                                message:constants.ERROR_MESSAGES.ANSWER_REQUIRED
                                            },
                                            allowNull:{
                                                errorCode:VccResponse.REQUIRED_FIELD,
                                                message:constants.ERROR_MESSAGES.ANSWER_REQUIRED
                                            },
                                            match:{
                                                errorCode:VccResponse.REQUIRED_FIELD,
                                                message:constants.ERROR_MESSAGES.ANSWER_REQUIRED
                                            }
                                        }
                                    }
                                }
                            },
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.ANSWERS_INVALID_DT
                                }
                            }

                        }
                    }
                },
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.QUESTIONS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.QUESTIONS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.QUESTIONS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.QUESTIONS_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    removeUserPlace:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            restaurant_ids:{
                type:Array,
                schema:{
                    type:Number,
                    errors:{
                        type:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                        },
                        allowNull:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                        }
                    }
                },
                required:true,
                len:'1-',
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_REQUIRED
                    }
                }
            },
            place_type:{
                type:String,
                required:true,
                enum: [
                    constants.USER_ARCHIVE_TYPE.MY_PLACE,
                    constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    constants.USER_ARCHIVE_TYPE.MY_REMEMBER
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INV
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    registerUser:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            first_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FIRST_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FIRST_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FIRST_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FIRST_NAME_REQUIRED
                    }
                }
            },
            last_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LAST_NAME_REQUIRED
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LAST_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LAST_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LAST_NAME_REQUIRED
                    }
                }
            },
            email:{
                type:String,
                trim:true,
                required:true,
                match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.EMAIL_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    }
                }
            },
            mobile_phone:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.MOBILE_PHONE_INVALID_DT
                    }
                }
            },
            birthdate:{
                type:String,
                trim:true,
                required:true,
                match:/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.BIRTHDATE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.BIRTHDATE_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.BIRTHDATE_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.BIRTHDATE_REQUIRED
                    }
                }
            },
            address_details:{
                type:Object,
                required:false,
                unknownKeys:'allow',
                schema:{
                    address:{
                        type:String,
                        trim:true,
                        required:true,
                        match:/^.{1,}$/,
                        errors:{
                            type:{
                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                message:constants.ERROR_MESSAGES.ADDRESS_INVALID_DT
                            },
                            required:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ADDRESS_REQUIRED
                            },
                            match:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ADDRESS_REQUIRED
                            },
                            allowNull:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ADDRESS_REQUIRED
                            }
                        }
                    },
                    address_2:{
                        type:String,
                        trim:true,
                        required:true,
                        errors:{
                            type:{
                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                message:constants.ERROR_MESSAGES.ADDRESS_2_INVALID_DT
                            },
                            required:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ADDRESS_2_REQUIRED
                            },
                            allowNull:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ADDRESS_2_REQUIRED
                            }
                        }
                    },
                    city:{
                        type:String,
                        trim:true,
                        required:true,
                        match:/^.{1,}$/,
                        errors:{
                            type:{
                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                message:constants.ERROR_MESSAGES.CITY_INVALID_DT
                            },
                            required:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.CITY_REQUIRED
                            },
                            match:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.CITY_REQUIRED
                            },
                            allowNull:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.CITY_REQUIRED
                            }
                        }
                    },
                    state:{
                        type:String,
                        trim:true,
                        required:true,
                        match:/^.{1,}$/,
                        errors:{
                            type:{
                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                message:constants.ERROR_MESSAGES.STATE_INVALID_DT
                            },
                            required:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.STATE_REQUIRED
                            },
                            match:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.STATE_REQUIRED
                            },
                            allowNull:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.STATE_REQUIRED
                            }
                        }
                    },
                    country:{
                        type:String,
                        trim:true,
                        required:true,
                        match:/^.{1,}$/,
                        errors:{
                            type:{
                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                message:constants.ERROR_MESSAGES.COUNTRY_INVALID_DT
                            },
                            required:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.COUNTRY_REQUIRED
                            },
                            match:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.COUNTRY_REQUIRED
                            },
                            allowNull:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.COUNTRY_REQUIRED
                            }
                        }
                    },
                    zip:{
                        type:Number,
                        required:true,
                        errors:{
                            type:{
                                errorCode:VccResponse.INVALID_DATA_TYPE,
                                message:constants.ERROR_MESSAGES.ZIP_INVALID_DT
                            },
                            required:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ZIP_REQUIRED
                            },
                            allowNull:{
                                errorCode:VccResponse.REQUIRED_FIELD,
                                message:constants.ERROR_MESSAGES.ZIP_REQUIRED
                            }
                        }
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {
                var birthDate = moment(data.birthdate,"YYYY-MM-DD");
                var userAge = moment().diff(birthDate,'years');

                if(birthDate.isValid() && moment(birthDate).isSameOrAfter(moment()) == false){
                    if(userAge < constants.MIN_AGE){
                        return fn({message:{errorCode:VccResponse.INVALID_VALUE,message:"Age must be "+constants.MIN_AGE+" or more"}},data);
                    }

                    return fn(null,data);
                }else{
                    return fn({message:{errorCode:VccResponse.INVALID_VALUE,message:constants.ERROR_MESSAGES.BIRTHDATE_INV}},data);
                }
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    linkedInRegisteration:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            linked_in_id:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LINKED_IN_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LINKED_IN_ID_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LINKED_IN_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LINKED_IN_ID_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    sendFriendInvite:{
        type:Object,
        unknownKeys:'allow',
        required:true,
        schema:{
            first_name:{
                type:String,
                trim:true,
                required:false,
                allowNull:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FIRST_NAME_INVALID_DT
                    }
                }
            },
            last_name:{
                type:String,
                trim:true,
                required:false,
                allowNull:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LAST_NAME_INVALID_DT
                    }
                }
            },
            email:{
                type:String,
                trim:true,
                required:true,
                match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.EMAIL_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.EMAIL_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    }
                }
            },
            mobile:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.MOBILE_PHONE_INVALID_DT
                    }
                }
            },
            medium:{
                type:String,
                trim:true,
                required:true,
                enum: [
                    constants.INVITE_MEDIUM.EMAIL,
                    constants.INVITE_MEDIUM.SMS
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.INVITE_CODE_MEDIUM_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.INVITE_CODE_MEDIUM_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.INVITE_CODE_MEDIUM_INV
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    inviteCode: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            invitation_code: {
                type: String,
                trim: true,
                required: true,
                match: /^.{1,}$/,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.INVITATION_CODE_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.INVITATION_CODE_REQUIRED
                    },
                    match: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.INVITATION_CODE_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.INVITATION_CODE_REQUIRED
                    }
                }
            }
        }
    },
    getWinesFromRE: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            lower_price:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LOWER_PRICE_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LOWER_PRICE_INVALID_DT
                    }
                }
            },
            upper_price:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.UPPER_PRICE_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.UPPER_PRICE_INVALID_DT
                    }
                }
            },
            food_category:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_INVALID_DT
                    }
                }
            },
            food_id:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_ID_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_ID_INVALID_DT
                    }
                }
            }
        }
    },
    changePassword: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            old_password: {
                type: String,
                trim: true,
                required: true,
                match: /^.{1,}$/,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.OLD_PASSWORD_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.OLD_PASSWORD_REQUIRED
                    },
                    match: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.OLD_PASSWORD_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.OLD_PASSWORD_REQUIRED
                    }
                }
            },
            new_password: {
                type: String,
                trim: true,
                required: true,
                match: /^.{1,}$/,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.NEW_PASSWORD_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.NEW_PASSWORD_REQUIRED
                    },
                    match: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.NEW_PASSWORD_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.NEW_PASSWORD_REQUIRED
                    }
                }
            }
        }
    },
    vinOutByRestaurant: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            }
        }
    },
    forgotPassword: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            email: {
                type: String,
                trim: true,
                required: true,
                match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                errors: {
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.EMAIL_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.EMAIL_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    }
                }
            }
        }
    },
    getWineDetails: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            wine_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            menu_id: {
                type: Number,
                required: false,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.MENU_ID_INVALID_DT
                    }
                }
            }
        }
    },
    getRestaurantDetails: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            }
        }
    },
    saveProfile: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            address: {
                type: String,
                trim: true,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.ADDRESS_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.ADDRESS_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.ADDRESS_REQUIRED
                    }
                }
            },
            latitude: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.LONGITUDE_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.LONGITUDE_REQUIRED
                    }
                }
            }
        }
    },
    affluenceUserLogin: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            email:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.EMAIL_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.EMAIL_REQUIRED
                    }
                }
            },
            password:{
                type:String,
                required:true,
                trim:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.PASSWORD_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PASSWORD_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PASSWORD_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PASSWORD_REQUIRED
                    }
                }
            }
        }
    },
    wwAnalytics: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            wine_ids:{
                type:Array,
                schema:{
                    type:Number,
                    errors:{
                        type:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.WINE_IDS_INVALID_DT
                        },
                        allowNull:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.WINE_IDS_INVALID_DT
                        }
                    }
                },
                required:true,
                len:'1-',
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_IDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_IDS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_IDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_IDS_REQUIRED
                    }
                }
            },
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            latitude: {
                type: Number,
                required: false,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    }
                }
            },
            longitude: {
                type: Number,
                required: false,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    }
                }
            },
            lower_price:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LOWER_PRICE_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.LOWER_PRICE_INVALID_DT
                    }
                }
            },
            upper_price:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.UPPER_PRICE_INVALID_DT
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.UPPER_PRICE_INVALID_DT
                    }
                }
            },
            style:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.STYLE_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.STYLE_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.STYLE_REQUIRED
                    }
                }
            },
            food_category:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_NAME_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_REQUIRED
                    }
                }
            },
            food:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_REQUIRED
                    }
                }
            },
            grape:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.GRAPE_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GRAPE_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GRAPE_REQUIRED
                    }
                }
            }
        }
    },
    selectedPinAnalytics: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            latitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            longitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            pin_type:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.PIN_TYPE_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PIN_TYPE_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PIN_TYPE_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PIN_TYPE_REQUIRED
                    }
                }
            },
            pin_color:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.PIN_COLOR_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PIN_COLOR_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PIN_COLOR_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PIN_COLOR_REQUIRED
                    }
                }
            },
            restaurant_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    }
                }
            },
            no_of_wines:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NO_OF_WINES_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NO_OF_WINES_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NO_OF_WINES_REQUIRED
                    }
                }
            }
        }
    },
    wineArchiveAnalytics: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            wine_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            wine_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    }
                }
            },
            wine_producer:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_PRODUCER_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_PRODUCER_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_PRODUCER_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_PRODUCER_REQUIRED
                    }
                }
            },
            wine_style:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.STYLE_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.STYLE_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.STYLE_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.STYLE_REQUIRED
                    }
                }
            },
            wine_type:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_TYPE_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_TYPE_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_TYPE_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_TYPE_REQUIRED
                    }
                }
            },
            wine_color:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_COLOR_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_COLOR_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_COLOR_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_COLOR_REQUIRED
                    }
                }
            },
            wine_vintage: {
                type: Number,
                required: false,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.WINE_VINTAGE_DT
                    }
                }
            },
            latitude: {
                type: Number,
                required: false,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    }
                }
            },
            longitude: {
                type: Number,
                required: false,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    }
                }
            },
            archive_type:{
                type:String,
                required:true,
                enum: [
                    constants.USER_ARCHIVE_TYPE.VIN_IN,
                    constants.USER_ARCHIVE_TYPE.VIN_OUT,
                    constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    constants.ALL
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    }
                }
            }
        }
    },
    restaurantArchiveAnalytics: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            latitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            longitude:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            restaurant_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    }
                }
            },
            no_of_wines:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NO_OF_WINES_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NO_OF_WINES_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NO_OF_WINES_REQUIRED
                    }
                }
            },
            place_type:{
                type:String,
                required:true,
                enum: [
                    constants.USER_ARCHIVE_TYPE.MY_PLACE,
                    constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    constants.USER_ARCHIVE_TYPE.MY_REMEMBER
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.ARCHIVE_TYPE_INV
                    }
                }
            }
        }
    },
    dataFactoryAnalytics: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            submission_type:{
                type:String,
                required:true,
                trim:true,
                match:/^.{1,}$/,
                enum: [
                    constants.DATA_FACTORY_SUBMISSION_TYPE.WINE_LABEL,
                    constants.DATA_FACTORY_SUBMISSION_TYPE.WINE_LIST
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SUBMISSION_TYPE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SUBMISSION_TYPE_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SUBMISSION_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.SUBMISSION_TYPE_INV
                    }
                }
            },
            image_height: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.IMAGE_HEIGHT_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.IMAGE_HEIGHT_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.IMAGE_HEIGHT_REQUIRED
                    }
                }
            },
            image_width: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.IMAGE_WIDTH_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.IMAGE_WIDTH_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.IMAGE_WIDTH_REQUIRED
                    }
                }
            },
            image_type:{
                type:String,
                required:true,
                match:/^.{1,}$/,
                trim:true,
                enum: [
                    constants.DATA_FACTORY_IMAGE_TYPE.JPEG,
                    constants.DATA_FACTORY_IMAGE_TYPE.PNG
                ],
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.IMAGE_TYPE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.IMAGE_TYPE_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.IMAGE_TYPE_REQUIRED
                    },
                    enum:{
                        errorCode:VccResponse.INVALID_VALUE,
                        message:constants.ERROR_MESSAGES.IMAGE_TYPE_INVALID_DT
                    }
                }
            },
            latitude:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            longitude:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                    }
                }
            },
            restaurant_id:{
                type:Number,
                required:false,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {
                if(data.submission_type === constants.DATA_FACTORY_SUBMISSION_TYPE.WINE_LIST){
                    if(Utility.isNull(data.restaurant_id) === true){
                        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Restaurant ID is required when submission type is WINE_LIST."}},data);
                    }
                }

                return fn(null,data);
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    restaurantListAnalytics: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_list:{
                type:Array,
                required:true,
                len:'1-',
                schema:{
                    type:Object,
                    required:true,
                    unknownKeys: 'allow',
                    schema:{
                        restaurant_id:{
                            type:Number,
                            required:true,
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.RESTAURANT_ID_INV
                                },
                                required:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                                },
                                allowNull:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                                }
                            }
                        },
                        pin_color:{
                            type:String,
                            trim:true,
                            required:true,
                            match:/^.{1,}$/,
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.PIN_COLOR_DT
                                },
                                required:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.PIN_COLOR_REQUIRED
                                },
                                match:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.PIN_COLOR_REQUIRED
                                },
                                allowNull:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.PIN_COLOR_REQUIRED
                                }
                            }
                        },
                        latitude:{
                            type:Number,
                            required:true,
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.LATITUDE_INVALID_DT
                                },
                                required:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                                },
                                allowNull:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                                }
                            }
                        },
                        longitude:{
                            type:Number,
                            required:true,
                            errors:{
                                type:{
                                    errorCode:VccResponse.INVALID_DATA_TYPE,
                                    message:constants.ERROR_MESSAGES.LONGITUDE_INVALID_DT
                                },
                                required:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                                },
                                allowNull:{
                                    errorCode:VccResponse.REQUIRED_FIELD,
                                    message:constants.ERROR_MESSAGES.CURRENT_LOCATION_REQUIRED
                                }
                            }
                        }
                    }
                },
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_LIST_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_LIST_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_LIST_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_LIST_REQUIRED
                    }
                }

            }
        }
    },
    notiDelayGroupCreate: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            group_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_REQUIRED
                    }
                }
            },
            delay:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.DELAY_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DELAY_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DELAY_REQUIRED
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {
                if(data.delay <= 0){
                    return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Delay must be greater than 0."}},data);
                }

                return fn(null,data);
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    notiDelayGroupUpdate: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            group_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.GROUP_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.GROUP_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.GROUP_ID_REQUIRED
                    }
                }
            },
            group_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_NAME_REQUIRED
                    }
                }
            },
            delay:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.DELAY_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DELAY_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DELAY_REQUIRED
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {
                if(data.delay <= 0){
                    return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Delay must be greater than 0."}},data);
                }

                return fn(null,data);
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    restaurantListForNotiGrp: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_name:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    }
                }
            },
            city:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CITY_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CITY_REQUIRED
                    }
                }
            },
            city_area:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.CITY_AREA_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CITY_AREA_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.CITY_AREA_REQUIRED
                    }
                }
            },
            page_no:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.PAGE_NO_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PAGE_NO_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.PAGE_NO_REQUIRED
                    }
                }
            },
            no_of_records:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NO_OF_RECORDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NO_OF_RECORDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NO_OF_RECORDS_REQUIRED
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {
                if(data.page_no <= 0){
                    return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Page no must be greater than 0."}},data);
                }else if(data.no_of_records <= 0){
                    return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"No of records must be greater than 0."}},data);
                }

                return fn(null,data);
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    assignNotiGrpToRestaurants: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            restaurant_ids:{
                type:Array,
                schema:{
                    type:Number,
                    errors:{
                        type:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.RESTAURANT_IDS_INVALID_DT
                        },
                        allowNull:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.RESTAURANT_IDS_INVALID_DT
                        }
                    }
                },
                required:true,
                len:'1-',
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_IDS_REQUIRED
                    }
                }
            },
            group_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.GROUP_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.GROUP_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.GROUP_ID_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    deleteGroup: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            group_ids:{
                type:Array,
                schema:{
                    type:Number,
                    errors:{
                        type:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.GROUP_IDS_INVALID_DT
                        },
                        allowNull:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.GROUP_IDS_INVALID_DT
                        }
                    }
                },
                required:true,
                len:'1-',
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.GROUP_IDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_IDS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_IDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.GROUP_IDS_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    addDeviceToken: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            device_token:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    logout: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            device_token:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    createTokenForWordPress: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            session_id:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SESSION_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SESSION_ID_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SESSION_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SESSION_ID_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    wineSelectNotification: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            wine_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            wine_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    }
                }
            },
            vintage: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.VINTAGE_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.VINTAGE_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.VINTAGE_REQUIRED
                    }
                }
            },
            device_token:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.DEVICE_TOKEN_REQUIRED
                    }
                }
            },
            food_name:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_REQUIRED
                    }
                }
            },
            food_category:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_NAME_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_REQUIRED
                    }
                }
            },
            image_path:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.IMAGE_PATH_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.IMAGE_PATH_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.IMAGE_PATH_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    foodWinePairRating: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            wine_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.WINE_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.WINE_ID_REQUIRED
                    }
                }
            },
            restaurant_id: {
                type: Number,
                required: true,
                errors: {
                    type: {
                        errorCode: VccResponse.INVALID_DATA_TYPE,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_INVALID_DT
                    },
                    required: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    },
                    allowNull: {
                        errorCode: VccResponse.REQUIRED_FIELD,
                        message: constants.ERROR_MESSAGES.RESTAURANT_ID_REQUIRED
                    }
                }
            },
            wine_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WINE_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_NAME_REQUIRED
                    }
                }
            },
            restaurant_name:{
                type:String,
                trim:true,
                required:true,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.RESTAURANT_NAME_REQUIRED
                    }
                }
            },
            food_name:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_REQUIRED
                    }
                }
            },
            food_category:{
                type:String,
                trim:true,
                required:false,
                match:/^.{1,}$/,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_NAME_INVALID_DT
                    },
                    match:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_CATEGORY_REQUIRED
                    }
                }
            },
            wine_rate:{
                type:Number,
                required:true,
                range:"0-5",
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.WIN_RATE_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_RATE_REQUIRED
                    },
                    range:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_RATE_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.WINE_RATE_REQUIRED
                    }
                }
            },
            food_wine_rate:{
                type:Number,
                required:false,
                range:"0-5",
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.FOOD_WINE_RATE_INVALID_DT
                    },
                    range:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_WINE_RATE_INV
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.FOOD_WINE_RATE_REQUIRED
                    }
                }
            },
            notification_open_datetime:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_OPEN_DATETIME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_OPEN_DATETIME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_OPEN_DATETIME_REQUIRED
                    }
                }
            },
            submitted_datetime:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.SUBMITTED_DATETIME_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SUBMITTED_DATETIME_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.SUBMITTED_DATETIME_REQUIRED
                    }
                }
            }
        },
        custom:[
            function (data, schema, fn) {

                if(Utility.isNull(data.food_wine_rate) === false){
                    if(Utility.isNull(data.food_category) === true || Utility.isNull(data.food_name) === true){
                        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Food parameters required"}},data);
                    }
                }else if(Utility.isNull(data.food_category) === false){
                    if(Utility.isNull(data.food_name) === true || Utility.isNull(data.food_wine_rate) === true){
                        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Food parameters requried."}},data);
                    }
                }else if(Utility.isNull(data.food_name) === false){
                    if(Utility.isNull(data.food_category) === true || Utility.isNull(data.food_wine_rate) === true){
                        return fn({message:{errorCode:VccResponse.REQUIRED_FIELD,message:"Food parameters requried."}},data);
                    }
                }

                return fn(null,data);
            }
        ],
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    notificationReadStatus: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            notification_id:{
                type:Number,
                required:true,
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_ID_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_ID_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_ID_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    },
    notificationDelete: {
        type: Object,
        unknownKeys: 'allow',
        required: true,
        schema: {
            notification_ids:{
                type:Array,
                schema:{
                    type:Number,
                    errors:{
                        type:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.NOTIFICATION_IDS_INVALID_DT
                        },
                        allowNull:{
                            errorCode:VccResponse.INVALID_DATA_TYPE,
                            message:constants.ERROR_MESSAGES.NOTIFICATION_IDS_INVALID_DT
                        }
                    }
                },
                required:true,
                len:'1-',
                errors:{
                    type:{
                        errorCode:VccResponse.INVALID_DATA_TYPE,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_IDS_INVALID_DT
                    },
                    required:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_IDS_REQUIRED
                    },
                    len:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_IDS_REQUIRED
                    },
                    allowNull:{
                        errorCode:VccResponse.REQUIRED_FIELD,
                        message:constants.ERROR_MESSAGES.NOTIFICATION_IDS_REQUIRED
                    }
                }
            }
        },
        errors:{
            required:{
                errorCode:VccResponse.REQUIRED_FIELD,
                message:"Details required."
            }
        }
    }
};
