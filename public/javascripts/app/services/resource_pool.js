'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
  .factory('resourcePool', function (resource) {
        var rc = resource.create;
        return {
            init:rc('/im_fsc/init'),
            sessions:rc('/im_fsc/sessions'),
            login:rc('/login'),
            sessionClasses:rc('/im_fsc/sessions/classes'),
            sessionSync:rc('/im_fsc/sessions/sync'),
            recorders:rc('/im_fsc/recorders'),
            sessionUsers:rc('/im_fsc/sessions/{sessionId}/users'),
            sessionReader:rc('/im_fsc/sessions/{sessionId}/reader'),
            classStudents:rc('/im_fsc/classes/{classId}/students'),
            sessionUser:rc('/im_fsc/classes/user/{id}'),
            classParents:rc('/im_fsc/classes/{classId}/parents'),
            parentsStudents:rc('/im_fsc/parents/{parentId}/students'),
            teachers:rc('/im_fsc/teachers'),
            deans:rc('/im_fsc/deans'),
            groups:rc('/im_fsc/groups'),
            planNode:rc('/open/plan_nodes/{nodeId}'),
            works:rc('/open/works/{workId}/{type}/{qid}/{analysis}'),
            exam:rc('/open/exam/{examId}/{type}/{qid}/{analysis}')
        }
  });
