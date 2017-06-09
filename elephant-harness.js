'use strict';

// elephant-harness version 0.5.2
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
  // PHP interpreter, full path of the PHP script and
  // name of the STDOUT handling function
  // are mandatory function parameter object properties.
  if (scriptObject.interpreter === undefined ||
      scriptObject.scriptFullPath === undefined ||
      typeof scriptObject.stdoutFunction !== 'function') {
    console.log('PHP interpreter, script full path or ' +
                'STDOUT handling function name are not supplied.');
    return false;
  }

  // Check if the supplied script exists:
  filesystemObject.access(scriptObject.scriptFullPath, function(error) {
    if (error && error.code === 'ENOENT') {
      console.log(scriptObject.scriptFullPath + ' was not found.');
      return false;
    }
  });

  // If request method is set, form data must also be set and vice versa:
  if (scriptObject.method !== undefined &&
      scriptObject.formData === undefined) {
    console.log('Request method is ' + scriptObject.method + ', ' +
                'but form data is not supplied.');
    return false;
  }

  if (scriptObject.method === undefined &&
      scriptObject.formData !== undefined) {
    console.log('Form data is supplied, but request method is not set.');
    return false;
  }
}

module.exports.startScript = function(scriptObject) {
  var validScriptSettings = checkScriptSettings(scriptObject);
  if (validScriptSettings === false) {
    return;
  }

  // Script environment inherits Node environment:
  var scriptEnvironment = process.env;

  // Handle GET requests:
  if (scriptObject.method === 'GET') {
    scriptEnvironment.REQUEST_METHOD = 'GET';
    scriptEnvironment.QUERY_STRING = scriptObject.formData;
  }

  // Handle POST requests:
  if (scriptObject.method === 'POST') {
    scriptEnvironment.REQUEST_METHOD = 'POST';
    scriptEnvironment.CONTENT_LENGTH = scriptObject.formData.length;
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
  if (scriptObject.method === 'POST') {
    scriptObject.scriptHandler.stdin.write(scriptObject.formData);
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
