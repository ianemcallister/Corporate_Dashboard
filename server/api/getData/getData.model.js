'use strict';

import mongoose from 'mongoose';

var GetDataSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('GetData', GetDataSchema);
