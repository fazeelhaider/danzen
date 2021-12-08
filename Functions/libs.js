var MongoClient = require('mongodb').MongoClient;
const {DBURL} = require('./connection')

function CheckMandatory(Body, MandatoryFields){
    const BodyKeys = Object.keys(Body);
    return new Promise((res, rej)=>{
        let MissingParams = '';
        const MandatoryLength = MandatoryFields.length;
        MandatoryFields.map((MandatoryField, index)=>{
            if(!BodyKeys.includes(MandatoryField)){
                if(MandatoryLength == index+1){
                    MissingParams+=`${MandatoryField}`;
                }
                else{
                    MissingParams+=`${MandatoryField}, `;
                }
            }
            if(MandatoryLength == index+1){
                if(MissingParams!=''){
                    rej({Error:`Please include ${MissingParams}`, Code: "01"});
                }
                else{
                    res({Code:"00", })
                }
            }
        })
    })
}

function CheckNullAndEmpty(Body){
    return new Promise((res, rej)=>{
        let NullParams = '';
        BodyKeys = Object.keys(Body);

        const Bodylength = BodyKeys.length;

        BodyKeys.map((Key, index)=>{
                var SingleKeyValue =Body[`${Key}`];
                if(SingleKeyValue === "null" || SingleKeyValue == null || SingleKeyValue ===""){

                if(Bodylength == index+1){
                    NullParams+=`${Key}`;
                }
                else{
                    NullParams+=`${Key}, `;
                }
                }
                if(Bodylength == index+1){
                    console.log(NullParams)
                if(NullParams!=''){
                    rej({Error:`These fields are empty or null. ${NullParams}`, Code: "01"});
                }
                else{
                    res({Code:"00", })
                }
                }

        })
     
    })
}
function InsertInDb(Table, Body){
    Body.CreatedAt = new Date();
    Body.UpdatedAt = null;

    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("DanzenDs");
            dbo.collection(Table).insertOne(Body, function(err, result) {
                if(err){
                  rej({Error:err, Code: "01"});
                }
                else{
                    res({
                        Code:"00", 
                        Message:"Inserted successfully!",
                    })
                }
            })
        }
    });
});
}

function UpdateInDb(Table, Body){
    Body.UpdatedAt = new Date();
    let{
        Id
    } = Body;
    Id = JSON.parse(Id)
    delete Body.Id;
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("DanzenDs");
            dbo.collection(Table).findOneAndUpdate({_id:Id},  {$set: Body}, {returnNewDocument:false},  function(err, result){
                if(result.lastErrorObject.updatedExisting){
                 res({Code: "00", Message:"Updated successfully!", result});
                }
                else{
                 rej({Error:err, Code: "01", Message:"Error in Updating!"});
                }
             db.close();
            });
        }
    });
});
}

function DeleteInDb(Table, Body){
    let{
        Id
    } = Body;
    Id = JSON.parse(Id);
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("DanzenDs");
            dbo.collection(Table).deleteOne({_id:Id},  function(err, result){
                if(result.deletedCount>0){
                 res({Code: "00", Message:"Deleted successfully!", result});
                }
                else{
                 rej({Error:err, Code: "01", Message:"Error in Deleting!"});
                }
             db.close();
            });
        }
    });
});
}

function FindInDb(Table, Query){
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("DanzenDs");
            dbo.collection(Table).find(Query, {}).toArray(function(err, result) {
                if(!err){
                    if(result.length > 0){
                        res({Code: "00", Message:"Finded successfully!", Data:result});
                    }
                    else{
                        rej({Code: "02", Message:"No data found!", Data:result});
                    }
                   }
                   else{
                    rej({Error:err, Code: "01", Message:"Error in Finding!"});
                   }
                db.close();
              });
            // dbo.collection(Table).find(Query,{},function(err, result){
         
            // });
        }
    });
});
}

function CheckIfExist(Table, Query){
    return new Promise((res, rej)=>{
        FindInDb(Table, Query)
        .then(finded=>{
        rej({Code: "01", Message:`${Table} Already Exist!`,})
        })
        .catch(()=>{
            res({Code: "00", Message:`${Table} User Not Exist!`});
        })
    });
}
module.exports = {
    CheckMandatory,
    InsertInDb,
    UpdateInDb,
    DeleteInDb,
    FindInDb,
    CheckNullAndEmpty,
    CheckIfExist
}
