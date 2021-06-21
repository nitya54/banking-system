const mongoose= require('mongoose');

const TransactionSchema= new mongoose.Schema({

  to: {
      type: String,
      required: true
  },
  from: {
      type: String,
      required: true
  },
  sender:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'customer'
  },
  receiver:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'customer'
  },
  amount: {
      type: Number,
      required: true
  },
  date: {
      type: String,
      default:`${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`
  },
  time: {
      type: String,
      default: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  }

});


const transaction= mongoose.model('transaction',TransactionSchema);

module.exports= transaction;