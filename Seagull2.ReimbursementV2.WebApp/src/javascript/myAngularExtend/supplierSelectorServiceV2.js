define([
    'angular',
    'app',
    'supplierCategoryExtend',
    'supplierProjectCityExtend',
    'supplierProjectExtend',
], function (angular, app) {
    app.factory('supplierSelectorV2', function ($http, $window, $filter, seagull2Url, wfWaiting, sogModal, configure) {
        /**
         * 全局变量
         */
        var common = {};
        configure.getConfig(common, 'common');
        common.apiUrlBase = "https://workflow.sinoocean-test.com";
        /*
         * 校验 open 函数的参数
         * @param {Object} params
         * */
        function checkParams(params) {
            if (!params || !angular.isObject(params)) {
                return '请传递参数';
            } else if (true) {
                var blackList = params.blackList;
                if (!angular.isArray(blackList)) {
                    blackList = [];
                }

                // 校验 项目
                if (blackList.indexOf('project') !== -1 && (!params.project || !params.project.projectCode || !params.project.projectName)) {
                    return "请先选择项目，再添加供应商";
                }

                if (blackList.indexOf('supplierCatagory') !== -1) {
                    if (angular.isArray(params.supplierCatagoryList) === false || params.supplierCatagoryList.length === 0) {
                        return "请先选择供应商类别，再添加供应商";
                    }
                }
                if (blackList.indexOf('reason') !== -1 && !params.reason) {
                    return "请先选择直接委托理由，再添加供应商";
                }

                // delegationAmount
                if (blackList.indexOf('delegationAmount') !== -1 && (!params.delegationAmount || params.delegationAmount <= 0)) {
                    return "请先填写直接委托金额，再添加供应商";
                }
            }
            return '';
        }

        /*
         *
         * @param {Object} params
         * params 参数说明：
         *
        params 参数说明：
        projectCode               项目编码                 String
        supplierCatagoryList      供应商类别               StringArray
        supplierName              供应商名称               String
        isMonopolyEditable        是否垄断条件能否选择   Boolean
        reason                    直接委托理由（1 是垄断） String
        delegationAmount          直接委托金额             Number
        blackList                 校验字段的黑名单         StringArray
        *
        * @returns {Promise}
         */
        function open(params) {
            if (!angular.isArray(params.blackList)) {
                params.blackList = [];
            }
            var errMsg = checkParams(params);
            if (errMsg.length > 0) {
                sogModal.openAlertDialog("提示", errMsg);
                return;
            }
            var IsDirectCommissioned = params.isDirectCommissioned;
            var viewPath = 'htmlTemplate/dialogTemplate/common/supplierInfoSelectorV4.html';
            var promise = sogModal.openLayer('<div><div ng-include="\'' + viewPath + '\'"></div></div>', ['$scope', function ($modalScope) {


                /**初始化 */

                // 供应商类别 StringArray
                $modalScope.supplierCatagoryList = angular.isArray(params.supplierCatagoryList) ? params.supplierCatagoryList : [];
                $modalScope.supplierCatagoryCodeList = [];
                angular.forEach($modalScope.supplierCatagoryList, function (item) {
                    $modalScope.supplierCatagoryCodeList.push(item.industryDomainCode);
                });

                //创建当前弹窗的行业领域集合
                $modalScope.currenttradeCatagoryList = $modalScope.supplierCatagoryList;

                // 查询条件
                $modalScope.condition = {
                    supplierCatagoryList: $modalScope.supplierCatagoryList,
                    //currenttradeCatagoryCodeList: [],
                    disableSupplierCatagory: false,// 禁用供应商类别选择
                    supplierCatagoryNamesStr: "",// 所有供应商类别名称组成的字符串
                    supplierCatagoryCodeList: [],// 所有供应商类别Code组成的字符串
                    supplierName: params.supplierName || "",// 供应商名称 String
                    isMonopolyEditable: true,// 是否垄断条件能否选择
                    isMonopoly: null,// 是否垄断
                    isStrategyEditable: true,//是否战采条件能否选择
                    isStrategy: null,//是否战采
                    isTinyEditable: true,//是否小微条件能否选择
                    isTiny: null,//是否小微
                    enterStartTime: null,
                    enterEndTime: null,
                    cooperationStartTime: null,
                    cooperationEndTime: null,
                    cityName: "",
                    projectName: "",
                    supplierLevel: [],
                    cityList: [],
                    cityCodelist: [],
                    projectCodeList: [],
                    cooperateProjectCodeList: [],
                    filedName: "supplierName",
                    isDesc: true
                };

                function InitCurrenttradeCatagory() {
                    //行业领域
                    if ($modalScope.supplierCatagoryList.length > 0) {
                        angular.forEach($modalScope.supplierCatagoryList, function (item) {
                            $modalScope.condition.supplierCatagoryCodeList.push(item.industryDomainCode);
                        })
                    }
                }
                InitCurrenttradeCatagory();

                // 供应商等级列表
                $modalScope.supplierLevelList = [];
                // 供应商列表
                $modalScope.querySupplierList = [];
                //是否显示等级层级
                $modalScope.isShowExcellentLevel = false;
                // 选中的供应商
                $modalScope.selectedItem = null;
                //分页
                $modalScope.selectCommodityPaging = {
                    currentPage: 1,
                    itemsPerPage: 6,
                    totalItems: 0
                };

                //初始化查询条件
                $modalScope.filedName = "";
                $modalScope.isDesc = null;
                //排序
                $modalScope.isSort = true;

                //项目不为空则将将限定项目
                if (params.project !== null && params.project !== undefined) {
                    if (params.actionTypeCode == 3 || params.actionTypeCode == 12 || params.actionTypeCode == 25 || params.actionTypeCode == 9 || params.actionTypeCode == 18 || params.actionTypeCode == 29 || params.actionTypeCode == 36) {
                        $modalScope.condition.projectCodeList.push(params.project.projectCode);
                    } else {
                        angular.forEach(params.project, function (pro) {
                            $modalScope.condition.projectCodeList.push(pro.projectCode);
                        });
                    }
                }

                if (params.isDirectCommissioned) {
                    //直接委托理由为垄断
                    if (params.reason === 1) {
                        $modalScope.condition.isMonopolyEditable = false;
                        $modalScope.condition.isMonopoly = true;
                    }

                    if (params.reason === 4) {
                        $modalScope.condition.isStrategy = true;
                        $modalScope.condition.isStrategyEditable = false;
                    }
                    //4为项目定义类
                    if (params.actionTypeCode != 4) {
                        if (params.delegationAmount > params.tinyAmount) {
                            $modalScope.condition.isTinyEditable = false;
                            $modalScope.condition.isTiny = false;
                        } else {
                            $modalScope.condition.isTiny = null;
                        }
                    } else {
                        //项目定义类只能选非小微
                        $modalScope.condition.isTinyEditable = false;
                        $modalScope.condition.isTiny = false;
                    }
                } else {
                    //招投标只能选择非垄断
                    $modalScope.condition.isMonopolyEditable = false;
                    $modalScope.condition.isMonopoly = false;
                    //招投标只能选择非小微
                    $modalScope.condition.isTinyEditable = false;
                    $modalScope.condition.isTiny = false;
                }

                if (params.project != null) {
                    $modalScope.condition.projectCodeList.push(params.project.projectCode);
                }


                $modalScope.tradeCatagoryOpts = {
                    beforAppend: function (tradeCatagory) {
                        for (var i = 0; i < tradeCatagory.length; i++) {
                            var item = tradeCatagory[i];
                            $modalScope.condition.supplierCatagoryCodeList.push(item.code);
                        }
                    }
                }

                //页面方法
                $modalScope.baseInfo = {
                    //是否垄断变化
                    isMonopolyChange: function (val) {
                        $modalScope.condition.isMonopoly = val;
                    },
                    //是否战采变化
                    isStrategyChange: function (val) {
                        $modalScope.condition.isStrategy = val;
                    },
                    //是否小微变化
                    isTinyChange: function (val) {
                        $modalScope.condition.isTiny = val;
                    },
                    //供应商级别选中
                    levelChecked: function () {
                        var codes = [];
                        for (var i = 0; i < $modalScope.supplierLevelList.length; i++) {
                            var item = $modalScope.supplierLevelList[i];
                            if (item.checked) {
                                codes.push(item.code);
                            }
                        }
                        $modalScope.condition.supplierLevel = codes;
                    },
                    //合作城市信息
                    projectCityOpts: {
                        cityName: $modalScope.condition.cityName,
                        beforAppend: function (city) {
                            var codes = [];
                            if (city.length != 0) {
                                for (var i = 0; i < city.length; i++) {
                                    var item = city[i];
                                    codes.push(item.code);
                                }
                                $modalScope.condition.cityCodelist = codes;
                            } else {
                                $modalScope.condition.cityCodelist = [];
                            }
                        }
                    },
                    //合作项目信息
                    projectOpts: {
                        projectName: $modalScope.condition.projectName,
                        cityList: $modalScope.condition.cityList,
                        beforAppend: function (project) {
                            var codes = [];
                            if (project.length != 0) {
                                for (var i = 0; i < project.length; i++) {
                                    var item = project[i];
                                    codes.push(item.code);
                                }
                                $modalScope.condition.cooperateProjectCodeList = codes;
                            } else {
                                $modalScope.condition.cooperateProjectCodeList = [];
                            }
                        }
                    },
                    //切换供应商类别控件非只读
                    changeTradeCatagoryReadOnly: function (supplierName) {
                        if (supplierName != "") {
                            $modalScope.condition.disableSupplierCatagory = false;
                            $modalScope.currenttradeCatagoryList = [];
                            $modalScope.condition.currenttradeCatagoryCodeList = [];
                            document.getElementById("inputSupplierCategory").value = "";
                        } else {
                            $modalScope.currenttradeCatagoryList = $modalScope.supplierCatagoryList;
                            $modalScope.condition.currenttradeCatagoryCodeList = [];
                            InitCurrenttradeCatagory();
                            if ($modalScope.currenttradeCatagoryList != []) {
                                var names = "";
                                angular.forEach($modalScope.currenttradeCatagoryList, function (item) {
                                    names += item.industryDomainName + ",";
                                });
                                var traderAreasName = names.substring(0, names.length - 1);
                                document.getElementById("inputSupplierCategory").value = traderAreasName;
                            }
                        }
                    }
                };

                // 处理供应商类别名称和Code
                var initSupplierCatagory = function (isTrue) {
                    var names = [];
                    var codes = [];
                    var len = $modalScope.condition.supplierCatagoryList.length;
                    if (len > 0) {
                        if (isTrue) {
                            $modalScope.condition.disableSupplierCatagory = true;
                        }
                        for (var i = 0; i < len; i++) {
                            names.push($modalScope.condition.supplierCatagoryList[i].industryDomainName);
                            codes.push($modalScope.condition.supplierCatagoryList[i].industryDomainCode);
                        }
                        if (names.length > 0) {
                            $modalScope.condition.supplierCatagoryNamesStr = names.join(",");
                        }
                        if (codes.length > 0) {
                            $modalScope.condition.supplierCatagoryCodeList = codes;
                            //$modalScope.condition.currenttradeCatagoryCodeList = codes;
                        }
                    }
                };
                initSupplierCatagory(true);

                //加载城市信息
                var getCityListUrl = seagull2Url.getPlatformUrlBase() + '/ProjectInfo/GetProjectCitys';
                $http.get(getCityListUrl)
                    .success(function (data) {
                        $modalScope.condition.cityList = data;
                        $modalScope.baseInfo.projectOpts.cityList = data;
                    }).error(function (data, status) {
                        sogModal.openAlertDialog(data, status, "查询城市数据异常");
                        wfWaiting.hide();
                    });
                //加载供应商等级
                $http.post(common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/LoadSupplierLevel")
                    .success(function (data) {
                        $modalScope.supplierLevelList = data || [];
                    })
                    .error(function (err) {
                        sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                    });
                // 选择供应商
                $modalScope.selectItem = function (item) {
                    $modalScope.selectedItem = item;
                };

                // 搜索
                $modalScope.search = function (filedName, isDesc) {
                    wfWaiting.show();
                    if ($modalScope.$$childHead) {
                        $modalScope.$$childHead.selectnum = -1;
                    }
                    if ($modalScope.condition.enterStartTime !== null) {
                        $modalScope.condition.enterStartTime = $filter('date')($modalScope.condition.enterStartTime, 'yyyy-MM-dd');
                    }
                    if ($modalScope.condition.enterEndTime !== null) {
                        $modalScope.condition.enterEndTime = $filter('date')($modalScope.condition.enterEndTime, 'yyyy-MM-dd');
                    }
                    if ($modalScope.condition.cooperationStartTime !== null) {
                        $modalScope.condition.cooperationStartTime = $filter('date')($modalScope.condition.cooperationStartTime, 'yyyy-MM-dd');
                    }
                    if ($modalScope.condition.cooperationEndTime !== null) {
                        $modalScope.condition.cooperationEndTime = $filter('date')($modalScope.condition.cooperationEndTime, 'yyyy-MM-dd');
                    }
                    var pageSize = $modalScope.selectCommodityPaging.itemsPerPage;
                    var pageIndex = $modalScope.selectCommodityPaging.currentPage - 1;

                    var url = common.apiUrlBase + "/THRWebApi/SupplierV2/SearchSupplier/FecthSupplierList";
                    if (filedName && (isDesc === true || isDesc === false)) {
                        var params = {
                            SupplierCatagoryCodeArray: $modalScope.condition.supplierCatagoryCodeList,
                            SupplierName: $modalScope.condition.supplierName,
                            SupplierCityCodeArray: $modalScope.condition.cityCodelist,
                            StorageBeginDate: $modalScope.condition.enterStartTime,
                            StorageEndDate: $modalScope.condition.enterEndTime,
                            CooperateBeginDate: $modalScope.condition.cooperationStartTime,
                            CooperateEndDate: $modalScope.condition.cooperationEndTime,
                            ProjectCodeArray: $modalScope.condition.projectCodeList,
                            CooperateProjectCodeArray: $modalScope.condition.cooperateProjectCodeList,
                            IsMonopoly: $modalScope.condition.isMonopoly,
                            IsStrategy: $modalScope.condition.isStrategy,
                            IsTiny: $modalScope.condition.isTiny,
                            SupplierLevelArray: $modalScope.condition.supplierLevel,
                            OrderByName: filedName,
                            IsDesc: isDesc,
                            PageSize: pageSize,
                            PageIndex: pageIndex,
                            IsDirectCommissioned: IsDirectCommissioned,
                        };
                        $modalScope.filedName = filedName;
                        $modalScope.isDesc = isDesc;
                    } else {
                        var params = {
                            SupplierCatagoryCodeArray: $modalScope.condition.supplierCatagoryCodeList,
                            SupplierName: $modalScope.condition.supplierName,
                            SupplierCityCodeArray: $modalScope.condition.cityCodelist,
                            StorageBeginDate: $modalScope.condition.enterStartTime,
                            StorageEndDate: $modalScope.condition.enterEndTime,
                            CooperateBeginDate: $modalScope.condition.cooperationStartTime,
                            CooperateEndDate: $modalScope.condition.cooperationEndTime,
                            ProjectCodeArray: $modalScope.condition.projectCodeList,
                            CooperateProjectCodeArray: $modalScope.condition.cooperateProjectCodeList,
                            IsMonopoly: $modalScope.condition.isMonopoly,
                            IsStrategy: $modalScope.condition.isStrategy,
                            IsTiny: $modalScope.condition.isTiny,
                            SupplierLevelArray: $modalScope.condition.supplierLevel,
                            PageSize: pageSize,
                            PageIndex: pageIndex,
                            IsDirectCommissioned: IsDirectCommissioned,
                        };
                    }
                    //升降序样式显示
                    if (isDesc == true) {
                        $modalScope.showFiledName = filedName;
                        $modalScope.isSort = false;
                    } else if (isDesc == false) {
                        $modalScope.showFiledName = filedName;
                        $modalScope.isSort = true;
                    }

                    //获取供应商信息
                    $http.post(url, params)
                        .success(function (data) {
                            wfWaiting.hide();
                            $modalScope.selectedItem = null;
                            $modalScope.querySupplierList = data;
                            $modalScope.isShowExcellentLevel = data.data.filter(function (e) { return e.excellentLevelName != "" }).length > 0;
                            $modalScope.selectCommodityPaging.totalItems = data.totalCount;
                        })
                        .error(function (err) {
                            wfWaiting.hide();
                            sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                        });
                };

                //监听ViewModel页数的变化更新ViewModel的数据
                $modalScope.$watch('selectCommodityPaging.currentPage', function () {
                    $modalScope.search($modalScope.filedName, $modalScope.isDesc)
                });

                //查询条件重置
                $modalScope.ResetSearchConditions = function () {
                    $modalScope.condition.supplierName = "";
                    for (var i = 0; i < $modalScope.supplierLevelList.length; i++) {
                        var item = $modalScope.supplierLevelList[i];
                        if (item.checked) {
                            item.checked = false;
                        }
                    }
                    //if (!$modalScope.condition.disableSupplierCatagory) {
                    //    $modalScope.condition.supplierCatagoryNamesStr = "";
                    //    $modalScope.condition.currenttradeCatagoryCodeList = [];
                    //    $modalScope.condition.currenttradeCatagoryList = [];
                    //}
                    if ($modalScope.condition.isMonopolyEditable) {
                        $modalScope.condition.isMonopoly = null;
                    }
                    if ($modalScope.condition.isStrategyEditable) {
                        $modalScope.condition.isStrategy = null;
                    }
                    if ($modalScope.condition.isTinyEditable) {
                        $modalScope.condition.isTiny = null;
                    }
                    $modalScope.condition.enterStartTime = null;
                    $modalScope.condition.enterEndTime = null;
                    $modalScope.condition.cooperationStartTime = null;
                    $modalScope.condition.cooperationEndTime = null;
                    $modalScope.condition.supplierLevel = [];
                    $modalScope.condition.cityCodelist = [];
                    $modalScope.condition.cooperateProjectCodeList = [];
                    document.getElementById("enterStartTime").value = null;
                    document.getElementById("enterEndTime").value = null;
                    document.getElementById("cooperationStartTime").value = null;
                    document.getElementById("cooperationEndTime").value = null;
                    //document.getElementById("inputSupplierCategory").value = "";
                    document.getElementById("inputProjectCityName").value = "";
                    document.getElementById("inputProjectName").value = "";
                };

                //确定操作，返回选中数据
                $modalScope.confirmHandler = function () {

                    var selectedItem = $modalScope.selectedItem;
                    if (!selectedItem) {
                        sogModal.openAlertDialog("提示", "请选择供应商");
                        return;
                    }
                    // 是否允许选择（非黑名单供应商）
                    var param = {
                        SupplierCode: selectedItem.code
                    }
                    wfWaiting.show();
                    $modalScope.api.fetchPurchaseForMonthNoncooperation(param, function (data) {
                        wfWaiting.hide();
                        if (data && data.isAllow === false) {
                            sogModal.openAlertDialog("提示", "供应商[" + selectedItem.supplierName + "]因存在不良投标行为，无故大幅提高或降低投标报价的行为（偏离初始报价30%以上），将暂停投标6个月，" + data.releaseData + "后可以继续投标！");
                        }
                        else {
                            var supplier = null;

                            if (selectedItem.isInBlacklist) {
                                sogModal.openAlertDialog("提示", "该供应商已进入黑名单，无法进行正常走单！");
                                return;
                            }

                            if (["4", "5", "7"].indexOf(selectedItem.tradeAreaLevel) !== -1) {
                                sogModal.openAlertDialog("提示", "不能选择供应商等级为" + selectedItem.tradeAreaLevelName + "的供应商");
                                return;
                            }

                            //验证供应商证件过期start
                            var expiredInfo = "";
                            var expireInfo = "";
                            for (var i = 0; i < selectedItem.expiredInfoList.length; i++) {
                                var expired = selectedItem.expiredInfoList[i];
                                if (expired.expiredDays <= 0) {
                                    expiredInfo += expired.typeName + "，";
                                }
                                else if (expired.expiredDays >= 1 && expired.expiredDays < 30) {
                                    expireInfo += expired.typeName + "，";
                                }
                            }
                            var alertInfo = "";
                            var isTimeEnd = false;
                            var isToTimeEnd = false;
                            if (expiredInfo) {
                                alertInfo += expiredInfo + "已过期，请尽快邀请供应商更新证件信息！";
                                isTimeEnd = true;
                            }
                            if (expireInfo) {
                                alertInfo += expireInfo + "即将在30日后过期，请及时邀请供应商更新证件信息！";
                                isToTimeEnd = true;
                            }
                            if (alertInfo) {
                                if (isTimeEnd === false) {
                                    if (isToTimeEnd === true) {
                                        sogModal.openAlertDialog("提示", selectedItem.supplierName + alertInfo);
                                    }

                                } else {
                                    sogModal.openAlertDialog("提示", selectedItem.supplierName + alertInfo);
                                    return;
                                }
                            }
                            //验证供应商证件过期end

                            /** 返回所选供应商*/
                            supplier = {
                                supplierCode: selectedItem.code,
                                supplierName: selectedItem.supplierName,
                                industryDomainCode: selectedItem.tradeAreaCode,
                                industryDomainName: selectedItem.tradeArea,
                                industryDomainLevelCode: selectedItem.tradeAreaLevel,
                                industryDomainLevelName: selectedItem.tradeAreaLevelName,
                                qualificationLevelNames: selectedItem.qualificationLevelName,
                                isTiny: selectedItem.isTiny,
                                registCapital: selectedItem.registCapital,
                                storageDate: selectedItem.createTime,
                            };
                            $modalScope.confirm(supplier);
                        }
                    });
                };

                //查看供应商入库及考察审批完成页面
                $modalScope.findInspectionConclusion = function (code, industryDomainCode) {
                    wfWaiting.show();
                    var url = common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/GetFinishInspectionUrl";
                    url += "?SupplierCode=" + code + "&IndustryDomainCode=" + industryDomainCode + "&random=" + Math.random();
                    $http.post(encodeURI(url)).success(function (data) {
                        wfWaiting.hide();
                        if (data.url !== "" && data.activityId !== "") {
                            if (typeof WebViewBridge === 'undefined') {
                                $window.open(common.webUrlBase + data.url);
                            }
                            else {
                                WebViewBridge.send(JSON.stringify({ type: 'attachment', title: "供应商入库及考察", url: RootUrl + data.url }));
                            }
                        } else {
                            sogModal.openAlertDialog("流程", "未能找到该流程！");
                        }
                    }).error(function (err) {
                        sogModal.openAlertDialog("提示", err.message || "查询异常，请稍后重试！");
                    });

                };

                //点击供应商详情
                $modalScope.checkSupplierDetails = function (code) {
                    var url = common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                };

                //查看供应商合作次数、行业领域合作次数
                $modalScope.openCooperationDetailsModal = function (fileName, item) {
                    if (!item.cooperationTimes || item.cooperationTimes <= 0) { return; }
                    var viewPath = "htmlTemplate/dialogTemplate/common/performanceDetailsTempV3.html";
                    if (!item.domainCooperationTimes || item.domainCooperationTimes <= 0) { return; }
                    if (fileName === "tradeArea") {
                        viewPath = 'htmlTemplate/dialogTemplate/common/cooperationDetailsTempV3.html';
                    }

                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    var promise = sogModal.openDialog(template, '合作详情', ["$scope", function ($cooperationModelScope) {
                        if (fileName === "tradeArea") {
                            $cooperationModelScope.cooperation = {
                                list: [],
                                supplierCode: item.code,
                                supplierCatagoryCode: item.tradeAreaCode,
                                pagination: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                }
                            };
                        } else {
                            $cooperationModelScope.cooperation = {
                                list: [],
                                supplierCode: item.code,
                                pagination: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                }
                            };
                        }

                        // 分页监控
                        $cooperationModelScope.$watch('cooperation.pagination.currentPage', function () {
                            getCooperationList();
                        });
                        // 请求数据
                        function getCooperationList() {
                            var coop = $cooperationModelScope.cooperation;
                            var params = {
                                supplierCode: coop.supplierCode,
                                supplierCatagoryCode: coop.supplierCatagoryCode,
                                pageIndex: coop.pagination.currentPage - 1,
                                pageSize: coop.pagination.itemsPerPage
                            };
                            wfWaiting.show();
                            $http.post(common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplieContactDetails/FindSupplieContactDetails", params)
                                .success(function (data) {
                                    $cooperationModelScope.cooperation.list = data.data;
                                    $cooperationModelScope.cooperation.pagination.totalItems = data.totalCount;
                                    wfWaiting.hide();
                                }).error(function (err) {
                                    sogModal.openAlertDialog("提示", err.message || "查询异常，请稍后重试！");
                                    wfWaiting.hide();
                                });
                        }

                    }], $modalScope, { containerStyle: { width: '70%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                };

                //查看行业领域入围次数
                $modalScope.openDomainShortListTimesModal = function (item) {
                    if (!item.domainShortListTimes || item.domainShortListTimes <= 0) { return; }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/domainShortListDetailsTempV3.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    var promise = sogModal.openDialog(template, '入围详情', ["$scope", function ($domainShortListScope) {
                        $domainShortListScope.domainShortList = {
                            list: [],
                            supplierCode: item.code,
                            supplierCatagoryCode: item.tradeAreaCode,
                            pagination: {
                                currentPage: 1,
                                itemsPerPage: 6,
                                totalItems: 0
                            }
                        };
                        // 分页监控
                        $domainShortListScope.$watch('domainShortList.pagination.currentPage', function () {
                            getDomainShortList();
                        });
                        // 请求数据
                        function getDomainShortList() {
                            var domain = $domainShortListScope.domainShortList;
                            var params = {
                                supplierCode: domain.supplierCode,
                                supplierCatagoryCode: domain.supplierCatagoryCode,
                                pageIndex: domain.pagination.currentPage - 1,
                                pageSize: domain.pagination.itemsPerPage
                            };
                            wfWaiting.show();
                            $http.post(common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplieShortListDetails/FindSupplieShortListDetails", params)
                                .success(function (data) {
                                    $domainShortListScope.domainShortList.list = data.data;
                                    $domainShortListScope.domainShortList.pagination.totalItems = data.totalCount;
                                    wfWaiting.hide();
                                }).error(function (err) {
                                    sogModal.openAlertDialog("提示", err.message || "查询异常，请稍后重试！");
                                    wfWaiting.hide();
                                });
                        }

                    }], $modalScope, { containerStyle: { width: '70%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                };

                $modalScope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                    urlFetchPurchaseForMonthNoncooperation: function (param) {
                        return common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/FetchPurchaseForMonthNoncooperation?r=' + Math.random();
                    },
                    fetchPurchaseForMonthNoncooperation: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $modalScope.api.urlFetchPurchaseForMonthNoncooperation(param),
                            data: param,
                        })
                            .success(function (data) { done(data); })
                            .error($modalScope.api.showErrorMessage);
                    },
                };

            }], undefined, undefined, undefined, undefined);// modal end
            return promise;
        }

        return {
            open: open
        };
    });// app.factory end
});
