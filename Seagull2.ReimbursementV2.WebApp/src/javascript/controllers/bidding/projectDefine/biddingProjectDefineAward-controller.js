define([
    'app',
    'commonUtilExtend',
    'biddingSynthesizeExtend',
    'contractAgreementExtend',
    'signContractExtend',
    'leftNavExtend'
], function (app) {
    app.controller('biddingProjectDefineAward_controller', [
        '$scope', '$rootScope', 'wfOperate', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'rcTools',
        function ($scope, $rootScope, wfOperate, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, rcTools) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            //设置
            $scope.settings = {
                //附件设置项
                fileopts: {
                    'auto': true,
                    'preview': false,
                    'resourceId': $scope.viewModel.resourceID,
                },
                numberToChinese: function (round) {
                    return rcTools.numberToChinese(round);
                },
                // 合约规划
                contractAgreementOpts: {
                    projectList: $scope.viewModel.projectScopeList,
                    stageAreaList: $scope.viewModel.stageAreaScopeList,
                    projectCode: $scope.viewModel.purchaseBase.useProjectCode,
                    projectName: $scope.viewModel.purchaseBase.useProjectName,
                    stageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                    stageAreaName: $scope.viewModel.purchaseBase.useStageAreaName,
                    useProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                    useStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                    useChargeCompanyCode: $scope.viewModel.purchaseBase.useChargeCompanyCode,
                    useCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                    expenditureTypeCode: $scope.viewModel.purchaseBase.expenditureTypeCode,
                    multipleSelect: true,
                    model: 'edit',
                    isAdmin: $scope.viewModel.isAdmin,
                    actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    beforAppend: function (v) {
                        var myContract = $scope.agreement.dataFormat(v); // 格式化到视图  
                        var isSelected = false;
                        if ($scope.viewModel.contractAgreementScopeList && $scope.viewModel.contractAgreementScopeList.length > 0) {
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                    var message = "合约[" + myContract.contractAgreementName + "]已选择！";
                                    sogModal.openAlertDialog("提示", message);
                                    isSelected = true;
                                    return;
                                }
                            });
                        };
                        if (!isSelected) {
                            $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount += myContract.costTargetAmount;
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                $scope.viewModel.contractAgreementScopeList = [];
                            }
                            $scope.viewModel.contractAgreementScopeList.push(myContract);
                            $scope.refreshProcess();
                        };
                    },
                    beforDelete: function () {
                        $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                        if (angular.isArray($scope.viewModel.contractAgreementScopeList)) {
                            for (var i = 0; i < $scope.viewModel.contractAgreementScopeList.length; i++) {
                                var agreement = $scope.viewModel.contractAgreementScopeList[i];
                                $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount += agreement.costTargetAmount;
                            }
                        };
                        $scope.refreshProcess();
                    },
                },
                //中标情况
                signContractOpts: {
                    scene: 'Award',
                    corporationScopeList: $scope.viewModel.corporationScopeList,
                    awardSupplierList: $scope.viewModel.option.awardSupplierList,
                    contractAgreementScopeList: $scope.viewModel.contractAgreementScopeList
                }
            }
            // 合约规划
            $scope.agreement = {
                // 获取的合约数据格式化
                dataFormat: function (data) {
                    var contractAgreementScope = {
                        projectCode: data.projectCode,
                        projectName: data.projectName,
                        stageAreaCode: data.stageAreaCode,
                        stageAreaName: data.stageAreaName,
                        contractAgreementCode: data.planContractCode,
                        contractAgreementName: data.planContractName,
                        contractAgreementTypeCode: data.contractPlanTypeCode,
                        contractAgreementTypeName: data.contractPlanTypeCnName,
                        costTargetAmount: data.costTarget,
                        costCourseName: "",
                        contractAgreementSplitInfoList: [],
                        isCostBelongStageArea: data.isCostBelongStageArea,
                        validStatus: true,
                    };
                    // 合约成本科目明细
                    if (angular.isArray(data.costCourseInfoController)) {
                        for (var i = 0; i < data.costCourseInfoController.length; i++) {
                            var item = data.costCourseInfoController[i];
                            var contractAgreementSplitInfo = {
                                projectCode: data.projectCode,
                                projectName: data.projectName,
                                stageAreaCode: data.stageAreaCode,
                                stageAreaName: data.stageAreaName,
                                contractAgreementCode: data.planContractCode,
                                contractAgreementName: data.planContractName,
                                costCourseCode: item.costCourseCode,
                                costCourseName: item.costCourseName,
                                costCourseLevelCode: item.costCourseLevelCode,
                                costTargetAmount: item.costTargetAmountWithTax,
                            };
                            contractAgreementScope.costCourseName += item.costCourseName + ";";
                            contractAgreementScope.contractAgreementSplitInfoList.push(contractAgreementSplitInfo);
                        }
                    }
                    // 被占用的合约
                    return contractAgreementScope;
                },
            };
            //数据有效性的检验
            var validData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        Key: '', attributeName: '', validator: new RequiredValidator('')
                    }]);
                // 选择合约规划 
                // 合约信息
                if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false || $scope.viewModel.contractAgreementScopeList.length === 0) {
                    modelStateDictionary.addModelError('合约规划', '请添加！');
                }
                // 中标情况
                if (angular.isArray($scope.viewModel.perSignContractInfoList) === false || $scope.viewModel.perSignContractInfoList.length === 0) {
                    modelStateDictionary.addModelError('中标情况', '中标供应商不能为空！');
                } else {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        var item = $scope.viewModel.perSignContractInfoList[i];
                        if (!item.contractName) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同名称', '不能为空！');
                        }
                        if (item.contractName && item.contractName.length > 256) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同名称', '不能大于256个字符！');
                        }
                        if (!item.corporationCode) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，甲方（法人公司）', '请选择！');
                        }
                        if (!item.supplierCode) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，他方（供应商）', '请选择！');
                        }
                        if (!item.perSignContractAmount) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同金额（元）', '不能为空！');
                        }
                        if (!item.operatorUser) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同经办人', '请选择！');
                        }
                        if (angular.isArray(item.perSignContractAgreementScopeInfoList) === false || item.perSignContractAgreementScopeInfoList.length === 0) {
                            modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，所属合约', '请选择！');
                        }
                    }
                }
                if (!$scope.viewModel.awardReportFile || $scope.viewModel.awardReportFile.length == 0) {
                    modelStateDictionary.addModelError("定标报告", "定标报告不能为空");
                }
                // 审批流
                if (angular.isArray($scope.opinionOpts.options) === false || $scope.opinionOpts.options.length === 0) {
                    modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
                }
                return modelStateDictionary;
            }
            //收集数据
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
                } else if (e.operationType === sogWfControlOperationType.Comment) {
                    var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                    promise.then(function () {
                        defer.resolve($scope.viewModel);
                    }, function () {
                        defer.reject($scope.viewModel);
                    });
                } else if (e.operationType === sogWfControlOperationType.Save) {
                    defer.resolve($scope.viewModel);
                } else {
                    defer.resolve($scope.viewModel);
                }
            };
            // 刷新流程
            $scope.refreshProcess = function () {
                //改成传页面对象
                wfOperate.refreshProcess('/BiddingProjectDefineAwardWf', $scope.currentActivityId, null, $scope.viewModel, true);
            };
            $rootScope.$on("$processRefreshed", function (event, data) {
                rcTools.setOpinionOpts(data.opinionOpts.options);
                rcTools.setProcessNavigator(data.processNavigator);
                angular.extend($scope.opinionOpts, data.opinionOpts);
            });
        }
    ]);
});