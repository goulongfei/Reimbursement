define([
    'app',
    'commonUtilExtend',
    'biddingSynthesizeExtend',
    'leftNavExtend'
], function (app) {
    app.controller('biddingLandDevelopCancelTenderReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（土地开发类）";
            $scope.isOpinionsShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;
            });              
            
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
                //单选人员
                selectRadioPeople: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "CancelTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                    isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                    isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
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
                fileReady: true,
                //获取供应商回标IP
                getReplyBiddingReplyIP: function (supplierCode) {
                    var replyIP = "";
                    if ($scope.viewModel.isShowIP) {
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSubmitList.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSubmitList[i].supplierCode == supplierCode && $scope.viewModel.supplierReplyBiddingInfoSubmitList[i].isReplyBidding) {
                                replyIP = $scope.viewModel.supplierReplyBiddingInfoSubmitList[i].replyIP + "/" + $scope.viewModel.supplierReplyBiddingInfoSubmitList[i].replyMAC;
                                break;
                            }
                        }
                    }
                    return replyIP;
                }
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


