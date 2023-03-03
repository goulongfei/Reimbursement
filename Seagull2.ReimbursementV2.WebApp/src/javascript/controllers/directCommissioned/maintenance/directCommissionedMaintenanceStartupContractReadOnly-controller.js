define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
    ],
    function (app) {
        app.controller('directCommissionedMaintenanceStartupContractReadOnly_controller', [
            '$scope', 'viewData',
            'wfWaiting', 'sogModal',
            function ($scope, viewData,
                wfWaiting, sogModal) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（第三方维保类）';
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = true;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowRejection = false;//退回
                    $scope.wfOperateOpts.allowCirculate = false;//传阅
                    $scope.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }
                // 设置审批栏权限
                angular.forEach($scope.opinionOpts.options, function (item) {
                    item.allowToBeAppended = false;
                    item.allowToBeDeleted = false;
                    item.allowToBeModified = false;
                });
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
                // 设置
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'startupContract',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        actionStateCode: $scope.viewModel.formAction.actionStateCode
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                }

                // 基本信息 
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
                };


                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $scope.baseInfo.init();
            }
        ]);
    });