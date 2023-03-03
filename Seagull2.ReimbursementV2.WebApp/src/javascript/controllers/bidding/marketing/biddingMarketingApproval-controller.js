define(
    [
        'app',
         'biddingSynthesizeExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingApproval_controller', [
            '$scope', 'viewData','seagull2Url','wfWaiting','$http',
        function ($scope, viewData, seagull2Url, wfWaiting, $http) {

            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(营销类)";

            $scope.isOpinionsShow = false;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.processId == 'InputOpinion')
                    $scope.isOpinionsShow = true;

                //审批意见是否显示
                if (v.processId != 'InputOpinion')
                    $scope.isApprovalShow = true;
            });
                
            $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送  
            $scope.wfOperateOpts.allowCirculate = true;//传阅  
            $scope.wfOperateOpts.allowRejection = viewData.sceneId == "PurchaseApproval" ? true : false;//退回
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowDoWithdraw = viewData.sceneId == "PurchaseApprovalReadOnly" ? true : false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印  
            if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                $scope.wfOperateOpts.allowSave = false;//保存
                $scope.wfOperateOpts.allowRejection = false;//退回
            }
            if ($scope.viewModel.isShowTopButton) {
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//退回
            }
            if ($scope.sceneId == 'Draft' || $scope.sceneId == 'PurchaseApproval' || $scope.sceneId == 'DefaultCirculationScene' || $scope.sceneId == 'ApprovalEdit' || $scope.sceneId == 'Approval' || $scope.viewModel.isAdmin) {
                $scope.isApproval = true;
            } else {
                $scope.isApproval = false;
            }
            //基本信息
            $scope.baseInfo = {
                // 采购时间安排信息
                purchaseDateArrangeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'DraftReadOnly',
                    'purchaseBase': $scope.viewModel.purchaseBase,
                    'priceFile': $scope.viewModel.priceFile,
                    'project': {
                        projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                        projectName: $scope.viewModel.purchaseOfMarketing.projectName
                    },
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
                // 入围供应商信息
                supplierScopeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'Approval',
                    'isshowenterpriseCheck': 'true',
                    'purchaseBase': $scope.viewModel.purchaseBase,
                    'priceFile': $scope.viewModel.priceFile,
                    'project': {
                        projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                        projectName: $scope.viewModel.purchaseOfMarketing.projectName
                    },
                },
            };

            //如果有上流流程信息，则显示出
            if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                $scope.baseInfo.isShowUpstreamProcessMarketing = true;
            }

            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };

        }]);
    });