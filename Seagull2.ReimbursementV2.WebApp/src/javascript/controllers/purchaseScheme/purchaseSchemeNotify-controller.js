define([
    'app',
], function (app) {
        app.controller('purchaseSchemeNotify_controller',
            function ($scope, wfWaiting, sogModal, seagull2Url, $http, $location) {
                $scope.resourceID = $location.search().resourceID;
                $scope.activityID = $location.search().activityID;
                $scope.taskID = $location.search().taskID;
                $scope.checked = true;
                $scope.linkUrl = "/THRWebApp/ReimbursementV2/default.htm#/purchaseSchemefileInfoProvided/" + $scope.activityID;
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl('/PurchaseScheme/InintNotifyPage?resourceID=' + $scope.resourceID + "&activityID=" + $scope.activityID))
                    .success(function (data) {
                        if (data != null) {
                            $scope.notifyModel = data.returnData;
                            wfWaiting.hide();
                        }
                    }).error(function (e) {
                        wfWaiting.hide();
                        console.log(e);
                    });
       
                $scope.Close = function () {
                    if ($scope.checked) {
                        $http.get(seagull2Url.getPlatformUrl('/PurchaseScheme/DeleteNotifyTask?taskID=' + $scope.taskID))
                        .success(function () {
                            window.close();
                        }).error(function (e) {
                            console.log(e);
                        });
                    }
                    else {
                        window.close();
                    }
                }
        });
    });




