define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopTechnologyEvaluteTenderReadOnly_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                if ($scope.sceneId == "DefaultCirculationScene" || $scope.viewModel.isAdmin) {
                    $scope.wfOperateOpts.allowCirculate = true;//传阅 
                }
                //基本信息
                $scope.baseInfo = {
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                    },
                    fileReady: true,
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'TechnologyEvaluteTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //查找技术标
                    getSupplierReplyBiddingInfo: function (supplierCode) {
                        var supplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSubmitList.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSubmitList[i].supplierCode == supplierCode) {
                                supplierReplyBiddingInfo = $scope.viewModel.supplierReplyBiddingInfoSubmitList[i];
                                break;
                            }
                        }
                        return supplierReplyBiddingInfo;
                    }
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });