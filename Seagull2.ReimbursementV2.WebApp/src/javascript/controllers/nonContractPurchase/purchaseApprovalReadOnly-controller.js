define([
    'app',
    'corporationRadioSelector',
    'commonUtilExtend',
    'contractAgreementExtend',
], function (app) {
    app.controller('purchaseApprovalReadOnly_controller', [
        '$scope', 'viewData', 'sogModal', 
        function ($scope, viewData, sogModal) {

            /////////////////////////初始化////////////////////////
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = '无合同采购';
            if ($scope.viewModel.isNonContractAdditional)
                $scope.title = "无合同采购补录";
            //设置导航栏按钮状态
            viewData.wfOperateOpts.allowCirculate = false;//传阅
            viewData.wfOperateOpts.allowRejection = false;//退回
            viewData.wfOperateOpts.allowDoAbort = false;//作废 
            viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
            viewData.wfOperateOpts.allowPrint = false;//打印
            viewData.wfOperateOpts.allowSave = false;//保存
           
            viewData.wfOperateOpts.allowAdminMoveTo = false;//超级发送
            viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
            if (viewData.viewModel.isCirculated) {
                $scope.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
            }
            // 设置审批栏权限
            angular.forEach($scope.opinionOpts.options, function (item) {
                item.allowToBeAppended = false;
                item.allowToBeDeleted = false;
                item.allowToBeModified = false;
            });
            $scope.readOnly = true;
            //是否有返回款
            $scope.hasPrepaymentRefundList = [
                   { code: true, name: "是", checked: $scope.viewModel.purchaseOfNoContract.hasPrepaymentRefund },
                   { code: false, name: "否", checked: !$scope.viewModel.purchaseOfNoContract.hasPrepaymentRefund }
            ];
            // 设置
            $scope.baseInfo = {
                // 无合同采购申请报告
                purchaseOfNoContractApplicationFileOpts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'className': null,
                    'preview': false,
                    'fileNumLimit': 10,//附件最大上传个数
                },
                // 付款计算明细
                payCaculationDetailFileOpts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'className': null,
                    'preview': false,
                    'fileNumLimit': 10,//附件最大上传个数
                },
                // 收费依据文件
                chargeAccordingFileOpts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'className': null,
                    'preview': false,
                    'fileNumLimit': 10,//附件最大上传个数
                },
                //合约规划
                contractAgreementOpts: {
                    model: 'readOnly',
                },
                //合约规划
                contractAgreementOpts: {
                    projectCode: $scope.viewModel.purchaseOfNoContract.projectCode,
                    projectName: $scope.viewModel.purchaseOfNoContract.projectName,
                    stageAreaCode: $scope.viewModel.purchaseOfNoContract.stageAreaCode,
                    stageAreaName: $scope.viewModel.purchaseOfNoContract.stageAreaName,
                    readonly: true,
                    model: 'readOnly',
                    isAdmin: $scope.viewModel.isAdmin,
                    beforAppend: function (v) {
                        var myContract = dataFormat(v);// 格式化到视图
                        var delegationContract = [];
                        var isSelected = false;
                        angular.extend(delegationContract, myContract);  //复制一份合约列表，用于委托信息选择
                        delegationContract.disabled = false;
                        if ($scope.viewModel.contractAgreementScopeList.length > 0) {
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                    var message = "合约已选择！";
                                    sogModal.openAlertDialog("提示", message);
                                    isSelected = true;
                                    return;
                                }
                            });
                        };
                        if (!isSelected) {
                            $scope.viewModel.purchaseOfNoContract.purchaseCostTargetAmount += myContract.costTargetAmount;
                            $scope.viewModel.contractAgreementScopeList.push(myContract);
                        };
                    },
                    beforDelete: function () {
                        $scope.viewModel.purchaseOfNoContract.purchaseCostTargetAmount -= myContract.costTargetAmount;
                        $scope.api.deletePerSignContractAgreementScopeInfoList();
                    },
                },
                checkallotType: function (item) {
                    var viewPath = './views/nonContractPurchase/htmlTemplate/addCostAttributionDetail.html';
                    var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                    sogModal.openDialog(template, '自定义比例', ['$scope', function ($childModelScope) {
                        $childModelScope.readonly = $scope.readOnly;
                        $childModelScope.diyScaleOpts = {
                            min: 0,
                            max: 100
                        }
                        //显示自定义金额
                        angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                            if (c.diyApportionScale != undefined && c.diyApportionScale != 0) {
                                c.diyApportionAmount = (item.actualAmount * c.diyApportionScale) / 100;
                            }
                        });
                        $childModelScope.list = angular.copy(item.costTargetStageAreaProductTypeApportionInfoList);
                        $childModelScope.numOpts = {
                            min: 0,
                            max: 100,
                            precision: 2
                        }
                        $childModelScope.productTypeConf = {
                            currentPage: 1,
                            itemsPerPage: 6,
                            totalItems: 0,
                        };
                        //成本归属实际金额
                        $scope.unSharedAmountNew = item.actualAmount;
                        initInfo();
                        function initInfo() {
                            if (item.costTargetStageAreaProductTypeApportionInfoList) {
                                $childModelScope.productTypeList = item;
                                var a = 0;
                                angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                    if (item.actualAmount) {
                                        a += parseFloat(c.diyApportionScale);
                                    }
                                });
                                $childModelScope.unSharedScale = $scope.unSharedScaleNew - a;
                                $childModelScope.productTypeConf.totalItems = $childModelScope.list.length;
                            }
                            $scope.totalSharedAmount = item.actualAmount;
                        }
                    }], $scope, { containerStyle: { width: '320px;' } }, function (v, defer) {

                        item.costTargetStageAreaProductTypeApportionInfoList = v;
                        defer.resolve(v);
                    }, function (v, defer) {
                        defer.resolve(v);//取消
                    });
                },
                //成本归属每项的合计计算
                getEachTotalAmount: function () {
                    if ($scope.viewModel.contractAgreementScopeList.length > 0) {
                        var allCostTargetAmount = 0;
                        var allActualAmount = 0;
                        var allAccumulativeHappenedAmountWithTax = 0;
                        var allForecastHappenAmountWithTax = 0;
                        var allSurplusValueWithTax = 0;
                        angular.forEach($scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList, function (splitInfo) {
                            allCostTargetAmount += parseFloat(splitInfo.costTargetAmount);
                            allActualAmount += parseFloat(splitInfo.actualAmount);
                            allAccumulativeHappenedAmountWithTax += parseFloat(splitInfo.accumulativeHappenedAmountWithTax);
                            allForecastHappenAmountWithTax += parseFloat(splitInfo.forecastHappenAmountWithTax);
                            allSurplusValueWithTax += parseFloat(splitInfo.surplusValueWithTax);
                        });
                        $scope.viewModel.contractAgreementScopeList[0].allCostTargetAmount = allCostTargetAmount;
                        $scope.viewModel.contractAgreementScopeList[0].allActualAmount = allActualAmount;
                        $scope.viewModel.contractAgreementScopeList[0].allAccumulativeHappenedAmountWithTax = allAccumulativeHappenedAmountWithTax;
                        $scope.viewModel.contractAgreementScopeList[0].allForecastHappenAmountWithTax = allForecastHappenAmountWithTax;
                        $scope.viewModel.contractAgreementScopeList[0].allSurplusValueWithTax = allSurplusValueWithTax;
                    }
                },
            };
            $scope.baseInfo.getEachTotalAmount();
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        }]);
});

