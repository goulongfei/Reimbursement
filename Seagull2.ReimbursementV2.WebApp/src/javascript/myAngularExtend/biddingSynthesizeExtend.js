define([
    'angular',
    'app',
    'echarts',
    'bidSectionExtend',
    'commonUtilExtend',
    'supplierInfoExtendV3',
    'supplierSelectorV2',
    'currentConstructionArea',
], function (angular, app, echarts) {
    window.echarts = echarts;
    //基础 opts
    app.factory("commissionBaseOpts", function () {
        function base() {
            this.corporationCode = "";
            this.corporationName = "";
            this.beforAppend = function (v) { };
            this.afterAppend = function (v) { };
            /*该方法接收当前的配置对象，可在这里从新修改该配置对象；*/
            this.refreshOpts = function (opts) { };
        }
        return {
            get: function (opts) {
                if (!angular.isObject(opts)) {
                    opts = {};
                }
                return angular.extend(new base(), opts);
            }
        }
    });

    //错误提示框
    app.factory("errorDialog", function (sogModal) {
        return {
            //请求出现错误调用的提示框
            openErrorDialog: function (data, status, msg) {
                sogModal.openErrorDialog({
                    message: msg,
                    exceptionMessage: status,
                    stackTrace: data || msg
                });
            }
        };
    });
    //选择法人公司
    app.directive("selectCorporation", function () {
        return {
            restrict: 'A',
            template: "<div><input sog-valide-status='招标人' style='width:88%;' type='text' class='meeting' disabled ng-value='opts.corporationName' title='{{opts.corporationName}}' placeholder='请选择招标人'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, commissionBaseOpts, errorDialog) {
                $scope.opts = commissionBaseOpts.get($scope.opts);
                $scope.opts.corporationName = $scope.opts.corporationName || "";
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/corporationInfoSelect.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择法人公司', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    corporationCnName: "",
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                keyword: "",
                                selectedItem: null,
                                corporationList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                    this.selectedItem.corporationName = item.corporationName;
                                },

                                loadData: function (pageIndex) {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData($modelScope.model.paginationConf.currentPage, false);
                                },
                                query: function () {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData(1, false);
                                },
                                queryData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryCorporationInfo"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.corporationList = data.corporationInfo;
                                            wfWaiting.hide();
                                        })
                                        .error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询法人公司数据异常");
                                            wfWaiting.hide();
                                        });

                                },
                                confirm: function () {
                                    if (this.selectedItem != null) {
                                        $modelScope.confirm(this.selectedItem);
                                    } else {
                                        sogModal.openAlertDialog("提示", "请选择一个法人公司");
                                    }

                                },
                            };
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.corporationName = v.corporationName;
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }


            }
        };
    });

    //采购时间安排
    app.directive("purchaseDatearrangeInfo",
        function () {
            return {
                restrict: 'A',
                scope: {
                    readonly: "=",
                    opts: "=",
                    data: "=",
                },
                templateUrl: 'htmlTemplate/controlTemplate/common/purchaseDatearrangeInfo.html',
                replace: false,
                controller: function ($scope,
                    $element,
                    $attrs,
                    $http,
                    sogModal,
                    seagull2Url,
                    wfWaiting,
                    ValidateHelper,
                    sogValidator,
                    sogOguType,
                    $location,
                    $window,
                    errorDialog,
                    configure) {
                    $scope.common = {};
                    configure.getConfig($scope.common, 'common');
                    $scope.editData = [];
                    var tempEditData = null;
                    if ($scope.data != null && $scope.data != undefined && $scope.data.length > 0 && $scope.opts.scene == 'Draft') {
                        angular.forEach($scope.data, function (item) {
                            if ($scope.opts.firstLink == true && item.className == 1) {
                                tempEditData = item;
                            } else if ($scope.opts.firstLink == false && item.className == 2) {
                                tempEditData = item;
                            }
                        })
                        $scope.editData.push(tempEditData);
                    }
                }
            }
        });

    //入围供应商信息
    app.directive("supplierScope",
        function () {
            return {
                restrict: 'A',
                scope: {
                    readonly: "=",
                    opts: "=",
                    data: "=",
                },
                templateUrl: 'htmlTemplate/controlTemplate/common/supplierScope.html',
                replace: false,
                controller: function ($scope,
                    $http,
                    sogModal,
                    seagull2Url,
                    wfWaiting,
                    $window,
                    commissionBaseOpts,
                    errorDialog,
                    configure,
                    $compile,
                    $timeout,
                    $interval,
                    $cookieStore,
                    supplierSelectorV2,
                    sogOguType, locals) {
                    $scope.opts = commissionBaseOpts.get($scope.opts);
                    $scope.common = {};
                    configure.getConfig($scope.common, 'common');
                    $scope.opts.model = {
                        /*行业领域大类为营造类的需要显示标签信息*/
                        industryDomainWithLabel: false,
                        /*是否八大行业领域*/
                        emphasisIndustryDomainByLabel: false,
                        /*货物类行业*/
                        goodsDetailsCategory: false,
                        /*不平衡报价行业*/
                        industryDomainForUnbalancedBid: false,
                        /*定标单方行业*/
                        industryDomainListForPricePerSquareMeter: false,
                    };
                    $scope.moneyOpts = {
                        min: 0,
                        max: 100000000000,
                        precision: 2
                    };
                    $scope.labelLC90102MoneyOpts = {
                        min: 0,
                        max: 100,
                        precision: 2
                    };
                    $scope.labelLC90103MoneyOpts = {
                        min: 0,
                        max: 100,
                        precision: 2
                    };
                    $scope.labelLC90104MoneyOpts = {
                        min: 0,
                        max: 100000000000,
                        precision: 2
                    };
                    $scope.labelLC90117MoneyOpts = {
                        min: 0,
                        max: 100000000000,
                        precision: 2
                    };
                    $scope.label = {};
                    //添加
                    $scope.addDetail = function () {
                        var params = {
                            scene: $scope.opts.scene,
                            actionTypeCode: $scope.opts.actionTypeCode,
                            project: $scope.opts.projectList,
                            supplierCatagoryList: $scope.opts.supplierCatagory,
                            supplierName: "",
                            isMonopolyEditable: $scope.opts.isMonopolyEditable != undefined ? $scope.opts.isMonopolyEditable : true,
                            blackList: $scope.opts.blackList,
                            isDirectCommissioned: false
                        };
                        var supplierSelectorResult = supplierSelectorV2.open(params);
                        if (supplierSelectorResult) {
                            //
                            supplierSelectorResult.then(function (result) {
                                if (result) {
                                    //不能选已选得供应商
                                    for (var i = 0; i < $scope.data.length; i++) {
                                        if (result.supplierCode == $scope.data[i].supplierCode) {
                                            sogModal.openAlertDialog("提示", "供应商[" + result.supplierName + "]已选择！");
                                            return false;
                                            break;
                                        }
                                    }
                                    var verificationCode = '';
                                    for (var j = 0; j < 6; j++) {
                                        verificationCode += Math.floor(Math.random() * 10);
                                    }
                                    //需要查询下当前供应商的中标次数和入围次数
                                    wfWaiting.show();
                                    $http.get(seagull2Url.getPlatformUrl("/TenderSuplierExtend/GetTenderSupplierInfo?supplierCode=" + result.supplierCode + "&industryDomainCode=" + result.industryDomainCode + '&r=' + Math.random()))
                                        .success(function (data) {
                                            wfWaiting.hide();
                                            var supplier = {
                                                checked: false,
                                                supplierCode: result.supplierCode,
                                                supplierName: result.supplierName,
                                                industryDomainCode: result.industryDomainCode,
                                                industryDomainName: result.industryDomainName,
                                                industryDomainLevelCode: result.industryDomainLevelCode,
                                                industryDomainLevelName: result.industryDomainLevelName,
                                                industryDomainHistoryBiddingCount: data.industryDomainHistoryBiddingCount,
                                                industryDomainHistoryTenderCount: data.industryDomainHistoryTenderCount,
                                                supplierHistoryBiddingCount: data.supplierHistoryBiddingCount,
                                                supplierHistoryTenderCount: data.supplierHistoryTenderCount,
                                                shortlistedExplain: "",
                                                storageDate: result.storageDate,
                                                verificationCode: verificationCode
                                            }
                                            if ($scope.opts.actionTypeCode == 28) {
                                                supplier.linkManName = data.linkManName;
                                                supplier.linkPhone = data.linkPhone;
                                                supplier.linkEmail = data.linkEmail;
                                            }
                                            $scope.supplierName = result.supplierName;
                                            $scope.opts.beforAppend(supplier, $scope.index);
                                            // 加载标签
                                            if ($scope.opts.model.industryDomainWithLabel === true) {
                                                if ($scope.opts.model.emphasisIndustryDomainByLabel === true) {
                                                    $scope.requestLabelListData();
                                                } else {
                                                    $scope.labelTypeLoadData();
                                                }
                                                $scope.loadImplementData();
                                            }
                                        })
                                        .error(function (err) {
                                            wfWaiting.hide();
                                            sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                                        });
                                }
                            });
                        }
                    };

                    //按供应商标签维度筛选
                    $scope.addSupplierByLabel = function () {
                        var isValid = true;
                        if ($scope.opts.blackList && $scope.opts.blackList.indexOf('supplierCatagory') !== -1) {
                            if (angular.isArray($scope.opts.supplierCatagory) === false || $scope.opts.supplierCatagory.length === 0) {
                                sogModal.openAlertDialog("提示", "请先选择供应商类别，再添加供应商！");
                                isValid = false;
                                return;
                            }
                        }
                        // 校验项目
                        if ($scope.opts.blackList && $scope.opts.blackList.indexOf('project') !== -1 && (!$scope.opts.projectList || !$scope.opts.projectList.projectCode || !$scope.opts.projectList.projectName)) {
                            sogModal.openAlertDialog("提示", "请先选择项目，再添加供应商！");
                            isValid = false;
                            return;
                        }
                        locals.setObject('projectList', $scope.opts.projectList);
                        if ($scope.opts.supplierCatagory) {
                            locals.setObject('supplierCatagoryList', $scope.opts.supplierCatagory);
                        } else {
                            locals.setObject('supplierCatagoryList', []);
                        }
                        if (isValid) {
                            var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierLabelInfoReport?value=1&type=2";
                            $window.open(url);
                        }

                    }
                    $scope.select_all = false;
                    //全选
                    $scope.selectAll = function (allChecked) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            $scope.data[i].checked = allChecked;
                        }
                    }
                    //复选框选中
                    $scope.selectOne = function (checked) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            if (!$scope.data[i].checked) {
                                $scope.select_all = false;
                                return;
                            } else {
                                $scope.select_all = true;
                            }
                        }
                    }
                    // 选择供应商
                    $scope.supplierOpts = {
                        supplierCatagory: $scope.opts.supplierCatagory, /*供应商类别 object*/
                        project: $scope.opts.project, /*项目 { projectCode: "", projectName: "" }*/
                        actionTypeCode: $scope.opts.actionTypeCode, //直委类型
                        tinyAmount: $scope.opts.tinyAmount, //小微供应商限定金额
                        beforAppend: function (supplier, index) {
                            var item = $scope.data[index];
                            if (supplier) {
                                item.supplierCode = supplier.supplierCode;
                                item.supplierName = supplier.supplierName;
                                item.industryDomainCode = supplier.industryDomainCode;
                                item.industryDomainName = supplier.industryDomainName;
                                item.biddingSectionScopeList = [];
                            } else {
                                item.supplierCode = null;
                                item.supplierName = null;
                                item.industryDomainCode = null;
                                item.industryDomainName = null;
                                item.biddingSectionScopeList = [];
                            }
                        }
                    };
                    // 标段
                    $scope.bidSectionOpts = {
                        bidSection: $scope.opts.bidSection
                    };
                    // 项目
                    $scope.$watch('opts.project',
                        function (newVal) {
                            $scope.supplierOpts.project = newVal;
                        });
                    // 供应商类别
                    $scope.$watch('opts.supplierCatagory',
                        function (newVal) {
                            $scope.supplierOpts.supplierCatagory = newVal;

                            $scope.supplierCatagory = null;
                            if (angular.isArray(newVal) && newVal.length > 0) {
                                $scope.supplierCatagory = newVal[0];
                            }
                            try {

                                if ((($scope.opts.actionTypeCode === 14 || $scope.opts.actionTypeCode === 15)
                                    && $scope.opts.formAction && $scope.opts.formAction.allowLabel)
                                    || (($scope.opts.actionTypeCode === 26 || $scope.opts.actionTypeCode === 27)
                                        && $scope.opts.formAction && $scope.opts.formAction.allowLabelForEnquiry)) {
                                    $scope.opts.model.industryDomainWithLabel = false;
                                    $scope.opts.model.goodsDetailsCategory = false;
                                    $scope.opts.model.emphasisIndustryDomainByLabel = false;
                                    $scope.opts.model.industryDomainForUnbalancedBid = false;
                                    $scope.opts.model.industryDomainListForPricePerSquareMeter = false;
                                    if ($scope.supplierCatagory) {
                                        var param = {
                                            code: $scope.supplierCatagory.industryDomainCode,
                                        }
                                        wfWaiting.show();
                                        $scope.api.loadChildrenByCode(param, function (data) {
                                            // 营造类
                                            if (data && data.extendData
                                                && angular.isObject($scope.opts.industryDomainType.constructionSummaryCategory)
                                                && $scope.opts.industryDomainType.constructionSummaryCategory[data.extendData.summaryCategoryCode]) {
                                                $scope.opts.model.industryDomainWithLabel = true;
                                                var industryDomainCode = data.id;
                                                // 货物类，非工程类和服务类
                                                if (angular.isObject($scope.opts.industryDomainType.constructionGoodsDetailsCategory)
                                                    && $scope.opts.industryDomainType.constructionGoodsDetailsCategory[data.extendData.detailsCategoryCode]) {
                                                    $scope.opts.model.goodsDetailsCategory = true;
                                                }
                                                // 重点行业领域八大类
                                                if (angular.isObject($scope.opts.industryDomainType.emphasisIndustryDomainListByLabel)
                                                    && $scope.opts.industryDomainType.emphasisIndustryDomainListByLabel[industryDomainCode]) {
                                                    $scope.opts.model.emphasisIndustryDomainByLabel = true;
                                                }
                                                // 首次回标是否存在不平衡报价
                                                if (angular.isObject($scope.opts.industryDomainType.industryDomainListForUnbalancedBid)
                                                    && $scope.opts.industryDomainType.industryDomainListForUnbalancedBid[industryDomainCode]) {
                                                    $scope.opts.model.industryDomainForUnbalancedBid = true;
                                                }
                                                // 定标单方行业领域
                                                if (angular.isObject($scope.opts.industryDomainType.industryDomainListForPricePerSquareMeter)
                                                    && $scope.opts.industryDomainType.industryDomainListForPricePerSquareMeter[industryDomainCode]) {
                                                    $scope.opts.model.industryDomainListForPricePerSquareMeter = true;
                                                }
                                                if ($scope.opts.model.emphasisIndustryDomainByLabel === true
                                                    && $scope.opts && ($scope.opts.scene === 'Draft' || $scope.opts.scene === 'DraftReadOnly')) {
                                                    wfWaiting.hide();
                                                    // 八大类行业领域-拟单环节
                                                    $scope.requestLabelListData();
                                                }
                                                else if ($scope.opts.model.emphasisIndustryDomainByLabel !== true
                                                    && $scope.opts && ($scope.opts.scene === 'Draft' || $scope.opts.scene === 'DraftReadOnly')) {
                                                    wfWaiting.hide();
                                                    if ($scope.readonly) {
                                                        // 非八大类行业领域-拟单环节-只读
                                                        $scope.requestLabelListData();
                                                    }
                                                    else {
                                                        // 非八大类行业领域-拟单环节-编辑
                                                        $scope.labelTypeLoadData();
                                                    }
                                                } else {
                                                    wfWaiting.hide();
                                                    // 商务评标环节，技术评标环节，评标汇总环节，定标环节
                                                    $scope.labelTypeLoadData();
                                                }
                                                $scope.loadImplementData();
                                            }
                                            else {
                                                wfWaiting.hide();
                                            }
                                        });
                                    }
                                }

                            } catch (e) {

                            }

                        });
                    //删除
                    $scope.deleteDetail = function () {
                        var select = false;
                        for (var i = $scope.data.length - 1; i >= 0; i--) {
                            if ($scope.data[i].checked) {
                                select = true;
                            }
                        }
                        if (!select) {
                            sogModal.openAlertDialog("提示", "请先选中需要删除的入围供应商信息")
                        } else {
                            var promise = sogModal.openConfirmDialog("删除", "确认是否删除入围供应商信息?");
                            promise.then(function (v) {
                                for (var i = $scope.data.length - 1; i >= 0; i--) {
                                    if ($scope.data[i].checked) {
                                        $scope.data.splice(i, 1);
                                    }
                                }
                                $scope.select_all = false;
                                $scope.opts.afterAppend($scope.data);
                            })
                        }
                    }
                    //删除
                    $scope.deleteOneDetail = function (item) {
                        locals.clear();
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除入围供应商信息?");
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                if ($scope.data[i].supplierCode === item.supplierCode) {
                                    $scope.data.splice(i, 1);
                                }
                            }
                            $scope.opts.afterAppend($scope.data);
                        });
                    }

                    //打开供应商详情页面
                    $scope.OpenSupplier = function (code) {
                        var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                        $window.open(url);

                    }

                    //重新发起合同
                    $scope.reStartContract = function (item) {
                        wfWaiting.show();
                        var param = {
                            bussinessTypeCode: $scope.opts.purchaseBase.purchaseBusinessTypeCode,
                            purchaseWayCode: $scope.opts.purchaseBase.purchaseWayCode,
                            resourceId: item.resourceID,
                            code: item.code,
                        }
                        $http({
                            method: 'POST',
                            url: seagull2Url.getPlatformUrl('/PurchaseContract/ReStartContract'),
                            data: param
                        }).error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "重新发起合同异常");
                            wfWaiting.hide();
                        })
                            .success(function (data) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", "重新发起合同成功");
                                item.contractStateCode = 1;
                                item.contractStateName = "未生效"
                            });

                    }

                    //企查查查询关联关系
                    $scope.selectenterpriseCheck = function () {

                        if ($scope.$parent.viewModel.supplierScopeList.length <= 1) {
                            sogModal.openAlertDialog("提示", "最少选择两个公司");
                            return;
                        }
                        $scope.companyItems = [];
                        angular.forEach($scope.$parent.viewModel.supplierScopeList, function (v) {
                            var supplier = {
                                supplierCode: v.supplierCode,
                                companyName: v.supplierName,
                            }
                            $scope.companyItems.push(supplier);
                        })

                        $scope.initenterpriseCheck($scope.companyItems);
                        $scope.togetherTenderCheck($scope.companyItems);
                    }

                    //初始化供应商关联关系查询结果
                    $scope.initenterpriseCheck = function (companyItems) {
                        if (companyItems.length <= 1) {
                            sogModal.openAlertDialog("提示", "最少选择两个公司");
                            return;
                        }
                        var url = seagull2Url.getPlatformUrl('/GetRelationShip') + '?r=' + Math.random();
                        var timeSpan = null;
                        var token = null;
                        var body = {
                            Timespan: timeSpan,
                            CompanyCollcetion: companyItems,
                            Token: token,
                            PageIndex: 1,
                            PageSize: 10,
                            code: 4
                        };
                        $scope.isLoaded = false;
                        $http.post(url, body).success(function (data) {
                            $scope.isLoaded = true;
                            $scope.infors = data.companyCollcetion;
                        }).error(function () {
                            $scope.isLoaded = false;
                        })
                    };

                    //查询供应商共同参与投标数据
                    $scope.togetherTenderCheck = function (companyItems) {
                        if (companyItems.length <= 1) {
                            sogModal.openAlertDialog("提示", "最少选择两个公司");
                            return;
                        }
                        var url = seagull2Url.getPlatformUrl('/Beneficiary/GetTogetherTenderTimesInfo') + '?r=' + Math.random();
                        $scope.tenderTimesLoaded = false;
                        $http.post(url, companyItems).success(function (data) {
                            $scope.tenderTimesLoaded = true;
                            $scope.tenderTimesInfors = data;
                        }).error(function () {
                            $scope.tenderTimesLoaded = false;
                        })
                    };

                    //关联关系挖掘 companyName：公司名称(至少两家企业)
                    $scope.showDetail = function (array) {
                        var str = "";

                        angular.forEach(array, function (v) {
                            str += v.companyName + ","
                        })

                        str = str.substring(0, str.length - 1);
                        var url = "default.htm#/associationMining/" + str;
                        window.open(url, '_blank');
                    }

                    // 受益人详情
                    $scope.beneficiaryIfor = function (item) {
                        var addr = "./views/enterpriseCheck/beneficiaryDialog.html";
                        var template = '<div ng-include="\'' + addr + '\'" ></div>';

                        var promise = sogModal.openDialog(template, '受益人详情', ["$scope", function ($ModelScope) {
                            $ModelScope.init = function () {
                                var timeSpan = Math.round(new Date().getTime() / 1000);
                                var token = null;
                                wfWaiting.show();
                                var url = seagull2Url.getPlatformUrlBase() + '/Beneficiary/GetBeneficiary';
                                var body = {
                                    Timespan: timeSpan,
                                    CompanyName: item.companyName,
                                    Token: token
                                };
                                $http.post(url, body).success(function (data) {
                                    $ModelScope.data = JSON.parse(JSON.parse(data));
                                    $ModelScope.beneficiaryArray = $ModelScope.data.result;
                                    var str = '', result = $ModelScope.data.result;
                                    for (var i = 0; i < result.breakThroughList.length; i++) {
                                        str += '<tr class="text-center">';
                                        var arr = result.breakThroughList[i].detailInfoList;
                                        if (arr.length > 1) {
                                            str += "<td rowspan=" + arr.length + ">" + (i + 1) + "</td><td rowspan=" + arr.length + ">" + result.breakThroughList[i].name + "</td><td rowspan=" + arr.length + ">" + result.breakThroughList[i].totalStockPercent + "</td>";
                                            for (var j = 0; j < arr.length; j++) {
                                                if (j >= 1) {
                                                    str += '<tr class="text-center">';
                                                }
                                                str += '<td>' + arr[j].stockType + "</td><td>" + arr[j].breakthroughStockPercent + "</td><td>" + getInfor(arr[j]) + "</td></tr>";
                                            }
                                        } else {
                                            str += "<td>" + (i + 1) + "</td><td>" + result.breakThroughList[i].name + "</td><td>" + result.breakThroughList[i].totalStockPercent + "</td><td>" + arr[0].stockType + "</td><td>" + arr[0].breakthroughStockPercent + "</td><td>" + getInfor(arr[0]) + "</td></tr>";
                                        }

                                    }
                                    var ele = $compile(str)($ModelScope);
                                    $timeout(function () {
                                        $("#talbe-list").html(str);
                                        wfWaiting.hide();
                                    }, 100)
                                })
                            }

                            //格式化字符串
                            var decodeNameLink = function (fromStr) {
                                var arr = fromStr.match(/\((.+?)%\)/g);//(自然人股东%)合肥讯飞产业投资合伙企业(有限合伙)  拿到['(自然人股东%)']
                                if (!arr || arr.length == 0) {
                                    return { value: fromStr }
                                }
                                for (var i = 0; i < arr.length; i++) {
                                    var t = arr[i], targetArr = t.split('(');
                                    if (targetArr.length > 2) {
                                        arr[i] = "(" + targetArr[2];
                                    }
                                }
                                if (arr && arr.length == 1) {
                                    return {
                                        value: fromStr.replace(arr[0], "").replace(arr[1], ""),
                                        link: [arr[0].replace("(", '').replace("%)", '')],
                                        num: fromStr.indexOf('(')
                                    }
                                }
                                return {
                                    value: fromStr.replace(arr[0], "").replace(arr[1], ""),
                                    link: [arr[0].replace("(", '').replace("%)", ''), arr[1].replace("(", '').replace("%)", '')]
                                }

                            }

                            //格式化字符串 得到需要html
                            function getInfor(item) {
                                var str = '';
                                tmpPath = item.path.replace(new RegExp("->", 'g'), "<-");
                                tmpPathArr = tmpPath.split("<-");//["安徽讯飞联创信息科技有限公司","(董事%)张友国","(自然人股东%)合肥讯飞产业投资合伙企业(有限合伙)","(自然人股东%)刘庆峰","(自然人股东%)科大讯飞股份有限公司"]
                                if (tmpPathArr && tmpPathArr.length > 0) {
                                    for (var i = 0; i < tmpPathArr.length; i++) {
                                        tmpPathItem = decodeNameLink(tmpPathArr[i]);
                                        if (!tmpPathItem.link) str += '<a style="color:blue">' + tmpPathItem.value + '</a>';
                                        //if (tmpPathItem.link && tmpPathItem.link.length == 2) {
                                        if (tmpPathItem.link && tmpPathItem.link.length == 1) {
                                            var obj;
                                            if (!tmpPathItem.num) {
                                                str += '<span class="right-line"><span class="text">' + tmpPathItem.link[0] + '%</span></span><a>' + tmpPathItem.value + '</a>';
                                            } else {
                                                str += '<a style="color:blue">' + tmpPathItem.value + '</a><span class="beinvested"><span class="text">' + tmpPathItem.link[0] + '%</span></span>';
                                            }
                                        }
                                        if (tmpPathItem.link && tmpPathItem.link.length == 2) {
                                            str += '<span  class="beinvested"><span class="text">' + tmpPathItem.link[0] + '%</span></span><a>' + tmpPathItem.value + '</a><span class="right-line"><span class="text">' + tmpPathItem.link[1] + '%</span></span>';
                                        }
                                    }
                                }
                                tmpPathItem = "";
                                return str;
                            }

                            $ModelScope.init();
                        }], $scope, { containerStyle: {} },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                    }

                    //股东关系关联 companyName：相关公司(至少两家企业)
                    $scope.showPersonDetail = function (array) {
                        var str = "";

                        angular.forEach(array, function (v) {
                            str += v.companyName + ","
                        })

                        str = str.substring(0, str.length - 1);
                        var url = "default.htm#/legalAssociation/" + str;
                        window.open(url, '_blank');
                    }

                    //行政处罚风险：   companyName：公司名称 keyNo :公司内部关联主键KeyNo
                    $scope.monitoringReportDetail = function (item) {
                        var url = "default.htm#/monitoringReportDetail/" + item.companyName;
                        window.open(url, '_blank');
                    }

                    // 查看保证金收费流程
                    $scope.showCashDeposit = function (index, item) {
                        $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                            .success(function (data) {
                                var urlat = data;
                                if (urlat !== null) {
                                    urlat = urlat.replace(/"/g, "");
                                    var url = $scope.common.webUrlBase + item.cashDepositURL + "&_at=" + urlat;
                                    $window.open(url, '_blank');
                                }
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "查看保证金收费流程异常");
                                wfWaiting.hide();
                            });
                    }

                    //重新发起收费
                    $scope.reStartCharging = function (item) {
                        wfWaiting.show();
                        var param = {
                            code: item.code,
                            resourceID: $scope.resourceId,
                            activityID: $scope.activityId,
                            businessType: $scope.opts.purchaseBase.purchaseBusinessTypeCode,
                        }

                        $http({
                            method: 'POST',
                            url: seagull2Url.getPlatformUrl('/Charging/ReStartCharging'),
                            data: param
                        }).error(function (data, status) {
                            wfWaiting.hide();
                            if (status === 400) {
                                sogModal.openAlertDialog("提示", data.message);
                            }
                            else {
                                errorDialog.openErrorDialog(data, status, "重新发起保证金收费异常！");
                            }
                        })
                            .success(function (data) {
                                wfWaiting.hide();
                                item.cashDepositStateCode = data.cashDepositStateCode;
                                item.cashDepositStateName = data.cashDepositStateName;
                                item.cashDepositURL = data.cashDepositURL;
                                item.cashDepositResourceID = data.cashDepositResourceID;
                                sogModal.openAlertDialog("提示", "重新发起保证金收费成功！");
                            });
                    }

                    // 获取收费状态
                    $scope.fetchChargeStatue = function () {

                        wfWaiting.show();
                        $scope.isSuccess = false;
                        if (angular.isArray($scope.data) == false) { return; }
                        var param = [];
                        for (var i = 0; i < $scope.data.length; i++) {
                            if ($scope.data[i].cashDepositResourceID) {
                                param.push($scope.data[i].cashDepositResourceID);
                            }
                        }
                        if (angular.isArray(param) && param.length > 0) {
                            $http.post(seagull2Url.getPlatformUrl('/Charging/GetChargingReturnFormStatus'), param)
                                .success(function (data) {
                                    $scope.isSuccess = (data && data.length > 0);
                                    for (var i = 0; i < data.length; i++) {
                                        for (var y = 0; y < $scope.data.length; y++) {
                                            var item = $scope.data[y];
                                            if (item.cashDepositResourceID == data[i].code) {
                                                item.cashDepositStateCode = data[i].formStatus;
                                                if (data[i].formStatus === 1) {
                                                    item.cashDepositStateName = "缴纳中";
                                                }
                                                else if (data[i].formStatus === 2) {
                                                    item.cashDepositStateName = "已缴纳";
                                                }
                                                else if (data[i].formStatus === 3) {
                                                    item.cashDepositStateName = "收费被退回";
                                                }
                                            }
                                        }
                                    }
                                    wfWaiting.hide();
                                })
                                .error(function (data, status) {
                                    errorDialog.openErrorDialog(data, status, "获取保证金收费状态异常");
                                    $scope.isSuccess = false;
                                    wfWaiting.hide();
                                });
                        }
                        else { wfWaiting.hide(); }

                    };

                    // 编辑标签选项
                    $scope.editLabel = function (item, read) {
                        wfWaiting.show();
                        var param = {
                            resourceId: $scope.resourceId,
                            code: item.code,
                            supplierCode: item.supplierCode,
                            supplierName: item.supplierName,
                            industryDomainCode: item.industryDomainCode,
                        }
                        $scope.api.createEvaluationInstanceData(param, function (data) {
                            item.code = data.code;
                            item.resourceID = data.resourceID;
                            item.className = data.className;
                            item.creator = data.creator;
                            item.createTime = data.createTime;
                            item.validStatus = data.validStatus;
                            item.modifier = data.modifier;
                            item.modifyTime = data.modifyTime;
                            item.sortNo = data.sortNo;

                            wfWaiting.hide();
                            var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierLabelInfo?resourceId=" + $scope.resourceId + "&read=" + ($scope.readonly ? 1 : 0);
                            if (item.supplierCode) {
                                url += "&suppliercode=" + item.supplierCode;
                            }
                            if ($scope.creator) {
                                url += "&userCode=" + $scope.creator;
                            }
                            if (item.industryDomainCode) {
                                url += "&industryDomainCode=" + item.industryDomainCode;
                            }
                            url += "&instanceCode=" + item.code;
                            //url += "&supplierName=" + item.supplierName;
                            //url += "&industryDomainName=" + item.industryDomainName;
                            $window.open(url, $scope.resourceId + ";" + item.supplierCode);
                        });

                    };
                    // 查看合作信息
                    $scope.viewCooperation = function (item, read) {
                        var url = $scope.common.webUrlBase + "/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/ModalDialog/SupplierMore.aspx?ID=1&Code=" + item.supplierCode + "&TradeAreaCode=" + item.industryDomainCode;
                        $window.open(url);
                    };
                    // 编辑标签回掉方法
                    $scope.requestLabelListData = function (supplierCode) {
                        if ($scope.opts && ($scope.opts.scene === 'Draft' || $scope.opts.scene === 'DraftReadOnly')) {

                            var param = {
                                ResourceId: $scope.resourceId,
                                LabelTemplateResultCode: $scope.opts.labelTemplateCodeList.templateCode,
                                SupplierList: [],
                            }
                            if (supplierCode) {
                                param.SupplierList.push({
                                    SupplierCode: supplierCode,
                                    IndustryDomainCode: $scope.supplierCatagory.industryDomainCode,
                                });
                            }
                            else {
                                if (angular.isArray($scope.data) === false) { return; }
                                for (var i = 0; i < $scope.data.length; i++) {
                                    var supplier = $scope.data[i];
                                    param.SupplierList.push({
                                        SupplierCode: supplier.supplierCode,
                                        IndustryDomainCode: supplier.industryDomainCode,
                                    });
                                }
                            }
                            // 加载编辑数据
                            wfWaiting.show();
                            $scope.api.fecthLabelViewListByTemplate(param, function (data) {
                                if (angular.isArray(data) && data.length > 0
                                    && angular.isArray($scope.data) && $scope.data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        var item = data[i];
                                        for (var j = 0; j < $scope.data.length; j++) {
                                            var sup = $scope.data[j];
                                            if (item.supplierCode === sup.supplierCode
                                                && item.industryDomainCode === sup.industryDomainCode) {
                                                sup.labelTemplate = item;
                                                angular.forEach(item.items, function (label) {
                                                    if (label.labelValue === 'LC90037') {
                                                        sup.labelLC90037 = label;
                                                        sup.labelLC90037OptionValue = label.optionValue;
                                                    } else if (label.labelValue === 'LC90024') {
                                                        sup.labelLC90024 = label;
                                                        sup.labelLC90024OptionValue = label.optionValue;
                                                    } else if (label.labelValue === 'LC90003') {
                                                        sup.labelLC90003 = label;
                                                    } else if (label.labelValue === 'LC90019') {
                                                        sup.labelLC90019 = label;
                                                    } else if (label.labelValue === 'LC90021') {
                                                        sup.labelLC90021 = label;
                                                    } else if (label.labelValue === 'LC90062') {
                                                        sup.labelLC90062 = label;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                                wfWaiting.hide();
                            });
                        }
                    };

                    // 需要填写标签的行业领域加载
                    $scope.labelTypeLoadData = function () {
                        if ($scope.opts.model.industryDomainWithLabel === true) {
                            wfWaiting.show();
                            // 获取评分模板编码
                            if ($scope.opts && ($scope.opts.scene === 'Draft' || $scope.opts.scene === 'DraftReadOnly')) {
                                $scope.labelTypeLoadDataToDraft();
                            }
                            else if ($scope.opts && $scope.opts.scene === 'BusinessEvaluate') {
                                $scope.labelTypeLoadDataToBusinessEvaluate();
                            }
                            else if ($scope.opts && $scope.opts.scene === 'TechnologyEvaluate') {
                                if ($scope.opts.model.goodsDetailsCategory) {
                                    $scope.labelTypeLoadDataToTechnologyEvaluateByGoods();
                                }
                                else {
                                    $scope.labelTypeLoadDataToTechnologyEvaluate();
                                }
                            }
                            else if ($scope.opts && $scope.opts.scene === 'Award') {
                                $scope.labelTypeLoadDataToAward();
                            }
                            else {
                                wfWaiting.hide();
                            }
                        }
                    };

                    // 拟单环节标签模板
                    $scope.labelTypeLoadDataToDraft = function () {

                        //行业内档次
                        //经营模式
                        //对接高管/法人/集体承包人/个人承包人姓名
                        var param = {
                            ResourceId: $scope.resourceId,
                            LabelTemplateResultCode: $scope.opts.labelTemplateCodeList.templateCode,
                            SupplierList: [],
                        }
                        if (angular.isArray($scope.data) === false) { return; }
                        for (var i = 0; i < $scope.data.length; i++) {
                            var supplier = $scope.data[i];
                            param.SupplierList.push({
                                SupplierCode: supplier.supplierCode,
                                IndustryDomainCode: supplier.industryDomainCode,
                            });
                        }
                        wfWaiting.show();
                        $scope.api.fecthLabelEditListByTemplate(param, function (data) {
                            if (angular.isArray(data) && data.length > 0
                                && angular.isArray($scope.data) && $scope.data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    for (var j = 0; j < $scope.data.length; j++) {
                                        var sup = $scope.data[j];
                                        if (item.supplierCode === sup.supplierCode
                                            && item.industryDomainCode === sup.industryDomainCode) {
                                            sup.labelTemplate = item;
                                            angular.forEach(item.items, function (label) {
                                                if (label.labelValue === 'LC90037') {
                                                    $scope.label.labelLC90037Title = label.title;
                                                    sup.labelLC90037 = label;
                                                    sup.labelLC90037OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90024') {
                                                    $scope.label.labelLC90024Title = label.title;
                                                    sup.labelLC90024 = label;
                                                    sup.labelLC90024OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90003') {
                                                    $scope.label.labelLC90003Title = label.title;
                                                    sup.labelLC90003 = label;
                                                } else if (label.labelValue === 'LC90019') {
                                                    $scope.label.labelLC90019Title = label.title;
                                                    sup.labelLC90019 = label;
                                                } else if (label.labelValue === 'LC90021') {
                                                    $scope.label.labelLC90021Title = label.title;
                                                    sup.labelLC90021 = label;
                                                } else if (label.labelValue === 'LC90062') {
                                                    $scope.label.labelLC90062Title = label.title;
                                                    sup.labelLC90062 = label;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            wfWaiting.hide();
                        });
                    };

                    // 商务评标环节标签模板
                    $scope.labelTypeLoadDataToBusinessEvaluate = function () {
                        var param = {
                            ResourceId: $scope.resourceId,
                            LabelTemplateResultCode: $scope.opts.labelTemplateCodeList.templateCodeToBusinessEvaluate,
                            SupplierList: [],
                        }
                        if (angular.isArray($scope.data) === false) { return; }
                        for (var i = 0; i < $scope.data.length; i++) {
                            var supplier = $scope.data[i];
                            param.SupplierList.push({
                                SupplierCode: supplier.supplierCode,
                                IndustryDomainCode: supplier.industryDomainCode,
                            });
                        }
                        wfWaiting.show();
                        $scope.api.fecthEvaluateLabelEditListByTemplate(param, function (data) {

                            if (angular.isArray(data) && data.length > 0
                                && angular.isArray($scope.data) && $scope.data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    for (var j = 0; j < $scope.data.length; j++) {
                                        var sup = $scope.data[j];
                                        if (item.supplierCode === sup.supplierCode
                                            && item.industryDomainCode === sup.industryDomainCode) {
                                            sup.labelTemplate = item;
                                            for (var y = 0; y < item.items.length; y++) {
                                                var label = item.items[y];
                                                if (label.labelValue === 'LC90096') {
                                                    $scope.label.labelLC90096Title = label.title;
                                                    sup.labelLC90096 = label;
                                                    sup.labelLC90096OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90097') {
                                                    $scope.label.labelLC90097Title = label.title;
                                                    sup.labelLC90097 = label;
                                                } else if (label.labelValue === 'LC90098') {
                                                    $scope.label.labelLC90098Title = label.title;
                                                    sup.labelLC90098 = label;
                                                    sup.labelLC90098OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90099') {
                                                    $scope.label.labelLC90099Title = label.title;
                                                    sup.labelLC90099 = label;
                                                } else if (label.labelValue === 'LC90100') {
                                                    $scope.label.labelLC90100Title = label.title;
                                                    sup.labelLC90100 = label;
                                                    sup.labelLC90100OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90101') {
                                                    $scope.label.labelLC90101Title = label.title;
                                                    sup.labelLC90101 = label;
                                                    sup.labelLC90101OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90102') {
                                                    $scope.label.labelLC90102Title = label.title;
                                                    sup.labelLC90102 = label;
                                                    angular.extend($scope.labelLC90102MoneyOpts, label.moneyOpts);
                                                } else if (label.labelValue === 'LC90103') {
                                                    $scope.label.labelLC90103Title = label.title;
                                                    sup.labelLC90103 = label;
                                                    angular.extend($scope.labelLC90103MoneyOpts, label.moneyOpts);
                                                } else if (label.labelValue === 'LC90104') {
                                                    $scope.label.labelLC90104Title = label.title;
                                                    sup.labelLC90104 = label;
                                                    angular.extend($scope.labelLC90104MoneyOpts, label.moneyOpts);
                                                } else if (label.labelValue === 'LC90105') {
                                                    $scope.label.labelLC90105Title = label.title;
                                                    sup.labelLC90105 = label;
                                                    sup.labelLC90105OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90106') {
                                                    $scope.label.labelLC90106Title = label.title;
                                                    sup.labelLC90106 = label;
                                                    sup.labelLC90106OptionValue = getSelectedLabelOption(label);
                                                }
                                            }
                                        }
                                    }
                                }
                                // 存在不良投标行为
                                for (var j = 0; j < $scope.data.length; j++) {
                                    var sup = $scope.data[j];
                                    for (var m = 0; m < sup.labelLC90099.options.length; m++) {
                                        var op = sup.labelLC90099.options[m];
                                        op.selected = !op.selected;
                                        $scope.labelLC90099Change(op);
                                    }
                                }
                            }
                            wfWaiting.hide();
                        });
                    };

                    // 技术评标环节标签模板-工程类，服务类
                    $scope.labelTypeLoadDataToTechnologyEvaluate = function () {
                        var param = {
                            ResourceId: $scope.resourceId,
                            LabelTemplateResultCode: $scope.opts.labelTemplateCodeList.templateCodeToTechnologyEvaluate,
                            SupplierList: [],
                        }
                        if (angular.isArray($scope.data) === false) { return; }
                        for (var i = 0; i < $scope.data.length; i++) {
                            var supplier = $scope.data[i];
                            param.SupplierList.push({
                                SupplierCode: supplier.supplierCode,
                                IndustryDomainCode: supplier.industryDomainCode,
                            });
                        }
                        wfWaiting.show();
                        $scope.api.fecthEvaluateLabelEditListByTemplate(param, function (data) {

                            if (angular.isArray(data) && data.length > 0
                                && angular.isArray($scope.data) && $scope.data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    for (var j = 0; j < $scope.data.length; j++) {
                                        var sup = $scope.data[j];
                                        if (item.supplierCode === sup.supplierCode
                                            && item.industryDomainCode === sup.industryDomainCode) {
                                            sup.labelTemplate = item;
                                            angular.forEach(item.items, function (label) {
                                                if (label.labelValue === 'LC90107') {
                                                    $scope.label.labelLC90107Title = label.title;
                                                    $scope.label.labelLC90107ToolTip = label.toolTip;
                                                    sup.labelLC90107 = label;
                                                    sup.labelLC90107OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90108') {
                                                    $scope.label.labelLC90108Title = label.title;
                                                    $scope.label.labelLC90108ToolTip = label.toolTip;
                                                    sup.labelLC90108 = label;
                                                    sup.labelLC90108OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90109') {
                                                    $scope.label.labelLC90109Title = label.title;
                                                    sup.labelLC90109 = label;
                                                    sup.labelLC90109OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90119') {
                                                    $scope.label.labelLC90119Title = label.title;
                                                    sup.labelLC90119 = label;
                                                    sup.labelLC90119OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90110') {
                                                    $scope.label.labelLC90110Title = label.title;
                                                    sup.labelLC90110 = label;
                                                    sup.labelLC90110OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90111') {
                                                    $scope.label.labelLC90111Title = label.title;
                                                    $scope.label.labelLC90111ToolTip = label.toolTip;
                                                    sup.labelLC90111 = label;
                                                } else if (label.labelValue === 'LC90112') {
                                                    $scope.label.labelLC90112Title = label.title;
                                                    sup.labelLC90112 = label;
                                                } else if (label.labelValue === 'LC90113') {
                                                    $scope.label.labelLC90113Title = label.title;
                                                    sup.labelLC90113 = label;
                                                } else if (label.labelValue === 'LC90114') {
                                                    $scope.label.labelLC90114Title = label.title;
                                                    $scope.label.labelLC90114ToolTip = label.toolTip;
                                                    sup.labelLC90114 = label;
                                                    for (var m = 0; m < label.options.length; m++) {
                                                        var op = label.options[m];
                                                        if (op.selected && !sup.labelLC90114OptionValue) {
                                                            sup.labelLC90114OptionValue = op.optionValue;
                                                        }
                                                        if (op.optionValue === 'OP90114014') {
                                                            sup.isSelectedOP90114014 = op.selected;
                                                            sup.otherTextOP90114014 = op.otherText;
                                                        }
                                                    }
                                                } else if (label.labelValue === 'LC90115') {
                                                    $scope.label.labelLC90115Title = label.title;
                                                    $scope.label.labelLC90115ToolTip = label.toolTip;
                                                    sup.labelLC90115 = label;
                                                } else if (label.labelValue === 'LC90116') {
                                                    $scope.label.labelLC90116Title = label.title;
                                                    $scope.label.labelLC90116ToolTip = label.toolTip;
                                                    sup.labelLC90116 = label;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            wfWaiting.hide();
                        });
                    };

                    // 技术评标环节标签模板-货物类
                    $scope.labelTypeLoadDataToTechnologyEvaluateByGoods = function () {
                        var param = {
                            ResourceId: $scope.resourceId,
                            LabelTemplateResultCode: $scope.opts.labelTemplateCodeList.templateCodeToGoodsTechnologyEvaluate,
                            SupplierList: [],
                        }
                        if (angular.isArray($scope.data) === false) { return; }
                        for (var i = 0; i < $scope.data.length; i++) {
                            var supplier = $scope.data[i];
                            param.SupplierList.push({
                                SupplierCode: supplier.supplierCode,
                                IndustryDomainCode: supplier.industryDomainCode,
                            });
                        }
                        wfWaiting.show();
                        $scope.api.fecthEvaluateLabelEditListByTemplate(param, function (data) {

                            if (angular.isArray(data) && data.length > 0
                                && angular.isArray($scope.data) && $scope.data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    for (var j = 0; j < $scope.data.length; j++) {
                                        var sup = $scope.data[j];
                                        if (item.supplierCode === sup.supplierCode
                                            && item.industryDomainCode === sup.industryDomainCode) {
                                            sup.labelTemplate = item;
                                            angular.forEach(item.items, function (label) {
                                                if (label.labelValue === 'LC90107') {
                                                    $scope.label.labelLC90107Title = label.title;
                                                    $scope.label.labelLC90107ToolTip = label.toolTip;
                                                    sup.labelLC90107 = label;
                                                    sup.labelLC90107OptionValue = getSelectedLabelOption(label);
                                                } else if (label.labelValue === 'LC90108') {
                                                    $scope.label.labelLC90108Title = label.title;
                                                    $scope.label.labelLC90108ToolTip = label.toolTip;
                                                    sup.labelLC90108 = label;
                                                    sup.labelLC90108OptionValue = getSelectedLabelOption(label);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            wfWaiting.hide();
                        });
                    };

                    // 定标环节标签模板-工程类，服务类
                    $scope.labelTypeLoadDataToAward = function () {
                        var param = {
                            ResourceId: $scope.resourceId,
                            LabelTemplateResultCode: $scope.opts.labelTemplateCodeList.templateCodeToAward,
                            SupplierList: [],
                        }
                        if (angular.isArray($scope.data) === false) { return; }
                        for (var i = 0; i < $scope.data.length; i++) {
                            var supplier = $scope.data[i];
                            param.SupplierList.push({
                                SupplierCode: supplier.supplierCode,
                                IndustryDomainCode: supplier.industryDomainCode,
                            });
                        }
                        wfWaiting.show();
                        $scope.api.fecthPurchaseAwardLabelViewList(param, function (data) {

                            if (angular.isArray(data) && data.length > 0
                                && angular.isArray($scope.data) && $scope.data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    for (var j = 0; j < $scope.data.length; j++) {
                                        var sup = $scope.data[j];
                                        if (item.supplierCode === sup.supplierCode
                                            && item.industryDomainCode === sup.industryDomainCode) {
                                            sup.labelTemplate = item;
                                            angular.forEach(item.items, function (label, index) {
                                                var showIndex = index + 2;
                                                if (label.labelValue === 'LC90107') {
                                                    $scope.label.labelLC90107Index = showIndex;
                                                    $scope.label.labelLC90107Title = label.labelTitle;
                                                    sup.labelLC90107 = label;
                                                } else if (label.labelValue === 'LC90108') {
                                                    $scope.label.labelLC90108Index = showIndex;
                                                    $scope.label.labelLC90108Title = label.labelTitle;
                                                    sup.labelLC90108 = label;
                                                } else if (label.labelValue === 'LC90109') {
                                                    $scope.label.labelLC90109Index = showIndex;
                                                    $scope.label.labelLC90109Title = label.labelTitle;
                                                    sup.labelLC90109 = label;
                                                } else if (label.labelValue === 'LC90119') {
                                                    $scope.label.labelLC90119Index = showIndex;
                                                    $scope.label.labelLC90119Title = label.labelTitle;
                                                    sup.labelLC90119 = label;
                                                } else if (label.labelValue === 'LC90110') {
                                                    $scope.label.labelLC90110Index = showIndex;
                                                    $scope.label.labelLC90110Title = label.labelTitle;
                                                    sup.labelLC90110 = label;
                                                } else if (label.labelValue === 'LC90111') {
                                                    $scope.label.labelLC90111Index = showIndex;
                                                    $scope.label.labelLC90111Title = label.labelTitle;
                                                    sup.labelLC90111 = label;
                                                } else if (label.labelValue === 'LC90112') {
                                                    $scope.label.labelLC90112Index = showIndex;
                                                    $scope.label.labelLC90112Title = label.labelTitle;
                                                    sup.labelLC90112 = label;
                                                } else if (label.labelValue === 'LC90113') {
                                                    $scope.label.labelLC90113Index = showIndex;
                                                    $scope.label.labelLC90113Title = label.labelTitle;
                                                    sup.labelLC90113 = label;
                                                } else if (label.labelValue === 'LC90114') {
                                                    $scope.label.labelLC90114Index = showIndex;
                                                    $scope.label.labelLC90114Title = label.labelTitle;
                                                    sup.labelLC90114 = label;
                                                } else if (label.labelValue === 'LC90115') {
                                                    $scope.label.labelLC90115Index = showIndex;
                                                    $scope.label.labelLC90115Title = label.labelTitle;
                                                    sup.labelLC90115 = label;
                                                } else if (label.labelValue === 'LC90116') {
                                                    $scope.label.labelLC90116Index = showIndex;
                                                    $scope.label.labelLC90116Title = label.labelTitle;
                                                    sup.labelLC90116 = label;
                                                } else if (label.labelValue === 'LC90097') {
                                                    $scope.label.labelLC90097Index = showIndex;
                                                    $scope.label.labelLC90097Title = label.labelTitle;
                                                    sup.labelLC90097 = label;
                                                } else if (label.labelValue === 'LC90099') {
                                                    $scope.label.labelLC90099Index = showIndex;
                                                    $scope.label.labelLC90099Title = label.labelTitle;
                                                    sup.labelLC90099 = label;
                                                } else if (label.labelValue === 'LC90100') {
                                                    $scope.label.labelLC90100Index = showIndex;
                                                    $scope.label.labelLC90100Title = label.labelTitle;
                                                    sup.labelLC90100 = label;
                                                } else if (label.labelValue === 'LC90117') {
                                                    // 投标单方
                                                    $scope.label.labelLC90117Index = showIndex;
                                                    $scope.label.labelLC90117ToolTip = label.labelToolTip;
                                                    $scope.label.labelLC90117Title = label.labelTitle;
                                                    sup.labelLC90117 = item.editItems[0];
                                                } else if (label.labelValue === 'LC90101') {
                                                    $scope.label.labelLC90101Index = showIndex;
                                                    $scope.label.labelLC90101Title = label.labelTitle;
                                                    sup.labelLC90101 = label;
                                                } else if (label.labelValue === 'LC90102') {
                                                    $scope.label.labelLC90102Index = showIndex;
                                                    $scope.label.labelLC90102Title = label.labelTitle;
                                                    sup.labelLC90102 = label;
                                                } else if (label.labelValue === 'LC90103') {
                                                    $scope.label.labelLC90103Index = showIndex;
                                                    $scope.label.labelLC90103Title = label.labelTitle;
                                                    sup.labelLC90103 = label;
                                                } else if (label.labelValue === 'LC90104') {
                                                    $scope.label.labelLC90104Index = showIndex;
                                                    $scope.label.labelLC90104Title = label.labelTitle;
                                                    sup.labelLC90104 = label;
                                                } else if (label.labelValue === 'LC90105') {
                                                    $scope.label.labelLC90105Index = showIndex;
                                                    $scope.label.labelLC90105Title = label.labelTitle;
                                                    sup.labelLC90105 = label;
                                                } else if (label.labelValue === 'LC90106') {
                                                    $scope.label.labelLC90106Index = showIndex;
                                                    $scope.label.labelLC90106Title = label.labelTitle;
                                                    sup.labelLC90106 = label;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            wfWaiting.hide();
                        });
                    };

                    // 与远洋合作在施面积
                    $scope.loadImplementData = function () {
                        var param = {
                            resourceId: $scope.resourceId,
                        };
                        $scope.api.fetchConfiscatedLandArea(param, function (data) {
                            if (angular.isArray(data) && data.length > 0
                                && angular.isArray($scope.data) && $scope.data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    for (var j = 0; j < $scope.data.length; j++) {
                                        var sup = $scope.data[j];
                                        if (item.supplierCode === sup.supplierCode) {
                                            sup.confiscatedLandArea = item.confiscatedLandArea;
                                        } else if (sup.confiscatedLandArea === undefined) {
                                            sup.confiscatedLandArea = 0;
                                        }
                                    }
                                }
                            }
                        });
                    };

                    // 获取单选选择内容
                    function getSelectedLabelOption(sup) {
                        if (angular.isArray(sup.options) === false) {
                            return;
                        }
                        var result = null;
                        for (var i = 0; i < sup.options.length; i++) {
                            var item = sup.options[i];
                            if (!result && item.selected) {
                                result = item.optionValue;
                            }
                            else {
                                item.selected = false;
                            }
                        }
                        return result;
                    }

                    // 单选标签选择事件
                    $scope.labelChange = function (label, labelSelectedValue) {
                        for (var i = 0; i < label.options.length; i++) {
                            if (label.options[i].optionValue === labelSelectedValue) {
                                label.options[i].selected = true;
                            }
                            else {
                                label.options[i].selected = false;
                            }
                        }
                    };
                    // 是否存在不良投标行为
                    $scope.labelLC90098Change = function (item) {
                        for (var j = 0; j < item.labelLC90099.options.length; j++) {
                            var op = item.labelLC90099.options[j];
                            op.selected = true;
                            $scope.labelLC90099Change(op);
                        }
                    };
                    // 存在不良投标行为
                    $scope.labelLC90099Change = function (option) {
                        option.selected = !option.selected;
                        var invalidTender = false;
                        for (var i = 0; i < $scope.data.length; i++) {
                            var item = $scope.data[i];
                            for (var j = 0; j < item.labelLC90099.options.length; j++) {
                                var op = item.labelLC90099.options[j];
                                if (op.selected && op.optionValue === 'OP90099001') {
                                    invalidTender = true;
                                    break;
                                }

                                if (op.optionValue === 'OP90099002') {
                                    item.currentInvalidTender = op.selected;
                                    break;
                                }
                            }
                        }
                        $scope.invalidTender = invalidTender;
                        for (var i = 0; i < $scope.data.length; i++) {
                            var item = $scope.data[i];
                            if ($scope.invalidTender || item.currentInvalidTender) {
                                for (var j = 0; j < item.labelLC90100.options.length; j++) {
                                    var op = item.labelLC90100.options[j];
                                    if (op.optionValue === 'OP90100002') {
                                        item.labelLC90100OptionValue = op.optionValue;
                                        op.selected = true;
                                    }
                                    else {
                                        op.selected = false;
                                    }
                                }
                            }
                        }
                    };

                    // 拟派项目经理优势
                    $scope.labelLC90114Change = function (item, option) {
                        option.selected = !option.selected;
                        item.labelLC90114OptionValue = option.optionValue;
                        for (var j = 0; j < item.labelLC90114.options.length; j++) {
                            var op = item.labelLC90114.options[j];
                            if (option.optionValue === 'OP90114001' && option.selected && op.optionValue !== 'OP90114001') {
                                op.selected = false;
                            }
                            if (option.optionValue === 'OP90114002' && option.selected && op.optionValue === 'OP90114001') {
                                op.selected = false;
                            }
                            if (option.optionValue === 'OP90114014') {
                                item.isSelectedOP90114014 = option.selected;
                            }
                        }
                    };

                    // 显示标签说明
                    $scope.showToolTip = function (toolTip, $event) {
                        $event.stopPropagation();
                        if (toolTip) {
                            sogModal.openAlertDialog('说明', toolTip);
                        }
                    }

                    $scope.api = {
                        showErrorMessage: function (error) {
                            wfWaiting.hide();
                            if (error) {
                                sogModal.openErrorDialog(error).then(function () {
                                });
                            }
                        },
                        urlFecthLabelEditListByTemplate: function (param) {
                            return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/FecthLabelEditListByTemplate?r=' + Math.random();
                        },
                        urlFecthEvaluateLabelEditListByTemplate: function (param) {
                            return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/FecthEvaluateLabelEditListByTemplate?r=' + Math.random();
                        },
                        urlFecthLabelViewListByTemplate: function (param) {
                            return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/FecthLabelViewListByTemplate?r=' + Math.random();
                        },
                        urlCreateEvaluationInstanceData: function (param) {
                            return seagull2Url.getPlatformUrl('/Supplier/CreateEvaluationInstanceData?r=' + Math.random());
                        },
                        urlLoadChildrenByCode: function (param) {
                            return seagull2Url.getPlatformUrl('/SupplierCategory/LoadChildrenByCode?code=' + param.code);
                        },
                        urlFecthPurchaseAwardLabelViewList: function (param) {
                            return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/FecthPurchaseAwardLabelViewList?r=' + Math.random();
                        },
                        urlFetchConfiscatedLandArea: function (param) {
                            return seagull2Url.getPlatformUrl('/ProjectInfo/FetchConfiscatedLandArea?&resourceId=' + param.resourceId);
                        },
                        fecthLabelEditListByTemplate: function (param, done) {
                            $http({
                                method: 'POST',
                                url: $scope.api.urlFecthLabelEditListByTemplate(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                        fecthEvaluateLabelEditListByTemplate: function (param, done) {
                            $http({
                                method: 'POST',
                                url: $scope.api.urlFecthEvaluateLabelEditListByTemplate(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                        fecthLabelViewListByTemplate: function (param, done) {
                            $http({
                                method: 'POST',
                                url: $scope.api.urlFecthLabelViewListByTemplate(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                        createEvaluationInstanceData: function (param, done) {
                            $http({
                                method: 'POST',
                                url: $scope.api.urlCreateEvaluationInstanceData(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                        loadChildrenByCode: function (param, done) {
                            $http({
                                method: 'GET',
                                url: $scope.api.urlLoadChildrenByCode(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                        fecthPurchaseAwardLabelViewList: function (param, done) {
                            $http({
                                method: 'POST',
                                url: $scope.api.urlFecthPurchaseAwardLabelViewList(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                        fetchConfiscatedLandArea: function (param, done) {
                            $http({
                                method: 'POST',
                                url: $scope.api.urlFetchConfiscatedLandArea(param),
                                data: param,
                            })
                                .success(function (data) { done(data); })
                                .error($scope.api.showErrorMessage);
                        },
                    };

                    //根据属性默认加载数据
                    $scope.init = function () {
                        $scope.isLoaded = false;
                        $scope.resourceId = $scope.$parent.resourceId;
                        $scope.activityId = $scope.$parent.currentActivityId;
                        $scope.businessType = $scope.$parent.businessType;
                        $scope.creator = $scope.$parent.viewModel.formAction.creator;
                        if ($scope.opts && $scope.opts.isshowenterpriseCheck && $scope.$parent.viewModel.supplierScopeList.length >= 2) {
                            $scope.selectenterpriseCheck();
                        }
                        else {
                            $scope.isLoaded = true;
                        }

                        //获取收费状态
                        if ($scope.opts && $scope.opts.scene === 'IssueBiddingDocument') {
                            $scope.fetchChargeStatue();
                        }


                        requestListData = $scope.requestLabelListData;
                    }
                    $scope.init();
                }
            }
        });

    // 入围审批意见控件
    app.directive("applicationOpinion", function () {
        return {
            restrict: "A",
            scope: {
                data: '=',
                readOnly: '=',
                opinionOpts: '=',
            },
            templateUrl: "htmlTemplate/controlTemplate/common/applicationOpinion.html",
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting) {

                $scope.hideApplicationOpinion = function () {
                    $scope.isShowApplicationOpinion = false;
                }
                $scope.showApplicationOpinion = function () {
                    $scope.isShowApplicationOpinion = true;
                }
            },
            link: function (scope, iElement, iAttr) {
            }
        }
    });
});
// 标签回掉方法
var requestListData = null;
