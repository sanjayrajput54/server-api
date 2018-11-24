const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const productRouter = require('./api/routes/product');
const userRouter = require('./api/routes/user');

mongoose.connect("mongodb://admin:"+'admin123'+"@node-rest-services-shard-00-00-u82qf.mongodb.net:27017,node-rest-services-shard-00-01-u82qf.mongodb.net:27017,node-rest-services-shard-00-02-u82qf.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-services-shard-0&authSource=admin&w=1",{
// useMongodbClient:true
useNewUrlParser:true
});
console.log(process.env.MONGO_ATLAS_PW);
app.use(morgan("dev"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/json',(req,res,next)=>{
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept, Authorization");
if(res.method==='OPTIONS'){
  res.header('Access-Control-Allow-Methods','GET,HEAD,PUT,PATCH,POST,DELETE');
  return res.status(200).json({});
}
next();
});
app.use('/user',userRouter);
app.use('/product',productRouter);



// app.use('/json',(req,res,next)=>{
// res.status(200).json({
//         "_id": "5a4fbbbdac9ec20e70e0eb9b",
//         "name": "8",
//         "__v": 0
// });

// });
app.use((req,res,next)=>{
const error=new Error('Not Found!');
error.status=404;
next(error);
});
app.use((error,req,res,next)=>{
res.status(error.status|| 500);
res.json({
      error:{
        message:error.message
      }
});

});
module.exports=app;