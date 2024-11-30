const { Schema, model, Types } = require("mongoose");
const subMasterModel = require("./subMaster");
const subMasterDataSchema = new Schema(
	{
		masterId: {
			type: Types.ObjectId,
			ref: "master",
		},
		subMasterId: {
			type: Types.ObjectId,
			ref: "sub-master",
		},
		title: {
			type: String,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

subMasterDataSchema.post("save", async function (doc, next) {
	try {
		doc.masterId = (await subMasterModel.findById(doc.subMasterId)).masterId;
		doc.save();
		next();
	} catch (err) {
		throw new Error("Error while getting Master Id");
	}
});
const subMasterDataModel = model("sub_master_data", subMasterDataSchema);
module.exports = subMasterDataModel;
