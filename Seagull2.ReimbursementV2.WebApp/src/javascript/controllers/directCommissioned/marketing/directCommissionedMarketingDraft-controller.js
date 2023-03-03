define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        //'supplierInfoExtendV3',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierCategoryExtend',
        'commonUtilExtend',
        'supplierInfoExtendV4',
    ],
    function (app) {
        app.controller('directCommissionedMarketingDraft_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "直接委托(营销类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = true;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId && v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }

                $scope.$broadcast('viewModel', { data: $scope.viewModel });
                
                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    // 金额控件
                    moneyOpts: {
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    // 委托信息
                    delegationOpts: {
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                        'blackList': ['project', 'delegationAmount'],
                        'tinyAmount': 50000,
                    },
                    //记账公司
                    useChargeCompanyOpts: {
                        corporationName: $scope.viewModel.purchaseBase.useChargeCompanyName,
                        beforAppend: function (corporation) {
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = corporation.corporationCode;
                            $scope.viewModel.purchaseBase.useChargeCompanyName = corporation.corporationName;
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                            $scope.baseInfo.loadUseCostCenter($scope.viewModel.purchaseBase.useChargeCompanyCode);
                        }
                    },
                    //使用成本中心
                    loadUseCostCenter: function (chargeCompanyCode){
                        if (chargeCompanyCode) {
                            $http.get(seagull2Url.getPlatformUrl("/Purchase/GetCostCenterList?chargeCompanyCode=" + chargeCompanyCode + "&isUseCostCenter=true"))
                                .success(function (data) {
                                    $scope.viewModel.option.useCostCenterList = data;
                                })
                        }
                    },
                    useCostCenterChange: function () {
                        angular.forEach($scope.viewModel.option.useCostCenterList, function (v) {
                            if ($scope.viewModel.purchaseBase.useCostCenterCode == v.code) {
                                $scope.viewModel.purchaseBase.useCostCenterCode = v.code;
                                $scope.viewModel.purchaseBase.useCostCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 3) {
                            $scope.refreshProcess();
                        }
                    },
                    //支出类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.api.useProjectOpts.projectName = "";
                        } else if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = true;
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                            $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                            $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.api.useProjectOpts.projectName = "";
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                $scope.refreshProcess();
                            }
                        }
                    },
                };

                //页面所用函数
                $scope.api = {
                    //自定义指令回调函数
                    //项目名称
                    projectOpts: {
                        projectName: $scope.viewModel.purchaseOfMarketing.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfMarketing.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfMarketing.projectName = project.projectName;
                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList) && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                    purchaseDelegationInfo.supplierCode = '';
                                    purchaseDelegationInfo.supplierName = '';
                                    purchaseDelegationInfo.industryDomainCode = '';
                                    purchaseDelegationInfo.industryDomainName = '';
                                })
                            }
                            $scope.baseInfo.delegationOpts.project = {
                                projectCode: project.projectCode,
                                projectName: project.projectName
                            };
                            $scope.refreshProcess();
                        }
                    },
                    //使用项目
                    useProjectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseBase.useProjectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseBase.useProjectCode = project.projectCode;
                            $scope.viewModel.purchaseBase.useProjectName = project.projectName;
                            $scope.refreshProcess();
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: $scope.viewModel.corporationScope[0].corporationName,
                        beforAppend: function (corporationData) {
                            $scope.viewModel.corporationScope[0].corporationCode = corporationData.corporationCode;
                            $scope.viewModel.corporationScope[0].corporationName = corporationData.corporationName;
                            $scope.initChargeCompany($scope.viewModel.corporationScope[0].corporationCode, true);
                        }
                    }
                };

                //是否工程
                $scope.IsInvolveEngineering = function (isEngineering) {
                    $scope.viewModel.purchaseOfMarketing.isInvolveEngineering = isEngineering;
                    $scope.refreshProcess();
                }

                //查询记账公司
                $scope.initChargeCompany = function (corporationCode, isClear) {
                    if (corporationCode) {
                        if (isClear) {
                            $scope.viewModel.option.chargeCompany = [];
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyCode = "";
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyName = "";
                            $scope.viewModel.option.costCenter = [];
                            $scope.viewModel.purchaseOfMarketing.costCenterCode = "";
                            $scope.viewModel.purchaseOfMarketing.costCenterName = "";
                        }
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetChargeCompanyList?corporationCode=" + corporationCode))
                        .success(function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                         })
                    }
                }
               
                //记账公司下拉框选中后数据变化
                $scope.chargeCompanyChange = function () {
                    angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyName = v.name;
                        }
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode) {
                            $scope.loadCostCenter($scope.viewModel.purchaseOfMarketing.chargeCompanyCode);
                        }
                    })
                }

                //加载成本中心
                $scope.loadCostCenter = function (chargeCompanyCode) {
                    if (chargeCompanyCode) {
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetCostCenterList?chargeCompanyCode=" + chargeCompanyCode +"&isFilterOperationCostControl=true"))
                         .success(function (data) {
                             $scope.viewModel.option.costCenter = data;
                        })
                    }
                }
                //成本中心选中下拉框数据变化
                $scope.costCenterChange = function () {
                    angular.forEach($scope.viewModel.option.costCenter, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.costCenterCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.costCenterName = v.name;
                        }
                    })
                    if ($scope.viewModel.purchaseBase.expenditureTypeCode != 3) {
                        $scope.refreshProcess();
                    }
                }

                //直接委托理由下拉框选中
                $scope.commissionReasonChange = function () {
                    angular.forEach($scope.viewModel.option.directDelegationReasonList, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.directDelegationReasonCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.directDelegationReasonCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.directDelegationReasonName = v.name;
                        }
                    })
                    if ($scope.viewModel.purchaseOfMarketing.directDelegationReasonCode == 13) {
                        $scope.viewModel.isMustMonopolyFile = true;
                    } else {
                        $scope.viewModel.isMustMonopolyFile = false;
                    }
                }

                //营销采购分类下拉框选中
                $scope.marketingPurchaseTypeChange = function () {
                    angular.forEach($scope.viewModel.option.marketingPurchaseType, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeName = v.name;
                        }
                    })
                    $scope.refreshProcess();
                }

                //校验是否选择了法人公司和成本中心
                $scope.validOpts = function (name) {
                    if (name == '记账公司') {
                        if ($scope.viewModel.corporationScope[0].corporationCode == "" || $scope.viewModel.corporationScope[0].corporationCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择法人公司");
                        }
                    }
                    if (name == '成本中心') {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode == "" || $scope.viewModel.purchaseOfMarketing.chargeCompanyCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择记账公司");
                        }
                    }
                }

                //根据营销费用预算金额刷新流程
                $scope.refreshMarketingBudgetAmount = function(){
                    $scope.refreshProcess();
                }

                $scope.refreshProcess = function () {
                    if ($scope.viewModel.isUseCostCenter) {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                    } else {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfMarketing.costCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfMarketing.chargeCompanyCode;
                    }
                    if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == null)
                        $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount = 0;
                    if ($scope.viewModel.purchaseOfMarketing.projectCode && $scope.viewModel.mainCostCenterCode && $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode) {
                        wfOperate.refreshProcess('/DirectCommissionedMarketingDraftWf', $scope.currentActivityId, null, $scope.viewModel, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                }); 
                // 自定义校验器-判断字符长度
                var stringMaxLengthValidator = (function () {
                    return function (maxlength, message) {
                        this.validateData = function (value, name, validationContext) {
                            if (value && value.length > maxlength) {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                        { key: '项目名称', attributeName: 'purchaseOfMarketing.projectName', validator: new RequiredValidator('不能为空！') },
                        { key: '记账公司', attributeName: 'purchaseOfMarketing.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfMarketing.costCenterCode', validator: new RequiredValidator('请选择！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfMarketing.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfMarketing.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购主责人', attributeName: 'purchaseMainUser', validator: new RequiredValidator('不能为空！') },
                        { key: '营销采购分类', attributeName: 'purchaseOfMarketing.marketingPurchaseTypeName', validator:new RequiredValidator('不能为空！')  },
                        { key: '营销费用预算', attributeName: 'purchaseOfMarketing.marketingBudgetAmount', validator: new RequiredValidator('不能为空！') }
                    ]);

                    if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount && $scope.viewModel.purchaseBase.purchaseAmount) {
                        if ($scope.viewModel.purchaseBase.purchaseAmount > $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount) {
                            modelStateDictionary.addModelError('本次拟采购金额', '本次拟采购金额不能大于营销费用预算！');
                        }
                    }
                    if ($scope.viewModel.purchaseOfMarketing.isInvolveEngineering == null) {
                        modelStateDictionary.addModelError('是否涉及工程', '是否涉及工程未选择！');
                    }
                    if (!$scope.viewModel.purchaseOfMarketing.upstreamProcessTypeCode) {
                        if ($scope.viewModel.purchaseBase.purchaseName != null && $scope.viewModel.purchaseBase.purchaseName.length > 30) {
                            modelStateDictionary.addModelError('采购名称', '采购名称不能大于30个字符!');
                        }
                    }
                    
                    //法人公司
                    if (angular.isArray($scope.viewModel.corporationScope) === false
                                 || $scope.viewModel.corporationScope.length === 0
                                 || !$scope.viewModel.corporationScope[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
                    }

                    //使用项目
                    if ($scope.viewModel.isUseProject == true && !$scope.viewModel.purchaseBase.useProjectCode) {
                        modelStateDictionary.addModelError('使用项目', '不能为空!');
                    }
                    //使用记账公司验证
                    if ($scope.viewModel.isUseCostCenter == true && !$scope.viewModel.purchaseBase.useChargeCompanyCode) {
                        modelStateDictionary.addModelError('使用记账公司', '不能为空!');
                    }
                    //使用成本中心验证
                    if ($scope.viewModel.isUseCostCenter == true && !$scope.viewModel.purchaseBase.useCostCenterCode) {
                        modelStateDictionary.addModelError('使用成本中心', '不能为空!');
                    }
                    //直接委托理由
                    if ($scope.viewModel.purchaseOfMarketing.directDelegationReasonCode == 0) {
                        modelStateDictionary.addModelError('直接委托理由', '请选择！');
                    }
                    //直接委托信息
                    if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)) {
                        // 校验合同经办人是否为空
                        if ($scope.viewModel.purchaseDelegationInfoList.length === 0) {
                            modelStateDictionary.addModelError('委托信息', '不能为空!');
                        }
                        if ($scope.viewModel.purchaseDelegationInfoList.length > 1 && $scope.viewModel.purchaseOfMarketing.upstreamProcessTypeCode == 17) {
                            modelStateDictionary.addModelError('委托信息', '由现场销售发起的直接委托只能添加一条委托信息，同时只能发起一条合同!');
                        }
                        for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                            var item = $scope.viewModel.purchaseDelegationInfoList[i];
                            var rowKey = "委托信息第" + (i + 1) + "行";
                            if (!item.delegationAmount || item.delegationAmount <= 0) {
                                modelStateDictionary.addModelError(rowKey + '，直接委托金额(元)', '直接委托金额(元)必须大于零!');
                            }
                            var required = ValidateHelper.validateData(item, [
                                { key: rowKey + '，直接委托供应商', attributeName: 'supplierCode', validator: [new RequiredValidator("请选择！")] },
                                { key: rowKey + '，合同经办人', attributeName: 'operatorUser', validator: [new RequiredValidator("请选择！")] }
                            ]);
                            modelStateDictionary.merge(required);
                        }
                    }
                    return modelStateDictionary;


                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfMarketing.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);

                    return modelStateDictionary;
                };
                var checkFileData = function () {
                    if (!$scope.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    return true;
                };
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            result = validData();
                            if (!result.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                sogValidator.broadcastResult(result.get());
                                defer.reject($scope.viewModel);
                            } else {
                            //是否有审批人
                                if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length == 0) {
                                    sogModal.openAlertDialog('提示', '当前流程没有审批人，无法发送，');
                                    defer.reject($scope.viewModel);
                                    } else {
                                    defer.resolve($scope.viewModel)
                                    }
                                }
                        }
                        else if (e.operationType === sogWfControlOperationType.Comment) {
                            var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                            promise.then(function () {
                                defer.resolve($scope.viewModel);
                            }, function () {
                                defer.reject($scope.viewModel);
                            });
                        }
                        else if (e.operationType === sogWfControlOperationType.Save) {
                            result = saveValidData();
                            if (!result.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                sogValidator.broadcastResult(result.get());
                                defer.reject($scope.viewModel);
                            } else {
                                defer.resolve($scope.viewModel);
                            }
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                    }
                }
            }]);
    });