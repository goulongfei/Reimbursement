define([
    'app',
], function (app) {
    app.controller('directCommissionedEngineeringSignatureNotify_controller',
        function ($scope, wfWaiting, wfOperate, seagull2Url, $http, $location, configure) {
            var common = {};
            configure.getConfig(common, 'common');
            $scope.resourceID = $location.search().resourceID;
            $scope.activityID = $location.search().activityID;
            $scope.taskID = $location.search().taskID;
            $scope.notifyModel = {};
            $scope.mainTitle = '直接委托';
            $scope.title = '直接委托（工程采购类）';
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl('/DirectCommissionedEngineering/GetViewModel?resourceID=' + $scope.resourceID))
                .success(function (data) {
                    if (data != null) {
                        $scope.viewModel = data.returnData;
                        wfWaiting.hide();
                    }
                }).error(function (e) {
                    wfWaiting.hide();
                    console.log(e);
                });
            $scope.deleteTask = function () {
                $http.get(seagull2Url.getPlatformUrl('/DirectCommissionedEngineering/DeleteNotifyTask?taskID=' + $scope.taskID))
                    .success(function () {
                        window.close();
                    }).error(function (e) {
                        console.log(e);
                    });
            }
        });
});