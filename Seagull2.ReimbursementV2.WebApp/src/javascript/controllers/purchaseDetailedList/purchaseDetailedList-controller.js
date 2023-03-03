//采购清单
define(['app', 'pdTaskExtend'], function (app) {
    app.controller('purchaseDetailedList_controller', function ($scope, $location, wfWaiting, sogModal, $http, seagull2Url, commonService, commonSetting, commonApi, oAuth) {

        //访问后台地址
        var PurchaseInfoUrl = {
            GetLoginUserNameUrl: '/Purchase/GetLoginUserName'   //获取登录人信息
        };

        $scope.loginUser = {
            displayName: ""
        };
        $scope.paginationUnstart = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0
        }

        $scope.InitData = function () {
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl(PurchaseInfoUrl.GetLoginUserNameUrl), { cache: false })
                .success(function (data) {
                    $scope.loginUser.displayName = data.displayName;
                    wfWaiting.hide();
                });

            var postData = {
                pageIndex: 1,
                pageSize: 10,
                queryTaskTitle: ''
            }
            commonService.getTabList(commonSetting.taskConfig.userTask.type, postData)
                .success(function (res) {
                    $scope.taskList = res.data;
                    $scope.paginationUnstart.totalItems = res.totalItems;
                })
                .error(function (data, header) {
                    commonService.requestException(data, header);
                });
        };

        //退出登录
        $scope.layoutCurrentUser = function () {
            oAuth.logoutWithPassport($location.absUrl());
        };

        //页面数据结构
        $scope.links = {
            major: [
                {
                    categoryID: 1,
                    category: "前置操作",
                    items: [
                        { code: 11, name: "供应商入库及考察", icon: "icongongyingshang", url: "/THRWebApp/SupplierV2/default.htm?processDescKey=SupplierStorageInvitationAndInspection#/SupplierStorageInvitationAndInspection/" },
                        { code: 12, name: "垄断供应商入库", icon: "icongongyingshangchaxun", url: "/THRWebApp/SupplierV2/default.htm?processDescKey=MonopolySupplierStorage_V2#/MonopolySupplierStorageInvitation/" },
                        { code: 13, name: "固定资产申请", icon: "iconzichan", url: "/THRWebApp/FixedAssetsNew/default.htm#/FixedAssetsApplyPrepare" },
                        { code: 14, name: "采购计划", icon: "iconcaigoujihua", url: "/THRWebApp/ReimbursementV2/default.htm#/purchasePlanFront" },
                        { code: 15, name: "采购前置流程", icon: "iconcehua", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_PurchaseScheme#/purchaseSchemeApplication/" },
                        { code: 16, name: "招标清单", icon: "iconrukuqingdan", url: "/THRWebApp/ReimbursementV2/default.htm#/glodonHome" }
                    ]
                },
                {
                    categoryID: 2,
                    category: "战略采购",
                    items: [
                        { code: 21, name: "战略采购招投标", icon: "icongoumaicaigouhuishouhuigourenminbi", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_StrategyGroup&purchaseOperation1=&purchasePattern=4#/biddingStrategyGroupCompilingTender/" },
                        { code: 22, name: "战略采购直接委托", icon: "iconweituo", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_StrategyGroupCommissioned&PurchaseOperation=1&PurchasePattern=1#/StrategyGroupCommissionedDraft/" },
                        { code: 23, name: "集中采购招投标", icon: "iconzhaobiao", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_CentralizedPurchasing&purchaseOperation=1&purchasePattern=4#/compilingTender/" },
                        { code: 24, name: "集中采购直接委托", icon: "iconjizhongcaigou", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_StrategyCentralizedCommissionedProject&PurchaseOperation=1&PurchasePattern=3#/strategyCentralizedCommissioned/" }
                    ]
                },
                {
                    categoryID: 3,
                    category: "直接委托",
                    items: [
                        { code: 31, name: "工程采购类", icon: "iconfuhegongchengliang", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Engineering&type=6#/directCommissionedEngineeringApplication/" },
                        { code: 32, name: "项目实施服务类", icon: "iconxiangmushishi", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Implement&type=5#/directCommissionedImplementApplication/" },
                        { code: 33, name: "项目定义服务类", icon: "iconones-icon-Projectoverview", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_ProjectDefine&type=4#/directCommissionedProjectDefine/" },
                        { code: 34, name: "非项目服务类", icon: "iconfeixiangmuxiangguan", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_NotProject&type=1#/directCommissionedNotProject/" },
                        { code: 35, name: "营销类", icon: "iconyingxiao", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Marketing&type=7#/directCommissionedMarketingDraft/" },
                        { code: 36, name: "土地开发类", icon: "icontudikaifaliyong", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_LandDevelop&type=8&expenditureType=1#/directCommissionedLandDevelop/" },
                        { code: 37, name: "第三方维保类", icon: "iconweibao", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_Maintenance&type=9&expenditureType=1#/directCommissionedMaintenanceApplication/" },
                        { code: 38, name: "非开发运营类", icon: "iconyunyingzhushuju", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Entrust_BusinessOperations&type=10#/directCommissionedBusinessOperationsApplication/" }
                    ]
                },
                {
                    categoryID: 4,
                    category: "招投标",
                    items: [
                        { code: 41, name: "工程采购类", icon: "iconfuhegongchengliang", url: "default.htm?processDescKey=ReimbursementV2_Bidding_Engineering&type=6#/biddingEngineeringApplication/" },
                        { code: 42, name: "项目实施服务类", icon: "iconxiangmushishi", url: "default.htm?processDescKey=ReimbursementV2_Bidding_Implement&type=5#/biddingImplementApplication/" },
                        { code: 43, name: "项目定义服务类", icon: "iconones-icon-Projectoverview", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_ProjectDefine&type=4#/biddingProjectDefineApplication/" },
                        { code: 44, name: "非项目服务类", icon: "iconfeixiangmuxiangguan", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_NotProject&type=1#/biddingNotProjectCompilingTender/" },
                        { code: 45, name: "营销类", icon: "iconyingxiao", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_Marketing&type=7#/biddingMarketingDraft/" },
                        { code: 46, name: "土地开发类", icon: "icontudikaifaliyong", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_LandDevelop&type=8&expenditureType=1#/biddingLandDevelopDraft/" },
                        { code: 47, name: "第三方维保类", icon: "iconweibao", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_Maintenance&type=9&expenditureType=1#/biddingMaintenanceApplication/" },
                        { code: 48, name: "非开发运营类", icon: "iconyunyingzhushuju", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_Bidding_BusinessOperations&type=10#/biddingBusinessOperationsApplication/"}
                    ]
                },
                {
                    categoryID: 5,
                    category: "其他采购方式",
                    items: [
                        { code: 51, name: "无合同采购", icon: "iconhetongzhongzhi", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_NonContractPurchase#/purchaseApplication/" },
                        { code: 52, name: "无合同采购分摊", icon: "iconfentan", url: "/THRWebApp/ReimbursementV2/default.htm#/nonContractRenewFront" },
                        { code: 53, name: "采购变更", icon: "iconhetongbiangeng", url: "/THRWebApp/ContractV2/default.htm#/purchaseChangeFront" },
                        { code: 54, name: "比价采购", icon: "iconbijiaqi", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_ComparePricePurchase#/comparePricePurchaseApplication/" },
                        { code: 55, name: "询价", icon: "iconxunjia", url: "/THRWebApp/ReimbursementV2/default.htm#/enquiryFrontOaportal" },
                        { code: 56, name: "无合同采购(非开发运营类)", icon: "iconyunyingzhushuju", url: "/THRWebApp/ReimbursementV2/default.htm?processDescKey=ReimbursementV2_NonContractPurchaseBusinessOperations#/businessOperationsApplication/" }
                    ]
                },
                {
                    categoryID: 6,
                    category: "数据查询表",
                    items: [
                        { code: 61, name: "采购明细信息", icon: "iconmingxi", url: "https://report.sinooceangroup.com/BIReport/decision/v5/design/report/7d1aa318ec5e4cf98ffb45aef8ebfbad/view?entryType=5" },
                        { code: 62, name: "采购预算明细表", icon: "iconmingxibiao", url: "https://report.sinooceangroup.com/BIReport/decision/v5/design/report/1bf2a065883147ce9d06726acc412271/view?entryType=5" },
                        { code: 63, name: "采购计划明细表", icon: "iconcaigoujihua", url: "https://report.sinooceangroup.com/BIReport/decision/v5/design/report/5f77d8beedb5465097b95ec62748b369/view?entryType=5" },
                        { code: 64, name: "账户找回查询表", icon: "iconzujianku-chaxunbiaodan", url: "/THRWebApp/SupplierV2/default.htm#/AccountBackProgressQuery" },
                        { code: 65, name: "供应商查询", icon: "icongongyingshangchaxun", url: "/THRWebApp/SupplierV2/default.htm#/supplierSearcher" }
                    ]
                }
            ]
        };

        $scope.InitData();
        $scope.allLinksMajor = angular.copy($scope.links.major);

        $scope.sideSetting = {
            sidebarShow: true,
            selectItem: null,
            purchaseTypeShow: false,
            biddingChildShow: false,
            inquiryPriceChildShow: false,
            directChildShow: false,
        }

        //展开/折叠消息框
        $scope.toggleSidebar = function () {
            if ($scope.sideSetting.sidebarShow) {
                $scope.sideSetting.sidebarShow = false;
                $(".cc-sidebar").css("width", window.innerWidth / 5 * 2 + "px");
                $scope.links.major.splice(0, 2);
            } else {
                $scope.sideSetting.sidebarShow = true;
                $(".cc-sidebar").css("width", "28px");
                $scope.links.major = angular.copy($scope.allLinksMajor);
            }
        }
        $scope.taskCount = {
            unCompletedTaskNum: 0, //待办
            noticeAndCirculationNum: 0, //传阅通知
            transferTaskNum: 0, //流转中
            completedTask: 0, //已办结
            lastupdateTime: "", //最后更新时间
            userGuid: "" //用户Guid
        };
        //当前展示的tab页
        $scope.currentShowTabName = "tab_unStart";
        //导航栏切换事件
        var navbarToggle = function (event) {
            var li = $(event.target);
            li.parent().addClass("active").siblings("li").removeClass("active");
            li.blur();
            window.scrollTo(0, 0);
        };

        //显示当前tab页
        $scope.showCurrentTab = function (e) {
            var nodeName = e.target.nodeName.toUpperCase();
            if (nodeName === "A") {
                $scope.currentShowTabName = $(e.target).attr("name");
            }
            navbarToggle(e);
        };

        $scope.refresh = function (broadcast_name) {
            $scope.$broadcast(broadcast_name);
            $scope.sideSetting.purchaseTypeShow = false;
        };

        //接受父级的广播
        $scope.$on('to-personal-center', function (event) {
            $scope.$broadcast('to-unstart');
        });

        //设置待办条数
        $scope.$on("set_task_count", function (event, data) {
            switch (data.taskType) {
                case 'unStart':
                    $scope.taskCount.unStratTaskNum = data.count;
                    break;
                case 'runingTask':
                    $scope.taskCount.runningTaskNum = data.count;
                    break;
                case 'completedTask':
                    $scope.taskCount.completedTaskNum = data.count;
                    break;
            }
        });

        //查询条件
        $scope.queryCondition = {
            taskTitle: "", //标题
        };
        //查询
        $scope.query = function () {
            $scope.pagination.currentPage = 1;
            loadList.postData = null;
            loadList();
        }

        $scope.mainPage = {
            queryByPurchaseName: function () {
                if ($scope.currentShowTabName == "tab_unStart") {
                    $scope.$broadcast("to-unstart");
                } else if ($scope.currentShowTabName == "tab_processing") {
                    $scope.$broadcast("to-running");
                } else if ($scope.currentShowTabName == "tab_finished") {
                    $scope.$broadcast("to-finished");
                }
            },

            showBiddingChild: function (event) {
                $scope.sideSetting.directChildShow = false;
                $scope.sideSetting.inquiryPriceChildShow = false;
                if ($scope.sideSetting.biddingChildShow == true) {
                    $scope.sideSetting.biddingChildShow = false;
                } else {
                    $(".pdl-dropright-menu2").css("top", "24px");
                    $scope.sideSetting.biddingChildShow = true;
                }
            },

            showInquiryPriceChild: function (event) {
                $scope.sideSetting.directChildShow = false;
                $scope.sideSetting.biddingChildShow = false;
                if ($scope.sideSetting.inquiryPriceChildShow == true) {
                    $scope.sideSetting.inquiryPriceChildShow = false;
                } else {
                    $(".pdl-dropright-menu2").css("top", "24px");
                    $scope.sideSetting.inquiryPriceChildShow = true;
                }
            },

            showDirectChild: function (event) {
                $scope.sideSetting.biddingChildShow = false;
                $scope.sideSetting.inquiryPriceChildShow = false;
                if ($scope.sideSetting.directChildShow == true) {
                    $scope.sideSetting.directChildShow = false;
                } else {
                    $(".pdl-dropright-menu2").css("top", "24px");
                    $scope.sideSetting.directChildShow = true;
                }
            },

            startUpPurchaseWorkflow: function (purchaseType, typeName) {
                if (purchaseType == 0) {
                    sogModal.openAlertDialog("提示", typeName + "暂无新平台,请从流程中心入口发起！");
                    return;
                }
                $scope.sideSetting.purchaseTypeShow = false;
                $scope.sideSetting.selectItem.needStartPurchaseType = purchaseType;
                wfWaiting.show();
                $http.post(seagull2Url.getPlatformUrl(commonApi.StartUpWorkFlowByPurchaseDetailed), $scope.sideSetting.selectItem)
                    .success(function (data) {
                        wfWaiting.hide();
                        if (data.status == 200) {
                            sogModal.openAlertDialog("提示", "发起成功,请在待办中查看！");
                            return;
                        } else if (data.status == 500) {
                            sogModal.openAlertDialog("提示", "发起失败" + data.returnData);
                            return;
                        }
                    });
            },

            openUserTask: function (url) {
                //票据
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            if (url.indexOf("?") == -1) {
                                url = url + "?_at=" + urlat;
                            } else {
                                url = url + "&_at=" + urlat;
                            }
                        }
                        window.open(url, '_blank');
                    });
            },
        }

        // 打开拟单地址
        $scope.openUrl = function (item) {
            // 非项目服务类指引验证人员专业线
            if (item.code === 34 || item.code === 44 || item.code === 54) {
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl("/Purchase/GetStationByCurrentUser?r=" + new Date().getTime()))
                    .success(function (data) {
                        wfWaiting.hide();
                        if (data && data.isBanNewStationCategorySystem === true) {
                            var stationName = data.fullPath;
                            if (!stationName) { stationName = ""; }
                            sogModal.openAlertDialog('提示', '[' + stationName + '] 专业线人员不能发起' + item.name + '采购流程，请核实费用类型，选择正确的采购类型发起');
                        }
                        else {
                            window.open(item.url, '_blank');
                        }
                    }).error(function (error, header) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("提示", error.message);
                    });
            }
            else {
                window.open(item.url, '_blank');
            }
        };
    });
});

