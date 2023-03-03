define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'supplierInfoExtendV3',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierCategoryExtend',
        'negativeListExtend',
        'contractAgreementExtend'
    ],
    function (app) {

        app.controller('directCommissionedProjectDefineApprovalReadOnly_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData',
            '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType',
            'seagull2Url',
            'ValidateHelper', 'sogValidator',
            'sogOguType',
            '$filter',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter) {

                angular.extend($scope, viewData);
                
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowAdminMoveTo = false;//超级发送
                 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }

                $scope.mainTitle = '直接委托';
                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 4,
                        'scene': 'application',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'contractAgreementScopeList': $scope.viewModel.contractAgreementScopeList,
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });