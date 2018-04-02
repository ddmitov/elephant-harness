'use strict';

const ELEPHANT_HARNESS = require('elephant-harness');

let phpScriptObject = {};
phpScriptObject.interpreter = 'php';
phpScriptObject.scriptFullPath = '/test/test.php';

phpScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

ELEPHANT_HARNESS.startScript(phpScriptObject);
