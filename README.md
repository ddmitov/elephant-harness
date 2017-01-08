elephant-harness
--------------------------------------------------------------------------------

[![GitHub Version](https://img.shields.io/github/release/ddmitov/elephant-harness.svg)](https://github.com/ddmitov/elephant-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/elephant-harness.svg)](https://www.npmjs.com/package/elephant-harness)
[![Travis CI Build Status](https://travis-ci.org/ddmitov/elephant-harness.svg?branch=master)](https://travis-ci.org/ddmitov/elephant-harness)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/elephant-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/elephant-harness)
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11338/badge.svg)](https://scan.coverity.com/projects/ddmitov-elephant-harness)
[![Known Vulnerabilities](https://snyk.io/test/github/ddmitov/elephant-harness/badge.svg)](https://snyk.io/test/github/ddmitov/elephant-harness)  

elephant-harness is a small [Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) library for asynchronous handling of [PHP](http://php.net/) scripts.

## Quick Start
``npm install elephant-harness``  

```javascript
const elephantHarness = require('elephant-harness');

var phpScriptObject = new Object();
phpScriptObject.interpreter = 'php';
phpScriptObject.scriptFullPath = '/test/test.php';

phpScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScriptObject);
```

## Electron Demo
* Download the [elephant-harness package](https://github.com/ddmitov/elephant-harness).  
* Download the [Electron binary package for your operating system](https://github.com/electron/electron/releases).  
* Extract the downloaded elephant-harness package.  
* Extract the downloaded Electron binary package inside the previously extracted ``elephant-harness-master/demo`` folder. Confirm merging of the ``resources`` subfolder of Electron with the ``resources`` subfolder of the demo.  
* Start the Electron binary.  

## NW.js Demo
* Download the [elephant-harness package](https://github.com/ddmitov/elephant-harness).  
* Download the [NW.js binary package for your operating system](http://nwjs.io/downloads/).  
* Extract the downloaded NW.js binary package. It will create its own folder.  
* Extract the downloaded elephant-harness package and copy everything inside its ``elephant-harness-master/demo`` folder in the folder of the NW.js binary.  
* Start the NW.js binary.  

## Core Dependencies
* ``child_process``
* ``fs``

## External Dependency
The only external dependency of elephant-harness is a PHP interpreter on PATH or any other PHP interpreter identified by its full pathname. elephant-harness npm package test will fail if no ``php`` binary is available on PATH.

## API

```javascript
const elephantHarness = require('elephant-harness');

var phpScriptObject = new Object();
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
}

phpScriptObject.exitFunction = function(exitCode) {
  console.log('PHP script exited with exit code ' + exitCode);
}

phpScriptObject.interpreterSwitches = '-q';

phpScriptObject.method = 'POST';

var formData = $('#form-id').serialize();
phpScriptObject.formData = formData;

elephantHarness.startScript(phpScriptObject);
```

  * **phpInterpreter:**  
  This is the full pathname of a PHP interpreter or just the filename of a PHP interpreter on PATH.  
  This object property is mandatory.  

* **scriptFullPath:**  
  This is the full path of the PHP script that is going to be executed.  
  This object property is mandatory.  

* **stdoutFunction:**  
  This is the name of the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ``stdoutFunction`` function is the ``stdout`` string.  
  This object property is mandatory.  

* **stderrFunction:**  
  This is the name of the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the ``stderr`` string.  

* **exitFunction:**  
  This is the name of the function that will be executed when a PHP script is finished.  
  The only parameter passed to this function is the ``exitCode`` string.  

* **interpreterSwitches:**  
  They are supplied to the PHP interpreter on runtime.  
  The ``php-cgi`` binary should be used together with the ``-q`` switch in [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/) to enable quiet mode and suppress unnecessary HTTP header output.  

* **method:**  
  Only ``GET`` or ``POST`` are allowed.  
  This object property has no effect if ``formData`` is not set.  

* **formData:**  
  This object property has no effect if ``method`` is not set.  
  elephant-harness does not depend on [jQuery](https://jquery.com/), but it can be used for easy acquisition of form data:  

  ```javascript
  var formData = $('#form-id').serialize();
  ```

## Interactive Scripts
elephant-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to the standard input of an interactive script waiting for data on STDIN:

```javascript
var data = document.getElementById('interactive-script-input').value;
phpScriptObject.scriptHandler.stdin.write(data + '\n');
```

## PHP Interpreter
Any PHP interpreter is usable for elephant-harness - either a PHP interpreter on PATH or a PHP interpreter identified by its full pathname. ``php`` binary should be used instead of ``php-cgi`` in all [Node.js](http://nodejs.org/) command-line applications and test scripts.  

## [Thanks and Credits](./CREDITS.md)

## License
MIT © 2016 - 2017 Dimitar D. Mitov  
