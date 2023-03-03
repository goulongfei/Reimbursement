define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('directCommissionedBusinessOperationsApplicationReadOnly_controller', 
            function ($scope, viewData) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(非开发运营类)";
                
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                //基本信息
                $scope.settings = {
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                        isAdmin: $scope.viewModel.isAdmin,
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'reason': $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode,
                        'contractAgreementScopeList': $scope.viewModel.contractAgreementScopeList,
                        'isBusinessAgreement': true,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfBusinessOperations.projectCode,
                            projectName: $scope.viewModel.purchaseOfBusinessOperations.projectName
                        },
                        'blackList': ['delegationAmount', 'reason', 'project'],
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            });
    });