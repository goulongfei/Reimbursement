define([
    'app',
    'commonUtilExtend', 'leftNavExtend', 'biddingSynthesizeExtend', 'useCostCenterExtend'], function (app) {
        app.controller('biddingNotProjectScalingApproval_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowAdminMoveTo = false; //超级发送
                //设置审批意见
                rcTools.setOptions($scope, "定标", -1);
                //基本信息
                $scope.baseInfo = {
                    //是否显示合计中标金额
                    isAllSupplierFinalQuoteAmount: true,
                    // 金额控件
                    moneyOpts: {
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'ConfirmTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    fileReady: true
                };

                $scope.settings = {
                    //判断审批是否是选择不同意退回
                    getTransitionName: function (transitionKey) {
                        if ($scope.opinionOpts.options.length > 0) {
                            angular.forEach($scope.opinionOpts.options, function (v) {
                                if (v.processId && v.processId !== "InputOpinion" && angular.isArray(v.nextStepCollection) && v.nextStepCollection.length > 0) {
                                    angular.forEach(v.nextStepCollection, function (itemSelect) {
                                        if (itemSelect.transitionKey === transitionKey) {
                                            $scope.viewModel.transitionName = itemSelect.name;
                                        }
                                    });
                                }
                            });
                        }
                    },
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
                    },
                    isSpreadInfo: false,
                    spreadButtonName: "展开",
                    isApproval: true,
                    linkName: "定标"
                }

                //查看页面
                $scope.lookInfo = function (routesType) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var activityID = "";
                                switch (routesType) {
                                    case "biddingNotProjectEvaluateTenderGather":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "EvaluateTenderSummary") {
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
                            errorDialog.openErrorDialog(data, status, "查看评标信息异常");
                            wfWaiting.hide();
                        });
                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    //设置审批意见
                    rcTools.setOptions(data, "定标", -1);
                    $scope.settings.getTransitionName(data.wfOperateOpts.transitionKey);
                });
                $scope.settings.getTransitionName($scope.wfOperateOpts.transitionKey);

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


