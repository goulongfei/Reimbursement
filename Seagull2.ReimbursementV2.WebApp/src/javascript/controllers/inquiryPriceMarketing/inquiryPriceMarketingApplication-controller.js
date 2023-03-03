define([
    'app',
    'engineeringExtend',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend',
], function (app) {
    app.controller('inquiryPriceMarketingApplication_controller', [
        '$scope', '$http', 'viewData', 'wfWaiting', 'sogModal',
        'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType',
        function ($scope, $http, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType) {
            angular.extend($scope, viewData);
            // 流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "询价(营销类)";
            // 设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoAbort = true;//作废
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowComment = false;  //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            // 页面所用函数
            $scope.api = {
                showErrorMessage: function (error, status) {
                    wfWaiting.hide();
                    if (status === 400) {
                        sogModal.openAlertDialog("提示", error.message);
                    }
                    else {
                        if (error) { sogModal.openErrorDialog(error); }
                    }
                },
                urlGetChargeCompanyList: function (param) {
                    return seagull2Url.getPlatformUrl('/Purchase/GetChargeCompanyList?r=' + Math.random() + '&corporationCode=' + param.corporationCode);
                },
                urlGetCostCenterList: function (param) {
                    return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode +'&isFilterOperationCostControl=true');
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
                }
            };
            // 设置
            $scope.settings = {
                // 附件设置项
                fileopts: {
                    'resourceId': $scope.viewModel.resourceID,
                },
                // 单选人员
                peopleSelectOpts: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                // 多选人员
                peopleMultipleSelectOpts: {
                    selectMask: sogOguType.User,
                    multiple: true
                },
                // 金额控件
                moneyOpts: {
                    min: 1,
                    max: 999999999,
                    precision: 2
                },
                // 项目名称
                projectOpts: {
                    projectName: $scope.viewModel.purchaseOfMarketing.projectName,
                    beforAppend: function (project) {
                        $scope.viewModel.purchaseOfMarketing.project = {
                            projectCode: project.projectCode,
                            projectName: project.projectName
                        }
                    }
                },
                // 法人公司
                corporationOpts: {
                    corporationName: $scope.viewModel.corporationScopeList[0].corporationName,
                    beforAppend: function (corporationData) {
                        $scope.viewModel.corporationScopeList[0].corporationCode = corporationData.corporationCode;
                        $scope.viewModel.corporationScopeList[0].corporationName = corporationData.corporationName;
                        $scope.viewModel.purchaseOfMarketing.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfMarketing.chargeCompanyName = "";
                        $scope.viewModel.purchaseOfMarketing.costCenterCode = "";
                        $scope.viewModel.purchaseOfMarketing.costCenterName = "";
                        $scope.baseInfo.loadChargeCompany(corporationData.corporationCode);
                    }
                },
                // 入围供应商
                supplierScopeOpts: {
                    'scene': "Application",
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    projectList: $scope.viewModel.projectScopeList,
                    beforAppend: function (supplierData) {
                        $scope.viewModel.supplierScopeList.push(supplierData);
                    },
                    afterAppend: function (supplierData) {
                        $scope.viewModel.supplierScopeList = supplierData;
                    }
                }
            }
            // 基本信息
            $scope.baseInfo = {
                isShowUpstreamProcessMarketing: false,
                init: function () {
                    //如果有上流流程信息，则显示出
                    if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                        $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                    }
                },
                // 项目变更 projectChange
                projectChange: function (newVal, oldVal) {
                    if (newVal === oldVal) { return; }
                    if (newVal) {
                        $scope.viewModel.projectScopeList = [];
                        $scope.viewModel.supplierScopeList = [];
                        $scope.viewModel.purchaseOfMarketing.projectCode = newVal.projectCode;
                        $scope.viewModel.purchaseOfMarketing.projectName = newVal.projectName;
                        $scope.viewModel.projectScopeList.push($scope.viewModel.purchaseOfMarketing.project);
                        $scope.settings.supplierScopeOpts.projectList = $scope.viewModel.projectScopeList;
                    }
                    else {
                        $scope.viewModel.projectScopeList = [];
                        $scope.viewModel.supplierScopeList = [];
                        $scope.viewModel.purchaseOfMarketing.projectCode = null;
                        $scope.viewModel.purchaseOfMarketing.projectName = null;
                    }
                },
                // 查询记账公司
                loadChargeCompany: function (corporationCode) {
                    wfWaiting.show();
                    $scope.viewModel.option.chargeCompanyList = [];
                    $scope.viewModel.option.costCenterList = [];
                    var param = {
                        corporationCode: corporationCode
                    };
                    $scope.api.getChargeCompanyList(param, function (data) {
                        $scope.viewModel.option.chargeCompanyList = data;
                        wfWaiting.hide();
                    });
                },
                // 查询成本中心
                loadCostCenter: function (chargeCompanyCode) {
                    wfWaiting.show();
                    $scope.viewModel.option.costCenterList = [];
                    var param = {
                        chargeCompanyCode: chargeCompanyCode
                    };
                    $scope.api.getCostCenterList(param, function (data) {
                        $scope.viewModel.option.costCenterList = data;
                        wfWaiting.hide();
                    });
                },
                // 记账公司选中下拉框选中后数据变化
                chargeCompanyChange: function () {
                    angular.forEach($scope.viewModel.option.chargeCompanyList, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode === v.code) {
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyName = v.name;
                        }
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode) {
                            $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfMarketing.chargeCompanyCode);
                        }
                    })
                },
                // 成本中心选中下拉框数据变化
                costCenterChange: function () {
                    angular.forEach($scope.viewModel.option.costCenterList, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.costCenterName = v.name;
                        }
                    })
                },
                // 营销采购分类下拉框数据变化
                marketingPurchaseTypeChange: function () {
                    angular.forEach($scope.viewModel.option.marketingPurchaseTypeList, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeName = v.name;
                        }
                    })
                }
            };
            $scope.$watch('viewModel.purchaseOfMarketing.project', $scope.baseInfo.projectChange);
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
            // 自定义校验器-判断下拉框必填
            var RequiredSelectValidator = (function () {
                return function (message) {
                    this.validateData = function (value, name, validationContext) {
                        if ((!value) || value.length === 0 || value === 0 || value === '0') {
                            ValidateHelper.updateValidationContext(validationContext, name, message);
                            return false;
                        }
                        return true;
                    };
                };
            }());
            // 发送前数据校验
            var checkData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var error = ValidateHelper.validateData($scope.viewModel, [
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator("不能为空！") },
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                    { key: '项目名称', attributeName: 'projectScopeList', validator: new RequiredValidator('请选择！') },
                    { key: '营销费用预算', attributeName: 'purchaseOfMarketing.marketingBudgetAmount', validator: new RequiredValidator("不能为空！") },
                    { key: '是否涉及工程', attributeName: 'purchaseOfMarketing.isInvolveEngineering', validator: new RequiredValidator("请选择！") },
                    { key: '记账公司', attributeName: 'purchaseOfMarketing.chargeCompanyCode', validator: new RequiredValidator("请选择！") },
                    { key: '成本中心', attributeName: 'purchaseOfMarketing.costCenterCode', validator: new RequiredValidator("请选择！") },
                    { key: '营销采购分类', attributeName: 'purchaseOfMarketing.marketingPurchaseTypeCode', validator: new RequiredSelectValidator('请选择！') },
                    { key: '本次招标范围和内容', attributeName: 'purchaseOfMarketing.purchaseContent', validator: new RequiredValidator("不能为空！") },
                    { key: '本次招标范围和内容', attributeName: 'purchaseOfMarketing.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    { key: '招标联系人', attributeName: 'purchaseOfMarketing.linkManUser', validator: new RequiredValidator("不能为空！") },
                    { key: '招标联系电话', attributeName: 'purchaseOfMarketing.linkManPhone', validator: new RequiredValidator("不能为空！") },
                    { key: '招标邮箱', attributeName: 'purchaseOfMarketing.linkManEmail', validator: new RequiredValidator("不能为空！") },
                ]);
                // 项目名称
                if ($scope.viewModel.corporationScopeList[0].corporationCode == null || $scope.viewModel.corporationScopeList[0].corporationCode == "") {
                    error.addModelError('招标人', '请选择！');
                }
                // 项目名称
                if (angular.isArray($scope.viewModel.projectScopeList) === false || $scope.viewModel.projectScopeList.length === 0) {
                    error.addModelError('项目名称', '请选择！');
                }
                // 营销费用预算
                if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == 0)
                    error.addModelError("营销费用预算", "不能为0!");
                // 回标截止时间
                if ($scope.viewModel.purchaseOfMarketing.lastReplyDeadline) {
                    var lastTime = new Date($scope.viewModel.purchaseOfMarketing.lastReplyDeadline.replace('T', ' ').replace(/-/g, '/'));
                    var nowDate = new Date();
                    if (lastTime < nowDate) {
                        error.addModelError("回标截止时间", "不能小于当前时间");
                    }
                } else {
                    error.addModelError("回标截止时间", "不能为空！");
                }
                // 联系人电话与邮箱验证
                var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                if ($scope.viewModel.purchaseOfMarketing.linkManPhone && !regPhoneNumber.test($scope.viewModel.purchaseOfMarketing.linkManPhone))
                    error.addModelError('招标联系电话', '请正确填写招标人联系电话');
                if ($scope.viewModel.purchaseOfMarketing.linkManEmail && !regEmail.test($scope.viewModel.purchaseOfMarketing.linkManEmail))
                    error.addModelError('招标邮箱', '请正确填写招标人邮箱地址');

                // 供应商信息验证
                if (angular.isArray($scope.viewModel.supplierScopeList) === false || $scope.viewModel.supplierScopeList.length === 0) {
                    error.addModelError('入围供应商', '请添加！');
                } else if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount <= 100000 && $scope.viewModel.supplierScopeList.length < 2) {
                    error.addModelError("入围供应商", "入围供应商不能小于两家");
                } else if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount > 100000 && $scope.viewModel.supplierScopeList.length < 3) {
                    error.addModelError("入围供应商", "入围供应商不能小于三家");
                }
                if ($scope.viewModel.supplierScopeList.length) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                        var key = '第' + (i + 1) + '行供应商';
                        if (!v.linkManName)
                            error.addModelError("联系人", key + "联系人不能为空");
                        if (!v.linkPhone)
                            error.addModelError("联系人电话", key + "联系人电话不能为空");
                        else {
                            if (regPhoneNumber.test(v.linkPhone) === false) {
                                error.addModelError('联系人电话', key + '联系人电话格式不正确');
                            }
                        }
                        if (!v.linkEmail)
                            error.addModelError("联系人邮箱", key + "联系人邮箱不能为空");
                        else {
                            if (regEmail.test(v.linkEmail) === false) {
                                error.addModelError('联系人邮箱', key + '联系人邮箱格式不正确');
                            }
                        }
                    });
                }

                if ($scope.viewModel.purchaseOfMarketing.biddingReportFile == null || $scope.viewModel.purchaseOfMarketing.biddingReportFile.length == 0)
                    error.addModelError("询价文件", "询价文件不能为空");

                if (!error.isValid()) {
                    sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                    sogValidator.broadcastResult(error.get());
                    return false;
                }
                return true;
            }
            // 附件是否上传完成
            var checkFileData = function () {
                var retrunFlag = true;
                if ($scope.viewModel.purchaseOfMarketing.biddingReportFile != null && $scope.viewModel.purchaseOfMarketing.biddingReportFile.length > 0) {
                    angular.forEach($scope.viewModel.purchaseOfMarketing.biddingReportFile, function (item) {
                        if (!item.uploaded) {
                            retrunFlag = false;
                        }
                    });
                }
                if ($scope.viewModel.otherFile != null && $scope.viewModel.otherFile.length > 0) {
                    angular.forEach($scope.viewModel.otherFile, function (item) {
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
            // 加载收集数据的名称
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                if (checkFileData()) {
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        if (checkData(e)) {
                            return defer.resolve($scope.viewModel)
                        } else {
                            return defer.reject($scope.viewModel);
                        }
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        return defer.resolve($scope.viewModel);
                    }
                    return defer.resolve($scope.viewModel);
                }
            };

            $scope.baseInfo.init();
        }
    ]);
});