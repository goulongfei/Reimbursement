define(
    [
        'app',
        'commonUtilExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'dateTimePickerExtend',
    ],
    function(app) {
        app.controller('biddingEngineeringClarigyReply_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator', 'rcTools',
            'sogWfControlOperationType', '$rootScope', 'wfOperate',
            function($scope, viewData, $http, seagull2Url,
                wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
                sogWfControlOperationType, $rootScope, wfOperate) {

                angular.extend($scope, viewData);
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toClarigyTransitionKey;
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 设置 
                $scope.settings = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingEngineeringClarigyReply",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfEngineering.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                };

                $scope.api = {
                    showErrorMessage: function(error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function() { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function() { }); }
                        }
                    },
                    urlAbandonClarifyReply: function(param) {
                        return seagull2Url.getPlatformUrl('/BiddingEngineering/AbandonClarifyReply?r=' + Math.random());
                    },
                    // 延长提问截止时间
                    abandonClarifyReply: function(param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlAbandonClarifyReply(param),
                            data: param,
                        })
                            .success(function(data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function() {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },
                    // 放弃回复
                    abandonClarifyReply: function(item) {
                        var param = {
                            resourceId: $scope.resourceId,
                            bidClarifyInfoCode: item.code,
                        }
                        var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次澄清，是否确认该供应商放弃回复？");
                        promise.then(function (v) {
                            wfWaiting.show();
                            $scope.api.abandonClarifyReply(param, function (data) {
                                if ($scope.api.showErrorMessage != "") {
                                    item.isNeedBidClarifyReply = false;
                                    item.replyStateCode = data.clearBiddingClarifyInfo.replyStateCode;
                                    item.replyStateName = data.clearBiddingClarifyInfo.replyStateName;
                                    item.replyDate = data.clearBiddingClarifyInfo.replyDate;
                                    wfWaiting.hide();
                                    sogModal.openAlertDialog('提示', "放弃回复操作成功！");
                                } else {
                                    wfWaiting.hide();
                                    console.log(data.errorStr);
                                    sogModal.openAlertDialog('提示', "放弃回复操作失败，请稍后再试！");
                                }
                            });
                        }, function (v) {
                            $scope.msg = "点击了取消" + v;
                            wfWaiting.hide();
                        });
                    },
                    // 撤回清标汇总
                    returnToClarigySummary: function() {
                        if ($scope.viewModel.isCancelClarigy) {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toClarigySummaryTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                        else {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toClarigyTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                    },
                };

                // 自定义校验器-判断字符长度
                var stringMaxLengthValidator = (function() {
                    return function(maxlength, message) {
                        this.validateData = function(value, name, validationContext) {
                            if (value && value.length > maxlength) {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                //验证
                var validData = function() {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    // var RangeValidator = ValidateHelper.getValidator('Range'); 
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') }
                    ]);
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function() {
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
                $scope.collectData = function(e, defer) {
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
                        promise.then(function() {
                            defer.resolve(getCleanModel());
                        }, function() {
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


                $scope.baseInfo.init();
            }
        ]);
    });