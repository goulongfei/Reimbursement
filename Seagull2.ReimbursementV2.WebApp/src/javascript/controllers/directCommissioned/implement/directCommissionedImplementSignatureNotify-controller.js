define([
    'app',
], function (app) {
    app.controller('directCommissionedImplementSignatureNotify_controller',
        function ($scope, wfWaiting, wfOperate, seagull2Url, $http, $location, configure) {
            var common = {};
            configure.getConfig(common, 'common');
            $scope.resourceID = $location.search().resourceID;
            $scope.activityID = $location.search().activityID;
            $scope.taskID = $location.search().taskID;
            //流程标题
            $scope.mainTitle = '直接委托';
            $scope.title = '直接委托（项目实施服务类）';
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl('/DirectCommissionedImplement/GetViewModel?resourceID=' + $scope.resourceID))
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
                $http.get(seagull2Url.getPlatformUrl('/DirectCommissionedImplement/DeleteNotifyTask?taskID=' + $scope.taskID))
                    .success(function () {
                        window.close();
                    }).error(function (e) {
                        console.log(e);
                    });
            }
        });
});