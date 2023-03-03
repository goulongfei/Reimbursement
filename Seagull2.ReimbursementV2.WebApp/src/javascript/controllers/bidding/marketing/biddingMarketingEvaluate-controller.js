define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingEvaluate_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;
     
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                if ($scope.sceneId == "DefaultCirculationScene" || $scope.viewModel.isAdmin) {
                    $scope.wfOperateOpts.allowCirculate = true;//传阅 
                }
                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                if ($scope.viewModel.codeName == "BusinessEvaluteTender") {
                    $scope.navSceneName = "BusinessEvaluteTender"
                } else {
                    $scope.navSceneName = "TechnologyEvaluteTender"
                }

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
                        min: 0,
                        max: 100,
                        precision: 2
                    },
                    //招标比例
                    optsScale: {
                        min: 0,
                        max: 100,
                        precision: 0
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: $scope.navSceneName,
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    isShowUpstreamProcessMarketing: false
                };

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }

                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }

                //是否显示IP/Mac
                $scope.isMac = false;
                var replyIpMacs = [];
                $scope.supplierRemark = "";
                angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                    if (v.replyIP != "")
                        replyIpMacs.push(v.replyIP + v.replyMAC);
                });

                //去重
                $scope.uniq = function (array) {
                    var temp = []; //一个新的临时数组
                    var tempMore = [];//返回重复的数
                    for (var i = 0; i < array.length; i++) {
                        if (temp.indexOf(array[i]) == -1) {
                            temp.push(array[i]);
                        }
                        else {
                            if (tempMore.indexOf(array[i]) == -1) {
                                tempMore.push(array[i]);
                            }
                        }
                    }
                    return tempMore;
                }

                if ($scope.uniq(replyIpMacs).length > 0) {
                    var temp = $scope.uniq(replyIpMacs);
                    $scope.isMac = true;
                    angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i] == v.replyIP + v.replyMAC) {
                                $scope.supplierRemark += v.supplierName + "、";
                            }
                        }
                    });
                    $scope.supplierRemark = $scope.supplierRemark.substring(0, $scope.supplierRemark.length - 1);
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);

                    //供应商信息验证
                    if ($scope.viewModel.isBusinessEvaluate) {

                        if ($scope.viewModel.purchaseOfMarketing.businessEvaluateFile == null || $scope.viewModel.purchaseOfMarketing.businessEvaluateFile.length == 0) error.addModelError("商务评标报告", "商务评标报告不能为空");

                        if ($scope.viewModel.businessEvaluateBiddingInfoList.length) {
                            angular.forEach($scope.viewModel.businessEvaluateBiddingInfoList,
                                function (v, i) {
                                    var key = '第' + (i + 1) + '行供应商';
                                    if (v.businessScore == null || v.businessScore == undefined) error.addModelError("商务标得分", key + "商务标得分不能为空");
                                });
                        }
                    } else {
                        if ($scope.viewModel.technologyEvaluateBiddingInfoList.length) {

                            if ($scope.viewModel.purchaseOfMarketing.technologyEvaluateFile == null || $scope.viewModel.purchaseOfMarketing.technologyEvaluateFile.length == 0) error.addModelError("技术评标报告", "技术评标报告不能为空");

                            angular.forEach($scope.viewModel.technologyEvaluateBiddingInfoList, function (v, i) {
                                var key = '第' + (i + 1) + '行供应商';
                                if (v.technologyScore == null || v.technologyScore == undefined) error.addModelError("技术标得分", key + "技术标得分不能为空");
                            });
                        }
                    }
                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }

                var checkSaveData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);
                    //供应商信息验证
                    if ($scope.viewModel.isBusinessEvaluate) {
                        if ($scope.viewModel.businessEvaluateBiddingInfoList.length) {
                            angular.forEach($scope.viewModel.businessEvaluateBiddingInfoList,
                                function (v, i) {
                                    var key = '第' + (i + 1) + '行供应商';
                                    if (v.businessScore == null || v.businessScore == undefined) error.addModelError("商务标得分", key + "商务标得分不能为空");
                                });
                        }
                    } else {
                        if ($scope.viewModel.technologyEvaluateBiddingInfoList.length) {
                            angular.forEach($scope.viewModel.technologyEvaluateBiddingInfoList, function (v, i) {
                                var key = '第' + (i + 1) + '行供应商';
                                if (v.technologyScore == null || v.technologyScore == undefined) error.addModelError("技术标得分", key + "技术标得分不能为空");
                            });
                        }
                    }
                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }

                var checkFileData = function () {
                    var retrunFlag = true;
                    if ($scope.viewModel.purchaseOfMarketing.businessEvaluateFile != null && $scope.viewModel.purchaseOfMarketing.businessEvaluateFile.length > 0) {
                        angular.forEach($scope.viewModel.purchaseOfMarketing.businessEvaluateFile, function (item) {
                            if (!item.uploaded) {
                                retrunFlag = false;
                            }
                        });
                    }
                    if ($scope.viewModel.purchaseOfMarketing.technologyEvaluateFile != null && $scope.viewModel.purchaseOfMarketing.technologyEvaluateFile.length > 0) {
                        angular.forEach($scope.viewModel.purchaseOfMarketing.technologyEvaluateFile, function (item) {
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
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                        defer.resolve($scope.viewModel);
                    }else{
                        if (checkFileData()) {
                            if (e.operationType === sogWfControlOperationType.MoveTo) {
                                if (checkData(e)) {
                                    defer.resolve($scope.viewModel);
                                } else {
                                    defer.reject($scope.viewModel);
                                }
                            }
                            if (e.operationType === sogWfControlOperationType.Save) {
                                if (checkSaveData(e)) {
                                    defer.resolve($scope.viewModel);
                                } else {
                                    defer.reject($scope.viewModel);
                                }
                            }
                            return defer.resolve($scope.viewModel);
                        }
                    }
                }
            }]);
    });