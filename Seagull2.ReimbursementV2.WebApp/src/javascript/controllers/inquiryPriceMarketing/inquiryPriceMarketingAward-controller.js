define([
    'app',
    'biddingSynthesizeExtend',
    'signContractExtend'
], function (app) {
    app.controller('inquiryPriceMarketingAward_controller', [
        '$scope', '$rootScope', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
        function ($scope, $rootScope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "询价(营销类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowComment = false;  //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            //设置
            $scope.settings = {
                //附件设置项
                fileopts: {
                    'auto': true,
                    'preview': false,
                    'resourceId': $scope.viewModel.resourceID,
                },
                // 金额控件
                moneyOpts: {
                    min: 1,
                    max: 999999999,
                    precision: 2
                },
                //中标情况
                signContractOpts: {
                    scene: 'Award',
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    awardSupplierList: $scope.viewModel.option.awardSupplierList,
                    supplierScopeList: $scope.viewModel.supplierScopeList
                }
            }
            // 基本信息
            $scope.baseInfo = {
                // 营销费用预算变更
                marketingBudgetAmountChange: function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        $scope.refreshProcess();
                    }
                }
            }
            $scope.$watch('viewModel.purchaseOfMarketing.marketingBudgetAmount', $scope.baseInfo.marketingBudgetAmountChange);
            //发送前数据校验
            var checkData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var error = ValidateHelper.validateData($scope.viewModel, [
                    { key: '营销费用预算', attributeName: 'purchaseOfMarketing.marketingBudgetAmount', validator: new RequiredValidator("不能为空！") }
                ]);
                // 营销费用预算
                if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == 0)
                    error.addModelError("营销费用预算", "不能为0!");
                // 中标情况
                for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                    var item = $scope.viewModel.perSignContractInfoList[i];
                    if (!item.supplierCode) {
                        error.addModelError('中标情况第' + (i + 1) + '行，拟推荐中标单位(合同他方)', '请选择！');
                    }
                    if (item.perSignContractAmount) {
                        angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                            if (item.supplierCode === supplier.supplierCode) {
                                if (item.perSignContractAmount != supplier.finalQuoteAmount)
                                    error.addModelError('中标情况第' + (i + 1) + '行，拟定合同价', '与中标供应商最终报价不一致！');
                                if (item.perSignContractAmount > $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount)
                                    error.addModelError('中标情况第' + (i + 1) + '行，拟定合同价', '不能超过营销费用预算金额！');
                            }
                        });
                    }
                    if (!item.isBottomPriceWin && !item.notBottomPriceWinReason) {
                        error.addModelError('中标情况第' + (i + 1) + '行，未采用最低价原因', "不能为空");
                    }
                    if (!item.operatorUser) {
                        error.addModelError('中标情况第' + (i + 1) + '行，合同经办人', '请选择！');
                    }
                }
                if ($scope.viewModel.awardReportFile == null || $scope.viewModel.awardReportFile.length == 0)
                    error.addModelError("询价定标文件", "询价定标文件不能为空");
                // 审批流
                if (angular.isArray($scope.opinionOpts.options) === false || $scope.opinionOpts.options.length === 0) {
                    error.addModelError('审批流程', '审批人不能为空！');
                }
                if (!error.isValid()) {
                    sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                    sogValidator.broadcastResult(error.get());
                    return false;
                }
                return true;
            }
            //附件是否上传完成
            var checkFileData = function () {
                var retrunFlag = true;
                if ($scope.viewModel.awardReportFile != null && $scope.viewModel.awardReportFile.length > 0) {
                    angular.forEach($scope.viewModel.awardReportFile, function (item) {
                        if (!item.uploaded) {
                            retrunFlag = false;
                        }
                    });
                }
                if ($scope.viewModel.noTheLowestPriceWinFile != null && $scope.viewModel.noTheLowestPriceWinFile.length > 0) {
                    angular.forEach($scope.viewModel.purchaseOfMarketing.otherFile, function (item) {
                        if (!item.uploaded) {
                            retrunFlag = false;
                        }
                    });
                }
                if ($scope.viewModel.otherFile != null && $scope.viewModel.otherFile.length > 0) {
                    angular.forEach($scope.viewModel.purchaseOfMarketing.otherFile, function (item) {
                        if (!item.uploaded) {
                            retrunFlag = false;
                        }
                    });
                }
                if (!retrunFlag) {
                    sogModal.openAlertDialog('提示', '附件未上传完毕');
                }
                return retrunFlag;
            };
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    if (checkFileData()) {
                        if (checkData(e)) {
                            return defer.resolve($scope.viewModel)
                        }
                    }
                } else if (e.operationType === sogWfControlOperationType.Save) {
                    return defer.resolve($scope.viewModel);
                }
            };
            // 刷新流程
            $scope.refreshProcess = function () {
                //改成传页面对象
                wfOperate.refreshProcess('/InquiryPriceMarketingAwardWf', $scope.currentActivityId, null, $scope.viewModel, true);
            };
            $rootScope.$on("$processRefreshed", function (event, data) {
                rcTools.setOpinionOpts(data.opinionOpts.options);
                rcTools.setProcessNavigator(data.processNavigator);
                angular.extend($scope.opinionOpts, data.opinionOpts);
            });
        }
    ]);
})