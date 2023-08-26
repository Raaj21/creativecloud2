const express = require('express');
const bodyParser = require('body-parser')
const i3sys = express();
const massp = express();
const massd = express();
const nitel = express();
const ozone = express();
const avl = express();
const mvl = express();
const utkl = express();

const db = require('./dao/queries');
const { dialog } = require('electron');
var isshowed = false;

const options = {
  type: 'error',
  buttons: ['ok'],
  defaultId: 2,
  title: 'Error',
  message: 'App already running or port may be used.',
};

function createCustomServer(){    
    createi3sysServer();
    createMassServer();
    createNitelServer();
    createOzoneServer();    
    createAVLServer();
    createUTKLServer();
    createMServer();
}

function createi3sysServer(){
  i3sys.use(bodyParser.json())
  i3sys.use(
      bodyParser.urlencoded({
        extended: true,
      })
    )
    i3sys.get('/status', (req, res) => {
      res.send('Its gud!');
    });

    i3sys.get('/i3sys/gas',  db.getPetrolValue);
    i3sys.get('/i3sys/smoke',  db.getDieselValue);

    i3sys.post('/validatekey',  db.validateKey)

    i3sys.listen(5555, () => {
      console.log('Example i3sys listening on port 5555!');
    }).on('error', function(err) {
      if(err.errno === 'EADDRINUSE'){
        errorHandle(5555);
      }
    });  
}

function createMassServer(){
  //MASS 3004, 3005
  massp.use(bodyParser.json())
  massp.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  massp.get('/MARSMN05',  db.getPetrolValue)
  massp.get('/status', (req, res) => {
    res.send('Its gud!');
  });
  massp.listen(3004, () => {
    console.log('Example massp listening on port 3004!');
  }).on('error', function(err) {
    if(err.errno === 'EADDRINUSE'){
      errorHandle(3004);
    }
  });  

  massd.use(bodyParser.json())
  massd.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  massd.get('/MARSSM05',  db.getDieselValue);
  massd.get('/status', (req, res) => {
    res.send('Its gud!');
  });
  massd.listen(3005, () => {
    console.log('Example massd listening on port 3005!');
  }).on('error', function(err) {
    if(err.errno === 'EADDRINUSE'){
      errorHandle(3005);
    }
  });  

}

function createNitelServer(){
   
   //nitelp 5080
   nitel.use(bodyParser.json())
   nitel.use(
     bodyParser.urlencoded({
       extended: true,
     })
   )
   nitel.get('/api/PUCTestEquipmentManufacturer.asmx/Model',  db.getPetrolValue)
   nitel.get('/api/PUCTestEquipmentManufacturer.asmx/SMeter',  db.getDieselValue)
   nitel.get('/status', (req, res) => {
     res.send('Its gud!');
   });   

   nitel.listen(5080, () => {
     console.log('Example nitel listening on port 5080!');
   }).on('error', function(err) {
     if(err.errno === 'EADDRINUSE'){
       errorHandle(5080);
     }
   }); 

}

function createOzoneServer(){
  
  ozone.use(bodyParser.json())
  ozone.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  ozone.get('/api/OZONE/OZ-GAS-05/',  db.getPetrolValue)
  ozone.get('/api/OZONE/OZ-SMOKE-02/',  db.getDieselValue);
  ozone.get('/status', (req, res) => {
    res.send('Its gud!');
  });
  ozone.listen(8585, () => {
    console.log('Example ozone listening on port 8585!');
  }).on('error', function(err) {
    if(err.errno === 'EADDRINUSE'){
      errorHandle(8585);
    }
  });  
 
  
}

 
function createMServer(){
  mvl.use(bodyParser.json())
  mvl.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  mvl.get('/api/ecogas100',  db.getPetrolValue);
  mvl.get('/api/ecosmoke100',  db.getDieselValue);

  //Airvisor
  mvl.get('/gas/api/data',  db.getPetrolValue);
  mvl.get('/smoke/api/data',  db.getDieselValue);

  mvl.get('/status', (req, res) => {
    res.send('Its gud!');
  });
  mvl.listen(29985, () => {
    console.log('Example m listening on port 29985!');
  }).on('error', function(err) {
    if(err.errno === 'EADDRINUSE'){
      errorHandle(29985);
    }
  });  
  
}


function createAVLServer(){
  
  avl.use(bodyParser.json())
  avl.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  avl.get('/WebApi/AVLIndia/DIGAS444',  db.getPetrolValue)
  avl.get('/WebApi/AVLIndia/SMC437C',  db.getDieselValue);
  avl.get('/status', (req, res) => {
    res.send('Its gud!');
  });
  avl.listen(6969, () => {
    console.log('Example avl listening on port 6969!');
  }).on('error', function(err) {
    if(err.errno === 'EADDRINUSE'){
      errorHandle(6969);
    }
  });  
  
}

function createUTKLServer(){

  utkl.use(bodyParser.json())
  utkl.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  //utkl.get('/services/api/utkalelectronics?model=ndg15',  db.getPetrolValue)
  //utkl.get('/services/api/utkalelectronics?model=sss15',  db.getDieselValue);
  utkl.get('/services/api/utkalelectronics',  function(req, res) {
    var model = req.query.model;
    if(model == "ndg15"){
      db.getPetrolValue(req, res);
    }else if(model == "sss15"){
      db.getDieselValue(req, res);
    }
  });
  
  utkl.get('/status', (req, res) => {
    res.send('Its gud!');
  });
  utkl.listen(8190, () => {
    console.log('Example utkl listening on port 8190!');
  }).on('error', function(err) {
    if(err.errno === 'EADDRINUSE'){
      errorHandle(8190);
    }
  });  
  
}

var errorHandle= function(port){
  console.log("errorHandle alreadyrunning port :"+port)
  if(!isshowed){
    dialog.showMessageBox(null, options);
    //console.log(response);
    isshowed=true;
  }
}

module.exports = {
  createCustomServer
}