define([
    'app',
    'corporationRadioSelector',
    'commonUtilExtend',
    'contractAgreementExtend',
], function (app) {
    app.controller('startChargeApplicationReadOnly_controller', [
        '$scope', '$http', 'viewData', 'seagull2Url','configure', 'wfWaiting', 'sogModal', '$window',
        function ($scope, $http, viewData, seagull2Url, configure, wfWaiting, sogModal, $window) {

            /////////////////////////初始化////////////////////////
            angular.extend($scope, viewData);

            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = '无合同采购';
            //设置导航栏按钮状态
            viewData.wfOperateOpts.allowCirculate = false;//传阅
            viewData.wfOperateOpts.allowRejection = false;//退回
            viewData.wfOperateOpts.allowDoAbort = false;//作废 
            viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
            viewData.wfOperateOpts.allowPrint = false;//打印
            viewData.wfOperateOpts.allowSave = false;//保存
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
            //返还款信息明细栏
            $scope.repaymentInfoTotal = {
                amountReturnedTotal: 0,
                shouldReturnedTotal: 0,
                actualRefundScaleTotal: 0
            };
            if ($scope.viewModel.repaymentInfoList.length > 0) {
                $scope.repaymentInfoTotal.amountReturnedTotal = 0;
                $scope.shouldReturnedTotal = 0;
                angular.forEach($scope.viewModel.repaymentInfoList, function (item) {
                    if (item != null) {
                        if (item.amountReturned != 0) {
                            $scope.repaymentInfoTotal.amountReturnedTotal += item.amountReturned;
                        }
                    }
                });
                $scope.repaymentInfoTotal.actualRefundScaleTotal = (($scope.repaymentInfoTotal.amountReturnedTotal * 1.0) / $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount) * 100;
            }
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
                        //$childModelScope.unSharedAmount = item.actualAmount;
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

                findChargeProcess: function () {
                    var url = $scope.viewModel.purchaseOfNoContract.paymentFormURL;
                    if (url == "") {
                        sogModal.openAlertDialog('提示', '当前支付流程已发起但并未进行操作，请稍后刷新查看!');
                    } else {
                        url += "&random=" + Math.random();
                        var config = {};
                        var RootUrl = configure.getConfig(config, 'common').webUrlBase;
                        if (typeof WebViewBridge == 'undefined') {
                            $window.open(RootUrl + url);
                        }
                        else {
                            WebViewBridge.send(JSON.stringify({ type: 'attachment', title: "无合同支付流程", url: RootUrl + url }));
                        }
                    }
                },

                //显示重新发起/查看按钮
                isShowRestart: true,

                reStartChargeProcess: function () {
                    wfWaiting.show();
                    var apiUrl = "/PurchaseOfNoContract/ReStartChargeApplication?resourceID=" + $scope.viewModel.resourceID + "&rand=" + Math.random();

                    $http.post(seagull2Url.getPlatformUrl(apiUrl)).success(function (data) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("提示信息", "无合同采购支付流程发起成功,请尽快完成支付!");
                        $scope.baseInfo.isShowRestart = false;
                    }).error(function (data) {
                        sogModal.openAlertDialog("提示信息", "无合同采购支付流程发起失败,请稍后再试!");
                        $scope.baseInfo.isShowRestart = true;
                        wfWaiting.hide();
                        console.log(data);
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
                //返回款明细中查看预付成本返还单
                showPrepayRefund: function (item) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var config = {};
                                var url = configure.getConfig(config, 'common').webUrlBase + "/" + item.formUrl;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?r=" + Math.random() + "&_at=" + urlat;
                                } else {
                                    url = url + "&r=" + Math.random() + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看评标信息异常");
                            wfWaiting.hide();
                        });
                }
            }
            $scope.baseInfo.getEachTotalAmount();
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        }]);
});

