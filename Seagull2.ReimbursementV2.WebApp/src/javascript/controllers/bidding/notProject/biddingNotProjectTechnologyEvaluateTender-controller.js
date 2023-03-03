define([
    'app',
    'commonUtilExtend', 'leftNavExtend'], function (app) {
        app.controller('biddingNotProjectTechnologyEvaluateTender_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowCirculate = false;//传阅
                //基本信息
                $scope.baseInfo = {
                    //是否显示合计中标金额
                    isAllSupplierFinalQuoteAmount: false,
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'TechnologyEvaluteTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    fileReady: true,
                    //排名集合
                    rankingList: [],
                    //查找技术标
                    getSupplierReplyBiddingInfo: function (supplierCode) {
                        var supplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSaves.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSaves[i].supplierCode == supplierCode) {
                                supplierReplyBiddingInfo = $scope.viewModel.supplierReplyBiddingInfoSaves[i];
                                break;
                            }
                        }
                        return supplierReplyBiddingInfo;
                    }
                };
                //初始化排名列表
                for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                    $scope.baseInfo.rankingList.push(i + 1);
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);

                    angular.forEach($scope.viewModel.technologyEvaluateBiddingInfoPEMus, function (item) {
                        if (item.isQualified === "" || item.isQualified === null || item.isQualified === "null" || item.isQualified === undefined || item.isQualified === "undefined") {
                            modelStateDictionary.addModelError("技术评标信息", "供应商【" + item.supplierName + "】请选择是否合格");
                        }
                    });
                    if ($scope.viewModel.technologyEvaluateTenderFile.clientFileInformationList == null || $scope.viewModel.technologyEvaluateTenderFile.clientFileInformationList.length == 0) {
                        modelStateDictionary.addModelError("附件", "技术评标文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.technologyEvaluateTenderFile.clientFileInformationList, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "技术评标文件不能为空");
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


