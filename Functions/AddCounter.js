

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function AddCounter(Name){
    return new Promise((res, rej)=>{
        MongoClient.connect(url, function(err, db) {
            if (err){
                rej({Error:err, Code: "01"});
            }
            else{
                var dbo = db.db("DanzenDs");
                dbo.collection("Counter").findOne({Name:Name}, function(err, result){
                    if(typeof result == "undefined"){
                    dbo.collection("Counter").insertOne({Name:Name, WillLastId:2 }, function(err, result) {
                    if(!err){
                        res({Code: "00", WillLastId:1})
                    }
                    else{
                         rej({Error:err, Code: "01"});
                    }
                    db.close();
                    });
                    }
                    else{
                        let {
                            WillLastId
                        } = result;
                        WillLastId++;
                        dbo.collection("Counter").findOneAndUpdate({Name:Name}, { "$set": {Name:Name, WillLastId}}, {"returnNewDocument":true},  function(err, result){
                           if(!err){
                            res({WillLastId:result.value.WillLastId, Code: "00"});
                           }
                           else{
                            rej({Error:err, Code: "01"});
                           }
                        db.close();
                        });
                    }
                });
        }
    });
    })
}

module.exports = {
    AddCounter,
}
