define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceGrantDiscountEnquiry_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection =  false;//退回
                $scope.wfOperateOpts.allowDoAbort =  false;//作废
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                if (new Date() >= new Date(Date.parse($scope.viewModel.purchaseOfMaintenance.discountDeadline))) {
                    $scope.isAbortNoReply = true;
                } else {
                    $scope.isAbortNoReply = false;
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
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'GrantEnquiry',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    // 撤回评标汇总
                    returnToEvaluateSummary: function () {
                        if ($scope.viewModel.isCancelEvaluate) {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateSummaryTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                        else {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                    },
                    //查找商务评标信息
                    getBusinessEvaluateBiddingInfo: function (supplier) {
                        var amount = 0;
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].supplierCode == supplier.supplierCode
                                && $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].round == $scope.viewModel.purchaseOfMaintenance.evaluateBiddingTimes-1) {
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

                //放弃回复
                $scope.giveUpGrant = function (item) {
                    var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                    promise.then(function (v) {
                        wfWaiting.show();
                        item.replyStateName = "放弃回复";
                        item.replyStateCode = "3";

                        var obj = {
                            grantDiscountEnquiryInfo: item
                        };
                        $http.post(seagull2Url.getPlatformUrl("/BiddingMaintenance/GiveUpGrant"), obj)
                            .success(function (data) {
                                wfWaiting.hide();
                            }).error(function (data, status) {
                            if (data) {
                                sogModal.openAlertDialog(status, data.message);
                            } else {
                                sogModal.openAlertDialog("提示", "放弃回复错误");
                            }
                            wfWaiting.hide();
                        });
                    }, function (v) {
                        $scope.msg = "点击了取消" + v;
                        wfWaiting.hide();
                    });
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
                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                                defer.resolve($scope.viewModel);
                        }
                    }
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });