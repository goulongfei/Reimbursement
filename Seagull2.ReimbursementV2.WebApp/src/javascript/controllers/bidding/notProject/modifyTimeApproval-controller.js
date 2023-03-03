define(['app'], function (app) {
    app.controller('biddingNotProjectModifyTimeApproval_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData,
            sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, $window, configure) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "调整采购时间";
            
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //查看开标页面
            $scope.lookPurchaseInfo = function () {
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = $scope.viewModel.p_PurchaseDataArrangeAdjustRecordPEMu.purchaseUrl;

                            if (url.indexOf("?") == -1) {
                                url = url + "?_at=" + urlat;
                            } else {
                                url = url + "&_at=" + urlat;
                            }
                            $window.open(url, '_blank');
                        }

                    })
                    .error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "查看采购进度详情异常");
                        wfWaiting.hide();
                    });
            };
            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.Save:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.CancelProcess:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.Withdraw:
                        defer.resolve($scope.viewModel);
                        break;
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


