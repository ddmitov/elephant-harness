elephant-harness
--------------------------------------------------------------------------------

[![GitHub Version](https://img.shields.io/github/release/ddmitov/elephant-harness.svg)](https://github.com/ddmitov/elephant-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/elephant-harness.svg)](https://www.npmjs.com/package/elephant-harness)  
[![Travis CI Build Status](https://travis-ci.org/ddmitov/elephant-harness.svg?branch=master)](https://travis-ci.org/ddmitov/elephant-harness)
[![bitHound Overall Score](https://www.bithound.io/github/ddmitov/elephant-harness/badges/score.svg)](https://www.bithound.io/github/ddmitov/elephant-harness)
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11338/badge.svg)](https://scan.coverity.com/projects/ddmitov-elephant-harness)
[![Snyk Status](https://snyk.io/test/github/ddmitov/elephant-harness/badge.svg)](https://snyk.io/test/github/ddmitov/elephant-harness)  

[Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) library for asynchronous handling of [PHP](http://php.net/) scripts

## Quick Start
``npm install elephant-harness``  

```javascript
const elephantHarness = require('elephant-harness');

var phpScriptObject = {};
phpScriptObject.interpreter = 'php';
phpScriptObject.scriptFullPath = '/test/test.php';

phpScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScriptObject);
```

## Core Dependencies
* ``child_process``
* ``fs``

## External Dependency
The only external dependency of elephant-harness is a PHP interpreter on PATH or any other PHP interpreter identified by its full pathname.  
elephant-harness npm package test will fail if no ``php`` binary is available on PATH.  
``php`` binary should be used in all [Node.js](http://nodejs.org/) command-line applications and test scripts.  
``php-cgi`` binary should be used in all [Node.js](http://nodejs.org/) web applications, as well as in all [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/) applications.

## API

```javascript
const elephantHarness = require('elephant-harness');

var phpScriptObject = {};

 // mandatory object property
phpScriptObject.interpreter = 'php-cgi';

 // mandatory object property
phpScriptObject.scriptFullPath = '/test/test.php';

// mandatory object property:
phpScriptObject.stdoutFunction = function(stdout) {
  document.getElementById('DOM-element-id').innerHTML = stdout;
};

phpScriptObject.stderrFunction = function(stderr) {
  console.log('PHP script STDERR:\n' + stderr);
};

phpScriptObject.errorFunction = function(error) {
  if (error && error.code === 'ENOENT') {
    console.log('PHP interpreter was not found.');
  }
};

phpScriptObject.exitFunction = function(exitCode) {
  console.log('PHP script exited with exit code ' + exitCode);
};

// interpreter switches must be an array:
var interpreterSwitches = [];
interpreterSwitches.push('-q');
phpScriptObject.interpreterSwitches = interpreterSwitches;

phpScriptObject.requestMethod = 'POST';

phpScriptObject.inputDataHarvester = function() {
  var formData = $('#form-id').serialize();
  return formData;
}

elephantHarness.startScript(phpScriptObject);
```

* **phpInterpreter:**  
  This is the full pathname of a PHP interpreter or just the filename of a PHP interpreter on PATH.  
  This object property is mandatory.  

* **scriptFullPath:**  
  This is the full path of the PHP script that is going to be executed.  
  This object property is mandatory.  

* **stdoutFunction:**  
  This is the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ``stdoutFunction`` is the STDOUT string.  
  This object property is mandatory.  

* **stderrFunction:**  
  This is the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the STDERR string.  

* **errorFunction:**  
  This is the function that will be executed on script error.  
  The only parameter passed to this function is the error object.  
  The ``errorFunction`` could be useful for displaying a message when PHP interpreter is not found.  

* **exitFunction:**  
  This is the function that will be executed when a PHP script is finished.  
  The only parameter passed to this function is the exit code string.  

* **interpreterSwitches:**  
  They are supplied to the PHP interpreter on runtime.  
  The ``php-cgi`` binary should be used together with the ``-q`` switch in [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/) to enable quiet mode and suppress unnecessary HTTP header output.  

* **requestMethod:**  
  Only ``GET`` or ``POST`` are recognized.  
  This object property requires ``inputData`` to be set.  

* **inputData:**  
  This object property requires ``requestMethod`` to be set.  

* **inputDataHarvester:**  
  This is a function that can harvest input data from an HTML form or any other data source and supply it as its return value. If ``inputData`` is defined, ``inputDataHarvester`` will not be used, but if ``inputData`` is not defined and ``inputDataHarvester`` is available, it will be used as an input data source.  

  elephant-harness does not depend on [jQuery](https://jquery.com/), but it can be used for easy acquisition of HTML form data:  

  ```javascript
  phpScriptObject.inputDataHarvester = function() {
    var formData = $('#form-id').serialize();
    return formData;
  }
  ```

## Interactive Scripts
elephant-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to an interactive script waiting for input on STDIN:

```javascript
var data = document.getElementById('interactive-script-input').value;
phpScriptObject.scriptHandler.stdin.write(data + '\n');
```

## [Electron Demo](https://www.npmjs.com/package/elephant-harness-demo-electron)

## [NW.js Demo](https://www.npmjs.com/package/elephant-harness-demo-nwjs)

## [Thanks and Credits](./CREDITS.md)

## [License](./LICENSE.md)
MIT © 2016 - 2017 Dimitar D. Mitov  
