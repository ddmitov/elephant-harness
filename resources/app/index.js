

// Determine the operating system:
var osObject = require('os');
var platform = osObject.platform();

// Initialize 'path' object:
var pathObject;
if (platform !== "win32") {
    pathObject = require('path').posix;
} else {
    pathObject = require('path').win32;
}

// Get the full path of the directory where Electron or NW.js binary is located:
var binaryPath = process.execPath;
var binaryDirectory = pathObject.dirname(binaryPath);

// Get the full path of the application root directory:
var applicationDirectory = pathObject
    .join(binaryDirectory, "resources", "app");

var phpInfoOutput = "";


// phpinfo.php handling functions:
function startPhpInfoScript() {
    var scriptFullPath = pathObject
        .join(applicationDirectory, "php", "phpinfo.php");
    elephantHarness(scriptFullPath, "phpInfoScriptStdout",
        null, null, "phpInfoScriptExit", null, null);
}


function phpInfoScriptStdout(stdout) {
    phpInfoOutput = phpInfoOutput + stdout;
    console.log('phpinfo.php output received.');
}


function phpInfoScriptExit(exitCode) {
    document.write(phpInfoOutput);
    console.log('phpinfo.php finished.');
}
