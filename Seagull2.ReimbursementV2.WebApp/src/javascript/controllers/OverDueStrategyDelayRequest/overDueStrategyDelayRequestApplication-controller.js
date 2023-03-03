define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'supplierCategoryExtend',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'commonUtilExtend',
        'supplierInfoExtendV4',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('overDueStrategyDelayRequestApplication-controller', [
            '$window', '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'sogWfQueryField', 'exception',
            function ($window, $scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, sogWfQueryField, exception) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '战采协议延期申请';
                $scope.title = "延期申请";
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

                //页面权限加载--对接统一权限资源权限
                function CheckPermission() {
                    var command = {
                        permissionValue: "StrategyDelayRequest",
                        permissionName: "战采协议延期申请"
                    };
                    var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
                    wfWaiting.show();
                    $http.post(url, command)
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data.success) {
                                if (!data.data) {
                                    exception.throwException(500, { message: "您没有战采协议延期申请相关权限，请联系管理员!" });
                                }
                            } else {
                                exception.throwException(500, { message: data.message });
                            }
                        });
                }
                CheckPermission();


                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId && v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }
                // 设置
                $scope.settings = {

                    // 拟变更信息
                    proposedChangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'isUpstreamReadOnly': $scope.viewModel.isUpstreamReadOnly
                    }
                };

                //基本信息
                $scope.baseInfo = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '延期申请说明', attributeName: 'overDueStrategyDelayRequestRecord.delayReason', validator: new RequiredValidator('不能为空！') },
                        { key: '延期申请说明', attributeName: 'overDueStrategyDelayRequestRecord.delayReason', validator: new stringMaxLengthValidator(500, "不能大于500个字符!") }
                    ]);

                    //拟变更信息
                    if (angular.isArray($scope.viewModel.proposedChangeInfoList)) {
                        // 拟变更信息是否为空
                        if ($scope.viewModel.proposedChangeInfoList.length === 0) {
                            modelStateDictionary.addModelError('拟变更信息', '不能为空!');
                        }
                        for (var i = 0; i < $scope.viewModel.proposedChangeInfoList.length; i++) {
                            var item = $scope.viewModel.proposedChangeInfoList[i];
                            var rowKey = "拟变更信息第" + (i + 1) + "行";
                            if (!item.agreementDelayTime || item.agreementDelayTime == undefined) {
                                modelStateDictionary.addModelError(rowKey + '，延长后结束时间', '不能为空');
                            } else {
                                var newContractDelayTime = new Date(item.agreementDelayTime);
                                var nowDateTime = new Date();
                                if (newContractDelayTime.getTime() - nowDateTime.getTime()<=1) {
                                    //if (newContractDelayTime.getDay() !== nowDateTime.getDay()) {
                                        modelStateDictionary.addModelError(rowKey, "延长后结束日期应该大于当前日期;");
                                    //}
                                }
                                if (item.agreementDelayDays > 30) {
                                    modelStateDictionary.addModelError(rowKey, "延长后结束时间,单次不能延长30天以上;");
                                }
                            }
                            
                        }
                    }
                    return modelStateDictionary;
                };

                // 保存验证
                var saveValidData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '延期申请说明', attributeName: 'overDueStrategyDelayRequestRecord.delayReason', validator: new RequiredValidator('不能为空！') },
                        { key: '延期申请说明', attributeName: 'overDueStrategyDelayRequestRecord.delayReason', validator: new stringMaxLengthValidator(500, "不能大于500个字符!") }
                    ]);

                    return modelStateDictionary;
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel)
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
                    //else if (e.operationType === sogWfControlOperationType.Save) {
                    //    result = saveValidData();
                    //    if (!result.isValid()) {
                    //        sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                    //        sogValidator.broadcastResult(result.get());
                    //        defer.reject($scope.viewModel);
                    //    } else {
                    //        defer.resolve($scope.viewModel);
                    //    }
                    //}
                    else {
                        defer.resolve($scope.viewModel);
                    }

                }
               
                // 刷新流程
                $scope.refreshProcess = function () {
                   
                    if (param.PurchaseAmount && param.CostCenterCode && param.ChargeCompanyCode && param.CorporationCode) {
                        wfOperate.refreshProcess('/OverDueStrategyDelayRequestApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                });

            }]);
    });