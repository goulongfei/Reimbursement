define([
    'app',
    'commonUtilExtend',
    'leftNavExtend',
], function (app) {
    app.controller('cooperationInfo_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //得到中标供应商信息
                getWinTheBiddingSuppliers: function () {
                    var suppliers = [];
                    angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (supplier) {
                        if (supplier.isWinTheBidding) {
                            suppliers.push(supplier);
                        }
                    });
                    return suppliers;
                },
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false,
                    'fileNumLimit': 10
                },
                fileReady: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "CooperationInfo",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
            };
            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");
            var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
            var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
            var validData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                angular.forEach($scope.baseInfo.getWinTheBiddingSuppliers(), function (item) {
                    if (!item.linkManName) {
                        modelStateDictionary.addModelError("合作供应商信息", "供应商【" + item.supplierName + "】联系人不能为空");
                    }
                    if (!item.linkEmail) {
                        modelStateDictionary.addModelError("合作供应商信息", "供应商【" + item.supplierName + "】联系人邮箱不能为空");
                    } else {
                        var validEmail = regEmail.test(item.linkEmail);
                        if (validEmail === false) {
                            modelStateDictionary.addModelError("合作供应商信息", "供应商【" + item.supplierName + "】联系人邮箱格式不正确");
                        }
                    }
                    if (!item.linkPhone) {
                        modelStateDictionary.addModelError("合作供应商信息", "供应商【" + item.supplierName + "】联系人电话不能为空");
                    } else {
                        var validPhoneNumber = regPhoneNumber.test(item.linkPhone);
                        if (validPhoneNumber === false) {
                            modelStateDictionary.addModelError("合作供应商信息", "供应商【" + item.supplierName + "】联系人电话格式不正确");
                        }
                    }
                });
                angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus, function (item) {
                    if (item.startDate == null || item.startDate == "0001-01-01T00:00:00" || item.startDate == "") {
                        modelStateDictionary.addModelError("协议信息", "供应商【" + item.supplierName + "】协议开始时间不能为空");
                    } else {
                        if (new Date(item.startDate) < new Date()) {
                            modelStateDictionary.addModelError("协议信息", "供应商【" + item.supplierName + "】协议开始时间不能小于当前时间");
                        }
                    }
                    if (item.endDate == null || item.endDate == "0001-01-01T00:00:00" || item.endDate == "") {
                        modelStateDictionary.addModelError("协议信息", "供应商【" + item.supplierName + "】协议开始时间不能为空");
                    } else {
                        if (item.endDate.getTime() <= item.startDate.getTime()) {
                            modelStateDictionary.addModelError("协议信息", "供应商【" + item.supplierName + "】协议结束时间不能小于协议开始时间");
                        }
                    }
                });
                return modelStateDictionary;
            };
            var checkFileData = function () {
                if (!$scope.baseInfo.fileReady) {
                    sogModal.openAlertDialog('提示', '附件未上传完毕');
                    return false;
                }
                return true;
            };
            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                if (checkFileData()) {
                    switch (e.operationType) {
                        case sogWfControlOperationType.MoveTo:
                            var result = validData();
                            if (!result.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                sogValidator.broadcastResult(result.get());
                                defer.reject($scope.viewModel);
                            } else {
                                defer.resolve($scope.viewModel);
                            }
                            break;
                        case sogWfControlOperationType.Save:
                            defer.resolve($scope.viewModel);
                            break;
                        case sogWfControlOperationType.CancelProcess:
                            defer.resolve($scope.viewModel);
                            break;
                        default:
                            defer.resolve(null);
                            break;
                    }
                }
            };
        });
});


