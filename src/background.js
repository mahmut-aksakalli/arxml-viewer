'use strict'

const {globalShortcut , ipcMain, Menu, MenuItem} = require('electron');
const { readFileSync, writeFile, readFile} = require('fs') // used to read files
let parser = require('fast-xml-parser');
//let j2xParser = require("fast-xml-parser").j2xParser;
const path = require('path');

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win  = new BrowserWindow({
    show: false,
    minWidth : 700,
    minHeight: 600,
    icon: path.join(__static, '../src/assets/logo.ico'),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true
    }
  });

  win.maximize();
  win.show();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('focus', () => {
    globalShortcut.register('CommandOrControl+F', () => win.webContents.send('on-find'))
  })
  win.on('blur', () => {
    globalShortcut.unregister('CommandOrControl+F')
  })
}

// function to read from a json file
function readAndParseXML (file_path) {

  const parserOptions = {
    attributeNamePrefix : "@_",
    ignoreAttributes : false,
    ignoreNameSpace: false,
    parseNodeValue : false,
    parseAttributeValue : false
    };
  const revparserOptions = {
    attributeNamePrefix : "@_",
    ignoreAttributes : false,
    ignoreNameSpace: false,
    format:true,
    supressEmptyNode: true,
    indentBy: "\t"
  };
  try{  
    const RootJson = parser.parse(
                      readFileSync(file_path, 'utf8'),
                      parserOptions);

    return JSON.stringify(RootJson);
     
  } catch(err){
    console.log(err.message);
    return '{"FILE-READ-ERROR":"true"}';
}                
}

// event listener for file open request
ipcMain.on('file-open-request', (event, arg) => {
  event.returnValue = readAndParseXML(arg)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
