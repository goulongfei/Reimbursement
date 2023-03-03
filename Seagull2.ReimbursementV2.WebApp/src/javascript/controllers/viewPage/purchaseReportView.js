define(["app"], function (app) {
    app.controller('purchaseReportViewController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'configure',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, configure) {
            //判断是否是新平台地址
            var isNewPlatform = function (url) {
                var isNew = false;
                if (url) {
                    isNew = url.search(/\/MCSWebApp\//g) < 0
                }
                return isNew;
            }

            var modalOpen = function (document) {
                if (document) {
                    var div = document.createElement("div");
                    div.setAttribute("style", "padding:230px 0; text-align: center;position: fixed;top: 0;left: 0;right:0;bottom:0;z-index: 10001;display:block;filter:alpha(opacity=100);background-color: #fff;opacity: 1;-moz-opacity: 1.0;");
                    var img = document.createElement("img");
                    img.src = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/images/upload-icon.gif";
                    img.alt = "数据加载中...";
                    img.style.width = "70px";
                    img.style.height = "70px";
                    div.appendChild(img);
                    if (document.body) {
                        document.body.appendChild(div);
                    }
                }
            };
            var intervalFunc = function (oneWindow, url) {
                var i = 0;
                var timer = setInterval(function () {
                    i++;
                    var pathname = oneWindow.location ? oneWindow.location.pathname : "";
                    if (pathname && pathname.substr(0, 15).indexOf("MCSWebApp") > 0) {
                        modalOpen(oneWindow.document);
                        oneWindow.location.replace(url);
                        clearInterval(timer);
                    }
                    if (i == 500) {
                        clearInterval(timer);
                    }
                }, 200);
            }

            $scope.isIE = function () {
                if (!!window.ActiveXObject || "ActiveXObject" in window)
                    return true;
                else
                    return false;
            }

            $scope.targetPage = function () {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                var obj = document.getElementById("mainIframe");
                var resourceID = $location.search().resourceID;
                var typeCode = $location.search().type;
                var isNew = $location.search().isNew;
                var purchaseBusinessType = $location.search().purchaseBusinessType;
                var purchaseWay = $location.search().purchaseWay;
                //调用方类型-- 默认空和1为Bi，2为(动态成本、合约规划、成本目标）
                var userType = $location.search().userType;
                var url = "";
                var activityID = "";
                if (resourceID != "") {
                    if (userType === "2") {
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetReportViewUrl?resourceID=" + resourceID + "&typeCode=" + typeCode + "&purchaseWay=" + purchaseWay))
                            .success(function (data) {
                                try {
                                    var newWindow = window.open();
                                    //票据 
                                    if (!data.ticket) {
                                        sogModal.openAlertDialog("提示", "无法查看进行中的单据！");
                                        newWindow.close();
                                    } else {
                                        newWindow.location.href  = $scope.common.webUrlBase + data.taskUrl + "&_at=" + data.ticket;
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                                wfWaiting.hide();
                            }).error(function (data, status) { wfWaiting.hide(); });
                    } else {
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetActivityId?resourceID=" + resourceID + "&typeCode=" + typeCode + "&isNew=" + isNew + "&purchaseWay=" + purchaseWay))
                            .success(function (data) {
                                activityID = data.activityID;
                                try {
                                    switch (typeCode) {
                                        case "1"://初审
                                            if (isNew == "1") {//新系统
                                                if (purchaseBusinessType == 5) {//项目实施
                                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedImplementAuditApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                                if (purchaseBusinessType == 6) {//工程采购
                                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedEngineeringAuditApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                            } else {//老系统
                                                url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/ProjectCommissionedUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                            }
                                            break;
                                        case "2"://复审
                                            if (isNew == "1") { //新系统
                                                if (purchaseBusinessType == 5) {//项目实施
                                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedImplementAuditImplementation/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                                if (purchaseBusinessType == 6) {//工程采购

                                                    url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedEngineeringAuditImplementation/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                            } else { //老系统
                                                url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.InternalAudit/InternalAudit/AuditProjectBudget/AuditProjectImplementateController.ashx?processDescKey=AuditProject&resourceID=" + resourceID + "&activityID=" + activityID;
                                            }
                                            break;
                                        case "3": //定标
                                            if (isNew == "1") { //新系统
                                                //直接委托
                                                if (purchaseWay == "1") {
                                                    if (purchaseBusinessType == "4") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedProjectDefineStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "5") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedImplementStartupContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "6") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedEngineeringStartupContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "1") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedNotProjectStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "2") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedAssetsPurchaseStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "7") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedMarketingStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "8") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedLandDevelopStartContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "9") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedMaintenanceStartupContract/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //招投标-新平台取的拟单，
                                                if (purchaseWay == "3") {
                                                    if (purchaseBusinessType == "6") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingEngineeringApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "5") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingImplementApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "1") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingNotProjectCompilingTender/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "7") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingMarketingDraft/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "8") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingLandDevelopDraft/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "9") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingMaintenanceApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //询价-新平台取的拟单，
                                                if (purchaseWay == "2") {
                                                    if (purchaseBusinessType == "6") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingEngineeringApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "7") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/inquiryPriceMarketingApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "5") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingImplementApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "1") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingNotProjectCompilingTender/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                    if (purchaseBusinessType == "2") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingAssetsPurchaseDraft/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //战略采购-新平台取的拟单，
                                                if (purchaseWay == "5") {
                                                    //招投标集中采购
                                                    if (purchaseBusinessType == "4") {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/compilingTender/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //无合同采购
                                                if (purchaseWay == "8") {
                                                    if (data.isMigrationType) {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/NonContractPurchaseUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    } else {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/startChargeApplication/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //打开无合同发起的支付流程
                                                if (purchaseWay == "88") {
                                                    url = $scope.common.webUrlBase + "/THRWebApp/payment/default.htm#/uncontract/?resourceID=" + resourceID + "&activityID=" + purchaseBusinessType;
                                                }

                                            } else { //老系统
                                                if (purchaseWay == "1") {
                                                    if (purchaseBusinessType != "4" && purchaseBusinessType != "5" && purchaseBusinessType != "6") {
                                                        url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/UnProjectCommissioned/UnProjectCommissionedController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    } else {
                                                        url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/ProjectCommissioned/ProjectCommissionedController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //询价
                                                if (purchaseWay == "2") {
                                                    if (purchaseBusinessType != "4" && purchaseBusinessType != "5" && purchaseBusinessType != "6") {
                                                        if (purchaseBusinessType == "7") {
                                                            url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/InquiryPriceConfirmUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                        } else {
                                                            url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderUnProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                                        }
                                                    } else {
                                                        url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                if (purchaseWay == "3") {
                                                    if (purchaseBusinessType != "5" && purchaseBusinessType != "6") {
                                                        if (purchaseBusinessType == "1") {
                                                            url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/UnProjectConfirmTenderUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                        } else if (purchaseBusinessType == "4") {
                                                            url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/GoodsDefineServiceConfirmTenderUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                        } else {
                                                            url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderUnProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                                        }
                                                    } else {
                                                        url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderProjectPurchase/ConfirmTenderController.ashx?resourceID=" + resourceID + "&activityID=" + activityID;
                                                    }
                                                }
                                                //无合同采购
                                                if (purchaseWay == "8") {
                                                    url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/NonContractPurchaseUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                                //竞争性谈判
                                                if (purchaseWay == "10") {
                                                    url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/CompetitiveConfirmTenderUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                                //比价采购
                                                if (purchaseWay == "11") {
                                                    url = $scope.common.webUrlBase + "/THRWebApp/Tender/default.htm#/ComparePricePurchaseApprovalUrl/?resourceID=" + resourceID + "&activityID=" + activityID;
                                                }
                                            }
                                            break;

                                    }
                                    //票据 
                                    var urlat = data.ticket;
                                    var newWindow = window.open();
                                    if (!urlat) {
                                        sogModal.openAlertDialog("提示", "无法查看进行中的单据！");
                                        newWindow.close();
                                    } else {
                                        debugger;
                                        if (url.indexOf("?") == -1) {
                                            if (isNewPlatform(url)) {
                                                newWindow.location.href = url + "?" + urlat;
                                            } else {
                                                newWindow.location.href = url + "?" + urlat;
                                                intervalFunc(newWindow,url + "?" + urlat);
                                            }

                                        } else {
                                            if (isNewPlatform(url)) {
                                                newWindow.location.href = url + "&_at=" + urlat;
                                            } else {
                                                newWindow.location.href = url + "&_at=" + urlat;
                                                intervalFunc(newWindow,url + "&_at=" + urlat);
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                                wfWaiting.hide();
                            }).error(function (data, status) { wfWaiting.hide(); });
                    }
                }
            }
            $scope.targetPage();
        }]);
});

