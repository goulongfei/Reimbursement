define(
    [
        'app',
        'javascript/controllers/enterpriseCheck/judicialDetail-controller.js'
    ],
    function (app) {
        app.controller('monitoringReportDetail_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", '$compile', '$timeout',
            function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $compile, $timeout) {

                $scope.selectCollection = [{ code: 4, name: '全部变动' }, { code: 1, name: '司法诉讼全部' }, { code: 2, name: '工商信息全部' }, { code: 3, name: '经营风险全部' }];
                $scope.conitoringChange = 4;
                $scope.judicialLitigation = [];
                $scope.startTime = new Date(new Date(new Date().getTime() - 7 * 1000 * 24 * 3600));
                $scope.endTime = new Date(new Date(new Date()).getTime() + 24 * 60 * 60 * 1000 - 1);
                $scope.commerceQuantity = $scope.judicialQuantity = $scope.riskQuantity = 0;

                //分页设置
                $scope.paginationConf = {
                    currentPage: 1,
                    itemsPerPage: 10
                }

                //初始化数据源
                $scope.getInfor = function (code, status) {
                    var timeSpan = null;
                    var token = null;
                    var url = seagull2Url.getPlatformUrlBase() + '/Beneficiary/MonitoringDetails';
                    var body = {
                        Timespan: timeSpan,
                        CompanyName: $stateParams.companyNames,
                        Token: token,
                        PageIndex: 1,
                        PageSize: 10,
                        code: code,
                        load: status,
                        keyNo: $stateParams.keyNo//公司内部关联主键KeyNo
                    };
                    $scope.paginationConf.currentPage = 1;
                    wfWaiting.show();
                    $http.post(url, body).success(function (data) {
                        wfWaiting.hide();
                        if (status) {
                            $scope.commerceQuantity = data.commerceQuantity;
                            $scope.judicialQuantity = data.judicialQuantity;
                            $scope.riskQuantity = data.riskQuantity;
                            $scope.initArray_old = data.list.sort(function (a, b) {
                                return new Date(b.time) - new Date(a.time);
                            });
                        } else {
                            if (code == 4) {
                                $scope.commerceQuantity = data.commerceQuantity;
                                $scope.judicialQuantity = data.judicialQuantity;
                                $scope.riskQuantity = data.riskQuantity;
                                $scope.initArray_old = data.list.sort(function (a, b) {
                                    return new Date(b.time) - new Date(a.time);
                                });
                            } else {
                                $scope.initArray_old = data.sort(function (a, b) {
                                    return new Date(b.time) - new Date(a.time);
                                });
                            }

                        }
                        $scope.selectArray($scope.startTime, $scope.endTime)
                    }).error(function (data) {
                        console.log(data);
                    });
                }

                //对时间进行筛选
                $scope.selectArray = function (startTime, endTime) {
                    var arr = [];
                    angular.forEach($scope.initArray_old, function (v) {
                        if (v.endTime) {
                            if ((new Date(v.time) >= startTime && new Date(v.time) <= endTime) || (new Date(v.endTime) >= startTime && new Date(v.endTime) <= endTime)) arr.push(v)
                        } else {
                            if (new Date(v.time) >= startTime && new Date(v.time) <= endTime) arr.push(v)
                        }

                    })
                    $scope.initArray = arr;
                    $scope.judicialLitigation = $scope.initArray.slice(0, 10);
                    $scope.paginationConf.totalItems = $scope.initArray.length;
                }

                //时间控制
                $scope.getQueryInfor = function () {
                    $scope.startTime = $scope.startTime;
                    $scope.endTime = $scope.endTime;
                    var addr = "./views/enterpriseCheck/judicialDetail.html";
                    var template = '<div ng-include="\'' + addr + '\'" ></div>';
                    var promise = sogModal.openDialog(template, "时间设置", 'judicialDetail_controller', $scope, { startTime: $scope.startTime, endTime: $scope.endTime });
                    promise.then(function (obj) {
                        $scope.startTime = obj.startTime;
                        $scope.endTime = obj.endTime;
                        $scope.paginationConf.currentPage = 1;
                        $scope.selectArray($scope.startTime, $scope.endTime)
                    })
                };

                //初始化数据
                $scope.getInfor(4, true);


                //分页监控
                $scope.$watch("paginationConf.currentPage", function (newVal, oldVal) {
                    if (oldVal == newVal) return;
                    var i = newVal - 1;
                    $scope.judicialLitigation = $scope.initArray.slice(i * 10, (i + 1) * 10);

                });

            }])
    })
