'use strict';

// elephant-harness demo for Electron and NW.js

// Load the elephant-harness package:
var elephantHarness = require('./elephant-harness/elephant-harness.js');

// Determine the operating system and initialize 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== "win32") {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Get the full path of the directory where Electron or NW.js binary is located:
var binaryPath = process.execPath;
var binaryDirectory = path.dirname(binaryPath);

// Get the full path of the application root directory:
var applicationDirectory = path.join(binaryDirectory, "resources", "app");

// PHP interpreter:
var perlInterpreter = "php-cgi";
if (platform === "win32") {
  // Check for a portable PHP interpreter:
  var portablePhp =
      path.join(binaryDirectory, "php", "php-cgi.exe");
  var filesystem = require('fs');
  if (filesystem.existsSync(portablePhp)) {
    perlInterpreter = portablePhp;
  }
}

// Start the test script:
function startTestScript() {
  var testScriptFullPath =
      path.join(applicationDirectory, "php", "phpinfo.php");

  var testScriptOutput = "";

  var testScript = new Object();
  testScript.interpreter = "php-cgi";
  testScript.scriptFullPath = testScriptFullPath;
  testScript.interpreterSwitches = "-q";

  testScript.stdoutFunction = function(stdout) {
    testScriptOutput = testScriptOutput + stdout;
  };

  testScript.exitFunction = function(stdout) {
    document.write(testScriptOutput);
  };

  elephantHarness.startScript(testScript);
}
