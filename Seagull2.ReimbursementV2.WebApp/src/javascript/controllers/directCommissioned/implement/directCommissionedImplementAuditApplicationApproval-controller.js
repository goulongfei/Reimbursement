﻿define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        'isEmphasisExtend',
        'echartsUitl',
    ],
    function (app) {
        app.controller('directCommissionedImplementAuditApplicationApproval_controller', [
            '$scope', '$rootScope', 'viewData', '$http', 'seagull2Url',
            'wfWaiting', 'sogModal',  
            function ($scope, $rootScope, viewData, $http, seagull2Url,
                wfWaiting, sogModal) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                $scope.isApproval = true;
                //设置导航栏按钮状态
                //$scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if ($scope.sceneId === 'DefaultCirculationScene') {
                    $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                }
                //默认显示重要信息
                $scope.viewModel.isEmphasis = true;
                //判断显示，表示初审
                $scope.viewModel.auditState = "InitialAudit";
                //初审图表数据初始化
                $scope.chartOpt = ['成本目标金额', '上报金额', '初审金额'];
                $scope.chartData = [$scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount, $scope.viewModel.purchaseBase.purchaseAmount, $scope.viewModel.purchaseOfImplement.firstTrialAgreedPartAmount + $scope.viewModel.purchaseOfImplement.firstTrialDisputePartAmount];

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
                // 预算初审报告 附件设置项
                $scope.budgetReportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 预算定案表 附件设置项
                $scope.budgetFinalFormFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 资料清单 附件设置项
                $scope.materialMediaFileOpts = {
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
                    //页面的展开按钮控制
                    isSpreadInfo: false,
                    spreadButtonName: "展开",
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
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options); 
                });
                $scope.baseInfo.init();
            }
        ]);
    });