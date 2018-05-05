const elephantHarness = require("elephant-harness");

let phpScriptObject = {};
phpScriptObject.interpreter = "php";
phpScriptObject.scriptFullPath = "/test/test.php";

phpScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScriptObject);
