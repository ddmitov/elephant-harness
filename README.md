elephant-harness
--------------------------------------------------------------------------------

[![GitHub Version](https://img.shields.io/github/release/ddmitov/elephant-harness.svg)](https://github.com/ddmitov/elephant-harness/releases)
[![NPM Version](https://img.shields.io/npm/v/elephant-harness.svg)](https://www.npmjs.com/package/elephant-harness)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)  
[![Travis CI Build Status](https://travis-ci.org/ddmitov/elephant-harness.svg?branch=master)](https://travis-ci.org/ddmitov/elephant-harness)
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11338/badge.svg)](https://scan.coverity.com/projects/ddmitov-elephant-harness)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/74d599477f164e13af8e3a03de20a1bf)](https://www.codacy.com/app/ddmitov/elephant-harness?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ddmitov/elephant-harness&amp;utm_campaign=Badge_Grade)
[![Snyk Status](https://snyk.io/test/github/ddmitov/elephant-harness/badge.svg)](https://snyk.io/test/github/ddmitov/elephant-harness)  

[Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) package for asynchronous handling of [PHP](http://php.net/) scripts

## Quick Start
``npm install elephant-harness``  

```javascript
const elephantHarness = require("elephant-harness");

let phpScriptObject = {};
phpScriptObject.interpreter = "php";
phpScriptObject.scriptFullPath = "/test/test.php";

phpScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScriptObject);
```

## Core Dependencies
* ``child_process``
* ``fs``

## External Dependency
The only external dependency of elephant-harness is a PHP interpreter on PATH or  
any other PHP interpreter identified by its full pathname.  

elephant-harness npm package test will fail if no ``php`` binary is available on PATH.  

``php`` binary should be used in [Node.js](http://nodejs.org/) applications and test scripts.  

``php-cgi`` binary should be used in [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/) applications.

## API

```javascript
const elephantHarness = require("elephant-harness");

let phpScriptObject = {};

 // mandatory object property
phpScriptObject.interpreter = "php-cgi";

 // mandatory object property
phpScriptObject.scriptFullPath = "/test/test.php";

// mandatory object property:
phpScriptObject.stdoutFunction = function(stdout) {
  document.getElementById("DOM-element-id").innerHTML = stdout;
};

phpScriptObject.stderrFunction = function(stderr) {
  console.log("PHP script STDERR:\n");
  console.log(stderr);
};

phpScriptObject.errorFunction = function(error) {
  if (error && error.code === "ENOENT") {
    console.log("PHP interpreter was not found.");
  }
};

phpScriptObject.exitFunction = function(exitCode) {
  console.log(`PHP script exited with exit code ${exitCode}`);
};

// interpreter switches must be an array:
let interpreterSwitches = [];
interpreterSwitches.push("-q");
phpScriptObject.interpreterSwitches = interpreterSwitches;

phpScriptObject.requestMethod = "POST";

phpScriptObject.inputData = function() {
  let data = document.getElementById("input-box-id").value;
  return data;
}

elephantHarness.startScript(phpScriptObject);
```

* **phpInterpreter:**  
  This is the full pathname of a PHP interpreter or just the filename of a PHP interpreter on PATH.  
  *This object property is mandatory.*  

* **scriptFullPath:**  
  This is the full path of the PHP script that is going to be executed.  
  *This object property is mandatory.*  

* **stdoutFunction:**  
  This is the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ``stdoutFunction`` is the STDOUT string.  
  *This object property is mandatory.*  

* **stderrFunction:**  
  This is the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the STDERR string.  

* **errorFunction:**  
  This is the function that will be executed on script error.  
  The only parameter passed to this function is the error object.  
  The ``errorFunction`` could be used for displaying a message when PHP interpreter is not found.  

* **exitFunction:**  
  This is the function that will be executed when a PHP script is finished.  
  The only parameter passed to this function is the exit code string.  

* **interpreterSwitches:**  
  They are supplied to the PHP interpreter on runtime.  
  The ``php-cgi`` binary should be used with the ``-q`` switch in [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/)  
  to enable quiet mode and suppress unnecessary HTTP header output.  

* **requestMethod:**  
  Only ``GET`` or ``POST`` are recognized.  
  This object property requires ``inputData`` to be set.  

* **inputData:**  
  This object property requires ``requestMethod`` to be set.  
  ``inputData`` can be either a variable or a function harvesting data from HTML forms or other data sources and supplying it as a return value.  

  Single input box simple example with no dependencies:  

  ```javascript
  phpScriptObject.inputData = function() {
    let data = document.getElementById("input-box-id").value;
    return data;
  }
  ```

  Whole form simple example based on [jQuery](https://jquery.com/):  

  ```javascript
  phpScriptObject.inputData = function() {
    let formData = $("#form-id").serialize();
    return formData;
  }
  ```

## Interactive Scripts
elephant-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to an interactive script waiting for input on STDIN:

```javascript
let data = document.getElementById("interactive-script-input").value;
phpScriptObject.scriptHandler.stdin.write(data);
```

## [Electron Demo](https://www.npmjs.com/package/elephant-harness-demo-electron)

## [NW.js Demo](https://www.npmjs.com/package/elephant-harness-demo-nwjs)

## [Thanks and Credits](./CREDITS.md)

## [License](./LICENSE.md)
MIT © 2016 - 2018 Dimitar D. Mitov  
