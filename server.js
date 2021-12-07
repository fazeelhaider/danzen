
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const {AddCounter} = require('./Functions/AddCounter');
const { 
  UpdateProduct,
  ImageUpload,
  AddVariantion,
  UpdateVariation,

  AddUserDoctor,
  UpdateProfile,
  Login,
  InsertSpeciality,
  InsertCity,
  AddUserAdmin,
  LoginPortal,
  InsertBook

 } = require('./Functions/Product');

const fileUpload = require('express-fileupload');
 
app.use(fileUpload());
const { DeleteInDb, FindInDb, UpdateInDb } = require('./Functions/libs');
var url = "mongodb://localhost:27017/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

app.put('/UpdateProfileDoctor', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Update id not found!"})
  }
  else{
    UpdateInDb('Users' , body)
    .then(result=>{
      res.status(200).send(result)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
  }
});


app.post('/LoginForDoctor', function(req, res){
  const {body} = req;
    Login(body)
    .then(result=>{
      res.status(200).send(result);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

app.post('/DoctorSignup', function(req, res){
  const {body} = req;
  AddUserDoctor(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.post('/InsertSpeciality', function(req, res){
  const {body} = req;
  InsertSpeciality(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})


app.put('/UpdateSpeciality', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Update id not found!"})
  }
  else{
    UpdateInDb('Speciality' , body)
    .then(result=>{
      res.status(200).send(result)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
  }
});

app.delete('/DeleteSpeciality', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Delete id not found!"});
  }
  else{
    DeleteInDb('Speciality' , body)
    .then(result=>{
      res.status(200).send(result);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
  }
});

app.post('/InsertCity', function(req, res){
  const {body} = req;
  InsertCity(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
});



app.put('/UpdateCity', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Update id not found!"})
  }
  else{
    UpdateInDb('City' , body)
    .then(result=>{
      res.status(200).send(result)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
  }
});

app.delete('/DeleteCity', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Delete id not found!"});
  }
  else{
    DeleteInDb('City' , body)
    .then(result=>{
      res.status(200).send(result);
    })
    .catch(err=>{
      res.status(500).send(err);
    });
  }
});


app.post('/AdminSignup', function(req, res){
  const {body} = req;
  AddUserAdmin(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
});


app.put('/UpdateProfileAdmin', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Update id not found!"})
  }
  else{
    UpdateInDb('Users' , body)
    .then(result=>{
      res.status(200).send(result)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
  }
});


app.post('/LoginForPortal', function(req, res){
  const {body} = req;
  LoginPortal(body)
    .then(result=>{
      res.status(200).send(result);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

app.delete('/DeleteAdminUser', function(req, res){
  let {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Delete id not found!"});
  }
  else{
    const {Id} = body;
    body._id = parseInt(Id);
    body.UserTypeId = 1;
    delete body.Id;
    console.log(body)
    FindInDb('Users', body)
    .then(next=>{
      body.Id = Id;
      delete body._id;
      delete body.UserTypeId;
      DeleteInDb('Users' , body)
      .then(result=>{
        res.status(200).send(result);
      })
      .catch(err=>{
        res.status(500).send(err);
      });
    })
    .catch(err=>{
      res.status(500).send({Code:"01", Message:"User not found or not a admin user!"});
    });
  }
});




app.post('/InsertBook', function(req, res){
  const {
    Pdf,
    CoverImage
  } = req.files;
  const {
    Name
  } = req.body;
  if(Pdf && CoverImage && Name){
    InsertBook({
      Pdf,
      CoverImage,
      Name,
      __dirname
    }).then((result)=>res.status(200).send(result))
    .catch((err)=> res.status(500).send(err))
  }
});




/// Get Lists
app.get('/GetCities', function(req, res){
  FindInDb('City', {})
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
});

app.get('/GetSpecialities', function(req, res){
  FindInDb('Speciality', {})
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
});

app.get('/GetAdminUser', function(req, res){
  FindInDb('Users', {UserTypeId:1})
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
});



app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});