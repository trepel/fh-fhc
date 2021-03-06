var assert = require('assert');
var fs = require('fs');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_env_submissions');
var submissionExportMocks = require('test/fixtures/appforms/fixture_env_submission_export');
var appformsenvsubmissions = {
  list: genericCommand(require('cmd/fh3/appforms/environments/submissions/list')),
  read: genericCommand(require('cmd/fh3/appforms/environments/submissions/read')),
  complete: genericCommand(require('cmd/fh3/appforms/environments/submissions/complete')),
  update: genericCommand(require('cmd/fh3/appforms/environments/submissions/update')),
  create: genericCommand(require('cmd/fh3/appforms/environments/submissions/create')),
  delete: genericCommand(require('cmd/fh3/appforms/environments/submissions/delete')),
  filter: genericCommand(require('cmd/fh3/appforms/environments/submissions/filter')),
  exportcsv : genericCommand(require('cmd/fh3/appforms/environments/submissions/exportcsv')),
  csvExportReset : genericCommand(require('cmd/fh3/appforms/environments/submissions/csvExportReset'))
};

var page = 1;
var limit = 10;

module.exports = {
  'test appforms-submissions list': function(cb) {
    appformsenvsubmissions.list({environment: "someenv", page: page, limit: limit}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data._table, "Expected A Table Of Submissions");
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions filter': function(cb) {
    appformsenvsubmissions.filter({environment: "someenv", formid: "someformid", projectid: "someformproject", page: page, limit: limit}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data._table, "Expected A Table Of Submissions");
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions read': function(cb) {
    appformsenvsubmissions.read({environment: "someenv", id: "somesubmissionid"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions complete': function(cb) {
    appformsenvsubmissions.complete({environment: "someenv", id: "somesubmissionid"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions create': function(cb) {
    appformsenvsubmissions.create({
      environment: "someenv",
      submissiondata: "test/fixtures/appforms/fixture_submission.json"
    }, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions delete': function(cb) {
    appformsenvsubmissions.delete({environment: "someenv", id: "somesubmissionid"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions update': function(cb) {
    appformsenvsubmissions.update({
      environment: "someenv",
      id: "somesubmissionid",
      submissiondata: "test/fixtures/appforms/fixture_submission.json"
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test appforms-submissions exportcsv async': function(cb) {
    var csvExportAsyncRequests = submissionExportMocks.getCSVExportAsyncMocks();
    var getCSVExportAsyncFileDownloadMocks = submissionExportMocks.getCSVExportAsyncFileDownloadMocks();
    var testOutputZipFile = 'testexportasync.zip';

    appformsenvsubmissions.exportcsv({
      environment: "someenv",
      async: "true",
      output: testOutputZipFile
    }, function(err) {
      assert.equal(null, err, "Expected no error : " + err);

      //Making sure that the required endpoints were called for async submission export.
      csvExportAsyncRequests.done();

      //Making sure the exported file has been downloaded
      getCSVExportAsyncFileDownloadMocks.done();

      //Cleaning up the output file if it exists.
      fs.unlink(testOutputZipFile, function() {
        cb();
      });
    });
  },
  'test appforms-submissions exportcsv async unavailable': function(cb) {
    var csvExportAsyncRequests = submissionExportMocks.getCSVExportAsyncUnavailable();
    var testOutputZipFile = 'testexportasync.zip';

    appformsenvsubmissions.exportcsv({
      environment: "someenv",
      async: "true",
      output: testOutputZipFile
    }, function(err) {
      assert.ok(err.indexOf("available") > -1, "Expected the error message to show that async submissions export is unavailable.");

      //Making sure that the required endpoints were called for async submission export.
      csvExportAsyncRequests.done();

      cb();
    });
  },
  'test appforms-submissions exportcsv sync': function(cb) {
    var csvExportSyncRequests = submissionExportMocks.getCSVExportSyncMocks();
    var testOutputZipFile = 'testexportsync.zip';

    appformsenvsubmissions.exportcsv({
      environment: "someenv",
      output: testOutputZipFile
    }, function(err) {
      assert.equal(null, err, "Expected no error : " + err);

      //Making sure that the required endpoints were called for sync submission export.
      csvExportSyncRequests.done();

      //Cleaning up the output file if it exists.
      fs.unlink(testOutputZipFile, function() {
        cb();
      });
    });
  }
};
