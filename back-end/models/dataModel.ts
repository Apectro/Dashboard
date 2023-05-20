import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  category: String,
  data: mongoose.Schema.Types.Mixed,
});

const LogModel = mongoose.model('Log', LogSchema);

export default LogModel;
