const mongoose = require("mongoose");
const reportProblemSchema = new mongoose.Schema({
	dealerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer"
	},
	metadataId: {
		type: mongoose.Types.ObjectId,
		ref: "metadata"
	},
	reportId: {
		type: String,
	},
	message: {
		type: String,
		trim: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
});

reportProblemSchema.pre('save', async function (next) {
	if (!this.isModified('reportId') && this.reportId) {
		return next();
	}

	try {
		const mostRecentReport = await reportProblemModel.findOne().sort({ reportId: -1 });
		if (mostRecentReport) {
			this.reportId = parseInt(mostRecentReport.reportId) + 1;
		} else {
			this.reportId = '1';
		}
		next();
	} catch (error) {
		next(error);
	}
});

const reportProblemModel = mongoose.model("report_problem", reportProblemSchema);
module.exports = reportProblemModel;