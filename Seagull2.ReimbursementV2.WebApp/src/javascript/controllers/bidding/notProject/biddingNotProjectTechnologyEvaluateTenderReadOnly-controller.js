define([
    'app',
    'commonUtilExtend', 'leftNavExtend'], function (app) {
        app.controller('biddingNotProjectTechnologyEvaluateTenderReadOnly_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                if ($scope.sceneId == "DefaultCirculationScene" || $scope.viewModel.isAdmin) {
                    $scope.wfOperateOpts.allowCirculate = true;//传阅 
                }
                //基本信息
                $scope.baseInfo = {
                    //是否显示合计中标金额
                    isAllSupplierFinalQuoteAmount: false,
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
                        scene: 'TechnologyEvaluteTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    fileReady: true,
                   
                    //查找技术标
                    getSupplierReplyBiddingInfo: function (supplierCode) {
                        var supplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSaves.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSaves[i].supplierCode == supplierCode) {
                                supplierReplyBiddingInfo = $scope.viewModel.supplierReplyBiddingInfoSaves[i];
                                break;
                            }
                        }
                        return supplierReplyBiddingInfo;
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
                        default:
                            defer.resolve(null);
                            break;
                    }
                };
            });
    });


