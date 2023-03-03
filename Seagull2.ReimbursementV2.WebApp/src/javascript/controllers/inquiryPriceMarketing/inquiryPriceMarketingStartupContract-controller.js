define([
    'app',
    'biddingSynthesizeExtend',
    'signContractExtend',
    'leftNavExtend'
], function (app) {
    app.controller('inquiryPriceMarketingStartupContract_controller', [
        '$scope', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
        function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "询价(营销类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowComment = false;  //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印 
            //设置
            $scope.settings = {
                //中标情况
                signContractOpts: {
                    scene: 'StartupContract',
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "InquiryPriceMarketingStartupContract",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                    actionTypeCode: $scope.viewModel.formAction.actionTypeCode
                }
            }
            //数据有效性的检验
            var checkData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var error = ValidateHelper.validateData($scope.viewModel, [
                    {
                        Key: '', attributeName: '', validator: new RequiredValidator('')
                    }]);
                // 中标情况
                for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                    if (!$scope.viewModel.perSignContractInfoList[i].operatorUser) {
                        error.addModelError('中标情况第' + (i + 1) + '行，合同经办人', '请选择！');
                    }
                }
                if (!error.isValid()) {
                    sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                    sogValidator.broadcastResult(error.get());
                    return false;
                }
                return true;
            }
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    if (checkData(e)) {
                        return defer.resolve($scope.viewModel)
                    } else {
                        return defer.reject($scope.viewModel);
                    }
                }
                return defer.resolve($scope.viewModel);
            }
        }
    ]);
})