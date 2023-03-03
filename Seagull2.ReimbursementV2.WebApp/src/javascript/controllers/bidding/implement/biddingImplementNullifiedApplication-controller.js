define(
    [
        'app',
        'supplierCategory',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'sectionNavExtend',
        'leftNavExtend',
        'refundProgressExtend', 
    ],
    function (app) {
        app.controller('biddingImplementNullifiedApplication_controller', [
            '$scope', 'viewData',
            'wfWaiting', 'sogModal', 'sogOguType', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            'regionType', 'regionShowStyle', '$injector', '$http', 'seagull2Url', '$rootScope','wfOperate',
            function ($scope, viewData,
                wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator,
                sogWfControlOperationType,
                regionType, regionShowStyle, $injector, $http, seagull2Url, $rootScope, wfOperate ) {
                var sogModuleLoader = $injector.get('sogModuleLoader');
                sogModuleLoader.useModuleWithRequire(app, ['angular-seagull2-bankAccountprovider'], ['angular-seagull2-bankAccountprovider'])
                    .then(function () {
                        //加载模块后显示界面目标指令
                        $scope.isSubReady = true;//加载完毕
                    });
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
                    precision: 2
                };
                // 设置 
                $scope.settings = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 地区
                    regionOpts: {
                        root: {
                            id: 'CHN',
                            //子级的类型
                            childrenClass: regionType.province
                        },
                        rootName: '中国',
                        selectMask: [regionType.county],
                        multiple: false,
                        showStyle: regionShowStyle.fullName,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                        scene: $scope.viewModel.isEvaluateNullified ? "BusinessEvaluate" : "IssueBiddingDocument" ,
                    },
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'IssueBiddingDocument',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingImplementNullifiedApproval",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    // 退费
                    refundOpts: {
                        route: 'biddingImplementNullifiedApplication',
                        businessType: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function () { }); }
                        }
                    }, 
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                        $scope.viewModel.isEmphasis = false; 
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    // 联系人变更事件
                    linkManChange: function (newVal, oldVal) {
                        if (newVal == null && oldVal != null) {
                            $scope.viewModel.purchaseOfImplement.linkManUserCode = null;
                            $scope.viewModel.purchaseOfImplement.linkManUserName = null;
                        }
                    }, 
                    // 废标
                    cancelBidding: function () {
                        $scope.refreshProcess();
                    }
                };

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
                    // var RangeValidator = ValidateHelper.getValidator('Range'); 
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') }
                    ]);
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") }
                    ]); 
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
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };
                $scope.$watch('viewModel.purchaseOfImplement.linkMan', $scope.baseInfo.linkManChange, true);
                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        IsNullified: $scope.viewModel.isNullified,
                    };
                    if (param) {
                        wfOperate.refreshProcess('/BiddingImplementIssueBiddingDocumentWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                });

                $scope.baseInfo.init();


            }
        ]);
    });