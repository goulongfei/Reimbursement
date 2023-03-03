define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddinglandDevelopStartContractReadOnly_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');

                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';

                $scope.title = "招投标(土地开发类)";
                
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }

                //获取合同状态
                wfWaiting.show();
                $scope.isSuccess = false;
                $scope.data = $scope.viewModel.perSignContractInfoList;
                if (angular.isArray($scope.data) == false) { return; }
                var contractResourceCodelist = [];
                for (var i = 0; i < $scope.data.length; i++) {
                    if ($scope.data[i].contractResourceCode) {
                        contractResourceCodelist.push($scope.data[i].contractResourceCode);
                    }
                }
                if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                    var param = {
                        resourceID: $scope.resourceId,
                        purchaseWayCode:$scope.viewModel.purchaseBase.purchaseWayCode,
                        contractResourceCodelist: contractResourceCodelist,
                    }
                    $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                        .success(function (data) {
                            $scope.isSuccess = (data.data && data.data.length > 0);
                            for (var i = 0; i < data.data.length; i++) {
                                for (var y = 0; y < $scope.data.length; y++) {
                                    var item = $scope.data[y];
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

                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    operatorSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },

                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'StartContract',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
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
                                    case 8:
                                        // 土地开发类合同
                                        contractTypeCode = 8;
                                        contractType = "developLandContractEntry";
                                        contractRouteType = "demolitionContractView";
                                        break;
                                    default:
                                }
                                switch (obj.contractStateCode) {
                                    case 1:
                                        url = $scope.common.webUrlBase + obj.contractProcessDraftURL;
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


                //重新发起合同
                $scope.reStartContract = function (item) {
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
                    })
                    .success(function (data) {
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

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

            }]);
    });