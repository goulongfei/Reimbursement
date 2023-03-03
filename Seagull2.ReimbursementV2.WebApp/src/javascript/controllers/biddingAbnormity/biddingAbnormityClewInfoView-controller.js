define(['app'], function (app) {
    app.controller('biddingAbnormityClewInfoView_controller', function ($scope, $location, wfWaiting, sogModal, $http, seagull2Url, sogOguType, configure, $window) {
        // 设置 
        $scope.settings = {
            // 日期控件选项
            dateOpts: {
                format: 'yyyy-mm-dd',
                selectYears: true
            },
            //单选人员
            peopleSelect: {
                selectMask: sogOguType.User,
                multiple: false
            },
            defaultModel: "ip",
            //ip分页配置
            paginationIP: {
                currentPage: 1,
                itemsPerPage: 10,
                pagesLength: 7,
                totalItems: 0
            },
            //人员信息分页配置
            paginationPersonalInfo: {
                currentPage: 1,
                itemsPerPage: 10,
                pagesLength: 7,
                totalItems: 0
            }
        }

        //页面对象
        $scope.viewModel = {
            // ip model
            ipModel: {
                clowTime: null,
                creator: null,
                purchaseName: "",
                dataTaskList: [],
                isLoaded: false
            },
            //人员信息model
            personalInfoModel: {
                clowTime: null,
                creator: null,
                purchaseName: "",
                dataTaskList: [],
                isLoaded: false
            },
            hasPermission: false
        }

        $scope.baseFn = {
            //导航切换
            refresh: function (type) {
                if (type == "ip") {
                    $scope.settings.defaultModel = "ip";
                } else if (type == "personalInfo") {
                    $scope.settings.defaultModel = "personalInfo";
                }
            },
            //ip信息查询按钮
            ipSearch: function (parmModel) {
                $scope.settings.paginationIP.currentPage = 1;
                var queryCondition = {
                    abnormityTime: $scope.apiHelper.dateToString(parmModel.clowTime),
                    draftUserID: parmModel.creator == null ? null : parmModel.creator.id,
                    purchaseName: parmModel.purchaseName == "" ? null : parmModel.purchaseName,
                    pageIndex: $scope.settings.paginationIP.currentPage,
                    pageSize: $scope.settings.paginationIP.itemsPerPage,
                }
                $scope.apiHelper.ipSearchLoading(queryCondition);
            },
            ipReset: function () {
                $scope.viewModel.ipModel = {
                    clowTime: null,
                    creator: null,
                    purhcaseName: "",
                    dataTaskList: []
                }
            },
            //人员信息查询按钮
            personalInfoSearch: function (parmModel) {
                $scope.settings.paginationPersonalInfo.currentPage = 1;
                var queryCondition = {
                    abnormityTime: $scope.apiHelper.dateToString(parmModel.clowTime),
                    draftUserID: parmModel.creator == null ? null : parmModel.creator.id,
                    purchaseName: parmModel.purchaseName == "" ? null : parmModel.purchaseName,
                    pageIndex: $scope.settings.paginationPersonalInfo.currentPage,
                    pageSize: $scope.settings.paginationPersonalInfo.itemsPerPage,
                }
                $scope.apiHelper.PersonalInfoSearchLoading(queryCondition);
            },
            personalInfoReset: function () {
                $scope.viewModel.personalInfoModel = {
                    clowTime: null,
                    creator: null,
                    purhcaseName: "",
                    dataTaskList: []
                }
            },
            //数据导出
            ipDataExport: function (parmModel) {
                if (!$scope.viewModel.hasPermission) {
                    sogModal.openAlertDialog("提示", "您没有权限导出异常数据报表！");
                    return;
                }

                var queryCondition = {
                    reportType: "IPAbnormity",
                    abnormityTime: parmModel.clowTime == null ? null : $scope.apiHelper.dateToString(parmModel.clowTime),
                    draftUserID: parmModel.creator == null ? null : parmModel.creator.id,
                    purchaseName: parmModel.purchaseName == "" ? null : parmModel.purchaseName,
                }
                $scope.apiHelper.exportReport(queryCondition);
            },
            personalInfoDataExport: function (parmModel) {
                var queryCondition = {
                    reportType: "PersonalInfoAbnormity",
                    abnormityTime: parmModel.clowTime == null ? null : $scope.apiHelper.dateToString(parmModel.clowTime),
                    draftUserID: parmModel.creator == null ? null : parmModel.creator.id,
                    purchaseName: parmModel.purchaseName == "" ? null : parmModel.purchaseName,
                }
                $scope.apiHelper.exportReport(queryCondition);
            },
            //供应商ip详情信息查看
            lookIpDataDetail: function (item) {
                var viewPath = 'htmlTemplate/dialogTemplate/biddingAbnormity/lookBiddingIPInfo.html';
                var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                    promise = sogModal.openDialog(template, '查看操作IP', ["$scope", function ($modelScope) {
                        $modelScope.model = {
                            purchaseName: item.purchaseName,
                            ipDataList: [],
                            isLoaded: false,
                            queryCondition: {
                                resourceID: item.resourceID,
                                pageSize: 8,
                                pageIndex: 1
                            },
                            paginationConf: {
                                currentPage: 1,
                                itemsPerPage: 8,
                                totalItems: 0
                            },
                            loadData: function (pageIndex) {
                                wfWaiting.show();
                                var that = $modelScope.model;
                                that.queryCondition.pageIndex = pageIndex;
                                var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/LookingUpBiddingDetailIpData");
                                $http.post(url, that.queryCondition)
                                    .success(function (data) {
                                        that.paginationConf.totalItems = data.totalItems;
                                        that.ipDataList = data.biddingDetailIpDataList;
                                        that.isLoaded = true;
                                        wfWaiting.hide();
                                    }).error(function (data, status) {
                                        wfWaiting.hide();
                                        sogModal.openAlertDialog("查询数据异常", data);
                                    });
                            },
                        };
                        $modelScope.model.loadData(1);
                        //分页监控
                        $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                            if ($modelScope.model.isLoaded === true && newVal !== oldVal) {
                                $modelScope.model.loadData(newVal);
                            }
                        });
                    }], $scope, { containerStyle: { width: '50%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });


            },
        }

        $scope.checkPermission = function () {
            var command = {
                permissionValue: "biddingAbnormityClewInfo",
                permissionName: "招标异常明细表"
            };
            var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
            wfWaiting.show();
            $http.post(url, command)
                .success(function (data) {
                    if (data.success) {
                        $scope.viewModel.hasPermission = data.data;
                        wfWaiting.hide();
                    } else {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("查询数据异常", data.message);
                    }
                }).error(function (data, status) {
                    wfWaiting.hide();
                    sogModal.openAlertDialog("查询数据异常", data.message);
                });
        }

        $scope.checkPermission();


        $scope.apiHelper = {
            exportReport: function (queryCondition) {
                var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/ExportReport") + "?reportType=" + queryCondition.reportType + "&abnormityTime=" + queryCondition.abnormityTime + "&draftUserID=" + queryCondition.draftUserID + "&purchaseName=" + queryCondition.purchaseName + "&random=" + Math.random();
                window.open(url);

            },
            ipSearchLoading: function (queryCondition) {
                if (!$scope.viewModel.hasPermission) {
                    sogModal.openAlertDialog("提示", "您没有权限查看投标IP异常数据报表！");
                    return;
                }

                var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/LoadBiddingIPAbnormityTask");
                wfWaiting.show();
                $http.post(url, queryCondition)
                    .success(function (data) {
                        $scope.settings.paginationIP.totalItems = data.totalItems;
                        $scope.viewModel.ipModel.dataTaskList = data.abnormityClewList;
                        $scope.viewModel.ipModel.isLoaded = true;
                        wfWaiting.hide();
                    }).error(function (data, status) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("查询数据异常", data.message);
                    });

            },
            PersonalInfoSearchLoading: function (queryCondition) {
                if (!$scope.viewModel.hasPermission) {
                    sogModal.openAlertDialog("提示", "您没有权限查看投标人员异常数据报表！");
                    return;
                }
                var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/LoadBiddingPersonalInfoAbnormityTask");
                wfWaiting.show();
                $http.post(url, queryCondition)
                    .success(function (data) {
                        $scope.settings.paginationPersonalInfo.totalItems = data.totalItems;
                        $scope.viewModel.personalInfoModel.dataTaskList = data.abnormityClewList;
                        $scope.viewModel.personalInfoModel.isLoaded = true;
                        wfWaiting.hide();
                    }).error(function (data, status) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("查询数据异常", data.message);
                    });

            },
            openAuthorityUrl: function (baseUrl) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                var url = seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime());
                wfWaiting.show();
                $http.post(url)
                    .success(function (urlat) {
                        wfWaiting.hide();
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = $scope.common.webUrlBase + baseUrl;
                            if (url.indexOf("?") == -1) {
                                url = url + "?_at=" + urlat;
                            } else {
                                url = url + "&_at=" + urlat;
                            }
                            $window.open(url, '_blank');
                        }
                    }).error(function (data, status) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("查询数据异常", data);
                    });
            },

            //时间日期转换成string
            dateToString: function (date) {
                if (date == null)
                    return null;
                var year = date.getFullYear();
                var month = (date.getMonth() + 1).toString();
                var day = (date.getDate()).toString();
                if (month.length == 1) {
                    month = "0" + month;
                }
                if (day.length == 1) {
                    day = "0" + day;
                }
                var dateTime = year + "-" + month + "-" + day;
                return dateTime;
            }
        }

        $scope.$watch('settings.paginationIP.currentPage', function (newVal, oldVal) {
            if ($scope.viewModel.ipModel.isLoaded === true && newVal !== oldVal) {
                var queryCondition = {
                    abnormityTime: $scope.apiHelper.dateToString($scope.viewModel.ipModel.clowTime),
                    draftUserID: $scope.viewModel.ipModel.creator == null ? null : $scope.viewModel.ipModel.creator.id,
                    purchaseName: $scope.viewModel.ipModel.purchaseName == "" ? null : $scope.viewModel.ipModel.purchaseName,
                    pageIndex: $scope.settings.paginationIP.currentPage,
                    pageSize: $scope.settings.paginationIP.itemsPerPage,
                }
                $scope.apiHelper.ipSearchLoading(queryCondition);
            }
        });

        $scope.$watch('settings.paginationPersonalInfo.currentPage', function (newVal, oldVal) {
            if ($scope.viewModel.personalInfoModel.isLoaded === true && newVal !== oldVal) {
                var queryCondition = {
                    abnormityTime: $scope.apiHelper.dateToString($scope.viewModel.personalInfoModel.clowTime),
                    draftUserID: $scope.viewModel.personalInfoModel.creator == null ? null : $scope.viewModel.personalInfoModel.creator.id,
                    purchaseName: $scope.viewModel.personalInfoModel.purchaseName == "" ? null : $scope.viewModel.personalInfoModel.purchaseName,
                    pageIndex: $scope.settings.paginationPersonalInfo.currentPage,
                    pageSize: $scope.settings.paginationPersonalInfo.itemsPerPage,
                }
                $scope.apiHelper.PersonalInfoSearchLoading(queryCondition);
            }
        });
    });
});

