
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

module.exports = {
    AddUserDoctor,
    Login,
    InsertSpeciality,
    InsertCity,
    AddUserAdmin,
    LoginPortal
}
