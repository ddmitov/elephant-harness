"use strict";

// elephant-harness npm test

// Load the elephant-harness package:
const elephantHarness = require("../src/elephant-harness.js");

// Determine the operating system and initialize a suitable "path" object:
let os = require("os");
let platform = os.platform();

let path;
if (platform !== "win32") {
  path = require("path").posix;
} else {
  path = require("path").win32;
}

// Compose the full path of the Perl test script:
let phpTestScriptFullPath = path.join(__dirname, "elephant-harness-test.php");

// Initialize the PHP test script object:
let phpTestScript = {};
phpTestScript.interpreter = "php";
phpTestScript.scriptFullPath = phpTestScriptFullPath;

// phpTestScript.requestMethod = "GET";
// phpTestScript.inputData = "test";

// The following interpreter switches are added only for testing purposes:
// -e  Generate extended information for debugger/profiler
// -H  Hide any passed arguments from external tools
let interpreterSwitches = [];
interpreterSwitches.push("-e");
interpreterSwitches.push("-H");
phpTestScript.interpreterSwitches = interpreterSwitches;

phpTestScript.stdoutFunction = function(stdout) {
  console.log(`elephant-harness STDOUT test: ${stdout}`);
};

phpTestScript.stderrFunction = function(stderr) {
  console.log(`elephant-harness STDERR test: ${stderr}`);
};

phpTestScript.errorFunction = function(error) {
  // console.log(`elephant-harness error stack: ${error.stack}`);
  // console.log(`elephant-harness error code: ${error.code}`);
  // console.log(`elephant-harness received signal: ${error.signal}`);

  if (error && error.code === "ENOENT") {
    console.log("PHP interpreter was not found.");
  }
};

phpTestScript.exitFunction = function(exitCode) {
  console.log(`elephant-harness test script exit code is ${exitCode}`);
};

// Start the PHP test script:
elephantHarness.startScript(phpTestScript);
