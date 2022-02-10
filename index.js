const express = require('express');
const bodyParser= require('body-parser');
const app=express();
const port=4000;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res)=>{
    res.send("siaw");
})
app.listen(port,()=>{
console.log("Server starting at port 4000");
})