(function(buster, define) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function createTask(y) {
	return function() {
		return y;
	};
}

function expectArgs(expected) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		assert.equals(args, expected);
	};
}

define('when/parallel-test', function (require) {

	var when, parallel;

	when = require('when');
	parallel = require('when/parallel');

	buster.testCase('when/parallel', {

		'should execute all tasks': function() {
			return parallel([createTask(1), createTask(2), createTask(3)]).then(
				function(result) {
					assert.equals(result, [1, 2, 3]);
				}
			);
		},

		'should resolve to empty array when no tasks supplied': function() {
			return parallel([], 1, 2, 3).then(
				function(result) {
					assert.equals(result, []);
				}
			);
		},

		'should pass args to all tasks': function(done) {
			var expected, tasks;

			expected = [1, 2, 3];
			tasks = [expectArgs(expected), expectArgs(expected), expectArgs(expected)];

			return parallel.apply(null, [tasks].concat(expected)).ensure(done);
		},

		'should accept promises for args': function(done) {
			var expected, tasks;

			expected = [1, 2, 3];
			tasks = [expectArgs(expected), expectArgs(expected), expectArgs(expected)];

			expected = [when(1), when(2), when(3)];
			return parallel.apply(null, [tasks].concat(expected)).ensure(done);
		}
	});

});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-\.]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));
