import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const guildData = new Schema({
	id: Number,
	name: String,
	prefix: String,
	language: String,
	actions: Object,
});
