const mongoose= require('mongoose');

const UserSchema= new mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    accountno: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: String,
        required: true
    }
    
   
    
}, {
    timestamps: true
});

const user= mongoose.model('customer',UserSchema);
module.exports= user;