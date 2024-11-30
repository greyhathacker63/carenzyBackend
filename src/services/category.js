const { Types } = require("mongoose");
const categoryModel = require("../models/category");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

class categoryService {
  // Author service :
  static async details(_id) {
    const response = { data: {}, status: false };
    try {
      _id = Types.ObjectId(_id);
      response.data = await categoryModel.findOne({
        _id: _id,
        isDeleted: false,
      });
      response.status = true;
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async list(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };

    try {
      const search = {
        _id: query._id ? Types.ObjectId(query._id) : "",
        name: query.key
          ? { $regex: new RegExp(query.key || ""), $options: "i" }
          : "",
        status: query.forFront ? true : "",
        isDeleted: false,
      };

      clearSearch(search);

      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },
      ];
      response = await paginationAggregate(categoryModel, $aggregate, $extra);
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async listForFront(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };

    try {
      const search = {
        _id: query._id ? Types.ObjectId(query._id) : "",
        status:true,
        isDeleted: false,
      };

      clearSearch(search);

      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },
        {
          $project:{
            name:1,
            slug:1,
          }
        }
      ];
      response = await paginationAggregate(categoryModel, $aggregate, $extra);
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async save(data) {
    const _id = data._id;
    const response = { data: {}, status: false };
    try {
      const docData = _id
        ? await categoryModel.findById(_id)
        : new categoryModel();

      docData.name = data.name;
      docData.slug = data.slug;
      docData.status = data.status || docData.status;

      await docData.save();
      console.log(docData)
      response.data = docData;
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async delete(ids) {
    const response = { status: false, ids: [] };
    try {
      if (Array.isArray(ids)) {
        await categoryModel.updateMany(
          { $or: [{ _id: { $in: ids } }] },
          { isDeleted: true }
        );
      } else if (typeof ids === "string") {
        await categoryModel.updateOne({ _id: ids }, { isDeleted: true });
        response.id = ids;
      }
      response.status = true;
      response.id = ids;

      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = categoryService;
