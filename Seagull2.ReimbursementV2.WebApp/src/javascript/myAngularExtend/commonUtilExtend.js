define([
    'angular',
    'app'
], function (angular, app) {

    //查看更多供应商信息
    app.directive("openExtraLink", function () {
        return {
            restrict: "A",
            scope: {
                extraLink: "=",
                extraName: "=",
            },
            template: "<span><a style='color:blue' ng-click='checkDetail()'>{{extraName}}</a></span>",
            replace: true,
            controller: ["$scope", "sogModal", "seagull2Url", "$http", "$window", function ($scope, sogModal, seagull2Url, $http, $window) {
                //票据
                $scope.checkDetail = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            var url = $scope.extraLink;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                            }
                            $window.open((url));
                        })
                        .error(function () {
                        });
                };
            }],
            link: function ($scope, element, attrs) {
            }
        }
    });

     //查看广联达页面
    app.directive("openGlodonLink", function () {
        return {
            restrict: "A",
            scope: {
                opt: "=",
            },
            template: "<span><a style='color:blue' ng-click='checkDetail()'>{{opt.extraName}}</a></span>",
            replace: true,
            controller: ["$scope", "wfWaiting", "seagull2Url", "$http", "$window", "configure", function ($scope, wfWaiting, seagull2Url, $http, $window, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.checkDetail = function () {
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl("/GlodonServe/GetTicket") + "?account=null&type=1", { cache: false })
                        .success(function (data) {
                            wfWaiting.hide();
                            dataForm = data.replace(/"/g, "");
                            var url = "";
                            //打开清单计价文件-编辑
                            if ($scope.opt.type == 1) {
                                url = $scope.common.glodonBase + "/webbq/#/login?op=edit&fileId=" + $scope.opt.id + "&ticket=" + dataForm;
                            }
                            //打开清单计价文件-查看
                            else if ($scope.opt.type == 2) {
                                url = $scope.common.glodonBase + "/webbq/#/login?op=view&fileId=" + $scope.opt.id + "&ticket=" + dataForm;
                            }
                            //进入清标分析项目
                            else if ($scope.opt.type == 3) {
                                url = $scope.common.glodonBase + "/analyze/#/login?ticket=" + dataForm + "&analyzeID=" + $scope.opt.id;
                            }
                            //跳转到清标分析首页
                            else if ($scope.opt.type == 4) {
                                url = $scope.common.glodonBase + "/?ticket=" + dataForm + "&module=BJFXGL";
                            }
                            if(url != "")
                                $window.open(url, '_blank');
                        });
                };
            }],
            link: function ($scope, element, attrs) {
            }
        }
    });

    //日期控件
    app.directive("myCalendar", function () {
        return {
            restrict: "AE",
            scope: {
                myDate: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/myCalendar.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure) {
                if ($scope.myDate == "1901-01-01T00:00:00+08:00" || $scope.myDate == "0001-01-01T00:00:00") {
                    $scope.myDate = undefined;
                }
            }],
            link: function ($scope, element, attrs) {
            }
        }
    });

    //查看供应商信息
    app.directive("openSupplierInfo", function () {
        return {
            restrict: "AE",
            scope: {
                supplier: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/openSupplierInfo.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');

                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }
            }],
            link: function ($scope, element, attrs) {
            }
        }
    });

    //右侧知识文档导航
    app.directive("rightDocs", function () {
        return {
            restrict: "AE",
            scope: {
                type: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/rightDocs.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure) {
                //工程类采购类流程培训-type == '1'
                $scope.relativeLinksEngineering = [
                    {
                        name: '工程类采购类流程培训',
                        category: 'TrainingMaterials',
                        url: 'http://km.sinooceangroup.com/sites/ServiceBiz/Service15/_layouts/15/WopiFrame.aspx?sourcedoc=/sites/ServiceBiz/Service15/DocLib1/1/%E9%87%87%E8%B4%AD%E7%AE%A1%E7%90%86/%E5%B7%A5%E7%A8%8B%E9%87%87%E8%B4%AD%E7%B1%BB%E6%96%B9%E5%BC%8F%E5%9F%B9%E8%AE%AD%E6%9D%90%E6%96%99-20210518.pptx&action=default'
                    }
                ];
            }],
            link: function ($scope, element, attrs) {
            }
        }
    });

    app.factory("rcTools", function () {
        return {
            trim: function (str) {
                return str.replace(/(^\s*)|(\s*$)/gm, '');
            },

            SpecialCharValidate: function (name, value, modelStateDictionary) {
                var pattern = /[\/.?:*"<>|\\]+/;
                if (value != null && value != '' && pattern.test(value)) {
                    modelStateDictionary.addModelError(name, name + "不能包含特殊字符[\/.?:*\"<>|\\]！");
                }
            },

            getPage: function (resource, pageIndex, pageSize) {
                var start = (pageIndex - 1) * pageSize,
                    end = pageIndex * pageSize;
                return resource.slice(start, end);
            },
            //四舍五入运算
            toFixedNum: function (num, fractionDigits) {
                //num 要处理的数字，fractionDigits 保留小数位的个数。 这个方法处理失败返回原数字
                var isMinus = false;
                if (num < 0) {
                    isMinus = true;
                    num = Math.abs(num);
                }
                var result = parseFloat((parseInt((num * Math.pow(10, fractionDigits + 1) + 5) / 10) / Math.pow(10, fractionDigits)).toString());
                if (isMinus) {
                    result = -result;
                }
                return isNaN(result) ? num : result;
            },
            getParams: function (url) {
                var queryStr = url.substr(1);
                var params = queryStr.length > 0 ? queryStr.split("&") : [];
                var urlParam = {};
                if ((typeof url).toLowerCase() != "string" || url.length === 0 || queryStr.length === 0) {
                    return {};
                }
                angular.forEach(params, function (item) {
                    var items = item.split("=");
                    urlParam[items[0]] = items[1];
                });
                return urlParam;
            },
            //阿拉伯数字转换大写（123转换为一百二十三）
            numberToChinese: function (number) {
                /*单位*/
                var units = '个十百千万@#%亿^&~';
                /*字符 */
                var chars = '零一二三四五六七八九';
                var a = (number + '').split(''), s = [];
                if (a.length > 12) {
                    throw new Error('too big');
                } else {
                    for (var i = 0, j = a.length - 1; i <= j; i++) {
                        if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*
                            if (i == 0) {
                                if (a[i] != '1') s.push(chars.charAt(a[i]));
                            } else {
                                s.push(chars.charAt(a[i]));
                            }
                        } else {
                            s.push(chars.charAt(a[i]));
                        }
                        if (i != j) {
                            s.push(units.charAt(j - i));
                        }
                    }
                }
                //return s;
                return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等
                    b = units.indexOf(d);
                    if (b != -1) {
                        if (d == '亿') return d;
                        if (d == '万') return d;
                        if (a[j - b] == '0') return '零'
                    }
                    return '';
                }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
                    return b;
                }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
                    return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
                }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
                    c = units.indexOf(d);
                    if (c != -1) {
                        if (a[j - c] == '0') return d + '零' + b
                    }
                    return m;
                });
            },
            setOptions: function (data, activityName, hideNumber) {
                //data:$scope
                //activityName:审批需要退回的节点名称（例如：编制招标信息）
                //hideNumber:需要隐藏第几条线（线优先级的值0，1，2），不需要隐藏传-1
                //更改当前节点审批意见名称及隐藏不需要的线
                if (data != null && data.opinionOpts != null && data.opinionOpts.options != null && data.opinionOpts.options.length > 0) {
                    for (var i = 0; i < data.opinionOpts.options.length; i++) {
                        if (data.opinionOpts.options[i].activityId == data.currentActivityId) {
                            if (data.opinionOpts.options[i].nextStepCollection != null && data.opinionOpts.options[i].nextStepCollection.length > 0) {
                                for (var j = data.opinionOpts.options[i].nextStepCollection.length - 1; j >= 0; j--) {
                                    if (data.opinionOpts.options[i].nextStepCollection[j].name.indexOf("不同意") != -1) {
                                        data.opinionOpts.options[i].nextStepCollection[j].name = "不同意，退回到" + activityName + "环节";
                                    }
                                    if (hideNumber != -1 && data.opinionOpts.options[i].nextStepCollection.length >= 3 && hideNumber == j) {
                                        data.opinionOpts.options[i].nextStepCollection.splice(j, 1);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            },
            setOptionsForOnly: function (data, activityName, hideNumber) {
                //就集中采购直接委托一个特殊的用
                //data:$scope
                //activityName:审批需要退回的节点名称（例如：编制招标信息）
                //hideNumber:需要隐藏第几条线（线优先级的值0，1，2），不需要隐藏传-1
                //更改当前节点审批意见名称及隐藏不需要的线
                if (data != null && data.opinionOpts != null && data.opinionOpts.options != null && data.opinionOpts.options.length > 0) {
                    for (var i = 0; i < data.opinionOpts.options.length; i++) {
                        if (data.opinionOpts.options[i].realActivityId == data.currentActivityId) {
                            if (data.opinionOpts.options[i].nextStepCollection != null && data.opinionOpts.options[i].nextStepCollection.length > 0) {
                                for (var j = data.opinionOpts.options[i].nextStepCollection.length - 1; j >= 0; j--) {
                                    if (data.opinionOpts.options[i].nextStepCollection[j].name.indexOf("不同意") != -1) {
                                        data.opinionOpts.options[i].nextStepCollection[j].name = "不同意，并退回到" + activityName + "环节";
                                    }
                                    if (hideNumber != -1 && data.opinionOpts.options[i].nextStepCollection.length >= 3 && hideNumber == j) {
                                        data.opinionOpts.options[i].nextStepCollection.splice(j, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            setOpinionOpts: function (data) {
                // 设置审批栏权限
                angular.forEach(data, function (item) {
                    item.allowToBeAppended = false;
                    item.allowToBeDeleted = false;
                    item.allowToBeModified = false;
                });
            },
            setProcessNavigator: function (data) {

                // 设置流程导航显示问题 
                if (angular.isArray(data.activities)) {
                    var activity = 0;
                    for (var i = 0; i < data.activities.length; i++) {
                        if (data.activities[i].status === 1 || data.activities[i].status === 2) {
                            activity = i;
                        }
                    }
                    for (var i = 0; i < data.activities.length; i++) {
                        if (data.activities[i].status === 0
                            && i < activity) {
                            data.activities[i].status = 3;
                        }
                    }
                }
                if (data.parent != null && angular.isArray(data.parent.activities)) {
                    var activity = 0;
                    for (var i = 0; i < data.parent.activities.length; i++) {
                        if (data.parent.activities[i].status === 1 || data.parent.activities[i].status === 2) {
                            activity = i;
                        }
                    }
                    for (var i = 0; i < data.parent.activities.length; i++) {
                        if (data.parent.activities[i].status === 0
                            && i < activity) {
                            data.parent.activities[i].status = 3;
                        }
                    }
                }
            },
        };
    });

    //本地存储服务
    app.factory('locals', ['$window', function ($window) {
        return {        //存储单个属性
            set: function (key, value) {
                $window.localStorage[key] = value;
            },        //读取单个属性
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },        //存储对象，以JSON格式存储
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
            },        //读取对象
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
            },
            removeItem: function (key) {
                $window.localStorage.removeItem(key);
            },
            clear: function () {
                $window.localStorage.clear();
            },
            setItem: function (key, value) {
                $window.localStorage.setItem(key, value);
            }
        }
    }]);
});