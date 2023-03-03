define(
    [
        'app',
        'negativeListExtend',
        'contractAgreementExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'isEmphasisExtend',
        'refundProgressExtend',
    ],
    function (app) {
        app.controller('biddingImplementApplicationReadOnly_controller', [
            '$scope', 'viewData', 'wfWaiting', 'sogModal',
            function ($scope, viewData, wfWaiting, sogModal) {

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
                    'fileNumLimit': 0,
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
                        'scene': 'DraftReadOnly',
                        'isEmphasis': $scope.viewModel.isEmphasis,
                    },
                    // 入围供应商信息
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                        'isshowenterpriseCheck': true,
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'Draft',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        //采购类别
                        catalogId: $scope.viewModel.purchaseOfImplement.purchaseCategoryCode,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingImplementApplication",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    // 退费
                    refundOpts: {
                        route: 'biddingImplementApplication',
                        businessType: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
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
                        this.setOpinionOpts($scope.opinionOpts.options);
                        $scope.viewModel.isEmphasis = true;
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

                $scope.$watch('viewModel.isEmphasis', function () { $scope.settings.purchaseDateArrangeOpts.isEmphasis = $scope.viewModel.isEmphasis; });
                $scope.baseInfo.init();
            }
        ]);
    });