const elephantHarness = require('elephant-harness');

var phpScriptObject = {};
phpScriptObject.interpreter = 'php';
phpScriptObject.scriptFullPath = '/test/test.php';

phpScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

elephantHarness.startScript(phpScriptObject);
