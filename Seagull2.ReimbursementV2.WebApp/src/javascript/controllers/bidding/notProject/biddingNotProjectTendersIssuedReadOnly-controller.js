define(['app', 'leftNavExtend', 'commonUtilExtend','biddingSynthesizeExtend'], function (app) {
    app.controller('biddingNotProjectTendersIssuedReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
                //单选人员
                selectRadioPeople: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
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
                    scene: 'SendTender',
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                fileReady: true
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
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


