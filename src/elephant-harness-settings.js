'use strict';

// elephant-harness
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

const filesystemObject = require('fs');

module.exports.checkSettings = function(script) {
  var scriptSettingsOk = true;

  // PHP interpreter, PHP script full path and
  // name of the STDOUT handling function
  // are mandatory function parameter object properties.
  if (script.interpreter === undefined) {
    console.log('elephant-harness: PHP interpreter is not supplied.');
    scriptSettingsOk = false;
  }

  if (script.scriptFullPath === undefined) {
    console.log('elephant-harness: Script full path is not supplied.');
    scriptSettingsOk = false;
  }

  if (typeof script.stdoutFunction !== 'function') {
    console.log('elephant-harness: STDOUT handling function is not defined.');
    scriptSettingsOk = false;
  }

  // Start script existence check:
  if (script.scriptFullPath !== undefined &&
      checkScriptExistence(script.scriptFullPath) === false) {
    scriptSettingsOk = false;
  }

  // If requestMethod is set, inputData or inputDataHarvester must also be set:
  if (script.requestMethod !== undefined &&
      script.inputData === undefined &&
      script.inputDataHarvester === undefined) {
    console.log('elephant-harness: Request method is ' +
                script.requestMethod + ', ' +
                'but input data can not be accessed.');
    scriptSettingsOk = false;
  }

  // If inputData or inputDataHarvester is set, requestMethod must also be set:
  if ((script.inputData !== undefined ||
      script.inputDataHarvester !== undefined) &&
      script.requestMethod === undefined) {
    console.log('elephant-harness: ' +
                'Input data is available, but request method is not set.');
    scriptSettingsOk = false;
  }

  return scriptSettingsOk;
};

function checkScriptExistence(scriptFullPath) {
  var scriptExists = true;

  try {
    filesystemObject.accessSync(scriptFullPath);
  } catch (exception) {
    console.log('elephant-harness: ' + scriptFullPath + ' not found.');
    scriptExists = false;
  }

  return scriptExists;
}
