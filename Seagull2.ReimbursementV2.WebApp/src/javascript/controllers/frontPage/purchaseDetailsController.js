define(['app'], function (app) {
    app.controller('purchaseDetailsController', ['$scope', '$location', 'wfWaiting', 'sogModal', '$http', 'seagull2Url', function ($scope, $location, wfWaiting, sogModal, $http, seagull2Url) {

        //访问后台地址
        var PurchaseInfoUrl = {
            GetLoginUserNameUrl: '/Purchase/GetLoginUserName'   //获取登录人信息
        };

        $scope.loginUser = {
            displayName: ""
        };

        $scope.InitData = function () {
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl(PurchaseInfoUrl.GetLoginUserNameUrl), { cache: false })
                .success(function (data) {
                    $scope.loginUser.displayName = data.displayName;
                    wfWaiting.hide();
                });
        };

        //页面数据结构
        $scope.links = {
            major: [
                {
                    categoryID: 1,
                    category: "前置操作",
                    items: [
                        { code: 11, name: "供应商入库及考察", icon: "./img/icon/11.png", url: "/THRWebApp/SupplierV2/default.htm?processDescKey=SupplierStorageInvitationAndInspection#/SupplierStorageInvitationAndInspection/" },
                        { code: 12, name: "垄断供应商入库", icon: "./img/icon/12.png", url: "/THRWebApp/SupplierV2/default.htm?processDescKey=MonopolySupplierStorage_V2#/MonopolySupplierStorageInvitation/" },
                        { code: 13, name: "固定资产申请", icon: "./img/icon/13.png", url: "/THRWebApp/FixedAssetsNew/default.htm#/FixedAssetsApplyPrepare" },
                        { code: 14, name: "采购计划", icon: "./img/icon/14.png", url: "/THRWebApp/ReimbursementV2/default.htm#/purchasePlanFront" }
                    ]
                },
                {
                    categoryID: 2,
                    category: "战略采购",
                    items: [
                        { code: 21, name: "战略采购招投标", icon: "./img/icon/21.png", url: "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/StrategicBiddingGroupAndArea/FillInfoAndApprovalController.ashx?processDescKey=StrategicBiddingGroup&businessTypeCode=6&purchasePatternCode=4" },
                        { code: 22, name: "战略采购直接委托", icon: "./img/icon/22.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_StrategyGroupCommissioned&PurchaseOperation=1&PurchasePattern=1#/StrategyGroupCommissionedDraft/" },
                        { code: 23, name: "集中采购招投标", icon: "./img/icon/23.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_CentralizedPurchasing&purchaseOperation=1&purchasePattern=4#/compilingTender/" },
                        { code: 24, name: "集中采购直接委托", icon: "./img/icon/24.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_StrategyCentralizedCommissionedProject&PurchaseOperation=1&PurchasePattern=3#/strategyCentralizedCommissioned/" }
                    ]
                },
                {
                    categoryID: 3,
                    category: "直接委托",
                    items: [
                        { code: 31, name: "工程采购类", icon: "./img/icon/3_4_1.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Engineering&type=6#/directCommissionedEngineeringApplication/" },
                        { code: 32, name: "项目实施服务类", icon: "./img/icon/3_4_2.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Implement&type=5#/directCommissionedImplementApplication/" },
                        { code: 33, name: "项目定义服务类", icon: "./img/icon/3_4_3.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_ProjectDefine&type=4#/directCommissionedProjectDefine/" },
                        { code: 34, name: "非项目服务类", icon: "./img/icon/3_4_4.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_NotProject&type=1#/directCommissionedNotProject/" },
                        { code: 35, name: "营销类", icon: "./img/icon/3_4_5.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Marketing&type=7#/directCommissionedMarketingDraft/" },
                        { code: 36, name: "土地开发类", icon: "./img/icon/3_4_6.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_LandDevelop&type=8&expenditureType=1#/directCommissionedLandDevelop/" },
                        { code: 37, name: "第三方维保类", icon: "./img/icon/3_4_7.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Maintenance&type=9&expenditureType=1#/directCommissionedMaintenanceApplication/" }
                    ]
                },
                {
                    categoryID: 4,
                    category: "招投标",
                    items: [
                        { code: 41, name: "工程采购类", icon: "./img/icon/3_4_1.png", url: "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderProjectPurchase/FillInformationController.ashx?processDescKey=Bidding_ProjectProcurement&Bidding=3&businessTypeCode=6" },
                        { code: 42, name: "项目实施服务类", icon: "./img/icon/3_4_2.png", url: "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/TenderProjectPurchase/FillInformationController.ashx?processDescKey=Bidding_ProjectProcurement&Bidding=3&businessTypeCode=5" },
                        { code: 43, name: "项目定义服务类", icon: "./img/icon/3_4_3.png", url: "/THRWebApp/Tender/default.htm#/GoodsDefineServiceFillInformationUrl/?processDescKey=Bidding_ProjectProcurement_GoodsDefineService&businessTypeCode=4" },
                        { code: 44, name: "非项目服务类", icon: "./img/icon/3_4_4.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_NotProject&type=1#/biddingNotProjectCompilingTender/" },
                        { code: 45, name: "营销类", icon: "./img/icon/3_4_5.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_Marketing&type=7#/biddingMarketingDraft/" },
                        { code: 46, name: "土地开发类", icon: "./img/icon/3_4_6.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_LandDevelop&type=8&expenditureType=1#/biddingLandDevelopDraft/" },
                        { code: 47, name: "第三方维保类", icon: "./img/icon/3_4_7.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_Maintenance&type=9&expenditureType=1#/biddingMaintenanceApplication/" }
                    ]
                }, 
                {
                    categoryID: 5,
                    category: "其他采购方式",
                    items: [
                        { code: 51, name: "无合同采购", icon: "./img/icon/51.png", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_NonContractPurchase#/purchaseApplication/" },
                        { code: 52, name: "无合同采购分摊", icon: "./img/icon/51.png", url: "/THRWebApp/ReimbursementV2/default.htm#/nonContractRenewFront" },
                        { code: 53, name: "采购变更", icon: "./img/icon/52.png", url: "/THRWebApp/ContractV2/default.htm#/purchaseChangeFront" },
                        { code: 54, name: "比价采购", icon: "./img/icon/53.png", url: "/THRWebApp/Tender/default.htm?processDescKey=ComparePricePurchase#/ComparePricePurchaseUrl/" },
                        { code: 55, name: "询价", icon: "./img/icon/54.png", url: "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/ModalDialog/InquiryPriceFrontPage.aspx" }
                    ]
                },
                {
                    categoryID: 6,
                    category: "数据查询表",
                    items: [
                        { code: 61, name: "采购明细信息", icon: "./img/icon/61.png", url: "https://report.sinooceangroup.com/BIReport/decision/v5/design/report/abff7acae7a64f1b98c173b7195f412f/view?entryType=5" },
                        { code: 62, name: "采购预算明细表", icon: "./img/icon/62.png", url: "https://report.sinooceangroup.com/BIReport/decision/v5/design/report/b59887734f154aaaa9b120c67b96f047/view?entryType=5"  },
                        { code: 63, name: "采购计划明细表", icon: "./img/icon/64.png", url: "https://report.sinooceangroup.com/BIReport/decision/v5/design/report/5f77d8beedb5465097b95ec62748b369/view?entryType=5"},
                        { code: 64, name: "账户找回查询表", icon: "./img/icon/63.png", url: "/THRWebApp/SupplierV2/default.htm#/AccountBackProgressQuery" }
                    ]
                }
            ]
        };

        $scope.InitData();
    }]);
});

