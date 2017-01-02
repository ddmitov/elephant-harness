elephant-harness
--------------------------------------------------------------------------------

[![GitHub Version](https://img.shields.io/github/release/ddmitov/elephant-harness.svg)](https://github.com/ddmitov/elephant-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/elephant-harness.svg)](https://www.npmjs.com/package/elephant-harness)
[![Travis CI Build Status](https://travis-ci.org/ddmitov/elephant-harness.svg?branch=master)](https://travis-ci.org/ddmitov/elephant-harness)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/elephant-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/elephant-harness)  

```elephant-harness``` is a small [Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) library for asynchronous handling of [PHP](http://php.net/) scripts.

## Quick Start
* Install using one of the following commands:  

```npm install elephant-harness```  
```npm install git+https://github.com/ddmitov/elephant-harness.git```  

* Use from code:

```javascript
var elephantHarness = require('elephant-harness');

var phpScript = new Object();
phpScript.interpreter = "php";
phpScript.scriptFullPath = "/test/test.php";

phpScript.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScript);
```

## Electron Demo
* Download the [elephant-harness package](https://github.com/ddmitov/elephant-harness).  
* Download the [Electron binary package for your operating system](https://github.com/electron/electron/releases).  
* Extract the downloaded ```elephant-harness``` package.  
* Extract the downloaded [Electron](http://electron.atom.io/) binary package inside the previously extracted ```elephant-harness-master/electron-nwjs-demo``` folder. Confirm merging of the ```resources``` subfolder of [Electron](http://electron.atom.io/) with the ```resources``` subfolder of the demo.  
* Start the [Electron](http://electron.atom.io/) binary.  

## NW.js Demo
* Download the [elephant-harness package](https://github.com/ddmitov/elephant-harness).  
* Download the [NW.js binary package for your operating system](http://nwjs.io/downloads/).  
* Extract the downloaded [NW.js](http://nwjs.io/) binary package. It will create its own folder.  
* Extract the downloaded ```elephant-harness``` package and copy everything inside its ```elephant-harness-master/electron-nwjs-demo``` subfolder in the folder of the [NW.js](http://nwjs.io/) binary.  
* Start the [NW.js](http://nwjs.io/) binary.  

## Core Dependencies
* ```child_process```
* ```fs```

## External Dependency
The only external dependency of ```elephant-harness``` is a PHP interpreter on PATH or any other PHP interpreter identified by its full pathname. ```elephant-harness``` package test will fail if no ```php``` binary is available on PATH.

## API

```javascript
var elephantHarness = require('elephant-harness');

var phpScript = new Object();
phpScript.interpreter = "php-cgi"; // mandatory object property
phpScript.scriptFullPath = "/test/test.php"; // mandatory object property

// mandatory object property:
phpScript.stdoutFunction = function(stdout) {
  document.getElementById("DOM-element-id").innerHTML = stdout;
};

phpScript.stderrFunction = function(stderr) {
  console.log('PHP script STDERR:\n' + stderr);
}

phpScript.exitFunction = function(exitCode) {
  console.log('PHP script exited with exit code ' + exitCode);
}

phpScript.method = "POST";

var formData = $("#form-id").serialize();
phpScript.formData = formData;

elephantHarness.startScript(phpScript);
```

  * **phpInterpreter:**  
  This is the full pathname of a PHP interpreter or just the filename of a PHP interpreter on PATH.  
  This object property is mandatory.  

* **scriptFullPath:**  
  This is the full path of the PHP script that is going to be executed.  
  This object property is mandatory.  

* **stdoutFunction:**  
  This is the name of the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ```stdoutFunction``` function is the ```stdout``` string.  
  This object property is mandatory.  

* **stderrFunction:**  
  This is the name of the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the ```stderr``` string.  

* **exitFunction:**  
  This is the name of the function that will be executed when a PHP script is finished.  
  The only parameter passed to this function is the ```exitCode``` string.  

* **method:**  
  ```GET``` or ```POST```  
  ```method``` is mandatory object property if ```formData``` is set.  

* **formData:**  
  ```formData``` is mandatory object property if ```method``` is set.  
  ```elephant-harness``` does not depend on [jQuery](https://jquery.com/), but it can be used for easy acquisition of form data:  

```javascript
  var formData = $("#form-id").serialize();
```

## PHP Interpreter
```elephant-harness``` is able to use any PHP interpreter - either a PHP interpreter on PATH or a PHP interpreter identified by its full pathname. ```php``` binary should be used instead of ```php-cgi``` in all command line applications and test scripts.  

## [Thanks and Credits](./CREDITS.md)

## License
MIT © 2016 - 2017 Dimitar D. Mitov  
