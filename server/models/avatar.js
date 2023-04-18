const mongoose = require('mongoose');


const BodyPartSchema = new mongoose.Schema({
  type:  String,
  color: String ,
  length: Number 
});

const ClothesSchema = new mongoose.Schema({
  color:String ,
  style: String ,
  size: String 
});

const AvatarSchema = new mongoose.Schema({
  skinColor: String ,
  gender: String,
  lowerBody: { type: BodyPartSchema, required: true },
  upperBody: { type: BodyPartSchema, required: true },
  eyebrows: { type: BodyPartSchema },
  skin: { type: BodyPartSchema, required: true },
  eyes: { type: BodyPartSchema },
  mouth: { type: BodyPartSchema },
  nose: { type: BodyPartSchema },
  clothes: { type: ClothesSchema }
});

const Avatar = mongoose.model('Avatar', AvatarSchema);
module.exports = Avatar;
