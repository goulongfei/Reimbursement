define(
    [
        'app',
        'commonUtilExtend',
        'contractAgreementExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'isEmphasisExtend',
        'signContractExtend',
        'leftNavExtend',
        'offerInfoExtend',
    ],
    function (app) {
        app.controller('biddingImplementAwardReadOnly_controller', [
            '$scope', 'viewData', 'wfWaiting', 'sogModal', 'rcTools',
            function ($scope, viewData, wfWaiting, sogModal, rcTools) {

                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                //是否显示招标清单
                $scope.isShowTenderFile = false;
                //根据采购类别判断是否显示招标清单
                if ($scope.viewModel.purchaseOfImplement.purchaseCategoryCode == 1) {
                    $scope.isShowTenderFile = true;
                }

                // 设置
                $scope.settings = {
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                        isAdmin: $scope.viewModel.isAdmin,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Award',
                        'isEmphasis': $scope.viewModel.isEmphasis,
                    },
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'Award',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        isNeedAgreement: true,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingImplementAward",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //拟签订合同信息
                    signContractOpts: {
                        scene: 'Award',
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: "Award",
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                };
                //超管查看
                if ($scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                }

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function () { }); }
                        }
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                        $scope.viewModel.isEmphasis = true;
                    }, 
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $scope.$watch('viewModel.isEmphasis', function () { $scope.settings.purchaseDateArrangeOpts.isEmphasis = $scope.viewModel.isEmphasis; });
                $scope.baseInfo.init();
            }
        ]);
    });