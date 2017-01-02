var elephantHarness = require('elephant-harness');

var phpScript = new Object();
phpScript.interpreter = "php";
phpScript.scriptFullPath = "/test/test.php";

phpScript.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScript);
