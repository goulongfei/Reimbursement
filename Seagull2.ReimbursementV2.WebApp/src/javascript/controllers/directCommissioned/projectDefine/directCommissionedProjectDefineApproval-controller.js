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

    	app.controller('directCommissionedProjectDefineApproval_controller', [
            '$scope', '$http', 'viewData', 'wfWaiting', 'sogModal', 'seagull2Url', 'sogOguType',
            function ($scope, $http, viewData, wfWaiting, sogModal, seagull2Url, sogOguType) {

                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowAdminMoveTo = false;//超级发送
                 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                if (viewData.sceneId == "DefaultCirculationScene") {
                    viewData.wfOperateOpts.allowDoWithdraw = false; //撤回
                }

                $scope.mainTitle = '直接委托';
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
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
                        'model':'readOnly',
                        'isAdmin':true,
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 4,
                        'scene': 'application',
                        'contractAgreementScopeList': $scope.viewModel.contractAgreementScopeList,
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });