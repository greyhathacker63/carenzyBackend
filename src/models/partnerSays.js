const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    dealer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'dealer',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('partner_says', partnerSchema);
