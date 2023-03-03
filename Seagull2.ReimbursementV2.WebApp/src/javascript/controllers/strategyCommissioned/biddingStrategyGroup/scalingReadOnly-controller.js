define(['app', 'commonUtilExtend', 'leftNavExtend', 'enterpriseShowExtend', 'biddingSynthesizeExtend'], function (app) {
    app.controller('scalingReadOnly_controller',
        function ($scope, $http, seagull2Url, wfWaiting, viewData, sogWfControlOperationType, sogValidator, configure, $window) {
            angular.extend($scope, viewData);
            $scope.common = {};
            configure.getConfig($scope.common, 'common');
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集团战采）";
            $scope.isOpinionsShow = true;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "ConfirmTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
            };

            //打开供应商详情页面
            $scope.OpenSupplier = function (code) {
                var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                $window.open(url);
            }

            //查看页面
            $scope.lookInfo = function (routesType, title) {
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = "";
                            var activityID = "";
                            switch (routesType) {
                                case "biddingStrategyGroupEvaluateTenderGather":
                                    for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                        if ($scope.viewModel.processActivityInfoList[i].activityStateName == "biddingStrategyGroupEvaluateTenderGather") {
                                            activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                            break;
                                        }
                                    }
                                    break;
                                case "biddingStrategyGroupCompilingTender":
                                    for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                        if ($scope.viewModel.processActivityInfoList[i].activityStateName == "biddingStrategyGroupCompilingTender") {
                                            activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                            break;
                                        }
                                    }
                                    break;
                            }
                            url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID;

                            if (url.indexOf("?") == -1) {
                                url = url + "?_at=" + urlat;
                            } else {
                                url = url + "&_at=" + urlat;
                            }
                            $window.open(url, '_blank');
                        }

                    })
                    .error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, title + "异常");
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


