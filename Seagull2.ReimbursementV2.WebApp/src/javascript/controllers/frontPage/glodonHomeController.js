define([
    "app",
], function (app) {
        app.controller('glodonHomeController', function ($scope, $http, wfWaiting, seagull2Url, $window, configure, $location) {
            $scope.common = {};
            configure.getConfig($scope.common, 'common');
            $scope.openHome = function () {
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl("/GlodonServe/GetTicket") + "?account=null&type=1", { cache: false })
                    .success(function (data) {
                        wfWaiting.hide();
                        dataForm = data.replace(/"/g, "");
                        var url = $scope.common.glodonBase + "/?ticket=" + dataForm;
                        $window.open(url, '_self');
                    });
            };
            $scope.openHome();
        });
});

