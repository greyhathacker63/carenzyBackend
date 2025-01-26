const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const BannerServices = require('../../../../services/banner');


class bannerController {
    // For Banners
    static async bannerList(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };

            const visibleTo = ["All Accounts"];

            if (!req.__cuser.crz) {
                visibleTo.push("Incomplete Accounts");
            } else if (!req.__cuser.verifcationStatus) {
                visibleTo.push("Unverified Accounts");
            } else {
                visibleTo.push("Verified / Complete Accounts");
            }
            if (!req.query.position) {
                return res.json({
                     success: false,
                     message: "Please provide position",
                     data: [],
                     extra: {
                         page: 1,
                         limit: 0,
                         total: 0
                     }
                 })
             }
             const checkPosition = ["home", "bidding", "market", "leads"];
             if (!checkPosition.includes(req.query.position)) {
                 return res.json({
                     success: false,
                     message: "Please provide correct value of position",
                     data: [],
                     extra: {
                         page: 1,
                         limit: 0,
                         total: 0
                     }
                 });
             }

            const srvRes = await BannerServices.listFront({ visibleTo, position: req.query.position, isAll: 1 });
            if (srvRes.data.length) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }

}

module.exports = bannerController