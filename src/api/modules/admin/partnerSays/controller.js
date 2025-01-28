const { toPath } = require('lodash');
const partnerSays = require('../../../../models/partnerSays');

class Controller {
  static async save(req, res) {
    try {
      const { dealer_id, description } = req.body;

      const missingFields = ["dealer_id", "description"].filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        return res.json({
          status: false,
          message: `Please provide ${missingFields.join(', ')}`,
        });
      }

      const partnerSaysCreate = await partnerSays.create({ dealer_id, description });

      return res.json({
        status: true,
        message: "Partner says created successfully",
        data: partnerSaysCreate,
      });

    } catch (error) {
      return res.json({
        status: false,
        message: error.message,
        data: {},
      });
    }
  }

  static async detail(req, res) {
    try {

      let { page = 1, limit = 20 } = req.query;
      page = Math.max(1, Number(page));
      limit = Math.max(1, Number(limit));

      const allPartnerSays = await partnerSays.aggregate([
        {
          $lookup: {
            from: 'dealers',
            localField: 'dealer_id',
            foreignField: '_id',
            as: 'dealerData'
          }
        }, {
          $unwind: '$dealerData'
        }, {
          $project: {
            avatar: '$dealerData.avatar',
            name: "$dealerData.name",
            dealer_id: 1,
            description: 1,
            createdAt: 1
          }
        }, {
          $facet: {
            paginatedData: [
              {
                $sort: {
                  updatedAt: -1
                },
              },
              {
                $skip: (page - 1) * limit
              },
              {
                $limit: limit
              }
            ],
            total: [
              {
                $count: 'total'
              }
            ]
          }
        }
      ])
      const data = allPartnerSays[0]?.paginatedData
      const total = allPartnerSays[0]?.total[0]?.total


      res.json({
        status_code: !!total,
        message: total ? "Data fetched successfully" : "No data found",
        data,
        total: total || 0
      });
    } catch (error) {
      res.json({
        status_code: false,
        message: error.message,
        data: []
      });
    }
  }

  static async delete(req, res) {
    const { _id } = req.query;
    if (!_id) {
      return res.json({
        status: false,
        message: "Please provide _id",
        data: {}
      });
    }
    try {
      const deleteData = await partnerSays.findByIdAndDelete(_id);
      if (!deleteData) {
        return res.json({
          status: false,
          message: "No data found with the provided _id",
          data: {}
        });
      }

      return res.json({
        status: true,
        message: "Data deleted successfully",
        data: {}
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message,
        data: {}
      });
    }
  }

  static async edit(req, res) {
    const { _id, dealer_id, description } = req.body;
    if (!_id) {
      return res.json({
        status: false,
        message: "Please provide _id",
        data: {}
      });
    }
    try {
      const filter = {};
      if (dealer_id) filter.dealer_id = dealer_id;
      if (description) filter.description = description;

      if (!Object.keys(filter).length) {
        return res.json({
          status: false,
          message: "Please provide any key to update",
          data: {}
        });
      }

      const updatedData = await partnerSays.findByIdAndUpdate(_id, { $set: filter }, { new: true });
      if (!updatedData) {
        return res.json({
          status: false,
          message: "No data found with the provided _id",
          data: {}
        });
      }

      return res.json({
        status: true,
        message: "Data updated successfully",
        data: updatedData
      });
    } catch (error) {
      return res.json({
        status: false,
        message: error.message,
        data: {}
      });
    }
  }

}

module.exports = Controller;
