define(
    [
        'app',
        'biddingSynthesizeExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseDraftApproval_controller', [
            '$scope', 'viewData', '$rootScope',
            function ($scope, viewData, $rootScope) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                if (viewData.wfOperateOpts.sendButtonName == "已阅") { 
                    viewData.wfOperateOpts.allowSave = false;//保存 
                }
                // 设置
                $scope.settings = {
                    //附件设置项
                    fileopts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0,
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: 'DraftReadOnly',
                        isshowenterpriseCheck: true,
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "Draft",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
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
                    isApproval: true,
                    linkName: "拟单"
                };


                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
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