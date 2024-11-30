const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');


class colorController {
    static async getListOfYears() {
        const currentYear = new Date().getFullYear();
        const nextFiveYears = currentYear + 5;
        const years = [];
      
        for (let year = 2010; year <= nextFiveYears; year++) {
          years.push(year);
        }
      
        return years;
      }
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = {
                start: "2010",
                end: (new Date().getFullYear() + 5).toString(),
            }
            if (srvRes) {
                response.data = srvRes;
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

module.exports = colorController