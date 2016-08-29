
// ElephantHarness.js version 0.1.0
// Electron and NW.js adapter for PHP scripts
// ElephantHarness.js is licensed under the terms of GNU GPL version 3.
// Dimitar D. Mitov, 2016.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


// Node.js Module Dependencies
// (available in both Electron and NW.js):
// child_process
// fs
// os
// path


// Global variables for ElephantHarness.js:
var elephantHarnessFilesystemObject = require('fs');
var portablePhpSubdirectory = "php";
var phpInterpreterCommand;


// Determine the operating system,
// set all operating-system-specific variables and
// find a PHP interpreter:
if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
    // Determine the operating system:
    var osObject = require('os');
    var elephantHarnessPlatform = osObject.platform();

    var elephantHarnessPathObject;
    var phpInterpreterFileName;
    if (elephantHarnessPlatform !== "win32") {
        phpInterpreterFileName = "php-cgi";
        elephantHarnessPathObject = require('path').posix;
    } else {
        phpInterpreterFileName = "php-cgi.exe";
        elephantHarnessPathObject = require('path').win32;
    }

    // Get the full path of the directory where
    // Electron or NW.js binary is located:
    var binaryPath = process.execPath;
    var binaryDir = elephantHarnessPathObject.dirname(binaryPath);

    // Compose the full path to the portable PHP interpreter (if any):
    var portablePhpInterpreterFullPath = elephantHarnessPathObject
        .join(binaryDir, portablePhpSubdirectory, phpInterpreterFileName);

    // Find PHP interpreter:
    elephantHarnessFilesystemObject
        .access(portablePhpInterpreterFullPath, function(error) {
        // If portable PHP interpreter is not found,
        // try to find the first PHP interpreter on PATH:
        if (error && error.code === 'ENOENT') {
            phpInterpreterCommand = "php-cgi";
            console.log('ElephantHarness.js: ' +
                'Will try to use PHP interpreter on PATH.');
        } else {
            phpInterpreterCommand = portablePhpInterpreterFullPath;
            console.log(
                'ElephantHarness.js: ' +
                'Portable PHP interpreter found: ' + phpInterpreterCommand);
        }
    });
} else {
    console.log(
        'ElephantHarness.js: ' +
        'This library is not usefull outside of Electron or NW.js.');
}


function elephantHarness(scriptFullPath, stdoutFunction,
    stderrFunction, errorFunction, exitFunction,method, formData) {
    if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
        if (phpInterpreterCommand !== null) {
            // The full path of the script and
            // the name of the STDOUT handling function
            // are mandatory elephantHarness function parameters.
            if (scriptFullPath !== null || stdoutFunction  !== null) {
                // Check if the supplied PHP script exists:
                elephantHarnessFilesystemObject
                    .access(scriptFullPath, function(error) {
                    if (error && error.code === 'ENOENT') {
                        console.log('ElephantHarness.js: ' +
                            'PHP script not found:\n' +
                            scriptFullPath);
                    } else {
                        // Set a clean environment for the supplied PHP script:
                        var cleanEnvironment = {};

                        if (method !== null &&
                            (method === "GET" || method === "POST")) {
                            if (formData  !== null && formData.length > 0) {
                                // Handle GET requests:
                                if (method === "GET") {
                                    cleanEnvironment['REQUEST_METHOD'] = 'GET';
                                    cleanEnvironment['QUERY_STRING'] = formData;
                                }

                                // Handle POST requests:
                                if (method === "POST") {
                                    cleanEnvironment['REQUEST_METHOD'] = 'POST';
                                    cleanEnvironment['CONTENT_LENGTH'] =
                                        formData.length;
                                }
                            } else {
                                console.log('ElephantHarness.js: ' +
                                    'Request method is ' + method +
                                    ', but form data is not supplied.');
                            }
                        }

                        // Run the supplied PHP script:
                        const spawn = require('child_process').spawn;
                        const scriptHandler = spawn(phpInterpreterCommand,
                                            ['-q', scriptFullPath],
                                            {env: cleanEnvironment});

                        // Send POST data to the PHP script:
                        if (method !== null && method === "POST" &&
                            formData.length > 0) {
                            scriptHandler.stdin.write(formData);
                        }

                        scriptHandler.stdout.on('data', function(data) {
                            if (typeof window[stdoutFunction] === 'function') {
                                window[stdoutFunction](data.toString('utf8'));
                            } else {
                                console.log('ElephantHarness.js: ' +
                                            'STDOUT handling function for\n' +
                                            scriptFullPath + '\n' +
                                            'is not found.');
                                console.log('STDOUT:\n' +
                                    data.toString('utf8'));
                            }
                        });

                        scriptHandler.stderr.on('data', function(data) {
                            if (typeof window[stderrFunction] === 'function') {
                                window[stderrFunction](data.toString('utf8'));
                            } else {
                                console.log('ElephantHarness.js: ' +
                                            'STDERR handling function for\n' +
                                            scriptFullPath + '\n' +
                                            'is not found.');
                                console.log('STDERR:\n' +
                                    data.toString('utf8'));
                            }
                        });

                        scriptHandler.on('error', function(errorCode) {
                            if (errorFunction !== null) {
                                if (typeof window[errorFunction] === 'function') {
                                    window[errorFunction](errorCode);
                                } else {
                                    console.log('ElephantHarness.js: ' +
                                        'Error handling function for\n' +
                                        scriptFullPath + '\n' +
                                        'is not found.');
                                    console.log('Error stack:\n' + error.stack);
                                    console.log('Error code: ' +
                                        error.code);
                                    console.log('Signal: ' +
                                        error.signal);
                                }
                            }
                        });

                        scriptHandler.on('exit', function(code) {
                            if (exitFunction !== null) {
                                if (typeof window[exitFunction] === 'function') {
                                    window[exitFunction](code);
                                } else {
                                    console.log('ElephantHarness.js is: ' +
                                        'Exit handling function for\n' +
                                        scriptFullPath + '\n' +
                                        'is not found.');
                                    console.log('Exit code: ' + exitCode);
                                }
                            }
                        });
                    }
                });
            } else {
                console.log('ElephantHarness.js: ' +
                    'Full path of a PHP script and ' +
                    'STDOUT handling function name are not supplied.');
                console.log('ElephantHarness.js minimal invocation:\n' +
                    'elephantHarness(scriptFullPath, stdoutFunction, ' +
                    'null, null, null, null, null)');
            }
        }else {
            console.log('ElephantHarness.js: ' +
                'This library is not usefull without a PHP interpreter.');
        }
    } else {
        console.log('ElephantHarness.js: ' +
            'This library is not usefull outside of Electron or NW.js.');
    }
}
