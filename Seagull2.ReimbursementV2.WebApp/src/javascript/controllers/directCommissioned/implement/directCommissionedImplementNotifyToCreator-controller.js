define([
    'app',
], function (app) {
    app.controller('directCommissionedImplementNotifyToCreator_controller',
        function ($scope, wfWaiting, sogModal, seagull2Url, $http, $location, configure) {
            var common = {};
            configure.getConfig(common, 'common');
            $scope.resourceID = $location.search().resourceID;
            $scope.activityID = $location.search().activityID;
            $scope.taskID = $location.search().taskID;
            $scope.linkUrl = common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedImplementAuditImplementation/" + $scope.activityID;
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl('/DirectCommissionedImplement/InintNotifyPage?resourceID=' + $scope.resourceID))
                .success(function (data) {
                    if (data != null) {
                        $scope.notifyModel = data.returnData;
                        wfWaiting.hide();
                    }
                }).error(function (e) {
                    wfWaiting.hide();
                    console.log(e);
                });
            $scope.openUrl = function () {
                window.open($scope.linkUrl, '_blank');
            };
            $scope.deleteTask = function () {
                $http.get(seagull2Url.getPlatformUrl('/DirectCommissionedImplement/DeleteNotifyTask?taskID=' + $scope.taskID))
                    .success(function () {
                        window.close();
                    }).error(function (e) {
                        console.log(e);
                    });
            }
        });
});




