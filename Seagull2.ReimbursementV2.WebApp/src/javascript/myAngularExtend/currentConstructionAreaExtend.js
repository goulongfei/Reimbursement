define([
    'angular',
    'app'
], function (angular, app) {
    // 退费状态
    app.directive("currentConstructionArea", function () {
        return {
            restrict: 'A',
            template: '<a ng-click="open()" style="color: blue; text- decoration: underline;">{{opts.confiscatedLandArea}}m<sup>2</sup></a>',
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, sogModal) {
                $scope.open = function () {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/currentConstructionArea.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    promise = sogModal.openDialog(template, '与远洋合作在施面积', [
                        '$scope', "configure", "sogModal", 'wfWaiting', "$http", "configure", "seagull2Url", "$window", "errorDialog",
                        function ($modelScope, configure, sogModal, wfWaiting, $http, configure, seagull2Url, $window, errorDialog) {
                            $scope.common = {};
                            configure.getConfig($scope.common, 'common');
                            $modelScope.model = {
                            }
                            function initInfo() {
                                wfWaiting.show();
                                $scope.isSuccess = false;
                                if (!$scope.opts) {
                                    wfWaiting.hide();
                                    return;
                                }
                                $http.post(seagull2Url.getPlatformUrl('/ProjectInfo/FetchSupplierConfiscatedLandArea?supplierCode=' + $scope.opts.supplierCode))
                                    .success(function (data) {
                                        $scope.isSuccess = !!data;
                                        $scope.data = data;
                                        wfWaiting.hide();
                                    })
                                    .error(function (data, status) {
                                        errorDialog.openErrorDialog(data, status, "获取合作在施面积异常");
                                        $scope.isSuccess = false;
                                        wfWaiting.hide();
                                    });
                            }
                            initInfo();
                        }], $scope, { containerStyle: { width: '70%' } },
                        function (v, defer) {
                            defer.resolve(v);//确定 
                            $scope.data = v.name;
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }

            }
        };
    });
});