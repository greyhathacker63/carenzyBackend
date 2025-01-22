const Response = require('../utilities/Response');
const Logger = require('../utilities/Logger');
const { validateToken } = require('./middlewares/auth');
const { validateToken: validateTokenFront, setCuserInfo: setCuserInfoFront } = require('./middlewares/authFront');
// const hh = require('../models/brandModelBookmark');

/*
|--------------------------------------------------------------------------
|  Admin routes import
|--------------------------------------------------------------------------
*/
const adminRoute = require("./modules/admin/user/route");
const rightRoute = require("./modules/admin/right/route");
const roleRoute = require("./modules/admin/role/route");
const fileRoute = require("./modules/admin/file/route");
const planRoute = require("./modules/admin/plan/route");
const cityRoute = require("./modules/admin/city/route");
const stateRoute = require("./modules/admin/state/route");
const dealerSubcriptionRoute = require("./modules/admin/dealerSubscription/route");
const adminBrand = require("./modules/admin/brand/route");
const adminBrandModel = require("./modules/admin/brandModel/route");
const adminModelVariant = require("./modules/admin/modelVariant/route");
const adminColor = require("./modules/admin/color/route");
const adminEngineType = require("./modules/admin/engineType/route");
const adminBodyType = require("./modules/admin/bodyType/route");
const adminMaster = require("./modules/admin/master/route");
const adminRTO = require("./modules/admin/rto/route");
const adminRTOcharge = require("./modules/admin/rtoCharge/route");
const fuelTypeRoute = require("./modules/admin/fuleType/route");
const AdminBannerRoute = require("./modules/admin/banner/route");
const AdminSurveyQuesRoute = require("./modules/admin/surveyQues/route");
const AdminSurveyQuesOptRoute = require("./modules/admin/surveryQuesOptions/route");
const VariantSpecFeatureRoute = require("./modules/admin/variantSpecFeature/route");
const rightGrpRoute = require("./modules/admin/rightsGrp/route");
// const biddingCarAdmin = require("./modules/admin/biddingCar/route");
const adminBlogRoute = require("./modules/admin/blog/route");
const adminBlogCommentRoute = require("./modules/admin/blogComment/route");
const adminAuthorRoute = require("./modules/admin/author/route");
const dealerCarAdmin = require("./modules/admin/dealerCar/route");
const newCarAdmin = require("./modules/admin/newcar/route");
const adminSetting = require("./modules/admin/setting/route");
const blogCategory = require("./modules/admin/category/route");
const blogCategoryRoute = require("./modules/blog/category/route");
const adminSubscriptionRoute = require("./modules/admin/subscription/route");
const adminDealerDataVerify = require("./modules/admin/dealer_data_verify/route");
const promoMediaRoute = require('./modules/admin/promoMedia/route')
const addCityRoute = require('./modules/admin/addCity/route')


/*
|--------------------------------------------------------------------------
|  Dealer routes import
|--------------------------------------------------------------------------
*/

const dealerRoute = require("./modules/front/dealer/route");
const carRoute = require("./modules/front/newcar/route");
const followRoute = require("./modules/front/follow/route");
const ratingDealerRoute = require("./modules/front/rating-dealer/route");
const brandRoute = require("./modules/front/brand/route");
const colorRoute = require("./modules/front/color/route");
const yearRoute = require("./modules/front/year/route");
const fuelTypeFrontRoute = require("./modules/front/fuelType/route");
const bodyTypeFrontRoute = require("./modules/front/bodyType/route");
const rtoRoute = require("./modules/front/rto/route");
const priceRangeRoute = require("./modules/front/priceRange/route");
const dealerCarRoute = require("./modules/front/dealerCar/route");
const dealerLeadRoute = require("./modules/front/dealerLead/route");
const dealerSearchRoute = require("./modules/front/search/route");
const dealerSettingRoute = require("./modules/front/setting/route");
const dealerReportRoute = require("./modules/front/report/route");
const dealerStateRoute = require("./modules/front/state/route");
const dealerCityRoute = require("./modules/front/city/route");
const dealerPlanRoute = require("./modules/front/plan/route");
const dealerBannerRoute = require("./modules/front/banner/route");
const dealerSubscriptionRoute = require("./modules/front/subscription/route");
const notificationRoute = require("./modules/front/notification/route");
const dealerBidding = require("./modules/front/bidding/route")
const sellCarRoute = require("./modules/front/sellCar/route");



/*
|--------------------------------------------------------------------------
|  Blog routes import
|--------------------------------------------------------------------------
*/

const blogRoute = require('./modules/blog/blog/route');
const commonRoute = require('./modules/common/route');
const pollRoute = require('./modules/poll/route')
const firebaseService = require('./../services/firebase');

const api = (app) => {
    app.use('*', (req, res, next) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        if (req.method === 'OPTIONS') {
            res.status(200).json({ status: 'Okay' });
        } else {
            next();
        }
    });

    app.all('/status', (req, res) => {
        Logger.info('checking status', { status: 1 });

        Response.success(res, {
            data: {
                headers: req.headers,
                params: req.params,
                query: req.query,
                body: req.body,
            },
        });
    });

    app.all('/validate-token', validateToken, (req, res) => {
        Response.success(res, {
            data: { type: req.__cuser.type, adminRights: req.__cuser.adminRights, name: req.__cuser.name, avatar: req.__cuser.avatar },
            message: "Authorized"
        });
    });

    /*
    |--------------------------------------------------------------------------
    |  Admin Urls
    |--------------------------------------------------------------------------
    */
    app.use('/admin/file', validateToken, fileRoute);
    app.use('/admin/user', adminRoute);
    app.use('/admin/right', validateToken, rightRoute);
    app.use('/admin/plan', validateToken, planRoute);
    app.use('/admin/city', validateToken, cityRoute);
    app.use('/admin/state', validateToken, stateRoute);
    app.use('/admin/role', validateToken, roleRoute);
    app.use('/admin/dealer-subscription', validateToken, dealerSubcriptionRoute);
    app.use('/admin/brand', validateToken, adminBrand);
    app.use('/admin/brand-model', validateToken, adminBrandModel);
    app.use('/admin/model-variant', validateToken, adminModelVariant);
    app.use('/admin/color', validateToken, adminColor);
    app.use('/admin/engine-type', validateToken, adminEngineType);
    app.use('/admin/body-type', validateToken, adminBodyType);
    app.use('/admin/fule-type', fuelTypeRoute);
    app.use('/admin/master', validateToken, adminMaster);
    app.use('/admin/rto', validateToken, adminRTO);
    app.use('/admin/rto-charge', validateToken, adminRTOcharge);
    app.use('/admin/banner', validateToken, AdminBannerRoute);
    app.use('/admin/survey-ques', validateToken, AdminSurveyQuesRoute);
    app.use('/admin/survey-ques-opt', validateToken, AdminSurveyQuesOptRoute);
    app.use('/admin/right-group', validateToken, rightGrpRoute);
    app.use('/admin/variant-spec-feature', validateToken, VariantSpecFeatureRoute);
    // app.use('/admin/bidding-car', biddingCarAdmin);
    app.use('/admin/author', validateToken, adminAuthorRoute);
    app.use('/admin/blog', validateToken, adminBlogRoute);
    app.use('/admin/blog-comment', validateToken, adminBlogCommentRoute);
    app.use('/admin/blog-category', validateToken, blogCategory);
    app.use('/admin/dealer-car', validateToken, dealerCarAdmin);
    app.use('/admin/new-car', validateToken, newCarAdmin);
    app.use('/admin/setting', adminSetting);
    app.use('/admin/subscription', validateToken, adminSubscriptionRoute);
    app.use('/admin/data-verify', adminDealerDataVerify);
    app.use('/admin/promo-media', promoMediaRoute)
    app.use('/admin/addCity', addCityRoute)

    /*
    |--------------------------------------------------------------------------
    |  Dealer Urls
    |--------------------------------------------------------------------------
    */

    app.use('/dealer/file', validateTokenFront, fileRoute);
    app.use('/dealer/user', dealerRoute);
    app.use('/dealer/follow', validateTokenFront, followRoute);
    app.use('/dealer/rating-dealer', validateTokenFront, ratingDealerRoute);
    app.use('/dealer/new-car', setCuserInfoFront, carRoute);
    app.use('/dealer/brand', brandRoute);
    app.use('/dealer/color', colorRoute);
    app.use('/dealer/year', yearRoute);
    app.use('/dealer/price-range', priceRangeRoute);
    app.use('/dealer/fueltype', fuelTypeFrontRoute);
    app.use('/dealer/bodytype', bodyTypeFrontRoute);
    app.use('/dealer/rto', rtoRoute);
    app.use('/dealer/dealer-car', validateTokenFront, dealerCarRoute);//comment
    app.use('/dealer/dealer-lead', validateTokenFront, dealerLeadRoute);
    app.use('/dealer/search', validateTokenFront, dealerSearchRoute);
    app.use('/dealer/setting', dealerSettingRoute);
    app.use('/dealer/report', validateTokenFront, dealerReportRoute);
    app.use('/dealer/state', dealerStateRoute);
    app.use('/dealer/city', dealerCityRoute);
    app.use('/dealer/plan', dealerPlanRoute);
    app.use('/dealer/banner', validateTokenFront, dealerBannerRoute);
    app.use('/dealer/subscription', dealerSubscriptionRoute);
    app.use('/dealer/notification', validateTokenFront, notificationRoute);
    app.use('/dealer/bid', dealerBidding)
    app.use('/dealer/sell-car', sellCarRoute);

    /*
    |--------------------------------------------------------------------------
    |  Blog Urls
    |--------------------------------------------------------------------------
    */
    app.use('/blog', blogRoute);
    app.use('/blog/category', blogCategoryRoute);


    /*
    |--------------------------------------------------------------------------
    |  Common Urls
    |--------------------------------------------------------------------------
    */
    app.use('/common', commonRoute);



    /*
|--------------------------------------------------------------------------
|  poll routes import
|--------------------------------------------------------------------------
*/
    app.use('/poll', pollRoute)


};

module.exports = api;