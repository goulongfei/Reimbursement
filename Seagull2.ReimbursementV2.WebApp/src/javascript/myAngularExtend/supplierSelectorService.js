define([
    'app',
    'supplierProjectCityExtend',
    'supplierProjectExtend'
], function (app) {
    app.factory('supplierSelector', function ($http, $window, $filter, seagull2Url, wfWaiting, sogModal, configure) {
        /**
         * 全局变量
         */
        var common = {};
        configure.getConfig(common, 'common');

        /*
         * 校验 open 函数的参数
         * @param {Object} params 
         * */
        function checkParams(params) {
            if (!params || !angular.isObject(params)) {
                return '请传递参数';
            }
            var blackList = params.blackList;
            if (!angular.isArray(blackList)) {
                blackList = [];
            }
            // 校验 项目
            if (blackList.indexOf('projectCode') !== -1 && !params.projectCode) {
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
            if (blackList.indexOf('delegationAmount') !== -1 && (!params.delegationAmount || params.delegationAmount <= 0)) {
                return "请先填写直接委托金额，再添加供应商";
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
            var viewPath = 'htmlTemplate/dialogTemplate/common/supplierSelectorTemp.html';
            var promise = sogModal.openLayer('<div><div ng-include="\'' + viewPath + '\'"></div></div>', ['$scope', function ($modalScope) {

                // 供应商类别 StringArray
                $modalScope.supplierCatagoryList = angular.isArray(params.supplierCatagoryList) ? params.supplierCatagoryList : [];
                // 供应商等级列表
                $modalScope.supplierLevelList = [];
                // 供应商列表
                $modalScope.querySupplierList = [];
                // 选中的供应商
                $modalScope.selectedItem = null;
                //分页
                $modalScope.selectCommodityPaging = {
                    currentPage: 1,
                    itemsPerPage: 6,
                    totalItems: 0
                };
                // 查询条件
                $modalScope.codation = {
                    supplierCatagoryList: $modalScope.supplierCatagoryList,
                    disableSupplierCatagory: false,// 禁用供应商类别选择
                    supplierCatagoryNamesStr: "",// 所有供应商类别名称组成的字符串
                    supplierCatagoryCodeList: [],// 所有供应商类别Code组成的字符串
                    supplierName: params.supplierName || "",// 供应商名称 String
                    isMonopolyEditable: false,// 是否垄断条件能否选择
                    isMonopoly: null,// 是否垄断
                    isStrategyEditable: false,//是否战采条件能否选择
                    isStrategy: null,//是否战采
                    isTinyEditable: false,//是否小微条件能否选择
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
                if (params.projectCode !== null) {
                    $modalScope.codation.projectCodeList.push(params.projectCode);
                }
                if (params.reason === 1) {
                    $modalScope.codation.isMonopolyEditable = true;
                    $modalScope.codation.isMonopoly = true;
                }
                if (params.reason === 4) {
                    $modalScope.codation.isStrategy = true;
                    $modalScope.codation.isStrategyEditable = true;
                }
                $modalScope.baseInfo = {
                    //选择供应商类别
                    supplierTypeSelected: function () {
                        var tempUrl = './htmlTemplate/dialogTemplate/common/supplierCategory.html';
                        var supplierTypeDialogUrl = '<div style="height:75%;" ng-include="\'' + tempUrl + '\'"></div>';
                        var promise = sogModal.openDialog(supplierTypeDialogUrl, "选择行业领域", "supplierCategory_controller", $modalScope);
                        promise.then(function (result) {
                            //清空数据
                            $modalScope.codation.supplierCatagoryList = [];
                            angular.forEach(result, function (v) {
                                var obj = {
                                    industryDomainCode: v.id,
                                    industryDomainName: v.title
                                };
                                $modalScope.codation.supplierCatagoryList.push(obj);
                            });
                            $modalScope.baseInfo.supplierTypeInit();
                        });
                    },
                    supplierTypeInit: function () {
                        initSupplierCatagory(false);
                    },
                    //是否垄断变化
                    isMonopolyChange: function (val) {
                        $modalScope.codation.isMonopoly = val;
                    },
                    //是否战采变化
                    isStrategyChange: function (val) {
                        $modalScope.codation.isStrategy = val;
                    },
                    //是否小微变化
                    isTinyChange: function (val) {
                        $modalScope.codation.isTiny = val;
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
                        $modalScope.codation.supplierLevel = codes;
                    },
                    //合作城市信息
                    projectCityOpts: {
                        cityName: $modalScope.codation.cityName,
                        beforAppend: function (city) {
                            var codes = [];
                            for (var i = 0; i < city.length; i++) {
                                var item = city[i];
                                codes.push(item.code);
                            }
                            $modalScope.codation.cityCodelist = codes;
                        }
                    },
                    //合作项目信息
                    projectOpts: {
                        projectName: $modalScope.codation.projectName,
                        cityList: $modalScope.codation.cityList,
                        beforAppend: function (project) {
                            var codes = [];
                            for (var i = 0; i < project.length; i++) {
                                var item = project[i];
                                codes.push(item.code);
                            }
                            $modalScope.codation.cooperateProjectCodeList = codes;

                        }
                    }
                };
                //加载城市信息
                var getCityListUrl = seagull2Url.getPlatformUrlBase() + '/ProjectInfo/GetProjectCitys';
                $http.get(getCityListUrl)
                    .success(function (data) {
                        $modalScope.codation.cityList = data;
                        $modalScope.baseInfo.projectOpts.cityList = data;
                    }).error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "查询城市数据异常");
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
                // 处理供应商类别名称和Code
                var initSupplierCatagory = function (isTrue) {
                    var names = [];
                    var codes = [];
                    var len = $modalScope.codation.supplierCatagoryList.length;
                    if (len > 0) {
                        if (isTrue) {
                            $modalScope.codation.disableSupplierCatagory = true;
                        }
                        for (var i = 0; i < len; i++) {
                            names.push($modalScope.codation.supplierCatagoryList[i].industryDomainName);
                            codes.push($modalScope.codation.supplierCatagoryList[i].industryDomainCode);
                        }
                        if (names.length > 0) {
                            $modalScope.codation.supplierCatagoryNamesStr = names.join(",");
                        }
                        if (codes.length > 0) {
                            $modalScope.codation.supplierCatagoryCodeList = codes;
                        }
                    }
                };
                initSupplierCatagory(true);
                // 选择供应商
                $modalScope.selectItem = function (item) {
                    $modalScope.selectedItem = item;
                };
                // 搜索
                $modalScope.search = function (isClick) {
                    wfWaiting.show();
                    if (isClick) {
                        $modalScope.selectedItem = null; // 换页删除之前选中的供应商
                        $modalScope.selectCommodityPaging.currentPage = 1;
                    }
                    if ($modalScope.codation.enterStartTime !== null) {
                        $modalScope.codation.enterStartTime = $filter('date')($modalScope.codation.enterStartTime, 'yyyy-MM-dd');
                    }
                    if ($modalScope.codation.enterEndTime !== null) {
                        $modalScope.codation.enterEndTime = $filter('date')($modalScope.codation.enterEndTime, 'yyyy-MM-dd');
                    }
                    if ($modalScope.codation.cooperationStartTime !== null) {
                        $modalScope.codation.cooperationStartTime = $filter('date')($modalScope.codation.cooperationStartTime, 'yyyy-MM-dd');
                    }
                    if ($modalScope.codation.cooperationEndTime !== null) {
                        $modalScope.codation.cooperationEndTime = $filter('date')($modalScope.codation.cooperationEndTime, 'yyyy-MM-dd');
                    }
                    initSupplierCatagory(false);
                    var url = common.apiUrlBase + "/THRWebApi/SupplierV2/SearchSupplier/FecthSupplierList";
                    var params = {
                        pageIndex: $modalScope.selectCommodityPaging.currentPage - 1,
                        pageSize: $modalScope.selectCommodityPaging.itemsPerPage,
                        SupplierCatagoryCodeArray: $modalScope.codation.supplierCatagoryCodeList,
                        SupplierName: $modalScope.codation.supplierName,
                        SupplierCityCodeArray: $modalScope.codation.cityCodelist,
                        StorageBeginDate: $modalScope.codation.enterStartTime,
                        StorageEndDate: $modalScope.codation.enterEndTime,
                        CooperateBeginDate: $modalScope.codation.cooperationStartTime,
                        CooperateEndDate: $modalScope.codation.cooperationEndTime,
                        ProjectCodeArray: $modalScope.codation.projectCodeList,
                        CooperateProjectCodeArray: $modalScope.codation.cooperateProjectCodeList,
                        IsMonopoly: $modalScope.codation.isMonopoly,
                        IsStrategy: $modalScope.codation.isStrategy,
                        IsTiny: $modalScope.codation.isTiny,
                        SupplierLevelArray: $modalScope.codation.supplierLevel,
                        OrderByName: $modalScope.codation.filedName,
                        IsDesc: $modalScope.codation.isDesc,
                        IsDirectCommissioned: false,

                    };
                    //获取供应商信息
                    $http.post(url, params)
                        .success(function (data) {
                            wfWaiting.hide();
                            $modalScope.querySupplierList = data;
                            $modalScope.selectCommodityPaging.totalItems = data.totalCount;
                        })
                        .error(function (err) {
                            wfWaiting.hide();
                            sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                        });
                };

                //监听ViewModel页数的变化更新ViewModel的数据
                $modalScope.$watch('selectCommodityPaging.currentPage', function () {
                    $modalScope.search();
                });

                //排序
                $modalScope.sort = function (filedName, isDesc) {
                    $modalScope.codation.filedName = filedName;
                    $modalScope.codation.isDesc = isDesc;
                    $modalScope.search(true);
                };
                //查询条件重置
                $modalScope.ResetSearchConditions = function () {
                    $modalScope.codation.supplierName = "";
                    for (var i = 0; i < $modalScope.supplierLevelList.length; i++) {
                        var item = $modalScope.supplierLevelList[i];
                        if (item.checked) {
                            item.checked = false;
                        }
                    }
                    if (!$modalScope.codation.disableSupplierCatagory) {
                        $modalScope.codation.supplierCatagoryList = [];
                        $modalScope.codation.supplierCatagoryNamesStr = "";
                        $modalScope.codation.supplierCatagoryCodeList = [];
                    }
                    if ($modalScope.codation.isMonopolyEditable) {
                        $modalScope.codation.isMonopoly = null;
                    }
                    if ($modalScope.codation.isStrategyEditable) {
                        $modalScope.codation.isStrategy = null;
                    }
                    if ($modalScope.codation.isTinyEditable) {
                        $modalScope.codation.isTiny = null;
                    }
                    $modalScope.codation.enterStartTime = null;
                    $modalScope.codation.enterEndTime = null;
                    $modalScope.codation.cooperationStartTime = null;
                    $modalScope.codation.cooperationEndTime = null;
                    $modalScope.codation.supplierLevel = [];
                    $modalScope.codation.cityCodelist = [];
                    $modalScope.codation.cooperateProjectCodeList = [];
                    document.getElementById("enterStartTime").value = null;
                    document.getElementById("enterEndTime").value = null;
                    document.getElementById("cooperationStartTime").value = null;
                    document.getElementById("cooperationEndTime").value = null;
                    document.getElementById("inputProjectCityName").value = "";
                    document.getElementById("inputProjectName").value = "";
                };

                //确定操作，返回选中数据
                $modalScope.confirmHandler = function (itemIndex) {
                    var supplier = null;
                    var selectedItem = $modalScope.selectedItem;
                    if (!selectedItem) {
                        sogModal.openAlertDialog("提示", "请选择供应商");
                        return;
                    }
                    if (["4", "5", "7"].indexOf(selectedItem.tradeAreaLevel) !== -1) {
                        sogModal.openAlertDialog("提示", "不能选择供应商等级为" + selectedItem.tradeAreaLevelName + "的供应商");
                        return;
                    }
                    supplier = {
                        supplierCode: selectedItem.code,
                        supplierName: selectedItem.supplierName,
                        industryDomainCode: selectedItem.tradeAreaCode,
                        industryDomainName: selectedItem.tradeArea,
                        industryDomainLevelCode: selectedItem.tradeAreaLevel,
                        industryDomainLevelName: selectedItem.tradeAreaLevelName,
                        qualificationLevelNames: selectedItem.qualificationLevelName,
                        isTiny: selectedItem.isTiny,
                        registCapital: selectedItem.registCapital
                    };
                    $modalScope.confirm(supplier);
                };

                //查看供应商入库及考察审批完成页面
                $modalScope.findInspectionConclusion = function (code) {
                    wfWaiting.show();
                    var url = common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/GetFinishInspectionUrl";
                    url += "?SupplierCode=" + code + "&random=" + Math.random();
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


            }], undefined, undefined, undefined, undefined);// modal end
            return promise;
        }

        return {
            open: open
        };
    });// app.factory end
});


