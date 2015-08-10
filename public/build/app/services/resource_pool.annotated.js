'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
  .factory('resourcePool', ["resource", function (resource) {
        var rc = resource.create;
        return {
            init:rc('/im_fsc/init'),
            sessions:rc('/im_fsc/sessions'),
            sessionClasses:rc('/im_fsc/sessions/classes'),
            sessionSync:rc('/im_fsc/sessions/sync'),
            recorders:rc('/im_fsc/recorders'),
            sessionUsers:rc('/im_fsc/sessions/{sessionId}/users'),
            sessionReader:rc('/im_fsc/sessions/{sessionId}/reader'),
            classStudents:rc('/im_fsc/classes/{classId}/students'),
            classParents:rc('/im_fsc/classes/{classId}/parents'),
            teachers:rc('/im_fsc/teachers'),
            deans:rc('/im_fsc/deans'),
            groups:rc('/im_fsc/groups')
        }
  }]);
