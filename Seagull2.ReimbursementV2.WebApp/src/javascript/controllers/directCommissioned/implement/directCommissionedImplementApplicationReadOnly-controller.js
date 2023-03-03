﻿define(
    [
        'app', 
        'directCommissionedSynthesizeExtend', 
        'negativeListExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('directCommissionedImplementApplicationReadOnly_controller', [
            '$scope', 'viewData','wfWaiting', 'sogModal',
            function ($scope, viewData, wfWaiting, sogModal) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                //是否营销展示不显示
                $scope.isMarketingExhibitionNotShow = true;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                angular.forEach($scope.opinions, function (item) {
                    if (item.isAbortOpinion === true) {
                        $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                    }
                }); 
                // 设置审批栏权限
                angular.forEach($scope.opinionOpts.options, function (item) {
                    item.allowToBeAppended = false;
                    item.allowToBeDeleted = false;
                    item.allowToBeModified = false;
                });
                //超管权限
                if ($scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                }
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 直接委托说明 附件设置项
                $scope.manualFileOpts = {
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
                        'actionTypeCode': 5,
                        'scene': 'application',
                        'isNeedContract': true,
                    },
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
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