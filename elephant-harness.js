'use strict';

// elephant-harness version 0.7.0
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
  // PHP interpreter, PHP script full path and
  // name of the STDOUT handling function
  // are mandatory function parameter object properties.
  if (scriptObject.interpreter === undefined ||
      scriptObject.scriptFullPath === undefined ||
      typeof scriptObject.stdoutFunction !== 'function') {
    console.log('PHP interpreter, script full path or ' +
                'STDOUT handling function name are not supplied.');
    return false;
  }

  // Check if script exists:
  filesystemObject.access(scriptObject.scriptFullPath, function(error) {
    if (error && error.code === 'ENOENT') {
      console.log(scriptObject.scriptFullPath + ' was not found.');
      return false;
    }
  });

  // If requestMethod is set, inputData or inputDataHarvester must also be set:
  if (scriptObject.inputData === undefined &&
      scriptObject.inputDataHarvester === undefined &&
      scriptObject.requestMethod !== undefined) {
    console.log('Request method is ' + scriptObject.requestMethod + ', ' +
                'but input data can not be accessed.');
    return false;
  }

  // If inputData is set, requestMethod must also be set:
  if (scriptObject.inputData !== undefined &&
      scriptObject.inputDataHarvester === undefined &&
      scriptObject.requestMethod === undefined) {
    console.log('Input data is available, but request method is not set.');
    return false;
  }
}

module.exports.startScript = function(scriptObject) {
  // Check script settings:
  var validScriptSettings = checkScriptSettings(scriptObject);
  if (validScriptSettings === false) {
    return;
  }

  // If inputData is not defined in the function parameter object,
  // inputDataHarvester function can be used as an alternative input data source:
  if (scriptObject.inputData === undefined &&
      scriptObject.requestMethod !== undefined &&
      typeof scriptObject.inputDataHarvester === 'function') {
    scriptObject.inputData = scriptObject.inputDataHarvester();
  }

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

  // The full path of the script is the minimal interpreter argument:
  var interpreterArguments = scriptObject.interpreterSwitches;
  interpreterArguments.push(scriptObject.scriptFullPath);

  // Run the supplied script:
  scriptObject.scriptHandler =
    spawn(scriptObject.interpreter,
      interpreterArguments,
      {env: scriptEnvironment}
    );

  // Send POST data to the script:
  if (scriptObject.requestMethod === 'POST') {
    scriptObject.scriptHandler.stdin.write(scriptObject.inputData);
  }

  // Log script handler errors:
  scriptObject.scriptHandler.on('error', function(error) {
    console.log('camel-harness error stack: ' + error.stack);
    console.log('camel-harness error code: ' + error.code);
    console.log('camel-harness received signal: ' + error.signal);
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
