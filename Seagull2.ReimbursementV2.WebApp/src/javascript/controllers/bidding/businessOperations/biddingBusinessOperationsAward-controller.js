define(
    [
        'app',
        'commonUtilExtend',
        'contractAgreementExtend',
        'signContractExtend',
        'leftNavExtend',
        'biddingSynthesizeExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsAward_controller',
            function ($scope, viewData, sogModal, ValidateHelper, sogValidator, rcTools, sogWfControlOperationType,
                wfOperate, sogOguType, $http, wfWaiting, $window, seagull2Url, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
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
                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100000000000,
                    precision: -1
                };

                // 合约规划
                $scope.agreement = {
                    // 获取的合约数据格式化
                    dataFormat: function (data) {
                        var contractAgreementScope = {
                            projectCode: data.projectCode,
                            projectName: data.projectName,
                            stageAreaCode: data.stageAreaCode,
                            stageAreaName: data.stageAreaName,
                            contractAgreementCode: data.planContractCode ? data.planContractCode : data.contractAgreementCode,
                            contractAgreementName: data.planContractName ? data.planContractName : data.contractAgreementName,
                            contractAgreementTypeCode: data.contractPlanTypeCode ? data.contractPlanTypeCode : data.contractAgreementTypeCode,
                            contractAgreementTypeName: data.contractPlanTypeCnName ? data.contractPlanTypeCnName : data.contractAgreementTypeName,
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
                // 设置 
                $scope.settings = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectList: $scope.viewModel.projectScopeList,
                        specialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                        specialtyName: $scope.viewModel.purchaseOfBusinessOperations.specialtyName,
                        purchaseWay: $scope.viewModel.purchaseBase.purchaseWayCode,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        isNoContractPruchase: false,
                        multipleSelect: true,
                        isAward: true,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        beforAppend: function (v) {
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                $scope.viewModel.contractAgreementScopeList = [];
                            }
                            var myContract = $scope.agreement.dataFormat(v); // 格式化到视图  
                            var isSelected = false;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                    if (c.validStatus === true) {
                                        var message = "合约[" + myContract.contractAgreementName + "]已选择！";
                                        sogModal.openAlertDialog("提示", message);
                                    }
                                    else {
                                        c.validStatus = true;
                                    }
                                    isSelected = true;
                                    return;
                                }
                            });
                            if (!isSelected) {
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += myContract.costTargetAmount;
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                                $scope.refreshProcess();
                            };
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += agreement.validStatus ? agreement.costTargetAmount : 0;
                                agreement.disabled = false;
                                agreement.selected = false;
                            });
                            if (angular.isArray($scope.viewModel.perSignContractInfoList) && $scope.viewModel.perSignContractInfoList.length > 0) {
                                angular.forEach($scope.viewModel.perSignContractInfoList, function (perSignContract) {
                                    perSignContract.perSignContractAgreementScopeInfoList = [];
                                });
                            }
                            $scope.refreshProcess();
                        },
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsAward",
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
                    }
                };

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },
                    lookInfo: function (routesType) {
                        wfWaiting.show();
                        var urlat = null;
                        $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                            .success(function (data) {
                                wfWaiting.hide();
                                urlat = data;
                                if (urlat !== null) {
                                    urlat = urlat.replace(/"/g, "");
                                    var activityID = "";
                                    angular.forEach($scope.viewModel.processActivityInfoList, function (process) {
                                        if (process.activityStateName == routesType) {
                                            activityID = process.activityCode;
                                        }
                                    });
                                    if (activityID != "") {
                                        var url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID + "&_at=" + urlat;
                                        $window.open(url, '_blank');
                                    }
                                }
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "查看信息异常");
                                wfWaiting.hide();
                            });
                    },
                    select_all: false,
                    //添加到中标信息
                    addWinningBidSupplier: function () {
                        angular.forEach($scope.viewModel.summerEvaluateBiddingInfoList, function (summer) {
                            if (summer.checked == true) {
                                var perContract = {
                                    supplierCode: summer.supplierCode,
                                    supplierName: summer.supplierName,
                                    industryDomainCode: summer.industryDomainCode,
                                    industryDomainName: summer.industryDomainName,
                                    perSignContractAmount: summer.finalQuoteAmountWithTax,
                                }
                                var maxContract = $scope.viewModel.corporationScopeList.length;
                                var existCount = 0;
                                if ($scope.viewModel.perSignContractInfoList != null && $scope.viewModel.perSignContractInfoList.length > 0) {
                                    angular.forEach($scope.viewModel.perSignContractInfoList, function (perSignCotract) {
                                        if (perSignCotract.supplierCode == summer.supplierCode)
                                            existCount++;
                                    });
                                }
                                if (existCount < maxContract) {
                                    $scope.viewModel.perSignContractInfoList.push(perContract);
                                } else {
                                    sogModal.openAlertDialog("提示", "同一个中标供应商添加中标信息数量不能超过单据的招标人数量!");
                                    return false;
                                }
                            }
                        });
                    },
                    //全选所有的中标供应商
                    selectAllContract: function (select_all) {
                        if ($scope.viewModel.perSignContractInfoList != null && $scope.viewModel.perSignContractInfoList.length > 0) {
                            angular.forEach($scope.viewModel.perSignContractInfoList, function (perSignCotract) {
                                perSignCotract.checked = select_all;
                            });
                        }
                    },
                    //删除中标信息
                    deleteWinningBidSupplier: function () {
                        if ($scope.baseInfo.select_all) {
                            $scope.viewModel.perSignContractInfoList = [];
                            $scope.baseInfo.select_all = false;
                            $scope.baseInfo.reflushRelateState();
                        } else {
                            if ($scope.viewModel.perSignContractInfoList != null && $scope.viewModel.perSignContractInfoList.length > 0) {
                                var checkedCount = 0;
                                angular.forEach($scope.viewModel.perSignContractInfoList, function (perSignCotract) {
                                    if (perSignCotract.checked)
                                        checkedCount++;
                                });
                                if (checkedCount == 0) {
                                    sogModal.openAlertDialog("提示", "请至少选中一个中标信息进行删除!");
                                    return false;
                                } else {
                                    //删除
                                    for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i >= 0; i--) {
                                        if ($scope.viewModel.perSignContractInfoList[i].checked) {
                                            $scope.viewModel.perSignContractInfoList.splice(i, 1);
                                        }
                                    }
                                    $scope.baseInfo.reflushRelateState();
                                }
                            } 
                        }
                    },
                    //下拉框选中合同甲方
                    contractCorporationChange: function (contract) {
                        if ($scope.viewModel.option.corporationList != null && $scope.viewModel.option.corporationList.length > 0) {
                            angular.forEach($scope.viewModel.option.corporationList, function (corporation) {
                                if (corporation.code == contract.corporationCode)
                                    contract.corporationName = corporation.name;
                            });
                        }
                    },
                    //关联合约
                    relatinCotractAgreement: function (contract) {
                        var viewPath = 'htmlTemplate/dialogTemplate/common/perSignBusinessAgreement.html';
                        var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                            promise = sogModal.openDialog(template, '选择所属合约', ["$scope", function ($modelScope) {
                                $modelScope.agreementData = angular.copy($scope.viewModel.contractAgreementScopeList);
                                $modelScope.projectCode = "";
                                $modelScope.readOnly = false;
                                $modelScope.projectCollection = [];
                                angular.forEach($modelScope.agreementData, function (item) {
                                    item.selected = false;
                                    angular.forEach(contract.perSignContractAgreementScopeInfoList, function (per) {
                                        if (per.contractAgreementCode === item.contractAgreementCode) {
                                            item.disabled = false;
                                            item.selected = true;
                                            $modelScope.projectCode = item.projectCode;
                                        }
                                    });
                                });
                                // 填充项目选项
                                angular.forEach($modelScope.agreementData, function (item) {
                                    var isExistProject = false;
                                    var project = {
                                        code: item.projectCode,
                                        name: item.projectName,
                                    };
                                    angular.forEach($modelScope.projectCollection, function (p) {
                                        if (p.code === item.projectCode) {
                                            isExistProject = true;
                                            return;
                                        }
                                    });
                                    if (!isExistProject) {
                                        $modelScope.projectCollection.push(project);
                                    }
                                });

                                $modelScope.projectChange = function (projectCode) {
                                    $modelScope.projectCode = projectCode;
                                }

                                //确定
                                $modelScope.selectedOk = function () {
                                    var perSignContractAgreementScopeInfoList = [];
                                    angular.forEach($modelScope.agreementData, function (item) {
                                        if (item.selected && item.projectCode == $modelScope.projectCode) {
                                            item.disabled = true;
                                            var perSignContractAgreementScopeInfo = {
                                                contractAgreementCode: item.contractAgreementCode,
                                                contractAgreementName: item.contractAgreementName,
                                                contractAgreementScopeAmount: item.costTargetAmount,
                                            };
                                            perSignContractAgreementScopeInfoList.push(perSignContractAgreementScopeInfo);
                                        }
                                    });
                                    contract.perSignContractAgreementScopeInfoList = perSignContractAgreementScopeInfoList;
                                    $modelScope.confirm();
                                };

                                //全选
                                $modelScope.selectAll = function (allChecked) {
                                    for (var i = 0; i < $modelScope.agreementData.length; i++) {
                                        if (!$modelScope.agreementData[i].disabled && $modelScope.projectCode == $modelScope.agreementData[i].projectCode) {
                                            $modelScope.agreementData[i].selected = allChecked;
                                        }
                                    }
                                };
                                //复选框选中
                                $modelScope.selectOne = function (selected) {
                                    for (var i = 0; i < $modelScope.agreementData.length; i++) {
                                        if (!$modelScope.agreementData[i].selected) {
                                            $modelScope.select_all = false;
                                            return;
                                        } else {
                                            $modelScope.select_all = true;
                                        }
                                    }
                                };
                            }], $scope, { containerStyle: { width: '50%' }  },
                                function (v, defer) {//50%
                                    $scope.baseInfo.reflushRelateState();
                                    defer.resolve(v);//确定                
                                }, function (v, defer) {
                                    angular.forEach($scope.viewModel.contractAgreementScopeList, function (item) {
                                        angular.forEach(contract.perSignContractAgreementScopeInfoList, function (perSignContractAgreementScopeInfo) {
                                            if (perSignContractAgreementScopeInfo.contractAgreementCode === item.contractAgreementCode) {
                                                item.disabled = true;
                                                item.selected = true;
                                                return;
                                            }
                                        });
                                    });
                                    defer.resolve(v);//取消
                                });
                    },
                    //更新
                    reflushRelateState: function () {
                        if (angular.isArray($scope.viewModel.contractAgreementScopeList) && $scope.viewModel.contractAgreementScopeList.length > 0) {
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                agreement.disabled = false;
                                agreement.selected = false;
                                if (angular.isArray($scope.viewModel.perSignContractInfoList) && $scope.viewModel.perSignContractInfoList.length > 0) {
                                    angular.forEach($scope.viewModel.perSignContractInfoList, function (perSignContract) {
                                        if (angular.isArray(perSignContract.perSignContractAgreementScopeInfoList) && perSignContract.perSignContractAgreementScopeInfoList.length > 0) {
                                            angular.forEach(perSignContract.perSignContractAgreementScopeInfoList, function (perSignAgreement) {
                                                if (perSignAgreement.contractAgreementCode == agreement.contractAgreementCode) {
                                                    agreement.disabled = true;
                                                    agreement.selected = true;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                };

                //初始化分配合约
                $scope.baseInfo.reflushRelateState();

                //验证
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    // 直接委托说明
                    var awardReportUploaded = false;
                    if ($scope.viewModel.awardReportFile && angular.isArray($scope.viewModel.awardReportFile)) {
                        for (var i = 0; i < $scope.viewModel.awardReportFile.length; i++) {
                            var item = $scope.viewModel.awardReportFile[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                awardReportUploaded = true;
                            }
                        }
                    }
                    if (awardReportUploaded === false) {
                        modelStateDictionary.addModelError('定标报告', '请上传！');
                    }
                    // 选择合约规划
                    // 合约信息
                    if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false
                        || $scope.viewModel.contractAgreementScopeList.length === 0) {
                        modelStateDictionary.addModelError('合约规划', '请添加！');
                    } else {
                        for (var i = 0; i < $scope.viewModel.contractAgreementScopeList.length; i++) {
                            var item = $scope.viewModel.contractAgreementScopeList[i];
                            if (!item.selected) {
                                modelStateDictionary.addModelError('合约规划', item.contractAgreementName + '未分配对应的合同，请删除！');
                            }
                        };
                    }

                    // 中标信息
                    if (angular.isArray($scope.viewModel.perSignContractInfoList) === false
                        || $scope.viewModel.perSignContractInfoList.length === 0) {
                        modelStateDictionary.addModelError('中标信息', '请添加！');
                    }
                    else {
                        for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                            var item = $scope.viewModel.perSignContractInfoList[i];
                            if (!item.contractName) {
                                modelStateDictionary.addModelError('中标信息第' + (i + 1) + '行', '合同名称不能为空！');
                            }
                            if (item.contractName && item.contractName.length > 256) {
                                modelStateDictionary.addModelError('中标信息第' + (i + 1) + '行', '合同名称不能大于256个字符！');
                            }
                            if (!item.corporationCode) {
                                modelStateDictionary.addModelError('中标信息第' + (i + 1) + '行', '甲方（法人公司）请选择！');
                            }
                            if (!item.perSignContractAmount) {
                                modelStateDictionary.addModelError('中标信息第' + (i + 1) + '行', '合同金额不能为空！');
                            }
                            if (!item.operatorUser) {
                                modelStateDictionary.addModelError('中标信息第' + (i + 1) + '行', '合同经办人请选择！');
                            }
                            if (angular.isArray(item.perSignContractAgreementScopeInfoList) === false
                                || item.perSignContractAgreementScopeInfoList.length === 0) {
                                modelStateDictionary.addModelError('中标信息第' + (i + 1) + '行', '所属合约请选择！');
                            }
                        }
                    }
                    // 审批流
                    if (angular.isArray($scope.opinionOpts.options) === false
                        || $scope.opinionOpts.options.length === 0) {
                        modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
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
                    //改成传页面对象
                    wfOperate.refreshProcess('/BiddingBusinessOperationsAwardWf', $scope.currentActivityId, null, $scope.viewModel, true);
                };
            }
        );
    });