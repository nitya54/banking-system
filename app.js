const express=require('express');
const dotenv=require('dotenv');
dotenv.config();
const db= require('./config/db_setup');
const User= require('./models/customer');
const transact= require('./models/transaction');
const session= require('express-session');
const flash= require('connect-flash');
const PORT= process.env.PORT || 4000;
const app=express();

// body-parser
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'Keyboard cat'
}));

//Serve Static File
app.use(express.static('./assets/'));



var setFlash=(req,res,next)=>{
    res.locals.flash={
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}

// adding flash
app.use(flash());

app.use(setFlash);

// Setting view engine 
app.set('view engine','ejs');


app.get('/',(req,res)=>{
    User.find({})
    .then(result=>{
        transact.find({})
        .populate('sender')
        .populate('receiver')
        .exec((err,trans)=>{
            res.render('index',{
                customer: result,
                transaction: trans
        })
        
        })
    })
    .catch(err=>{
        console.log(err);
    })
})


// Router for transfering money
app.post('/transfer',(req,res)=>{
    const {sender, receiver, amount}= req.body;
  
    User.findOne({accountno: sender},(err,result)=>{
        if(err) { console.log(err)}
        if(result){
            if(result.balance>=amount){
                User.findOne({accountno: receiver},(err,user)=>{
                    result.balance-=amount;
                    var balance=user.balance;
                    balance=parseInt(balance)+parseInt(amount);
                    user.balance=balance;

                    user.save();
                    result.save();
                    const new_transac= new transact({
                        to: sender,
                        from: receiver,
                        sender: result._id,
                        receiver: user._id,
                        amount: amount
                    });
                    new_transac.save();
                    req.flash('success',`Successfully transfered ${amount} to ${user.firstname} ${user.lastname}`);
                    res.redirect('back');
                });
            }
            else{
                req.flash('error',`${result.firstname} ${result.lastname} you do not have enough cash for this transaction !!!!!`);
                    res.redirect('back');
            }
        }
    });
    


   
});

app.get('/account/:no',(req,res)=>{
    const accno= req.params.no;
    User.findOne({accountno: accno},(err,result)=>{
        if(err){ console.log(err);     res.redirect('back');
    }
        if(result){
            User.find({})
            .then(users=>{
                transact.find({ $or:[{to: accno} , {from: accno } ] })
                .populate('sender')
                .populate('receiver')
                .exec((err, trans)=>{
                    res.render('customer',{
                        title: `${result.firstname} ${result.lastname}`,
                        person: result,
                        customer: users,
                        transaction: trans
                    });
                   });
                
            })
            .catch(err=>{
                console.log(err);
            })
           
        }
        else{
            res.redirect('back');

        }
    });
})


// Listening Server
app.listen(PORT,(err)=>{
    if(err){
        console.log("Server not starting because of error: "+err);
    }
    else{

        console.log(`Server is Running at PORT: ${PORT}`);
    }
})