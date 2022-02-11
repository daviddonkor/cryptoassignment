const express = require('express');
const bodyParser= require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app=express();
const port=4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname  + '/public'));


app.set("view engine",'ejs');

app.get('/', (req,res)=>{
    res.render("pages/index");
})

app.get('/buyCrypto', (req,res)=>{
    res.render("pages/buycrypto");
});

app.post('/buyCrypto', (req,res)=>{
    //res.render("pages/buycrypto");

})

app.get('/transactions', (req,res)=>{
    
        const db =new sqlite3.Database('./db/myCryptoBank.db',sqlite3.OPEN_READWRITE,(err)=>{
                if(err){
                    console.error(err.message)
                }
                console.log("Connected to the Transactions DB");
            });

            db.all("select * from transactions",[],(err,rows)=>{
                if(err){
                    console.error(err.message);
                }
                res.render("pages/transactions",{transactions:rows.sort(function(a,b){
                    return b.time-a.time;
                })}); 
            })
        console.log("no data found");
         
});



app.listen(port,()=>{
console.log("Server starting at port 4000");
})