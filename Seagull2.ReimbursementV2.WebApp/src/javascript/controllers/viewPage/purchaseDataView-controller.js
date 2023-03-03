define([
    "app",
    'commonUtilExtend',
], function (app) {
    app.controller('purchaseDataView_controller',
        function ($scope, $http, $state, wfWaiting, sogModal, seagull2Url, $location, $window, configure) {
            var resourceID = $location.search().resourceID;
            var purchaseWay = $location.search().purchaseWay;
            var businessType = $location.search().businessType;
            $scope.common = {};
            configure.getConfig($scope.common, 'common');

            wfWaiting.show();
            var url = seagull2Url.getPlatformUrl("/PurchaseDataView/GetPurchaseDataViewModel?resourceID=") + resourceID + "&purchaseWay=" + purchaseWay + "&businessType=" + businessType
            $http.get(url).success(function (data) {
                $scope.viewModel = data;
                wfWaiting.hide();
            }).error(function (data, status) { wfWaiting.hide(); });

            //查看采购流程页面
            $scope.purchaseWorkflowView = function () {
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl("/Purchase/GetActivityId?resourceID=" + $scope.viewModel.resourceID + "&typeCode=3&isNew=" + $scope.viewModel.isNew + "&purchaseWay=" + $scope.viewModel.purchaseWay))
                    .success(function (data) {
                        wfWaiting.hide();
                        activityID = data.activityID;
                        if ($scope.viewModel.isNew == "1") { //新系统
                            //直接委托
                            if ($scope.viewModel.purchaseWay == "1") {
                                if ($scope.viewModel.businessType == "4") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedProjectDefineStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "5") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedImplementStartupContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "6") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedEngineeringStartupContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "1") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedNotProjectStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "2") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedAssetsPurchaseStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "7") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedMarketingStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "8") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedLandDevelopStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "9") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedMaintenanceStartupContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //招投标-新平台取的拟单，
                            if ($scope.viewModel.purchaseWay == "3") {
                                if ($scope.viewModel.businessType == "6") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingEngineeringApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "5") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingImplementApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "1") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingNotProjectCompilingTender/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "7") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingMarketingDraft/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "8") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingLandDevelopDraft/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "9") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingMaintenanceApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //询价-新平台取的拟单，
                            if ($scope.viewModel.purchaseWay == "2") {
                                if ($scope.viewModel.businessType == "6") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingEngineeringApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "5") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingImplementApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "1") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingNotProjectCompilingTender/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                                if ($scope.viewModel.businessType == "2") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingAssetsPurchaseDraft/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //战略采购-新平台取的拟单，
                            if ($scope.viewModel.purchaseWay == "5") {
                                //招投标集中采购
                                if ($scope.viewModel.businessType == "4") {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/compilingTender/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //无合同采购
                            if ($scope.viewModel.purchaseWay == "8") {
                                if (data.isMigrationType) {
                                    url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/NonContractPurchaseUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                } else {
                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/startChargeApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //打开无合同发起的支付流程
                            if ($scope.viewModel.purchaseWay == "88") {
                                url = $scope.common.webUrlBase + "/THRWebApp/payment/default.htm#/uncontract/?resourceID=" + resourceID + "&activityID=" + $scope.viewModel.businessType;
                            }
                        } else { //老系统
                            if ($scope.viewModel.purchaseWay == "1") {
                                if ($scope.viewModel.businessType != "4" && $scope.viewModel.businessType != "5" && $scope.viewModel.businessType != "6") {
                                    url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/UnProjectCommissioned/UnProjectCommissionedController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                } else {
                                    url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/ProjectCommissioned/ProjectCommissionedController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //询价
                            if ($scope.viewModel.purchaseWay == "2") {
                                if ($scope.viewModel.businessType != "4" && $scope.viewModel.businessType != "5" && $scope.viewModel.businessType != "6") {
                                    if ($scope.viewModel.businessType == "7") {
                                        url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/InquiryPriceConfirmUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                    } else {
                                        url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderUnProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                    }
                                } else {
                                    url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            if ($scope.viewModel.purchaseWay == "3") {
                                if ($scope.viewModel.businessType != "5" && $scope.viewModel.businessType != "6") {
                                    if ($scope.viewModel.businessType == "1") {
                                        url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/UnProjectConfirmTenderUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                    } else if ($scope.viewModel.businessType == "4") {
                                        url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/GoodsDefineServiceConfirmTenderUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                    } else {
                                        url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderUnProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                    }
                                } else {
                                    url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                }
                            }
                            //无合同采购
                            if ($scope.viewModel.purchaseWay == "8") {
                                url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/NonContractPurchaseUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                            }
                            //竞争性谈判
                            if ($scope.viewModel.purchaseWay == "10") {
                                url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/CompetitiveConfirmTenderUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                            }
                            //比价采购
                            if (purchaseWay == "11") {
                                url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/ComparePricePurchaseApprovalUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                            }
                        }
                        var workflowUrl = url + "&_at=" + data.ticket
                        $window.open(workflowUrl, '_blank');
                        
                    }).error(function (data, status) { wfWaiting.hide(); });
            };

            //查看合同详情
            $scope.lookContarctInfo = function (url) {
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            url = url + "&_at=" + urlat;
                            $window.open(url, '_blank');
                        }
                    })
                    .error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "查看合同详情异常");
                        wfWaiting.hide();
                    });
            };
    });
});

