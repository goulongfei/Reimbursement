define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
         'commonUtilExtend',
    ],
    function (app) {
        app.controller('modifyPurchaseTimeReadOnly_controller', [
            '$scope', '$http', 'viewData', 'wfWaiting', 'seagull2Url', 'errorDialog', 'configure', '$window',
            function ($scope, $http, viewData, wfWaiting, seagull2Url, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "调整采购时间";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'scene': 'ReadOnly',
                        'isShowTime': $scope.viewModel.isShowTime,
                        'actionTypeCode': $scope.viewModel.purchaseFormAction.actionTypeCode,
                    },
                    isShowUpstreamProcessMarketing: false,
                    // 初始化
                    init: function () {
                        if ($scope.viewModel.purchaseFormAction.actionTypeCode == 14
                            || $scope.viewModel.purchaseFormAction.actionTypeCode == 15
                            || $scope.viewModel.purchaseFormAction.actionTypeCode == 26
                            || $scope.viewModel.purchaseFormAction.actionTypeCode == 27
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 11
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 31
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 33) {
                            $scope.baseInfo.purchaseDateArrangeOpts.actionTypeCode = $scope.viewModel.purchaseFormAction.actionTypeCode;
                        }
                        else {
                            $scope.baseInfo.purchaseDateArrangeOpts.actionTypeCode = 16;
                        }
                    },
                };

                //过滤时间显示格式
                for (var i = 0; i < $scope.viewModel.p_PurchaseDateArrangeInfoList.length; i++) {
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].replyDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].replyDeadline;
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].evaluateBiddingDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].decideBiddingDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].decideBiddingDeadline;
                }

                //查看开标页面
                $scope.lookPurchaseProgress = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";

                                url = $scope.common.webUrlBase + $scope.viewModel.p_PurchaseDataArrangeAdjustRecord.purchaseUrl;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看采购进度详情异常");
                            wfWaiting.hide();
                        });
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
                $scope.baseInfo.init();
            }]);
    });