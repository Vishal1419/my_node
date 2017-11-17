/**
 * Created by ravimodha on 01/12/16.
 */

const fs = require('fs');
const path = require('path');
const imagemagick = require("imagemagick-native");

const wineController = require('../controllers/wine_controller');
const validateSchema = require('../validation_schema');
const versionConstants = require('../version_constants');

const constants = require(global.appRoot+'/common/constants');

const ApplicationUtils = require(global.appRoot+"/common/application");
const VccResponse = require(appRoot+'/common/vcc_response');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/wine/vinout/list",
        wineController.getVinOut
    );

    server.get(versionConstants.VERSION+"/wine/vinout/list/:page_no/:no_of_records",
        wineController.getVinOut
    );

    server.get(versionConstants.VERSION+"/wine/vinin/list",
        wineController.getVinIn
    );

    server.get(versionConstants.VERSION+"/wine/vinin/list/:page_no/:no_of_records",
        wineController.getVinIn
    );

    server.get(versionConstants.VERSION+"/wine/favorite/list",
        wineController.getFavList
    );

    server.get(versionConstants.VERSION+"/wine/favorite/list/:page_no/:no_of_records",
        wineController.getFavList
    );

    server.post(versionConstants.VERSION+"/wine/archive/note/add",
        ApplicationUtils.validateRequest(validateSchema.addArchiveNote),
        wineController.addArchiveNote
    );

    server.get(versionConstants.VERSION+"/wine/archive/all",
        wineController.getAllArchiveWines
    );

    server.get(versionConstants.VERSION+"/wine/archive/all/:page_no/:no_of_records",
        wineController.getAllArchiveWines
    );

    server.post(versionConstants.VERSION+"/wine/archive/rate",
        ApplicationUtils.validateRequest(validateSchema.addArchiveRate),
        wineController.addArchiveRate
    );

    server.post(versionConstants.VERSION+"/wine/archive/remove",
        ApplicationUtils.validateRequest(validateSchema.removeArchive),
        wineController.removeArchive
    );

    server.post(versionConstants.VERSION+"/wine/name/lookup",
        ApplicationUtils.validateRequest(validateSchema.wineNameLookup),
        wineController.nameLookUp
    );

    server.post(versionConstants.VERSION+"/wine/archive/photo/add",
        ApplicationUtils.getMulterForFile(global.appRoot+"/assets/photos/my_wines/original").single("wine_pic"),
        ApplicationUtils.validateRequest(validateSchema.addArchivePhoto),
        function (request, response) {
            if(request.file){
                fs.writeFileSync(path.join(appRoot,constants.PHYSICAL_IMAGE_PATH.MY_WINES_THUMB_PATH,request.file.filename),imagemagick.convert({
                    srcData: fs.readFileSync(path.join(appRoot,constants.PHYSICAL_IMAGE_PATH.MY_WINES_ORIGINAL_PATH,request.file.filename)),
                    width: 200,
                    height: 200,
                    resizeStyle: 'aspectfill',
                    gravity: 'Center'
                }));

                wineController.addArchivePhoto(request,response);
            }else{
                var customResponse = new VccResponse(response);
                customResponse.setStatusCode(VccResponse.REQUIRED_FIELD)
                    .setResponseBody({error: constants.ERROR_MESSAGES.WINE_PIC_REQUIRED})
                    .send();
            }
        }
    );

    server.post(versionConstants.VERSION+"/wine/search",
        ApplicationUtils.validateRequest(validateSchema.searchWine),
        wineController.searchWine
    );

    server.get(versionConstants.VERSION+"/wine/vintage/list",
        wineController.getVintageList
    );

    server.post(versionConstants.VERSION+"/wine/add_to_archive",
        ApplicationUtils.validateRequest(validateSchema.addToArchive),
        wineController.addToArchive
    );

    server.post(versionConstants.VERSION+"/wine/re",
        ApplicationUtils.validateRequest(validateSchema.getWinesFromRE),
        wineController.getWinesFromRE
    );

    server.get(versionConstants.VERSION+"/wine/vin_out_by_restaurant/:restaurant_id",
        ApplicationUtils.validateRequest(validateSchema.vinOutByRestaurant),
        wineController.getVinOutByRestaurantId
    );

    server.post(versionConstants.VERSION+"/wine/details",
        ApplicationUtils.validateRequest(validateSchema.getWineDetails),
        wineController.getWineDetails
    );
};