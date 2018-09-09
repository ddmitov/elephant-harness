"use strict";

// elephant-harness npm test

// elephant-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 - 2018 Dimitar D. Mitov

// THE SOFTWARE IS PROVIDED "AS IS",
// WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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

// Compose the full path of the PHP test script:
let phpTestScriptFullPath = path.join(__dirname, "elephant-harness-test.php");

// PHP test script settings:
let phpTestScript = {};
phpTestScript.interpreter = "php";
phpTestScript.script = phpTestScriptFullPath;

// The following interpreter switches are added only for testing purposes:
// -e  Generate extended information for debugger/profiler
// -H  Hide any passed arguments from external tools
let interpreterSwitches = [];
interpreterSwitches.push("-e");
interpreterSwitches.push("-H");
phpTestScript.interpreterSwitches = interpreterSwitches;

phpTestScript.stdoutFunction = function(stdout) {
  console.log(stdout);
};

phpTestScript.errorFunction = function(error) {
  if (error && error.code === "ENOENT") {
    console.log("PHP interpreter was not found.");
  }
};

phpTestScript.exitFunction = function(exitCode) {
  console.log(`elephant-harness test script exit code is ${exitCode}`);
  console.log(" ");
};

// Start the PHP test script:
elephantHarness.startScript(phpTestScript);
