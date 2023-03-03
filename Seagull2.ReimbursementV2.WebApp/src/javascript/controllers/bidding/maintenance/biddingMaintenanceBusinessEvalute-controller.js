define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceBusinessEvalute_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";
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
                        scene: 'BusinessEvaluteTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //查找商务评标信息
                    getBusinessEvaluateBiddingInfo: function (supplier) {
                        var amount = 0;
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].supplierCode == supplier.supplierCode
                                && $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].round == $scope.viewModel.purchaseOfMaintenance.evaluateBiddingTimes - 1) {
                                amount = $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].afterDiscountAmount;
                                break;
                            }
                        }
                        if (amount == 0) {
                            amount = supplier.totalAmountWithTax;
                        }
                        return amount;
                    },
                };

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
                    if ($scope.viewModel.businessEvaluateBiddingInfoList.length) {
                        angular.forEach($scope.viewModel.businessEvaluateBiddingInfoList,
                            function (v, i) {
                                var key = '第' + (i + 1) + '行供应商';
                                if (v.ranking == 0) error.addModelError("商务评标信息", key + "排名不能为空");
                            });
                    }
                    if ($scope.viewModel.businessEvaluateTenderFile.clientFileInformationList == null || $scope.viewModel.businessEvaluateTenderFile.clientFileInformationList.length == 0) {
                        error.addModelError("附件", "商务评标文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.businessEvaluateTenderFile.clientFileInformationList, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            error.addModelError("附件", "商务评标文件不能为空");
                        }
                    }

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }
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
                    if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                        defer.resolve($scope.viewModel);
                    }
                    sogValidator.clear();
                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                defer.resolve($scope.viewModel);
                            } else {
                                defer.reject($scope.viewModel);
                            }
                        }
                        return defer.resolve($scope.viewModel);
                    }
                }
            }]);
    });