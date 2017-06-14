'use strict';

// elephant-harness test

// Load the elephant-harness package:
var elephantHarness = require("../elephant-harness.js");

// Determine the operating system and initialize a suitable 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== "win32") {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Compose the full path of the Perl test script:
var phpTestScriptFullPath = path.join(__dirname, "elephant-harness-test.php");

// Initialize the PHP test script object:
var phpTestScript = {};
phpTestScript.interpreter = "php";
phpTestScript.scriptFullPath = phpTestScriptFullPath;

// The following interpreter switches are added only for testing purposes:
// -e  Generate extended information for debugger/profiler
// -H  Hide any passed arguments from external tools
var interpreterSwitches = [];
interpreterSwitches.push('-e');
interpreterSwitches.push('-H');
phpTestScript.interpreterSwitches = interpreterSwitches;

phpTestScript.stdoutFunction = function(stdout) {
  console.log('elephant-harness STDOUT test: ' + stdout);
};

phpTestScript.stderrFunction = function(stderr) {
  console.log('elephant-harness STDERR test: ' + stderr);
};

phpTestScript.errorFunction = function(error) {
  if (error && error.code === 'ENOENT') {
    console.log('PHP interpreter was not found.');
  }
};

phpTestScript.exitFunction = function(exitCode) {
  console.log('elephant-harness PHP test script exited with exit code ' +
    exitCode);
};

// Start the PHP test script:
elephantHarness.startScript(phpTestScript);
