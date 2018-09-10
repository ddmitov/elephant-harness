elephant-harness
--------------------------------------------------------------------------------
[![Travis CI Build Status](https://travis-ci.org/ddmitov/elephant-harness.svg?branch=master)](https://travis-ci.org/ddmitov/elephant-harness)
[![Inline docs](http://inch-ci.org/github/ddmitov/elephant-harness.svg?branch=master)](http://inch-ci.org/github/ddmitov/elephant-harness)  
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11338/badge.svg)](https://scan.coverity.com/projects/ddmitov-elephant-harness)
[![Snyk Status](https://snyk.io/test/github/ddmitov/elephant-harness/badge.svg)](https://snyk.io/test/github/ddmitov/elephant-harness)  
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/74d599477f164e13af8e3a03de20a1bf)](https://www.codacy.com/app/ddmitov/elephant-harness?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ddmitov/elephant-harness&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/f728110055011b195a4d/maintainability)](https://codeclimate.com/github/ddmitov/elephant-harness/maintainability)

[Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) package for asynchronous handling of [PHP](http://php.net/) scripts

## Quick Start
``npm install elephant-harness``  

```javascript
const elephantHarness = require("elephant-harness");

let phpTest = {};
phpTest.script = "/test/test.php";

phpTest.stdoutFunction = function (stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpTest);
```

## Core Dependency
``child_process``

## External Dependency
The only external dependency of elephant-harness is a PHP interpreter on PATH or  
a PHP interpreter identified by its full pathname.  

elephant-harness npm package test will fail if no ``php`` binary is available on PATH.  

``php`` binary should be used in [Node.js](http://nodejs.org/) applications and test scripts.  

``php-cgi`` binary should be used in [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/) applications.

## API
All settings of a PHP script executed by elephant-harness are stored in a JavaScript object with an arbitrary name and the following object properties:  

* **script**  
  ``String`` for PHP script full path  
  *This object property is mandatory.*  

  ```javascript
  phpTest.script = "/full/path/to/test.php";
  ```

* **stdoutFunction**  
  will be executed every time data is available on STDOUT  
  The only parameter passed to the ``stdoutFunction`` is the STDOUT ``String``.  

  ```javascript
  phpTest.stdoutFunction = function (stdout) {
    document.getElementById("DOM-element-id").textContent = stdout;
  };
  ```

* **stderrFunction**  
  will be executed every time data is available on STDERR  
  The only parameter passed to the ``stderrFunction`` is the STDERR ``String``.  

  ```javascript
  phpTest.stderrFunction = function (stderr) {
    console.log("PHP script STDERR:\n");
    console.log(stderr);
  };
  ```

* **errorFunction**  
  will be executed on PHP script error  
  The only parameter passed to the ``errorFunction`` is the error ``Object``.  

  The ``errorFunction`` can generate a message when PHP interpreter is not found:  

  ```javascript
  phpTest.errorFunction = function (error) {
    if (error.code === "ENOENT") {
      console.log("PHP interpreter was not found.");
    }
  };
  ```

* **exitFunction**  
  will be executed when PHP script has ended  
  The only parameter passed to the ``exitFunction`` is the exit code ``String``.  

  The ``exitFunction`` can generate a message when PHP script is not found:  

  ```javascript
  phpTest.exitFunction = function (exitCode) {
    if (exitCode === 2) {
      console.log("PHP script was not found.");
    }
  };
  ```

* **phpInterpreter**  
  ``String`` for a PHP interpreter: either filename on PATH or full pathname  
  If no ``phpInterpreter`` is defined, ``php`` binary on PATH is used, if available.  

  ```javascript
  phpTest.interpreter = "/full/path/to/php";
  ```

* **interpreterSwitches**  
  ``Array`` for PHP interpreter switches  

  ```javascript
  phpTest.interpreterSwitches = [];
  phpTest.interpreterSwitches.push("-q");
  ```

  The ``php-cgi`` binary should be used with the ``-q`` switch in Electron and NW.js  
  to enable quiet mode and suppress unnecessary HTTP header output.  

* **scriptArguments**  
  ``Array`` for PHP script arguments  

  ```javascript
  phpTest.scriptArguments = [];
  phpTest.scriptArguments.push("argument-one");
  phpTest.scriptArguments.push("argument-two");
  ```

* **options**  
  ``Object`` for PHP script options passed to the ``child_process`` core module.  
  Click [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for a full list of all available ``child_process`` options.

* **options.cwd**  
  ``String`` for a new PHP script current working directory  

  ```javascript
  phpTest.options = {};
  phpTest.options.cwd = "/full/path/to/current-working-directory";;
  ```

* **options.env**  
  ``Object`` for a new PHP script environment  

  Script environment with an inherited PATH and a new variable:  

  ```javascript
  phpTest.options = {};
  phpTest.options.env = {};
  phpTest.options.env.PATH = process.env.PATH;
  phpTest.options.env.TEST = "test";
  ```

* **options.detached**  
  ``Boolean`` option for starting detached PHP processes like servers  

  ``options.detached`` must be set to ``true`` and  
  ``options.stdio`` must be set to ``"ignore"`` to  
  start a detached process without receiving anything from it.  
  A process detached with the above options can run even after its parent has ended.  

  Example settings for a PHP server application:  

  ```javascript
  let phpServer = {};
  phpServer.script = "/path/to/php-server-application";

  phpServer.options = {};
  phpServer.options.detached = true;
  phpServer.options.stdio = "ignore";

  const elephantHarness = require("elephant-harness");
  elephantHarness.startScript(phpServer);

  phpServer.scriptHandler.unref();
  ```

* **requestMethod**  
  ``String`` holding either ``GET`` or ``POST`` as a value.  
  ``requestMethod`` has to be set for PHP scripts reading input data in CGI mode.  

  ```javascript
  phpTest.requestMethod = "GET";
  ```
  or  
  ```javascript
  phpTest.requestMethod = "POST";
  ```

* **inputData**  
  ``String`` or ``Function`` supplying user data as its return value.  

  Single HTML input box example with no dependencies:  

  ```javascript
  phpTest.inputData = function () {
    let data = document.getElementById("input-box-id").value;
    return data;
  }
  ```

  Whole HTML form example based on [jQuery](https://jquery.com/):  

  ```javascript
  phpTest.inputData = function () {
    let formData = $("#form-id").serialize();
    return formData;
  }
  ```

## Interactive Scripts
elephant-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to an interactive script waiting for input on STDIN:

```javascript
let data = document.getElementById("interactive-script-input").value;
phpTest.scriptHandler.stdin.write(data);
```

elephant-harness demo packages for [Electron](https://www.npmjs.com/package/elephant-harness-demo-electron) and [NW.js](https://www.npmjs.com/package/elephant-harness-demo-nwjs) include a PHP script that can be constantly fed with data from an HTML interface. PHP with the ``AnyEvent`` CPAN module has to be available on PATH.  

## [Electron Demo](https://www.npmjs.com/package/elephant-harness-demo-electron)

## [NW.js Demo](https://www.npmjs.com/package/elephant-harness-demo-nwjs)

## [Credits](./CREDITS.md)

## [License](./LICENSE.md)
MIT 2016 - 2018  
Dimitar D. Mitov  
