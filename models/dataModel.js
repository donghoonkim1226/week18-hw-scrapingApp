var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DataSchema = new Schema({
  data:{
    type:String
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

var Data = mongoose.model("Data", DataSchema);
module.exports = Data;