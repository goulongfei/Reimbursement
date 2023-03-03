define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'fixedAssetsExtend',
        'useCostCenterExtend'
    ],
    function (app) {

        app.controller('directCommissionedAssetsPurchaseApprovalReadOnly_controller', [
            '$scope', 'viewData', 'sogOguType', '$window', '$http', 'seagull2Url',
            function ($scope, viewData, sogOguType, $window, $http, seagull2Url) {

                angular.extend($scope, viewData);
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }

                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（固定资产采购类）';
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                //  查看上游流程
                $scope.lookFixedAssets = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = $scope.viewModel.purchaseOfFixedAssets.upstreamProcessURL;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看上游流程异常");
                            wfWaiting.hide();
                        });
                }
                //基本信息
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 2,
                        'completereadonly': false,
                        'scene': 'application',
                    },
                };

                // 设置
                $scope.settings = {
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
                    },
                    isSpreadInfo: false,
                    spreadButtonName: "展开",
                    isApproval: false,
                };

                if ($scope.viewModel.isAdmin) {
                    $scope.settings.isApproval = true;
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $scope.baseInfo.init();
            }]);
    });