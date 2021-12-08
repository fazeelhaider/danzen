
const fs = require('fs');
const { uuid } = require('uuidv4');
const { AddCounter } = require('./AddCounter');

const {
    CheckMandatory, 
    InsertInDb,
    UpdateInDb,
    CheckNullAndEmpty,
    CheckIfExist,
    FindInDb
} = require('./libs');

const MFDoctorSignup = [
    'Name',
    'PhoneNumber',
    'Email',
    'ClinicName',
    'CityId',
    'SpecialityId',
    'UserTypeId',
    'Password'
];

const MFAdminSignup = [
    'Name',
    'Email',
    'UserTypeId',
    'Password'
]



const MFLogin = [
    'PhoneNumber',
    'Password'
]

const MFLoginPortal = [
    'Email',
    'Password'
]

const MFSpeciality = [
    'Name',
]

const MFCity = [
    'Name',
]

function AddUserDoctor(Body){
    return new Promise((res, rej)=>{
        Body.UserTypeId = 2;
        CheckMandatory(Body, MFDoctorSignup)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Users', {$or: [ {PhoneNumber: Body.PhoneNumber } , {Email: Body.Email} ]})
            .then(NotFound=>{
                AddCounter('Users').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Users', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function AddUserAdmin(Body){
    return new Promise((res, rej)=>{
        Body.UserTypeId = 1;
        CheckMandatory(Body, MFAdminSignup)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Users',  {Email: Body.Email})
            .then(NotFound=>{
                AddCounter('Users').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Users', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function InsertSpeciality(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFSpeciality)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Speciality', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('Speciality').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Speciality', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function InsertCity(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFCity)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('City', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('City').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('City', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function Login(Body){
    return new Promise((res, rej)=>{
    Body.UserTypeId = 2;
    CheckMandatory(Body, MFLogin)
    .then(next=>{
        CheckNullAndEmpty(Body)
    .then(next=>{
        FindInDb('Users', Body)
        .then(next=>{
            res({Code:"00", Message:"Login successfully!"})
        })
        .catch(err=>{
            rej({Code:"01", Message:"Login Failed!"})
        });
    })
    .catch(err=>{
        rej(err)
    });
    })
    .catch(err=>{
        rej(err)
    });
    })
}

function LoginPortal(Body){
    return new Promise((res, rej)=>{
    Body.UserTypeId = 1;
    CheckMandatory(Body, MFLoginPortal)
    .then(next=>{
        CheckNullAndEmpty(Body)
    .then(next=>{
        FindInDb('Users', Body)
        .then(next=>{
            res({Code:"00", Message:"Login successfully!"})
        })
        .catch(err=>{
            rej({Code:"01", Message:"Login Failed!"})
        });
    })
    .catch(err=>{
        rej(err)
    });
    })
    .catch(err=>{
        rej(err)
    });
    })
}

function InsertBook(data){
    return new Promise( async (res, rej)=>{
    const{
    Pdf,
    CoverImage,
    Name,
    __dirname
    } = data;
    const PdfURL =  await UploadSingleFile(Pdf, __dirname);
    const CoverImageURL = await UploadSingleFile(CoverImage, __dirname);
    if(PdfURL && CoverImageURL){
        AddCounter('Books').then((result)=>{
            const {
              WillLastId
            } = result;
            const Body = {
                PdfURL,
                CoverImageURL,
                Name,
                _id:WillLastId
            };
            InsertInDb('Books', Body)
            .then(result=>{
                res(result)
            })
            .catch(err=>{
                rej(err)
            })
           }).catch((err)=>rej(err))
    }
    else{
        rej({Code:"01", Message:`Error in Uploading file, ${PdfURL}, ${CoverImageURL}` })
    }
 
    })
}


function UploadSingleFile(File, __dirname){
    return new Promise((res, rej)=>{
        AddCounter('Uploads').then((result)=>{
            const {
                WillLastId
              } = result;
            const Path = `Uploads/${WillLastId}-${File.name}`;
            File.mv(Path, function(err) {
                if (!err){
                    res(Path);
                }
                else{
                    rej(null)
                }
              });
           }).catch((err)=>rej(err))
        
        })
}
function AddHostInBooks(arr, host){
    const NewArray = [];
    return new Promise((resolve,reject)=>{
        arr.map((Val, index)=>{
            Val.CoverImageURL = `${host}${Val.CoverImageURL}`;
            Val.PdfURL = `${host}${Val.PdfURL}`;
            NewArray.push(Val)
            if(arr.length == index+1){
                resolve(NewArray)
            }
        })
    })
}
module.exports = {
    AddUserDoctor,
    Login,
    InsertSpeciality,
    InsertCity,
    AddUserAdmin,
    LoginPortal,
    InsertBook,
    AddHostInBooks
}
