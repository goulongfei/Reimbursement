define(
    [
        'app',
        'commonUtilExtend',
        'contractAgreementExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsStartupContract_controller', 
            function ($scope, viewData, sogModal, ValidateHelper, sogValidator, sogWfControlOperationType, sogOguType) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 设置 
                $scope.settings = {
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                        isAdmin: $scope.viewModel.isAdmin,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsStartupContract",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //附件设置项
                    fileReady: true,
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                };

                // 基本信息 
                $scope.baseInfo = {
                    //关联合约
                    relatinCotractAgreement: function (contract) {
                        var viewPath = 'htmlTemplate/dialogTemplate/common/perSignBusinessAgreement.html';
                        var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                            promise = sogModal.openDialog(template, '查看所属合约', ["$scope", function ($modelScope) {
                                $modelScope.agreementData = [];
                                $modelScope.readOnly = true;
                                if (angular.isArray(contract.perSignContractAgreementScopeInfoList) && contract.perSignContractAgreementScopeInfoList.length > 0) {
                                    angular.forEach(contract.perSignContractAgreementScopeInfoList, function (perSignAgreement) {
                                        angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreementScope) {
                                            if (perSignAgreement.contractAgreementCode === agreementScope.contractAgreementCode) {
                                                var lookContractAgreement = {
                                                    projectName: agreementScope.projectName,
                                                    stageAreaName: agreementScope.stageAreaName,
                                                    contractAgreementName: agreementScope.contractAgreementName,
                                                    costTargetAmount: agreementScope.contractAgreementScope,
                                                };
                                                $modelScope.agreementData.push(lookContractAgreement);
                                            }
                                        });
                                    });
                                }

                            }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                                function (v, defer) {//50%
                                    defer.resolve(v);//确定                
                                }, function (v, defer) {
                                    defer.resolve(v);//取消
                                });
                    },
                }

                //验证
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);

                    // 选择合约规划
                    if ($scope.viewModel.isNeedAgreement === true) {
                        // 拟签订合同信息
                        if (angular.isArray($scope.viewModel.perSignContractInfoList)) {
                            for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                                var item = $scope.viewModel.perSignContractInfoList[i];
                                if (!item.operatorUser) {
                                    modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同经办人', '请选择！');
                                }
                            }
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
            }
        );
    });