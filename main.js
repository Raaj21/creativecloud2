// Modules to control application life and create native browser window

const {app, BrowserWindow, Tray, Menu, MenuItem, globalShortcut, ipcMain} = require('electron')
var servers = require("./server");
var queries = require("./dao/queries");
var path = require('path')
const url = require('url')
var fs = require('fs');
const os = require('os');
var dateTime = require('node-datetime');
var admin = require("firebase-admin");
var serviceAccount = require("./pollutionuc-firebase.json");
const { autoUpdater } = require('electron-updater');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app, creativeInfix_dir)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

global.creativeInfix_Info_g = {};  
global.creativeInfix_User_g = {};  
console.log(__dirname)
var iconpath = path.join(__dirname, 'favicon.ico');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('d0426ce9-cc19-4c32-a24e-bc7c2be23b42');

var dt = dateTime.create();
var date = dt.format('dmY');

var creativeInfix_dir = os.homedir().toString()+"/Creativeinfix"; 
if (!fs.existsSync(creativeInfix_dir)){fs.mkdirSync(creativeInfix_dir);} 
var creativeInfix_dir_dummy = os.homedir().toString()+"/Creativeinfix/dummy.txt"; 
fs.writeFileSync(creativeInfix_dir_dummy, "", function (err) {
  if (err) throw err;
  console.log('Date Saved!');
});
var creativeInfix_dir_logger = os.homedir().toString()+"/Creativeinfix/logger.txt"; 
var logger = fs.createWriteStream( creativeInfix_dir_logger, {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
var creativeInfix_Info = os.homedir().toString()+"/Creativeinfix/creativeInfix_Info.txt";   
var creativeInfix_date = os.homedir().toString()+"/Creativeinfix/creativeInfix_"+ date +".txt";
var creativeInfix_key = os.homedir().toString()+"/Creativeinfix/key.txt"; 
var creativeInfix_user = os.homedir().toString()+"/Creativeinfix/creativeInfix_user.txt"; 

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

const template = [
  {
     label: 'File',
     submenu: [
        {
          label: 'Home',
          click: function () {
            //mainWindow.loadURL('file://' + __dirname + '/index.html');
            mainWindow.loadURL(url.format({
              pathname: path.join(__dirname, 'index.html'),
              protocol: 'file:',
              slashes: true
            }));
          }
        },
        {
          label: 'Quit',
          click: function () {
            app.quit()
          }
        }
     ]
  },  
  {
     label: 'About',
     submenu: [
        {
          label: 'Activated',
          click: function () {
            //mainWindow.loadURL('file://' + __dirname + '/activated.html');
            mainWindow.loadURL(url.format({
              pathname: path.join(__dirname, 'activated.html'),
              protocol: 'file:',
              slashes: true
            }));
          }
        },
        {
           label: 'License',
           click: function () {
            //mainWindow.loadURL('file://' + __dirname + '/license.html');
            mainWindow.loadURL(url.format({
              pathname: path.join(__dirname, 'license.html'),
              protocol: 'file:',
              slashes: true
            }));
          }
        },
        {
           label: 'Reset',
           click: function () {
              fs.unlinkSync(creativeInfix_Info);
              fs.unlinkSync(creativeInfix_date);
              fs.unlinkSync(creativeInfix_key);
              fs.unlinkSync(creativeInfix_user);
              app.quit()
          }
        }
     ]
  }
]

const templateA = [
  {
     label: 'File',
     submenu: [
        {
          label: 'Quit',
          click: function () {
            app.quit()
          }
        },
        {
          label: 'Reset',
          click: function () {
             fs.unlinkSync(creativeInfix_Info);
             fs.unlinkSync(creativeInfix_date);
             fs.unlinkSync(creativeInfix_key);
             fs.unlinkSync(creativeInfix_user);
             app.quit()
         }
        }
     ]
  }
]







function createWindow () {
  
  /*
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Shift+X', () => {
    console.log('CommandOrControl+Shift+X is pressed ')
    queries.allowExecuteFunction();
  })
  if (!ret) {
    console.log('registration failed')
  }
  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Shift+X'))
  */

  let trayIcon = new Tray(iconpath);
  const trayMenuTemplate = [
    {
      label: 'Show',
      click: function () {
          mainWindow.show();
      }
    },    
    {
      label: 'Quit',
      click: function () {
        app.quit()
      }
    }
  ]
  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  trayIcon.setToolTip('cloud')
  trayIcon.setContextMenu(trayMenu);

   // Create the browser window.
   mainWindow = new BrowserWindow({
    icon: iconpath,
    width: 430,
    height: 650,
    title: "CreativeCloud",
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });

 

  fs.exists(creativeInfix_date, function(exists) {
    console.log(creativeInfix_date);
    
    logger.write('creativeInfix_date ' +creativeInfix_date);
    
    if(!exists){
      const timeoutObj = setTimeout(() => {
        console.log('timeout beyond time');
        mainWindow.show();
      }, 5000);
      
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://pollutionuc.firebaseio.com"
        });
      }
      var dbf = admin.firestore();
      var infoRef = dbf.collection('newpuc').doc('INFO');
      infoRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document INFO!');
          } else {
            const jsonStr = JSON.stringify(doc.data());
            creativeInfix_Info_g = doc.data();
            //console.log('Firebase Document data:', jsonStr);
            console.log('Firebase Document data loaded1');
            const encryptedString = cryptr.encrypt(jsonStr);
              fs.writeFileSync(creativeInfix_Info, encryptedString, function (err) {
                if (err) throw err;
                console.log('INFO Saved!');              
              });
  
              fs.writeFileSync(creativeInfix_date, "", function (err) {
                if (err) throw err;
                console.log('Date Saved!');
              });

              fs.exists(creativeInfix_user, function(existsU) {
                if(existsU){
                  var OgbufferU = fs.readFileSync(creativeInfix_user);            
                  if(OgbufferU.length>10){
                    const ogDecryptedStringU = cryptr.decrypt(OgbufferU.toString());
                    console.log("load user file :", ogDecryptedStringU);
                    var jsonObjU = JSON.parse(ogDecryptedStringU);
                    var infoRefUser = dbf.collection('newpuc').doc(jsonObjU.center_code);
                    infoRefUser.get()
                        .then(docU => {
                          if (!docU.exists) {
                            console.log('No such document User1!'+ jsonObjU.center_code);
                          } else {
                            const jsonStrU = JSON.stringify(docU.data());
                            console.log('Firebase Document data loaded '+ jsonStrU);
                            creativeInfix_User_g = docU.data();
                            //if(creativeInfix_User_g.mcode != jsonObjU.mcode || creativeInfix_User_g.status != jsonObjU.status){
                            if(creativeInfix_User_g.mcode != jsonObjU.mcode){
                              console.log('Not Matched');
                              fs.unlinkSync(creativeInfix_Info);
                              fs.unlinkSync(creativeInfix_date);
                              fs.unlinkSync(creativeInfix_key);
                              fs.unlinkSync(creativeInfix_user);
                              app.quit()
                            }else{ 
                              if(!creativeInfix_User_g.status){
                                fs.unlinkSync(creativeInfix_date);
                                app.quit()
                              }
                              console.log('Matched :'+creativeInfix_User_g.status);                              
                            }                            
                          }
                        });
                  }
                }
              });
              checkKey();
          }
        })
        .catch(err => {
          logger.write('Error getting document ' +err);
          console.log('Error getting document', err);
        });
      }else{
        fs.exists( creativeInfix_Info, function(existsC) {
          if(existsC){
            var Ogbuffer = fs.readFileSync(creativeInfix_Info);            
            if(Ogbuffer.length>10){
              const ogDecryptedString = cryptr.decrypt(Ogbuffer.toString());
              console.log("load info file :", ogDecryptedString);
              var jsonObj = JSON.parse(ogDecryptedString);                
              creativeInfix_Info_g = jsonObj;
              fs.exists(creativeInfix_user, function(existsU) {
                  if(existsU){
                    var OgbufferU = fs.readFileSync(creativeInfix_user);            
                    if(OgbufferU.length>10){
                      const ogDecryptedStringU = cryptr.decrypt(OgbufferU.toString());
                      console.log("load user file :", ogDecryptedStringU);
                      var jsonObjU = JSON.parse(ogDecryptedStringU);
                      creativeInfix_User_g = jsonObjU;  
                      checkKey();                            
                    }
                  }else{
                    checkKey();
                  }
                });      
            }
          }
        });      
      }
    });

 
  function checkKey(){
      var isValid = false;
      try{  
      fs.exists(creativeInfix_key, function(exists) {
        if(exists){
          var buffer = fs.readFileSync(creativeInfix_key);
          if(buffer.length>10){
            const decryptedString = cryptr.decrypt(buffer.toString());
            if(decryptedString == creativeInfix_Info_g.a_key){
               isValid = true;
            }              
          }
          loadPage(isValid);
        }else{
          loadPage(isValid);
        }
      });
    }catch(e){
      console.log(e);
      loadPage(isValid);
    }
  }

  function loadPage(isValid){
      if(isValid){
        console.log("load : index");
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
        //mainWindow.loadURL('file://' + __dirname + '/index.html');     
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true
        }));   
      }else{
        console.log("load : activate");
        const menu = Menu.buildFromTemplate(templateA)
        Menu.setApplicationMenu(menu)
        //mainWindow.loadURL('file://' + __dirname + '/activate.html');
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, 'activate.html'),
          protocol: 'file:',
          slashes: true
        }));
      }     
      mainWindow.show();
      servers.createCustomServer();
  }
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.    
    mainWindow = null;
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide();
  })

  /*mainWindow.on('show', function () {
      trayIcon.setHighlightMode('always');
  })*/
}
/*
const sendStatusToWindows = (text, toshow) => {
  logger.write(text);
  if(mainWindow && toshow){
    mainWindow.webContents.send('message', text);
  }
};
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindows('checking-for-update', false);
});
autoUpdater.on('update-available', () => {
  //sendStatusToWindows('Update Available', true);
});
autoUpdater.on('update-not-available', () => {
  sendStatusToWindows('update_not_available', false);
});
autoUpdater.on('error', err => {
  sendStatusToWindows(`Error auto update: ${err.toString()}`, false);
});
autoUpdater.on('downloade-progress', obj => {
  sendStatusToWindows(`Downloaded speed: ${obj.bytesPerSecond} - Downloading ${obj.percent}% `, true);
});
autoUpdater.on('update-downloaded', () => {
  sendStatusToWindows('update downloaded will install now', true);
  autoUpdater.quitAndInstall();
});
*/
//app.on('ready', createWindow);
app.on('ready', () => {
  createWindow();
  /*const data = {
    'provider': 'github',
    'owner':    'CreativeCloudMode',
    'repo':     'cloudmode',
    'token':    'f224798f9bae57f01480ca4c48d86890c4dd7289'
  };
  autoUpdater.setFeedURL(data);
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();*/
});



// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
/*
app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+X')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
*/
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function handleSquirrelEvent(application, creativeInfix_dir) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);
          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated
          if(application!=undefined){
            application.quit();
          }
          return true;
  }
};