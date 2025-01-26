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
            $lookup:{
              from: 'dealers',
              localField: 'dealer_id',
              foreignField: '_id',
              as: 'dealerData'
            }
          },{
            $unwind:'$dealerData'
          },{
            $project: {
              _id:0,
              avatar: '$dealerData.avatar',
              name: "$dealerData.name",
              dealer_id: 1,
              description:1,
              createdAt: 1
            }
          }
        ])

        // const allPartnerSays = await partnerSays.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        res.json({
            status_code: allPartnerSays.length > 0,
            message: allPartnerSays.length > 0 ? "Data fetched successfully" : "No data found",
            data: allPartnerSays
        });
    } catch (error) {
        res.json({
            status_code: false,
            message: error.message,
            data: []
        });
    }
}

// static async delete(req,res){
//   const {_id}= req.query
//   if(!_id){
//     return res.json({
//       status_code: false,
//       message : "Please provide _id"
//     })
//   }
//   const deleteData = await partnerSays.findByIdAndDelete({_id})
//   if(!deleteData){
//     return res.json({
//       status_code: false
//     })
//   }
// }

}

module.exports = Controller;
