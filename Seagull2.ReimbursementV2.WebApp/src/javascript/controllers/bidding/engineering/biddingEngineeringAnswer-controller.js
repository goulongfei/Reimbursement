define(
    [
        'app',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingEngineeringAnswer_controller', [
            '$scope', 'viewData', '$rootScope', '$http',
            'wfOperate', 'seagull2Url',
            'wfWaiting', 'sogModal', 'sogOguType', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            'regionType', 'regionShowStyle', '$injector',
            function ($scope, viewData, $rootScope, $http,
                wfOperate, seagull2Url,
                wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator,
                sogWfControlOperationType,
                regionType, regionShowStyle, $injector) {
                //var sogModuleLoader = $injector.get('sogModuleLoader');
                //sogModuleLoader.useModuleWithRequire(app, ['angular-seagull2-bankAccountprovider'], ['angular-seagull2-bankAccountprovider'])
                //    .then(function () {
                //        //加载模块后显示界面目标指令
                //        $scope.isSubReady = true;//加载完毕
                //    });

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
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Answer',
                    },
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'Answer',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaList: $scope.viewModel.stageAreaScopeList,
                        contractAgreementTypeCode: $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode,
                        resourceID: $scope.viewModel.resourceID,
                        //采购类别
                        catalogId: $scope.viewModel.purchaseOfEngineering.purchaseCategoryCode,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingEngineeringAnswer",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfEngineering.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
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
                    urlExtensionQuestionTime: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingEngineering/ExtensionQuestionTime?r=' + Math.random());
                    },
                    // 延长提问截止时间
                    extensionQuestionTime: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlExtensionQuestionTime(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    // 延长提问截止时间
                    confirmQuestionDeadline: function () {
                        wfWaiting.show();
                        var param = {
                            resourceId: $scope.resourceId,
                            questionTime: $scope.viewModel.questionDeadline,
                        }
                        $scope.api.extensionQuestionTime(param, function (data) {
                            angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (item) {
                                item.questionDeadline = data.deadline;
                                wfWaiting.hide();
                                sogModal.openAlertDialog('提示', "提问截止时间修改成功！");
                            });
                        });
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
                //  $scope.$watch('viewModel.purchaseOfEngineering.linkMan', $scope.baseInfo.linkManChange, true);
                // 刷新流程
                //$scope.refreshProcess = function () { 
                //};

                //$rootScope.$on("$processRefreshed", function (event, data) { 
                //});

                $scope.baseInfo.init();
            }
        ]);
    });