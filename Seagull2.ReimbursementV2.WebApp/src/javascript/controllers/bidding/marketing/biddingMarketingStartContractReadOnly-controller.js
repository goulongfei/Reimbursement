define(
    [
        'app',
        'biddingSynthesizeExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingStartContractReadOnly_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url', 'configure', '$window', 'sogOguType', 'wfWaiting', 'sogModal',
            function ($scope, viewData, $http, seagull2Url, configure, $window, sogOguType, wfWaiting, sogModal) {

                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                //获取合同状态
                wfWaiting.show();
                $scope.isSuccess = false;
                if (angular.isArray($scope.viewModel.perSignContractInfoList) == false) { return; }
                var contractResourceCodelist = [];
                for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                    if ($scope.viewModel.perSignContractInfoList[i].contractResourceCode) {
                        contractResourceCodelist.push($scope.viewModel.perSignContractInfoList[i].contractResourceCode);
                    }
                }
                if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                    var param = {
                        resourceID: $scope.resourceId,
                        purchaseWayCode: $scope.viewModel.purchaseBase.purchaseWayCode,
                        contractResourceCodelist: contractResourceCodelist,
                    }
                    $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                        .success(function (data) {
                            $scope.isSuccess = (data.data && data.data.length > 0);
                            for (var i = 0; i < data.data.length; i++) {
                                for (var y = 0; y < $scope.viewModel.perSignContractInfoList.length; y++) {
                                    var item = $scope.viewModel.perSignContractInfoList[y];
                                    if (item.contractResourceCode == data.data[i].contractResourceCode) {
                                        item.contractStateCode = data.data[i].contractStateCode;
                                        item.contractStateName = data.data[i].contractStateName;
                                    }
                                }
                            }
                            wfWaiting.hide();
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "获取合同状态异常");
                            $scope.isSuccess = false;
                            wfWaiting.hide();
                        });
                }
                else {
                    $scope.isSuccess = true;
                    wfWaiting.hide();
                }
                //基本信息
                $scope.baseInfo = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "StartContract",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    isShowUpstreamProcessMarketing: false
                };

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }

                //重新发起合同
                $scope.resetStartContract = function (item) {
                    wfWaiting.show();
                    var param = {
                        bussinessTypeCode: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
                        purchaseWayCode: $scope.viewModel.purchaseBase.purchaseWayCode,
                        resourceId: item.resourceID,
                        code: item.code,
                        operatorUserCode: item.operatorUser.id,
                        operatorUserName: item.operatorUser.displayName
                    }

                    $http({
                        method: 'POST',
                        url: seagull2Url.getPlatformUrl('/PurchaseContract/ReStartContract'),
                        data: param
                    }).error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "重新发起合同异常");
                        wfWaiting.hide();
                    }).success(function (data) {
                        wfWaiting.hide();
                        item.contractStateCode = 1;
                        item.contractStateName = "未生效"
                        $scope.isSuccess = true;
                        var promise = sogModal.openAlertDialog("提示", "重新发起合同成功");
                        promise.then(function (result) {
                            location.reload();
                        }, function (rejectData) {
                            location.reload();
                        });
                    });
                }

                //查看合同详情
                $scope.lookContarctInfo = function (obj) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var contractType = "";
                                var contractTypeCode = "";
                                var contractRouteType = "";
                                switch ($scope.viewModel.purchaseBase.purchaseBusinessTypeCode) {
                                    case 7:
                                        // 营销类合同
                                        contractTypeCode = 5;
                                        contractType = "marketingContractEntry";
                                        contractRouteType = "marketingContractView";
                                        break;
                                }
                                switch (obj.contractStateCode) {
                                    case 1:
                                        if (obj.contractProcessDraftURL) {
                                            url = $scope.common.webUrlBase + obj.contractProcessDraftURL;
                                        }
                                        else {
                                            url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractType + "/?resourceID=" + obj.contractResourceCode;
                                        }
                                        break;
                                    case 3:
                                        url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractRouteType + "?id=" + obj.contractResourceCode + '&contractTypeCode=' + contractTypeCode + '&systemVersionCode=2';
                                        break;
                                }
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看合同详情异常");
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
                    defer.resolve($scope.viewModel);
                };

                //查看页面
                $scope.lookbiddingMarketingInfo = function (routesType, title) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";

                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID;

                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, title + "异常");
                            wfWaiting.hide();
                        });
                }

            }]);
    });