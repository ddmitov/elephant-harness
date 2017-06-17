'use strict';

// elephant-harness version 0.8.2
// Node.js - Electron - NW.js controller for PHP scripts
// elephant-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 - 2017 Dimitar D. Mitov

// THE SOFTWARE IS PROVIDED "AS IS",
// WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Core dependencies:
// child_process
// fs

const spawn = require('child_process').spawn;
const filesystemObject = require('fs');

function checkScriptSettings(scriptObject) {
  var scriptSettingsOk = true;

  // PHP interpreter, PHP script full path and
  // name of the STDOUT handling function
  // are mandatory function parameter object properties.
  if (scriptObject.interpreter === undefined) {
    console.log('elephant-harness: PHP interpreter is not supplied.');
    scriptSettingsOk = false;
  }

  if (scriptObject.scriptFullPath === undefined) {
    console.log('elephant-harness: Script full path is not supplied.');
    scriptSettingsOk = false;
  }

  if (typeof scriptObject.stdoutFunction !== 'function') {
    console.log('elephant-harness: STDOUT handling function is not defined.');
    scriptSettingsOk = false;
  }

  // Check if script exists:
  if (scriptObject.scriptFullPath !== undefined) {
    try {
      filesystemObject.accessSync(scriptObject.scriptFullPath);
    } catch (exception) {
      console.log('elephant-harness: \n' +
                  scriptObject.scriptFullPath + ' was not found.');
      scriptSettingsOk = false;
    }
  }

  // If requestMethod is set, inputData or inputDataHarvester must also be set:
  if (scriptObject.requestMethod !== undefined &&
      scriptObject.inputData === undefined &&
      scriptObject.inputDataHarvester === undefined) {
    console.log('elephant-harness: Request method is ' +
                scriptObject.requestMethod + ', ' +
                'but input data can not be accessed.');
    scriptSettingsOk = false;
  }

  // If inputData or inputDataHarvester is set, requestMethod must also be set:
  if ((scriptObject.inputData !== undefined ||
      scriptObject.inputDataHarvester !== undefined) &&
      scriptObject.requestMethod === undefined) {
    console.log('elephant-harness: ' +
                'Input data is available, but request method is not set.');
    scriptSettingsOk = false;
  }

  return scriptSettingsOk;
}

function setScriptEnvironment(scriptObject) {
  // Script environment inherits Node environment:
  var scriptEnvironment = process.env;

  // Handle GET requests:
  if (scriptObject.requestMethod === 'GET') {
    scriptEnvironment.REQUEST_METHOD = 'GET';
    scriptEnvironment.QUERY_STRING = scriptObject.inputData;
  }

  // Handle POST requests:
  if (scriptObject.requestMethod === 'POST') {
    scriptEnvironment.REQUEST_METHOD = 'POST';
    scriptEnvironment.CONTENT_LENGTH = scriptObject.inputData.length;
  }

  return scriptEnvironment;
}

function setInterpreterArguments(scriptObject) {
  var interpreterArguments;

  if (scriptObject.interpreterSwitches !== undefined &&
      Array.isArray(scriptObject.interpreterSwitches)) {
    interpreterArguments = scriptObject.interpreterSwitches;
  } else {
    interpreterArguments = [];
  }

  // The full path of the script is the minimal interpreter argument:
  interpreterArguments.push(scriptObject.scriptFullPath);
  return interpreterArguments;
}

module.exports.startScript = function(scriptObject) {
  if (checkScriptSettings(scriptObject) === false) {
    return;
  }

  // If inputData is not defined and inputDataHarvester function is available,
  // it is used as an alternative input data source:
  if (scriptObject.inputData === undefined &&
      typeof scriptObject.inputDataHarvester === 'function') {
    scriptObject.inputData = scriptObject.inputDataHarvester();
  }

  // Set script environment:
  var scriptEnvironment = setScriptEnvironment(scriptObject);

  // Compose all interpreter arguments:
  var interpreterArguments = setInterpreterArguments(scriptObject);

  // Run the supplied script:
  scriptObject.scriptHandler =
    spawn(scriptObject.interpreter,
      interpreterArguments,
      {env: scriptEnvironment}
    );

  // Send POST data to the script:
  if (scriptObject.requestMethod === 'POST') {
    scriptObject.scriptHandler.stdin.write(scriptObject.inputData + '\n');
  }

  // Handle script errors:
  scriptObject.scriptHandler.on('error', function(error) {
    if (typeof scriptObject.errorFunction === 'function') {
      scriptObject.errorFunction(error);
    } else {
      console.log('elephant-harness error stack: ' + error.stack);
      console.log('elephant-harness error code: ' + error.code);
      console.log('elephant-harness received signal: ' + error.signal);
    }
  });

  // Handle STDOUT:
  scriptObject.scriptHandler.stdout.on('data', function(data) {
    scriptObject.stdoutFunction(data.toString('utf8'));
  });

  // Handle STDERR:
  scriptObject.scriptHandler.stderr.on('data', function(data) {
    if (typeof scriptObject.stderrFunction === 'function') {
      scriptObject.stderrFunction(data.toString('utf8'));
    }
  });

  // Handle script exit:
  scriptObject.scriptHandler.on('exit', function(exitCode) {
    if (typeof scriptObject.exitFunction === 'function') {
      scriptObject.exitFunction(exitCode);
    }
  });
};
