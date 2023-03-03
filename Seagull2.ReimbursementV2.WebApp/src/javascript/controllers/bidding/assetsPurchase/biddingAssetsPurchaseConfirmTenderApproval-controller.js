define(
    [
        'app',
        'biddingSynthesizeExtend',
        'fixedAssetsExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseConfirmTenderApproval_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url', 'rcTools', 'errorDialog', 'configure', '$window','$rootScope',
            function ($scope, viewData, $http, seagull2Url, rcTools, errorDialog, configure, $window, $rootScope) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态 
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回 
                viewData.wfOperateOpts.allowPrint = false;//打印 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowSave = false;//保存 
                }
                
                // 设置 
                $scope.settings = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "ConfirmTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                    },
                    //固定资产清单
                    fixedAssetsOpts: {
                        fixedAssetsList: $scope.viewModel.fixedAssetsList,
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
                    isSpreadInfo: false,
                    spreadButtonName: "展开",
                    isApproval: false,
                    linkName: "定标"
                };
                if ($scope.sceneId == 'Draft' || $scope.sceneId == 'PurchaseApproval' || $scope.sceneId == 'DefaultCirculationScene' || $scope.sceneId == 'ApprovalEdit' || $scope.sceneId == 'Approval' || $scope.viewModel.isPermissionAdmin) {
                    $scope.settings.isApproval = true;
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
                                var route = "";
                                switch (routesType) {
                                    case "evaluateTenderSummary":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "EvaluateTenderSummary") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                route = $scope.viewModel.processActivityInfoList[i].activityStateName;
                                                break;
                                            }
                                        }
                                        break;
                                    case "draft":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "Draft") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                route = $scope.viewModel.processActivityInfoList[i].activityStateName;
                                                break;
                                            }
                                        }
                                        break;
                                }
                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + route + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID;

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

                // 基本信息                
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },

                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.settings.getTransitionName(data.wfOperateOpts.transitionKey);
                });
                $scope.settings.getTransitionName($scope.wfOperateOpts.transitionKey);

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
                $scope.baseInfo.init();
            }]);
    });