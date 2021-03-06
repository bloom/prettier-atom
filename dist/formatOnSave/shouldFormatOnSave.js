'use strict';

var _ = require('lodash/fp');

var _require = require('../helpers'),
    someGlobsMatchFilePath = _require.someGlobsMatchFilePath;

var _require2 = require('../editorInterface'),
    getCurrentFilePath = _require2.getCurrentFilePath,
    getCurrentScope = _require2.getCurrentScope;

var _require3 = require('../atomInterface'),
    isFormatOnSaveEnabled = _require3.isFormatOnSaveEnabled,
    getScopes = _require3.getScopes,
    getExcludedGlobs = _require3.getExcludedGlobs,
    getWhitelistedGlobs = _require3.getWhitelistedGlobs;

var isFilePathEslintignored = require('./isFilePathEslintIgnored');

var hasFilePath = function hasFilePath(editor) {
  return !!getCurrentFilePath(editor);
};

var isInScope = function isInScope(editor) {
  return getScopes().includes(getCurrentScope(editor));
};

var filePathDoesNotMatchBlacklistGlobs = _.flow(getCurrentFilePath, function (filePath) {
  return _.negate(someGlobsMatchFilePath)(getExcludedGlobs(), filePath);
});

var noWhitelistGlobsPresent = _.flow(getWhitelistedGlobs, _.isEmpty);

var isFilePathWhitelisted = _.flow(getCurrentFilePath, function (filePath) {
  return someGlobsMatchFilePath(getWhitelistedGlobs(), filePath);
});

var isFilePathNotEslintignored = _.flow(getCurrentFilePath, _.negate(isFilePathEslintignored));

var shouldFormatOnSave = _.overEvery([isFormatOnSaveEnabled, hasFilePath, isInScope, _.overSome([isFilePathWhitelisted, _.overEvery([noWhitelistGlobsPresent, filePathDoesNotMatchBlacklistGlobs])]), isFilePathNotEslintignored]);

module.exports = shouldFormatOnSave;