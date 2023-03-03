define(['app', 'enterpriseShowExtend', 'commonUtilExtend', 'leftNavExtend', 'biddingSynthesizeExtend', 'useCostCenterExtend'], function (app) {
    app.controller('biddingNotProjectCompilingTenderReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            if ($scope.wfOperateOpts.allowMoveTo)
                $scope.wfOperateOpts.allowComment = true; //评论              
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowRejection = false;//退回 
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
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
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "Draft",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                fileReady: true
            };
            $scope.settings = {
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
                isDraftReadOnly: false,
                isApproval: false
            }
            //超管查看
            if ($scope.viewModel.isAdmin) {
                $scope.settings.isApproval = true;
            }
            if ($scope.viewModel.formAction.actionStateCode === 1) {
                $scope.settings.isDraftReadOnly = true;
            }

            //排序
            $scope.sortNo = function (item) {
                angular.forEach($scope.viewModel.supplierScopeList, function (v) {
                    if (item.sortNo < v.sortNo) {
                        v.sortNo = v.sortNo - 1;
                    }
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


