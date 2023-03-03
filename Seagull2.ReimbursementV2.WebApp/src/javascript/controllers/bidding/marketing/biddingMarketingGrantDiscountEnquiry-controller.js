define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingGrantDiscountEnquiry_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
                $scope.discountDeadline = $filter('date')($scope.viewModel.purchaseOfMarketing.discountDeadline, 'yyyy-MM-dd HH:mm');

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = viewData.sceneId == "PurchaseApproval" ? true : false;//退回;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdraw = viewData.sceneId == "PurchaseApprovalReadOnly" ? true : false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回   
                $scope.wfOperateOpts.allowPrint = false;//打印

                //回标截止时间到，页面左上方会出现发送按钮，您可以发送至定标环节

                //供应商信息验证--发放让利询价
                //var isSend = true;
                //if ($scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry) {

                //    if ($scope.viewModel.grantDiscountEnquiryInfoList.length) {
                //        angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList,
                //            function (v, i) {

                //                if (v.replyStateCode == 1 && v.linkPhone != "")
                //                    isSend = false;

                //            });
                //    }
                //}

                //if (($scope.nowDate >= $scope.discountDeadline || isSend) && viewData.sceneId == "Grant") {
                //    $scope.wfOperateOpts.allowMoveTo = true;
                //} else {
                //    $scope.wfOperateOpts.allowMoveTo = false;
                //}
                if ($scope.nowDate >= $scope.discountDeadline) {
                    $scope.isAbortNoReply = true;
                } else {
                    $scope.isAbortNoReply = false;
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
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    //招标比例
                    optsScale: {
                        min: 1,
                        max: 100,
                        precision: 2
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "GrantEnquiry",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                     
                    // 撤回评标汇总
                    returnToEvaluateSummary: function () {
                        if (!$scope.viewModel.toEvaluateSummaryTransitionKey
                            || !$scope.viewModel.toAwardTransitionKey) { return; }
                        if ($scope.viewModel.isCancelEvaluate) {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateSummaryTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                        else {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toAwardTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                    },
                    isShowUpstreamProcessMarketing: false
                };

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }

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

                        $http.post(seagull2Url.getPlatformUrl("/BiddingMarketing/GiveUpGrant"), obj)
                            .success(function (data) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog('提示', "放弃回复操作成功！");
                            }).error(function (data, status) {
                                wfWaiting.hide();
                                if (data) {
                                    sogModal.openAlertDialog(status, data.message);
                                } else {
                                    sogModal.openAlertDialog("提示", "放弃回复错误");
                                }
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
                //加载收集数据的名称
                $scope.collectData = function (e, defer) { 
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        $scope.baseInfo.returnToEvaluateSummary();
                        defer.resolve($scope.viewModel);
                    }
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });