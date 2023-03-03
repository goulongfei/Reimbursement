define([
    'app',
    'contractAgreementExtend',
    'signContractExtend',
    'leftNavExtend'
], function (app) {
    app.controller('biddingProjectDefineStartupContract_controller', [
        '$scope', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
        function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            //设置
            $scope.settings = {
                //合约规划
                contractAgreementOpts: {
                    model: 'readOnly',
                    isAdmin: $scope.viewModel.isAdmin
                },
                //中标情况
                signContractOpts: {
                    scene: 'StartupContract',
                    contractAgreementScopeList: $scope.viewModel.contractAgreementScopeList
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: 'BiddingProjectDefineStartupContract',
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                    actionTypeCode: $scope.viewModel.formAction.actionTypeCode
                }
            }
            //数据有效性的检验
            var validData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        Key: '', attributeName: '', validator: new RequiredValidator('')
                    }]);

                if ($scope.viewModel.perSignContractInfoList.length) {
                    angular.forEach($scope.viewModel.perSignContractInfoList, function (v, i) {
                        var key = '第' + (i + 1) + '行供应商';
                        if (v.operatorUser == null || v.operatorUser == undefined) {
                            modelStateDictionary.addModelError("合同经办人", key + "合同经办人不能为空");
                        }
                    });
                }
                return modelStateDictionary;
            }
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                var result;
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    result = validData();
                    if (!result.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                        sogValidator.broadcastResult(result.get());
                        defer.reject($scope.viewModel);
                    } else {
                        defer.resolve($scope.viewModel);
                    }
                }
                return defer.resolve($scope.viewModel);
            }
        }
    ]);
});