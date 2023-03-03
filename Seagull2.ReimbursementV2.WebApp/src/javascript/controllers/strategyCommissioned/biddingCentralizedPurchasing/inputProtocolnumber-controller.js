define(['app', 'leftNavExtend'], function (app) {
    app.controller('inputProtocolnumber_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "InputProtocolnumber",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
            };
            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");
            var validData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus, function (item) {
                    if (!item.agreementNo) {
                        modelStateDictionary.addModelError("协议信息", "供应商【" + item.supplierName + "】协议编号不能为空");
                    }
                });
                return modelStateDictionary;
            };
            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        var result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
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


