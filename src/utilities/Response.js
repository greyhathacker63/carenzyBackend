const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const Config = require('../config');
const {changeBucketUrl} = require('./Helper');

class Response {
	/**
	 * @example extra = {pagination: {offset: 10, limit: 50, rows: 1000}}
	 *
	 * @static
	 * @param {*} res
	 * @param {*} message
	 * @param {*} [data=null]
	 * @param {number} [code=200]
	 * @param {*} [extra={}]
	 * @memberof Response
	 */
	static success(res, message, data = null, code = HttpStatus.StatusCodes.OK, extra = {}) {
		const resObj = { success: true };

		if (_.isObjectLike(message)) {
			resObj.message = message.message || 'success';
			resObj.data = message.data || null;
			resObj.code = message.code || HttpStatus.StatusCodes.OK;
			if (!_.isEmpty(message.extra) && _.isObjectLike(message.extra)) {
				resObj.extra = message.extra;
			}
		} else {
			resObj.message = message || 'success';
			resObj.data = data || null;
			resObj.code = code || HttpStatus.StatusCodes.OK;
			if (!_.isEmpty(extra) && _.isObjectLike(extra)) {
				resObj.extra = extra;
			}
		}

		if (resObj.extra && resObj.extra.pagination) {
			resObj.extra.pagination.currentPage = resObj.extra.pagination.offset / resObj.extra.pagination.limit + 1;
			resObj.extra.pagination.nextPage =
				resObj.extra.pagination.rows > resObj.extra.pagination.offset + resObj.extra.pagination.limit
					? resObj.extra.pagination.currentPage + 1
					: null;
			delete resObj.extra.pagination.offset;
		}
		if (_.isObjectLike(resObj.data)) {
            resObj.data = JSON.parse(JSON.stringify(resObj.data));
        }
        resObj.data = changeBucketUrl(resObj.data);

		if (res.req.headers.json) {
			res
				.status(resObj.code)
				.type('json')
				.send(`${JSON.stringify(resObj, null, 2)}\n`);
		} else {
			res.status(resObj.code).json(resObj);
		}
	}

	/**
	 * @static
	 * @param {*} res
	 * @param {*} message
	 * @param {number} [code=404]
	 * @param {*} [resCode=null]
	 * @param {*} [extra={}]
	 * @memberof Response
	 */
	static fail(res, message, code = HttpStatus.StatusCodes.NOT_FOUND, resCode = HttpStatus.StatusCodes.NOT_FOUND, extra = {}) {
		const resObj = { success: false };

		if (_.isObjectLike(message)) {
			resObj.message = message.message || 'failed';
			resObj.errors = [{ msg: resObj.message }];
			resObj.code = message.code || HttpStatus.StatusCodes.NOT_FOUND;
			resObj.resCode = message.resCode || resObj.code;
			if (!_.isEmpty(message.extra) && _.isObjectLike(message.extra)) {
				resObj.extra = message.extra;
			}
		} else {
			resObj.message = message || 'failed';
			resObj.errors = [{ msg: resObj.message }];
			resObj.code = code || HttpStatus.StatusCodes.NOT_FOUND;
			resObj.resCode = resCode || resObj.code;
			if (!_.isEmpty(extra) && _.isObjectLike(extra)) {
				resObj.extra = extra;
			}
		}

		if (res.req.headers.json) {
			res
				.status(resObj.code)
				.type('json')
				.send(`${JSON.stringify(resObj, null, 2)}\n`);
		} else {
			res.status(resObj.code).json(resObj);
		}
	}

	/**
	 * @description adding stack trace in response if environment is not prod
	 * @static
	 * @param {*} obj => response object
	 * @param {*} err => error object
	 * @memberof Response
	 */

	/**
	 * @description create custom error object
	 * @static
	 * @param {*} type
	 * @param {*} [err=null]
	 * @returns
	 * @memberof Response
	 */
	static createError(customErr, systemError = null) {
		if (systemError && Config.IsLocal) {
			const e = new Error(systemError.message);
			e.code = HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY;
			return e;
		}

		const e = new Error(customErr.message);
		e.code = customErr.code || HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY;

		e.name = customErr.name || 'CustomError';

		if (customErr.resCode) {
			e.resCode = customErr.resCode;
		} else {
			e.resCode = customErr.code;
		}

		if (!_.isEmpty(customErr.extra)) {
			e.extra = customErr.extra;
		} else {
			e.extra = {};
		}

		return e;
	}
}

module.exports = Response;