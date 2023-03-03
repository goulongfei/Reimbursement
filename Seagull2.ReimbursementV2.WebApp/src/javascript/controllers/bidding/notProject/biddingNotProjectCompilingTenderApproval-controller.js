define(['app', 'commonUtilExtend', 'enterpriseShowExtend', 'leftNavExtend', 'biddingSynthesizeExtend', 'useCostCenterExtend'], function (app) {
    app.controller('biddingNotProjectCompilingTenderApproval_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowAdminMoveTo = false; //超级发送  
            //设置审批意见
            rcTools.setOptions($scope, "编制招标信息", -1);
            //基本信息
            $scope.baseInfo = {
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
                // 采购时间安排信息
                purchaseDateArrangeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'DraftReadOnly',
                },
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false,
                    'fileNumLimit': 10
                },
                fileReady: true,
                // 入围供应商信息
                supplierScopeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'Approval',
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "Draft",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
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
                linkName: "拟单"
            }

            //排序
            $scope.sortNo = function (item) {
                angular.forEach($scope.viewModel.supplierScopeList, function (v) {
                    if (item.sortNo < v.sortNo) {
                        v.sortNo = v.sortNo - 1;
                    }
                });
            };
            $rootScope.$on("$processRefreshed", function (event, data) {
                //设置审批意见
                rcTools.setOptions(data, "编制招标信息", -1);
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


