define(
    [
        'app',
        'commonUtilExtend',
        'leftNavExtend',
        'dateTimePickerExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsClarigySummary_controller',
            function ($scope, viewData, wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools, sogWfControlOperationType, $rootScope, wfOperate) {

                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };

                // 设置 
                $scope.settings = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsClarigySummary",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    numberToChinese: function (round) {
                        return rcTools.numberToChinese(round);
                    },
                    //附件设置项
                    fileReady: true,
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    }
                };

                // 基本信息 
                $scope.baseInfo = {
                    // 设置是否发放澄清问卷
                    setIsGrantClarifyQuestionnaire: function (val) {
                        $scope.viewModel.purchaseOfBusinessOperations.isGrantClarifyQuestionnaire = val;
                        $scope.refreshProcess();
                    },
                };

                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '是否发放澄清问卷', attributeName: 'purchaseOfBusinessOperations.isGrantClarifyQuestionnaire', validator: new RequiredValidator('不能为空！') }
                    ]);
                    if ($scope.viewModel.purchaseOfBusinessOperations.isGrantClarifyQuestionnaire) {
                        if (!$scope.viewModel.purchaseOfBusinessOperations.clarifyDeadline) {
                            modelStateDictionary.addModelError('回复截止时间', '不能为空！');
                        }
                    }
                    return modelStateDictionary;
                };
               
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    model.option = null;
                    return model;
                }

                //提交数据
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
                            defer.resolve(getCleanModel());
                        }
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve(getCleanModel());
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        IsGrantClarifyQuestionnaire: $scope.viewModel.purchaseOfBusinessOperations.isGrantClarifyQuestionnaire,
                    };
                    if (param) {
                        wfOperate.refreshProcess('/BiddingBusinessOperationsClarigySummaryWf', $scope.currentActivityId, null, param, true);
                    }
                };
            }
        );
    });