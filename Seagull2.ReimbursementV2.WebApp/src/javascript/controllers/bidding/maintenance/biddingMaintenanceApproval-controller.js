define(
    [
        'app',
        'commonUtilExtend',
         'biddingSynthesizeExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceApproval_controller', [
            '$scope', 'viewData', '$rootScope',
            function ($scope, viewData, $rootScope) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";
              
                $scope.isOpinionsShow = false;
                $scope.isApprovalShow = false;
                angular.forEach($scope.opinions, function (v, i) {
                    //评价意见是否显示
                    if (v.processId == 'InputOpinion')
                        $scope.isOpinionsShow = true;
                    //审批意见是否显示
                    if ( v.processId != 'InputOpinion')
                        $scope.isApprovalShow = true;
                });
                var scene = "";
                if ($scope.sceneId=="PurchaseApproval") {
                    scene = "Approval"
                } else {
                    scene = "DraftReadOnly"
                }

                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = viewData.sceneId == "PurchaseApprovalReadOnly" ? true : false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印  
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                    $scope.wfOperateOpts.allowRejection = false;//退回
                }
                if (viewData.sceneId == "PurchaseApprovalReadOnly") {
                    $scope.wfOperateOpts.allowRejection = false;//退回
                    $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
                }
                // 设置
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
                    isApproval: false
                };
                if ($scope.sceneId == 'Draft' || $scope.sceneId == 'PurchaseApproval' || $scope.sceneId == 'DefaultCirculationScene' || $scope.sceneId == 'ApprovalEdit' || $scope.sceneId == 'Approval' || $scope.viewModel.isAdmin) {
                    $scope.settings.isApproval = true;
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
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        },
                    },
                    // 入围供应商信息
                    supplierScopeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': scene,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
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
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.settings.getTransitionName(data.wfOperateOpts.transitionKey);
                });
                $scope.settings.getTransitionName($scope.wfOperateOpts.transitionKey);

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

            }]);
    });