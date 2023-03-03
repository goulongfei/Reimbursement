define(
    [
        'app',
        'biddingSynthesizeExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingDraftReadOnly_controller', [
           '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal,
                sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter) {

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
                    if ( v.processId != 'InputOpinion')
                        $scope.isApprovalShow = true;
                });

                //检验数组
                if (Array.prototype.isPrototypeOf($scope.viewModel.purchaseDateArrangeInfoList) && $scope.viewModel.purchaseDateArrangeInfoList.length > 0) {
                    var purchaseDateArrangeInfoList = [];
                    angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (item) {
                        if (item.className == 1) {
                            purchaseDateArrangeInfoList.push(item);
                        }
                    });
                    $scope.viewModel.purchaseDateArrangeInfoList = purchaseDateArrangeInfoList;
                }

                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                //基本信息
                $scope.baseInfo = {
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
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
                        'scene': 'DraftReadOnly',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                    },
                };

                //超管查看
                if ($scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                }
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