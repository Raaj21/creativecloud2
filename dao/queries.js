var dateTime = require('node-datetime');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('d0426ce9-cc19-4c32-a24e-bc7c2be23b42');
const os = require('os');
var fs = require('fs');
var allowExecute = false;

var creativeInfix_dir = os.homedir().toString()+"/Creativeinfix";    
if (!fs.existsSync(creativeInfix_dir)){fs.mkdirSync(creativeInfix_dir);} 
var creativeInfix_key = os.homedir().toString()+"/Creativeinfix/key.txt"; 
var creativeInfix_user = os.homedir().toString()+"/Creativeinfix/creativeInfix_user.txt"; 
var admin = require("firebase-admin");
var serviceAccount = require("../pollutionuc-firebase.json");
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pollutionuc.firebaseio.com"
  });
}

var petrolValue = 1;
var dieselValue = 1;
var rpmbs4 = 0;

function allowExecuteFunction(){
  allowExecute = true;
}

  const validateKey = (request, response) => {
    var key = request.body.password;
    var centercode = request.body.center_code;
    var milliseconds = new Date().getTime();
    var userJsonObj = {
      mcode : milliseconds,
      center_code :  centercode,
      petrol_username:  request.body.petrol_username,
      petrol_password : request.body.petrol_password,
      diesel_username:  request.body.diesel_username,
      diesel_password : request.body.diesel_password,
      status: true
    }
        console.log(key ," == ", creativeInfix_Info_g.a_key);    
          if(key == creativeInfix_Info_g.a_key){
            const encryptedString = cryptr.encrypt(key);
            fs.writeFile(creativeInfix_key, encryptedString, function (err) {
              if (err) throw err;
              
              var dbf = admin.firestore();
              var docRef = dbf.collection('newpuc').doc(centercode);
              docRef.set(userJsonObj);
              const userJsonStr = JSON.stringify(userJsonObj);
              console.log('Firebase Save User data:', userJsonStr);
              const encryptedjsonStr = cryptr.encrypt(userJsonStr);
              fs.writeFile(creativeInfix_user, encryptedjsonStr, function (err) {
                if (err) throw err;
                console.log('User Saved!');
                response.send({"status":"success"});
              });
              console.log('Key Saved!');
            });
          }else{
            response.send({"status":"error"});
          } 
  }

  const getPetrolValue = (request, response) => {
   // console.log(allowExecute);
   // if(allowExecute){
      fs.exists( creativeInfix_key, function(exists) {
        if(exists){
          var buffer = fs.readFileSync(creativeInfix_key);
          const decryptedString = cryptr.decrypt(buffer.toString());
          console.log("creativeInfix_Info_g.a_key : ",creativeInfix_Info_g.a_key)
          if(decryptedString == creativeInfix_Info_g.a_key){
            if(creativeInfix_User_g.status){
              //var value = request.params.value;
              var dt = dateTime.create();
              var date = dt.format('d-m-Y');
              console.log(date);
              var time = dt.format('H:M');
              console.log(time);
              var hc, co, co2, lv, lcov, o2;
              if(petrolValue == 1){
                rpmbs4 = 0;
                hc = generateRandomInteger(500, 4500);
                co = genRand(1, 3, 2);
                co2 = genRand(5, 20, 2);
                lv = genRand(1, 5, 2);
                lcov = genRand(3, 5, 2); 
                o2 = genRand(5, 20, 2); 
                petrolValue = 2;
              }else if(petrolValue == 2){
                hc = generateRandomInteger(200, 500);
                co = genRand(0, 0.4, 2);
                co2 = genRand(1, 4, 2);
                lv = genRand(0.97, 1.03, 2);
                lcov = genRand(0.01, 0.20, 5); 
                o2 = genRand(1, 6, 2);
                petrolValue = 3;
              }else if(petrolValue == 3){
                hc = generateRandomInteger(40, 190);
                co = genRand(0.1, 0.2, 2);
                co2 = genRand(1, 4, 2);
                rpmbs4 = generateRandomInteger(2300, 2500);
                lv = genRand(0.97, 1.03, 2);
                lcov = genRand(0.10, 0.28, 5); 
                o2 = genRand(1, 6, 2);
                petrolValue = 4;
              }else if(petrolValue == 4){
                hc = generateRandomInteger(40, 190);
                co = genRand(0.1, 0.2, 2);
                co2 = genRand(1, 4, 2);
                lv = genRand(0.97, 1.03, 2);
                lcov = genRand(0.01, 0.20, 5); 
                o2 = genRand(1, 6, 2); 
                petrolValue = 1;
              }
              response.set('Content-Type', 'application/json');
              response.set('Server', 'Microsoft-HTTPAPI/2.0');
              response.set('Access-Control-Allow-Origin', '*');
                response.send({

                "CO":  co,
              
                "CO2":  co2,
              
                "Date": date,
              
                "HC":  hc ,
              
                "Lambda":  lv ,
              
                "Lambda_CO":  lcov ,
              
                "O2":  o2 ,
              
                "RPM": rpmbs4,
              
                "Status": "OK",
              
                "Time": time,
              
                "Reserve": "8"
              
              })
              allowExecute = false;
            }else{
              response.send({});
            }
          }else{
            response.send({});
          }
        }else{
          response.send({});
        }
      });
   // }else{
     // response.send({});
   // }
  }

  const getDieselValue = (request, response) => { 
   // console.log(allowExecute);
   // if(allowExecute){
      fs.exists( creativeInfix_key, function(exists) {
        if(exists){
          var buffer = fs.readFileSync(creativeInfix_key);
          const decryptedString = cryptr.decrypt(buffer.toString());
          console.log("creativeInfix_Info_g.a_key : ",creativeInfix_Info_g.a_key)
          if(decryptedString == creativeInfix_Info_g.a_key){
          //var value = request.params.value;

          var dt = dateTime.create();
          var date = dt.format('d-m-Y');
          var time = dt.format('H:M');

          var t1_k, t1_i, t1_m;
          if(dieselValue == 1){
            t1_k = genRand(1, 2.1, 3);
            t1_i = generateRandomInteger(750, 1100);
            t1_m = generateRandomInteger(3300, 4900);
            dieselValue = 2;
          }else if(dieselValue == 2){
            t1_k = genRand(1, 1.5, 3);
            t1_i = generateRandomInteger(750, 1100);
            t1_m = generateRandomInteger(3300, 4900);
            dieselValue = 3;
          }else if(dieselValue == 3){
            t1_k = genRand(0.20, 0.5, 3);
            t1_i = generateRandomInteger(750, 1100);
            t1_m = generateRandomInteger(3300, 4900);
            dieselValue = 4;
          }else if(dieselValue == 4){
            t1_k = genRand(2.6, 3.5, 3);
            t1_i = generateRandomInteger(1000, 1500);
            t1_m = generateRandomInteger(5000, 7000);
            dieselValue = 1;
          }
          //var t1_k = genRand(0.10, 0.5, 3);
          var t1_o = generateRandomInteger(30, 50);
          var t1_f = "TR01;"+ (t1_k).toFixed(3) +";"+ t1_i +";"+ t1_m +";"+ t1_o;

          var t2_k = t1_k - genRand(0.010, 0.070, 3);
          var t2_i = t1_i - generateRandomInteger(20, 40);
          var t2_m = t1_m - generateRandomInteger(50, 100);
          var t2_o = t1_o - generateRandomInteger(1, 3);
          var t2_f = "TR02;"+ (t2_k).toFixed(3) +";"+ t2_i +";"+ t2_m +";"+ t2_o;

          var t3_k = t1_k - genRand(0.010, 0.070, 3);
          var t3_i = t1_i + generateRandomInteger(20, 30);
          var t3_m = t1_m + generateRandomInteger(50, 100);
          var t3_o = t1_o + generateRandomInteger(1, 3);
          var t3_f = "TR03;"+ (t3_k).toFixed(3) +";"+ t3_i +";"+ t3_m +";"+ t3_o;

          var a_k =  ((t1_k + t2_k + t3_k / 3)).toFixed(3);
          var a_k_f = "#TA;" + a_k;

          var tf_i =  t1_i - generateRandomInteger(1, 10);
          var tf_m =  t1_m + generateRandomInteger(70 , 100);
          var tf_o =  t1_o + generateRandomInteger(1 , 3);
          var tf_f =  "#PT;" + tf_i +";"+ tf_m +";"+ tf_o;
          
          response.set('Content-Type', 'application/json');
          response.set('Server', 'Microsoft-HTTPAPI/2.0');
          response.set('Access-Control-Allow-Origin', '*');
          

          response.send({
          
            "Date": date,
          
            "Test1":  t1_f,
          
            "Test2":  t2_f,

            "Test3":  t3_f,

            "Test_AVG":  a_k_f,

            "Test_Status":  "#TS0",

            "Flush_Cyl":  tf_f,
              
            "Status": "OK",
          
            "Time": time    
          
          })
          allowExecute = false
        }else{
          response.send({});
        }
      }else{
        response.send({});
      }
      });
   // }else{
     // response.send({});
   // }
  }

  function genRand(min, max, decimalPlaces) {  
      var rand = Math.random()*(max-min) + min;
      var power = Math.pow(10, decimalPlaces);
      return Math.floor(rand*power) / power;
  }

  function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random()*(max + 1 - min))
  }
  
  module.exports = {
    getPetrolValue,
    getDieselValue,
    validateKey,
    allowExecuteFunction
  }