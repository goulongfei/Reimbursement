define(['app', 'commonUtilExtend', 'leftNavExtend'], function (app) {
    app.controller('biddingNotProjectCancelTenderApproval_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.wfOperateOpts.allowComment = true; //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底               
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowAdminMoveTo = false; //超级发送  
            //设置审批意见
            rcTools.setOptions($scope, "废标", -1);
            //基本信息
            $scope.baseInfo = {
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
                //单选人员
                selectRadioPeople: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                //采购时间安排
                purchaseDateArrangeInfoPEMus: function () {
                    var purchaseDateArrangeInfoPEMuList = [];
                    angular.forEach($scope.viewModel.purchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 1) {
                            purchaseDateArrangeInfoPEMuList.push(item);
                        }
                    });
                    return purchaseDateArrangeInfoPEMuList;
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "CancelTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
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
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSubmits.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSubmits[i].supplierCode == supplierCode && $scope.viewModel.supplierReplyBiddingInfoSubmits[i].isReplyBidding) {
                                replyIP = $scope.viewModel.supplierReplyBiddingInfoSubmits[i].replyIP + "/" + $scope.viewModel.supplierReplyBiddingInfoSubmits[i].replyMAC;
                                break;
                            }
                        }
                    }
                    return replyIP;
                }
            };
            $rootScope.$on("$processRefreshed", function (event, data) {
                //设置审批意见
                rcTools.setOptions(data, "废标", -1);
            });
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


