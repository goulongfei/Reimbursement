define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        'isEmphasisExtend',
        'echartsUitl',
    ],
    function (app) {
        app.controller('directCommissionedImplementAuditImplementationReadOnly_controller', [
            '$scope', 'viewData', 'wfWaiting', 'sogModal', 'rcTools',
            function ($scope, viewData, wfWaiting, sogModal, rcTools) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false;//打印 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送
                $scope.wfOperateOpts.allowSave = false;//保存
                if ($scope.sceneId === 'DefaultCirculationScene' && $scope.sceneId === 'DefaultScene') {
                    $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                }
                //超管权限
                if ($scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
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
                // 审计报告 附件设置项
                $scope.auditReportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 复审定案表 附件设置项
                $scope.auditFinalFormFileOpts = {
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
                    reTrialAmountChange: function () {
                        // 初审一致金额
                        var firstTrialAgreedPartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.firstTrialAgreedPartAmount, 2);
                        // 初审争议金额
                        var firstTrialDisputePartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.firstTrialDisputePartAmount, 2);
                        // 审计一致金额
                        var reTrialAgreedPartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmount, 2);
                        // 审计争议金额
                        var reTrialDisputePartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.reTrialDisputePartAmount, 2);
                        // 审计审增金额
                        var reTrialAuditIncreaseAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.reTrialAuditIncreaseAmount, 2);
                        // 审定金额
                        var total = rcTools.toFixedNum(reTrialAgreedPartAmount + reTrialDisputePartAmount + reTrialAuditIncreaseAmount, 2);
                        var costTarget = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount, 2);
                        // 计算成本目标偏差金额
                        var deviation = total - costTarget;

                        // 一致部分复审核减金额
                        $scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmountMinus = rcTools.toFixedNum(firstTrialAgreedPartAmount - reTrialAgreedPartAmount, 2);
                        // 争议部分复审核减金额
                        $scope.viewModel.purchaseOfImplement.reTrialDisputePartAmountMinus = rcTools.toFixedNum(firstTrialDisputePartAmount - reTrialDisputePartAmount, 2);
                        // 复审核减率
                        $scope.viewModel.purchaseOfImplement.reTrialJudgementAmountMinusRate
                            = rcTools.toFixedNum(($scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmountMinus / firstTrialAgreedPartAmount) * 100, 2);
                        // 复审审定金额
                        $scope.viewModel.purchaseOfImplement.reTrialJudgementAmount = rcTools.toFixedNum(total, 2);
                        // 成本目标偏差金额
                        $scope.viewModel.purchaseOfImplement.reTrialCostTargetDeviationAmount = rcTools.toFixedNum(deviation, 2);
                        // 成本目标偏差比例
                        $scope.viewModel.purchaseOfImplement.reTrialCostTargetDeviationRate
                            = costTarget === 0 ? 0 : rcTools.toFixedNum((deviation / costTarget) * 100, 2);
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
                $scope.baseInfo.init();
                if ($scope.viewModel.purchaseOfImplement.reTrialJudgementAmount == undefined || $scope.viewModel.purchaseOfImplement.reTrialJudgementAmount == null) {
                    $scope.baseInfo.reTrialAmountChange();
                }
            }
        ]);
    });