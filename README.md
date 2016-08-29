ElephantHarness.js
--------------------------------------------------------------------------------
  
```ElephantHarness.js``` is a small JavaScript library that can start [PHP] (http://php.net/) scripts from an application based on [Electron] (http://electron.atom.io/) or [NW.js] (http://nwjs.io/).
  
## Node.js Module Dependencies
All dependencies of ```ElephantHarness.js``` are available inside [Electron] (http://electron.atom.io/) and [NW.js] (http://nwjs.io/).
* ```child_process```
* ```fs```
* ```os```
* ```path```
  
## API
  ```elephantHarness(scriptFullPath, stdoutFunction, stderrFunction, errorFunction, exitFunction, method, formData);```  
* **scriptFullPath:**  
  This is the full path of the PHP script that is going to be executed. This parameter is mandatory.  
  
* **stdoutFunction:**  
  This is the name of the function that will be executed every time when output is available on STDOUT.  
  This parameter is mandatory.  
  The only argument passed to the ```stdoutFunction``` function is the ```stdout``` string. Example:  

```javascript
  function elephantHarnessStdout(stdout) {
      document.getElementById("DOM-element-id").innerHTML = stdout;
  }
```

* **stderrFunction:**  
  This is the name of the function that will be executed every time when output is available on STDERR.  
  The only argument passed to this function is the ```stderr``` string. Example:  

```javascript
  function elephantHarnessStderr(stderr) {
      console.log('PHP script STDERR:\n' + stderr);
  }
```

* **errorFunction:**  
  This is the name of the function that will be executed to read errors from a PHP script.  
  The only argument passed to this function is the ```error``` object. Example:  

```javascript
  function elephantHarnessError(error) {
      console.log(error.stack); 
      console.log('PHP script error code: ' + error.code); 
      console.log('PHP script signal received: ' + error.signal);
  }
```

* **exitFunction:**  
  This is the name of the function that will be executed when a PHP script is finished.  
  The only argument passed to this function is the ```exitCode``` string. Example:  

```javascript
  function elephantHarnessExit(exitCode) {
      console.log('PHP script exited with exit code ' + exitCode);
  }
```

* **method:**  
  ```GET``` or ```POST```
* **formData:**  
  Form data could be easily acquired using ```jQuery``` like that: ```var formData = $("#form-id").serialize();```  
  Note that ```ElephantHarness.js``` itself does not depend on ```jQuery```.  
  ```formData``` is mandatory parameter if ```method``` is not ```null```.  
  
## PHP Interpreter
```ElephantHarness.js``` tries to find ```php-cgi``` binary - either a portable PHP distributed together with the ```Electron``` or ```NW.js``` binary or any other PHP on PATH. A portable PHP interpreter has to be placed inside ```{Electron_or_NW.js_binary_directory}/php``` folder.  
  
## License
  
This program is free software;  
you can redistribute it and/or modify it under the terms of the GNU General Public License,  
as published by the Free Software Foundation; either version 3 of the License,  
or (at your option) any later version.  
This program is distributed in the hope that it will be useful, but WITHOUT A NY WARRANTY;  
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
  
## Author
  
Dimitar D. Mitov, 2016.
