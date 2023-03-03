define([
    'angular',
    'app'
], function (angular, app) {
    // 退费状态
    app.directive("refundProgress", function () {
        return {
            restrict: 'A',
            template: '<a ng-click="open()" style="color: blue; text- decoration: underline;">查看</a>',
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, sogModal) {
                $scope.open = function () {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/refundProgress.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    promise = sogModal.openDialog(template, '查看保证金退还进度', [
                        '$scope', "configure", "sogModal", 'wfWaiting', "$http", "configure", "seagull2Url", "$window", "errorDialog",
                        function ($modelScope, configure, sogModal, wfWaiting, $http, configure, seagull2Url, $window, errorDialog) {
                            $scope.common = {};
                            configure.getConfig($scope.common, 'common');
                            $modelScope.model = {
                            }
                            // 获取退费状态
                            function initInfo() {
                                wfWaiting.show();
                                $scope.isSuccess = false;
                                if (angular.isArray($scope.data) == false) { return; }
                                var param = { resourceID: '', businessType: $scope.opts.businessType };
                                if (angular.isArray($scope.data) && $scope.data.length > 0) {
                                    param.resourceID = $scope.data[0].resourceID;
                                }
                                if (angular.isObject(param)) {
                                    $http.post(seagull2Url.getPlatformUrl('/Charging/GetRefundReturnFormStatus'), param)
                                        .success(function (data) {
                                            $scope.isSuccess = (data && data.length > 0);
                                            for (var i = 0; i < data.length; i++) {
                                                for (var y = 0; y < $scope.data.length; y++) {
                                                    var item = $scope.data[y];
                                                    if (item.code == data[i].code) {
                                                        item.cashReturnStateCode = data[i].formStatus;
                                                        if (!item.cashReturnStateCode) {
                                                            item.cashReturnStateName = "--";
                                                        }
                                                        else if (item.cashReturnStateCode === 1) {
                                                            item.cashReturnStateName = "退费中";
                                                        }
                                                        else if (item.cashReturnStateCode === 2) {
                                                            item.cashReturnStateName = "已退还";
                                                        }
                                                        else if (item.cashReturnStateCode === 3) {
                                                            item.cashReturnStateName = "退费失败";
                                                        }
                                                        else if (item.cashReturnStateCode === 4) {
                                                            item.cashReturnStateName = "合同未签订";
                                                        }
                                                        else if (item.cashReturnStateCode === 5) {
                                                            item.cashReturnStateName = "合同签订中";
                                                        }
                                                        else {
                                                            item.cashReturnStateName = null;
                                                        }
                                                    }
                                                }
                                            }
                                            wfWaiting.hide();
                                        })
                                        .error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "获取保证金退还状态异常");
                                            $scope.isSuccess = false;
                                            wfWaiting.hide();
                                        });
                                }
                                else { wfWaiting.hide(); }
                            }

                            //重新发起退费
                            $modelScope.model.reStartRefund = function (item) {
                                wfWaiting.show();
                                var param = {
                                    code: item.code,
                                    resourceID: $scope.$parent.resourceId,
                                    activityID: $scope.$parent.currentActivityId,
                                    route: $scope.opts.route,
                                    businessType: $scope.opts.businessType,
                                }
                                $http({
                                    method: 'POST',
                                    url: seagull2Url.getPlatformUrl('/Charging/ReStartRefund'),
                                    data: param
                                }).error(function (data, status) {
                                    wfWaiting.hide();
                                    if (status === 400) {
                                        sogModal.openAlertDialog("提示", data.message);
                                    }
                                    else {
                                        errorDialog.openErrorDialog(data, status, "重新发起保证金退费异常！");
                                    }
                                })
                                    .success(function (data) {
                                        wfWaiting.hide();
                                        item.cashReturnStateCode = data.cashReturnStateCode;
                                        item.cashReturnStateName = data.cashReturnStateName;
                                        item.cashReturnStateURL = data.cashReturnStateURL;
                                        item.cashReturnResourceID = data.cashReturnResourceID;
                                        sogModal.openAlertDialog("提示", "重新发起保证金退费成功！");
                                    });
                            }

                            // 查看保证金退费流程
                            $modelScope.model.showRefund = function (index, item) {
                                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                                    .success(function (data) {
                                        var urlat = data;
                                        if (urlat !== null) {
                                            urlat = urlat.replace(/"/g, "");
                                            var url = $scope.common.webUrlBase + item.cashReturnStateURL + "&_at=" + urlat;
                                            $window.open(url, '_blank');
                                        }
                                    })
                                    .error(function (data, status) {
                                        errorDialog.openErrorDialog(data, status, "查看保证金退费流程异常");
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