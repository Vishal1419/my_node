'use strict';

const crypto = require("crypto");
const constants = require(appRoot+'/common/constants');

module.exports = function(sequelize, DataTypes) {
  var Customers = sequelize.define('Customers', {
      username: DataTypes.STRING(200),
      first_name:{
          type:DataTypes.STRING,
          allowNull:true
      },
      last_name:{
          type:DataTypes.STRING,
          allowNull:true
      },
      hash_key:DataTypes.STRING,
      latitude:DataTypes.STRING(12),
      longitude:DataTypes.STRING(12),
      email:{
          type:DataTypes.STRING(245),
          allowNull:true
      },
      password:{
          type:DataTypes.STRING,
          allowNull:true
      },
      address:DataTypes.STRING,
      address_2:DataTypes.STRING,
      city:DataTypes.STRING,
      state:DataTypes.STRING,
      zip:DataTypes.STRING,
      country:DataTypes.STRING,
      photo:DataTypes.STRING,
      fb_id:DataTypes.INTEGER,
      tw_id:DataTypes.INTEGER,
      li_id:DataTypes.STRING,
      udid:DataTypes.STRING,
      gender:DataTypes.INTEGER,
      birthday:DataTypes.DATE,
      dates_to_remember:DataTypes.STRING,
      price_from:DataTypes.DECIMAL(10, 2),
      price_to:DataTypes.DECIMAL(10,2),
      price_direction:DataTypes.STRING,
      style:DataTypes.STRING(50),
      color:DataTypes.STRING(50),
      food_id:DataTypes.INTEGER,
      invites_allowed:DataTypes.INTEGER,
      share_photo:DataTypes.INTEGER,
      share_aff:DataTypes.INTEGER,
      share_fb:DataTypes.INTEGER,
      share_tw:DataTypes.INTEGER,
      share_li:DataTypes.INTEGER,
      share_gg:DataTypes.INTEGER,
      share_email:DataTypes.INTEGER,
      share_place_name:DataTypes.INTEGER,
      share_place_address:DataTypes.INTEGER,
      share_place_city:DataTypes.INTEGER,
      share_place_state:DataTypes.INTEGER,
      share_place_country:DataTypes.INTEGER,
      share_place_zip:DataTypes.INTEGER,
      share_place_phone:DataTypes.INTEGER,
      rec_friends:DataTypes.INTEGER,
      rec_preferences:DataTypes.INTEGER,
      rec_sommelier:DataTypes.INTEGER,
      rec_social_network:DataTypes.INTEGER,
      rec_chef:DataTypes.INTEGER,
      rec_wine_critics:DataTypes.INTEGER,
      rec_vcc:DataTypes.INTEGER,
      share_wines_name:DataTypes.INTEGER,
      share_wines_year:DataTypes.INTEGER,
      share_wines_region:DataTypes.INTEGER,
      share_wines_grape:DataTypes.INTEGER,
      share_wines_producer:DataTypes.INTEGER,
      share_wines_price:DataTypes.INTEGER,
      share_wines_journal:DataTypes.INTEGER,
      is_registered:DataTypes.INTEGER,
      added:DataTypes.DATE,
      last_logged:DataTypes.DATE,
      last_logged_web:DataTypes.DATE,
      survey_starts:DataTypes.DATE,
      survey_ends:DataTypes.DATE,
      second_survey_starts:DataTypes.DATE,
      second_survey_ends:DataTypes.DATE,
      send_updates:DataTypes.INTEGER,
      follow_up:DataTypes.INTEGER,
      survey_group:DataTypes.INTEGER,
      platform:DataTypes.STRING,
      future_platform:DataTypes.STRING,
      organization:DataTypes.STRING,
      telephone:DataTypes.STRING,
      mobile_phone:DataTypes.STRING(30),
      url:DataTypes.STRING,
      partner_url:DataTypes.STRING,
      business:DataTypes.STRING,
      status:DataTypes.STRING,
      friend_requests:DataTypes.INTEGER,
      invitation_code_id:DataTypes.INTEGER,
      is_customer:DataTypes.INTEGER,
      is_admin:DataTypes.BOOLEAN,
      is_linkedin:DataTypes.INTEGER,
      is_affluence:DataTypes.INTEGER,
      is_deleted:DataTypes.INTEGER,
      membership:DataTypes.INTEGER,
      engagement_letter:DataTypes.INTEGER,
      resended_letter:DataTypes.INTEGER,
      wine_store_code:DataTypes.STRING,
      confirmed:DataTypes.INTEGER,
      survey_progress:DataTypes.ENUM("full","half"),
      events_performed:DataTypes.INTEGER,
      added_from_cms:DataTypes.INTEGER,
      user_type:DataTypes.ENUM(
          constants.CUSTOMER_TYPE.NORMAL,
          constants.CUSTOMER_TYPE.LINKED_IN
      ),
      profile_pic:DataTypes.STRING(100)
  }, {
      tableName: "customers"
  });

  return Customers;
};