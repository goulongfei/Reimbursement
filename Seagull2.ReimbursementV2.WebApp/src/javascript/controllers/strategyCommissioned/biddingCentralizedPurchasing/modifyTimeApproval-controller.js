define(['app', 'commonUtilExtend'], function (app) {
    app.controller('modifyTimeApproval_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData,
            sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, $window, configure, rcTools) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "调整采购时间";
            $scope.isOpinionsShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;
            });
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印

            //设置审批意见
            rcTools.setOptions($scope, "调整采购时间", 1);

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

             $rootScope.$on("$processRefreshed", function (event, data) {
                 //设置审批意见
                 rcTools.setOptions(data, "调整采购时间", 1);
                });

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


