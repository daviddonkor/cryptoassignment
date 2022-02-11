const express = require('express');
const bodyParser= require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app=express();
const port=4000;
const fetch = require('node-fetch');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname  + '/public'));


//Db Connnection, Can be moved to the routes to prevent loading DB when it is not needed. 
//This is just for assignment purposes
const db =new sqlite3.Database('./db/myCryptoBank.db',sqlite3.OPEN_READWRITE,(err)=>{
    if(err){
        console.error(err.message)
    }
    console.log("Connected to the Transactions DB");
});

//Set the EJS engine
app.set("view engine",'ejs');

//Home Route
app.get('/',  (req,res)=>{

    // const bitcoin =  fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=daily", {
    //     method: 'GET',
    //     mode: 'cors',
    //     headers: { 'Content-Type': 'application/json' }
    //   });
      
    //  console.log(bitcoin);

    //   const ethereum = await fetch("https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1&interval=daily", 
    //   {
    //     method: 'GET',
    //     mode: 'cors',
    //     headers: { 'Content-Type': 'application/json' }
    //   }).then(res => console.log(res.json()));

    // db.each("select current_balance from transactions where currency='"+req.body.coin+"'\
    // ORDER BY id DESC LIMIT 1",function(err,rows){
    //    if(err){
    //        console.error(err.message);
    //    }
    //    req.body.push(rows);
    // }
    // );
    
    res.render("pages/index");
})

//Buy Crypto Route
app.get('/buyCrypto', (req,res)=>{
    res.render("pages/buycrypto");
});

//Post buy Crypto Route
app.post('/buyCrypto', (req,res)=>{

    // Getting the last current value
   
  
 db.all("select current_balance from transactions where currency='"+req.body.coin+"'\
     ORDER BY id DESC LIMIT 1",[],function(err,rows){
        if(err){
            console.error(err.message);
        }
    if(rows){
        rows.forEach(function(row){
            
            currentbalance=parseFloat(req.body.amount)+parseFloat(row.current_balance);
            db.run('INSERT INTO transactions(time,currency,amount_purchased,current_balance) VALUES(?, ?, ?, ?)',[
                Date.now(),
                req.body.coin,
                req.body.amount,
                currentbalance
            ],function(err){
                if(err){
                    res.send(err.message)
                }
                res.redirect("/transactions");
            });
          });
    }else{
        db.run('INSERT INTO transactions(time,currency,amount_purchased,current_balance) VALUES(?, ?, ?, ?)',[
            Date.now(),
            req.body.coin,
            req.body.amount,
            req.body.amount
        ],function(err){
            if(err){
                res.send(err.message)
            }
            res.redirect("/transactions");
        });
    }
      //  return rows;
        
    });

 
  

});

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
            });
            db.close();
        
         
});



app.listen(port,()=>{
console.log("Server starting at port 4000");
});