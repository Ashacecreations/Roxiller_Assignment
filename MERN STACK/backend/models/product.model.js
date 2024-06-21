import { mongoose } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

productSchema.plugin(mongoosePaginate);
const ProductTransaction = mongoose.model('ProductTransaction', productSchema);

export default ProductTransaction;