import mongoose from 'mongoose'

let Schema = mongoose.Schema

export default mongoose.model(`User`, new Schema({
	email: String,
	password: String,
	plan: String,
	subjects: [{ id: String, name: String, numDocuments: Number }],
}))
