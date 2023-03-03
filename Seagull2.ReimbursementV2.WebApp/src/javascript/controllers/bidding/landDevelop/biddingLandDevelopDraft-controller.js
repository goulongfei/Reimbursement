define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'supplierCategoryExtend',
        'corporationExtend',
        'dateTimePickerExtend',
        'leftNavExtend',
        'supplierSelector',
        'projectExtend',
        'engineeringExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopDraft_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'supplierSelector','locals',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, supplierSelector,locals) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";
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
                $scope.viewModel.purchaseOfLandDevelop.project = null;
                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId && v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }
                //如果是观光状态则不需要作废按钮
                if ($scope.viewModel.formAction.actionStateCode === 0) {
                    $scope.wfOperateOpts.allowDoAbort = false;//作废      
                }

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                    urlGetChargeCompanyList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetChargeCompanyList?r=' + Math.random() + '&corporationCode=' + param.corporationCode);
                    },
                    urlGetCostCenterList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode);
                    },
                    urlGetCommissionReasonList: function () {
                        return seagull2Url.getPlatformUrl("/Purchase/LoadReasonByPartCode?isProject=false");

                    },
                    // 获取记账公司
                    getChargeCompanyList: function (param, done) {
                        $http({
                            method: 'GET',
                            url: $scope.api.urlGetChargeCompanyList(param),
                            data: param,
                        })
                            .success(function (data) { done(data); })
                            .error($scope.api.showErrorMessage);
                    },
                    // 获取成本中心
                    getCostCenterList: function (param, done) {
                        $http({
                            method: 'GET',
                            url: $scope.api.urlGetCostCenterList(param),
                            data: param,
                        })
                            .success(function (data) { done(data); })
                            .error($scope.api.showErrorMessage);
                    },
                };

                //设置
                $scope.settings = {
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
                }

                $scope.baseInfo = {
                    //项目
                    projectOpts: {
                        readOnly: false,
                        beforAppend: function (projectList) {
                            $scope.viewModel.projectScopeList = projectList;
                            $scope.viewModel.purchaseOfLandDevelop.project = $scope.viewModel.projectScopeList;
                            $scope.baseInfo.supplierScopeOpts.projectList = projectList;
                            $scope.viewModel.supplierScopeList = [];
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: '',
                        beforAppend: function (corporation) {
                            $scope.viewModel.corporationScopeList = corporation;
                            $scope.baseInfo.loadChargeCompany(corporation);
                        }
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "Draft",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                    },

                    //入围供应商
                    supplierScopeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        scene: "Draft",
                        projectList: $scope.viewModel.projectScopeList,
                        beforAppend: function (supplierData) {
                            if ($scope.viewModel.supplierScopeList.length > 0) {
                                var isSameSupplier = false;
                                angular.forEach($scope.viewModel.supplierScopeList, function (item) {
                                    if (supplierData.supplierCode == item.supplierCode) {
                                        isSameSupplier = true;
                                    }
                                });
                                if (isSameSupplier) {
                                    sogModal.openAlertDialog("提示", "不能添加相同供应商！");
                                } else {
                                    $scope.viewModel.supplierScopeList.push(supplierData);
                                }
                            } else {
                                $scope.viewModel.supplierScopeList.push(supplierData);
                            }


                        },
                        afterAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList = supplierData;
                        },
                    },

                    //查询记账公司
                    loadChargeCompany: function (corporation) {
                        wfWaiting.show();
                        var tempList = [];
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfLandDevelop.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfLandDevelop.costCenterCode = "";
                        $scope.viewModel.purchaseOfLandDevelop.costCenterName = "";
                        for (var i = 0; i < corporation.length; i++) {
                            var param = { corporationCode: corporation[i].corporationCode };
                            $scope.api.getChargeCompanyList(param, function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    $scope.viewModel.option.chargeCompany.push(data[i]);
                                }
                                wfWaiting.hide();
                            });
                        }
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfLandDevelop.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode);
                            }
                        })
                    },

                    //加载成本中心
                    loadCostCenter: function (chargeCompanyCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.costCenter = [];
                        var param = { chargeCompanyCode: chargeCompanyCode };
                        $scope.api.getCostCenterList(param, function (data) {
                            $scope.viewModel.option.costCenter = data;
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.option.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfLandDevelop.costCenterCode == v.code) {
                                $scope.viewModel.purchaseOfLandDevelop.costCenterCode = v.code;
                                $scope.viewModel.purchaseOfLandDevelop.costCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode != 3) {
                            $scope.refreshProcess();
                        }
                    },
                    //采购金额变化
                    purchaseAmountChange: function () {
                        $scope.refreshProcess();
                    },
                    // 项目变更 projectChange
                    projectChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        else {
                            $scope.refreshProcess();
                        }
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
                    loadUseCostCenter: function (chargeCompanyCode) {
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
                            $scope.settings.useProjectOpts.projectName = "";
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
                            $scope.settings.useProjectOpts.projectName = "";
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                $scope.refreshProcess();
                            }
                        }
                    },
                }

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
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator("不能为空！") },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '记账公司', attributeName: 'purchaseOfLandDevelop.chargeCompanyCode', validator: new RequiredValidator("请选择！") },
                        { key: '成本中心', attributeName: 'purchaseOfLandDevelop.costCenterCode', validator: new RequiredValidator("请选择！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfLandDevelop.purchaseContent', validator: new RequiredValidator("不能为空！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfLandDevelop.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购主责人', attributeName: 'purchaseOfLandDevelop.purchaseMainUser', validator: new RequiredValidator("不能为空！") },
                        { key: '商务负责人', attributeName: 'purchaseOfLandDevelop.businessMainUser', validator: new RequiredValidator("不能为空！") },
                        { key: '技术负责人', attributeName: 'purchaseOfLandDevelop.technologyMainUser', validator: new RequiredValidator("不能为空！") }
                    ]);
                    if ($scope.viewModel.purchaseOfLandDevelop.businessMainUser && $scope.viewModel.purchaseOfLandDevelop.technologyMainUser)
                        if ($scope.viewModel.purchaseOfLandDevelop.technologyMainUser.id == $scope.viewModel.purchaseOfLandDevelop.businessMainUser.id) modelStateDictionary.addModelError("采购小组成员", "商务负责人与技术负责人不能同为一人");
                    if (angular.isArray($scope.viewModel.projectScopeList) === false
                        || $scope.viewModel.projectScopeList.length === 0
                        || !$scope.viewModel.projectScopeList[0].projectCode) {
                        modelStateDictionary.addModelError("项目名称", "项目名称不能为空");
                    }
                    //预计采购金额
                    if (!$scope.viewModel.purchaseBase.perPurchaseAmount || $scope.viewModel.purchaseBase.perPurchaseAmount <= 0) {
                        modelStateDictionary.addModelError('预计采购金额', '预计采购金额(元)必须大于零!');
                    }
                    //法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                                 || $scope.viewModel.corporationScopeList.length === 0
                                 || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('招标人', '不能为空！');
                    }

                    var isValidAdopt = true;
                    if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                        modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能为空");
                        isValidAdopt = false;
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                        modelStateDictionary.addModelError("采购时间安排", "评标时间不能为空");
                        isValidAdopt = false;
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                        modelStateDictionary.addModelError("采购时间安排", "定标时间不能为空");
                        isValidAdopt = false;
                    }
                    if (isValidAdopt) {
                        if (new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline) < new Date()) {
                            modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                        }
                        if (new Date($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline) < new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline)) {
                            modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于回标截止时间");
                        }
                        if (new Date($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline) < new Date($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline)) {
                            modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                        }
                    }

                    if ($scope.viewModel.supplierScopeList.length == 0) {
                        modelStateDictionary.addModelError("入围供应商", "请添加供应商");
                    } else {
                        if ($scope.viewModel.supplierScopeList.length < 3) {
                            modelStateDictionary.addModelError("入围供应商", "入围供应商不能小于三家");
                        }
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
                    //招标文件
                    if (!$scope.viewModel.purchaseOfLandDevelop.biddingFile || $scope.viewModel.purchaseOfLandDevelop.biddingFile.length === 0) {
                        modelStateDictionary.addModelError('招标文件', '请上传招标文件！');
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfLandDevelop.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);

                    return modelStateDictionary;
                };
                $scope.fileReady = true;
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
                        if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                            angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                                if (v.replyDeadline == null || v.replyDeadline == "") {
                                    v.replyDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "") {
                                    v.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "") {
                                    v.decideBiddingDeadline = "0001-01-01T00:00:00";
                                }
                            });
                        }
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            result = validData();
                            if (!result.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                sogValidator.broadcastResult(result.get());
                                defer.reject($scope.viewModel);
                            } else {
                                //是否有审批人
                                if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length == 0) {
                                    sogModal.openAlertDialog('提示', '当前流程没有审批人，无法发送');
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

                $scope.$watch('viewModel.purchaseOfLandDevelop.project', $scope.baseInfo.projectChange);
                window.onstorage = function () {
                    var supplierList = locals.getObject('addSupplier');
                    if (supplierList && supplierList.length > 0) {
                        $timeout(function () {
                            $scope.viewModel.supplierScopeList = supplierList;
                        }, 0)
                    }
                }
                // 刷新流程
                $scope.refreshProcess = function () {
                    if ($scope.viewModel.isUseCostCenter) {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                    } else {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfLandDevelop.costCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode;
                    }
                    var param = {
                        ProjectCode: $scope.viewModel.projectScopeList[0].projectCode,
                        PurchaseAmount: $scope.viewModel.purchaseBase.perPurchaseAmount,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        ChargeCompanyCode: $scope.viewModel.mainChargeCompanyCode,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                        IsUseProject: $scope.viewModel.isUseProject
                    };
                    if ($scope.viewModel.corporationScopeList != null && $scope.viewModel.corporationScopeList.length > 0) {
                        param.CorporationCode = $scope.viewModel.corporationScopeList[0].corporationCode;
                    }

                    //使用项目
                    if ($scope.viewModel.isUseProject == true) {
                        param.ProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                    }
                    if (param.ProjectCode && param.PurchaseAmount && param.CostCenterCode && param.CorporationCode) {
                        wfOperate.refreshProcess('/BiddingLandDevelopDraftWf', $scope.currentActivityId, null, param, true);
                    }

                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                }); 
            }]);
    });