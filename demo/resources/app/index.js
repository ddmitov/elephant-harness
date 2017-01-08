'use strict';

// elephant-harness demo for Electron and NW.js

// Load the elephant-harness package:
const elephantHarness = require('./elephant-harness/elephant-harness.js');

// Determine the operating system and initialize 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== 'win32') {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Get the full path of the directory where Electron or NW.js binary is located:
var binaryPath = process.execPath;
var binaryDirectory = path.dirname(binaryPath);

// Get the full path of the application root directory:
var applicationDirectory = path.join(binaryDirectory, 'resources', 'app');

// Start the test script:
function startTestScript() {
  var testScriptFullPath =
      path.join(applicationDirectory, 'php-cgi', 'phpinfo.php');

  var testScriptOutput = '';

  var testScriptObject = new Object();
  testScriptObject.interpreter = phpInterpreter;
  testScriptObject.scriptFullPath = testScriptFullPath;
  testScriptObject.interpreterSwitches = '-q';

  testScriptObject.stdoutFunction = function(stdout) {
    testScriptOutput = testScriptOutput + stdout;
  };

  testScriptObject.exitFunction = function(stdout) {
    document.write(testScriptOutput);
  };

  elephantHarness.startScript(testScriptObject);
}
