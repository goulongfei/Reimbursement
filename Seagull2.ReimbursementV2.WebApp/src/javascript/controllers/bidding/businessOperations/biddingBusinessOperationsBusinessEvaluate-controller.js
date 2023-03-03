define(
    [
        'app',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsBusinessEvaluate_controller', 
            function ($scope, viewData, wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
                sogWfControlOperationType) {

                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.wfOperateOpts.allowCirculate = false;//传阅

                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100,
                    precision: -1
                };

                // 设置 
                $scope.settings = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsBusinessEvaluate",
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
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },

                };
                
                //验证
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    // 商务评标文件
                    var businessEvaluateFileUploaded = false;
                    if ($scope.viewModel.businessEvaluateFile && angular.isArray($scope.viewModel.businessEvaluateFile.clientFileInformationList)) {
                        for (var i = 0; i < $scope.viewModel.businessEvaluateFile.clientFileInformationList.length; i++) {
                            var item = $scope.viewModel.businessEvaluateFile.clientFileInformationList[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                businessEvaluateFileUploaded = true;
                            }
                        }
                    }
                    if (businessEvaluateFileUploaded === false) {
                        modelStateDictionary.addModelError('商务评标文件', '请上传！');
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
                $scope.baseInfo.init();
            }
        );
    });