define([
    'app',
    'leftNavExtend',
    'commonUtilExtend'], function (app) {
        app.controller('clearTender_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集中采购）";
                $scope.isOpinionsShow = false;
                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.commentIsDelete)
                        $scope.isOpinionsShow = true;
                });
                
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
                    //是否显示采购主责人信息
                    isShowUser: true,
                    clearBiddingClarifyRunds: [],
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
                        scene: $scope.viewModel.isBusinessClearTender ? "BusinessClearTender" : "TechnologyClearTender" ,
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //查找回标信息
                    getReplyBidding: function (supplierCode) {
                        var p_SupplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.p_SupplierReplyBiddingInfoPEMus.length; i++) {
                            if ($scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].className == 2) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i];
                                break;
                            }
                        }
                        return p_SupplierReplyBiddingInfo;
                    },
                    //得到澄清信息
                    getClearBiddingClarifyInfo: function (supplierCode, round) {
                        var item = {};
                        for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                            if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode && round == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                                item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                                break;
                            }
                        }
                        return item;
                    },
                    //得到清标回标信息
                    getClearBiddingReplyBidding: function (supplierCode, round) {
                        var p_SupplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos.length; i++) {
                            if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == round) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                                break;
                            }
                        }
                        return p_SupplierReplyBiddingInfo;
                    }
                };
                for (var i = 0; i < $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes; i++) {
                    $scope.baseInfo.clearBiddingClarifyRunds.push({ "code": (i + 1), "name": "第" + rcTools.numberToChinese(i + 1) + "轮澄清" });
                }
                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if ($scope.viewModel.isBusinessClearTender) {
                        if ($scope.viewModel.businessFileList[0].clientFileInformationList == null || $scope.viewModel.businessFileList[0].clientFileInformationList.length == 0) {
                            modelStateDictionary.addModelError("附件", "商务清标文件不能为空")
                        } else {
                            var count = 0;
                            angular.forEach($scope.viewModel.businessFileList[0].clientFileInformationList, function (file) {
                                if (!file.isDeleted) {
                                    count++;
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("附件", "商务清标文件不能为空");
                            }
                        }
                    } else {
                        if ($scope.viewModel.technologyFileList[0].clientFileInformationList == null || $scope.viewModel.technologyFileList[0].clientFileInformationList.length == 0) {
                            modelStateDictionary.addModelError("附件", "技术清标文件不能为空")
                        } else {
                            var count = 0;
                            angular.forEach($scope.viewModel.technologyFileList[0].clientFileInformationList, function (file) {
                                if (!file.isDeleted) {
                                    count++;
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("附件", "技术清标文件不能为空");
                            }
                        }
                    }
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


