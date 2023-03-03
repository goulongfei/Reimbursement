define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopDraftReadOnly_controller', [
           '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal,
                sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter) {

                angular.extend($scope, viewData);

                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";

                
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowDoWithdraw = true;//撤回
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }
                //基本信息
                $scope.baseInfo = {
                    // 入围供应商信息
                    supplierScopeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                        'isshowenterpriseCheck': true,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "Draft",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                    },
                };
                //超管查看
                if ($scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

            }]);
    });