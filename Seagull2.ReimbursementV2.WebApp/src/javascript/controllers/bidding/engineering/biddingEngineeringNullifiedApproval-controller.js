﻿define(
    [
        'app',
        'negativeListExtend',
        'contractAgreementExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'refundProgressExtend', 
    ],
    function (app) {
        app.controller('biddingEngineeringNullifiedApproval_controller', [
            '$scope', 'viewData', 'wfWaiting', 'sogModal',
            function ($scope, viewData, wfWaiting, sogModal) {

                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false;//打印    
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 设置
                $scope.settings = {
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                    },
                    // 入围供应商信息
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                        scene: $scope.viewModel.isEvaluateNullified ? "BusinessEvaluate" : "IssueBiddingDocument",
                    },
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'IssueBiddingDocument',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingEngineeringNullifiedApproval",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfEngineering.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    // 退费
                    refundOpts: {
                        route: 'biddingEngineeringNullifiedApproval',
                        businessType: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
                    },
                };

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
                        $scope.viewModel.isEmphasis = false;
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