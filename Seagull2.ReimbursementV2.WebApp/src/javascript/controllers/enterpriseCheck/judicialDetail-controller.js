define(["app"], function (app) {
    app.controller('judicialDetail_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", '$compile','$filter','$timeout',
        function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $compile, $filter, $timeout) {
            $scope.TendTime = $scope.endTime;
            $scope.init = function () {

               
                $scope.data={
                    result:{
                        breakThroughList:[
                            { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞机啊送打飞机啊是频道发就是的批发价而且我而将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞机啊送打是频道发就是的批发价而且我而将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞机啊送打飞机啊而且我而将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞机啊送打飞机将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞是频道发就是的批发价而且我而将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞道发就是的批发价而且我而将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞机啊送打发价而且我而将其我二姐去我耳机', changeDate: new Date() },
                             { companyName: '小米科技有限公司', riskLevel: 1, riskTypes: 1, content: '打飞机啊送打飞机啊是而且我而将其我二姐去我耳机', changeDate: new Date() }
                        ]
                    }
                }
                var str = '', arr = $scope.data.result.breakThroughList;
                for (var i = 0; i < arr.length; i++) {
                    var riskLevel = '警示信息', riskType = '裁判文书';
                    if (arr[i].riskLevel == 2) riskLevel = '高风险信息';
                    if (arr[i].riskLevel == 3) riskLevel = '良好信息';
                    if (arr[i].riskLevel == 4) riskLevel = '提示信息';
                    if (arr[i].riskTypes == 2) riskType = '开庭公告';
                    str += '<tr><td>' + (i + 1) + "</td><td>" +arr[i].companyName + "</td><td>" + riskLevel + "</td><td>" + riskType + "</td><td>" + arr[i].content + "</td><td>" + $filter('date')(arr[i].changeDate, 'yyyy-MM-dd') + "</td></tr>";
                }
                var ele = $compile(str)($scope);
                $timeout(function () {
                    $("#talbe-list").html(str);
                }, 500)

            }
            // $scope.init();
            $scope.isTime = true;
            $scope.setTime = function (str) {
                var startTime = endTime = new Date();
                switch (str) {
                    case 'today': startTime = new Date();
                                  break;
                    case 'week':  startTime=new Date(new Date().getTime() - 7 * 1000 * 24 * 3600);
                                  break;
                    case 'month':  startTime = new Date(endTime.setMonth(endTime.getMonth() - 1));
                                    break;
                    case 'months':  startTime = new Date(endTime.setMonth(endTime.getMonth() - 3));
                                    break;
                    case 'year':  startTime =  new Date(endTime.setFullYear(endTime.getFullYear() - 1));
                                    break;
                    default: startTime = new Date(endTime.setMonth(endTime.getMonth() -6));
                                    break;
                }
               $scope.startTime = new Date(startTime);
               $scope.TendTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 - 1);
                $scope.isTime = false;
                $timeout(function () {
                    $scope.isTime = true;
                }, 100)
                //$('#time').empty();
                //var date = new Date();
                //var str=''
                //var time = $compile(str)($scope);
                //$("#time").html(str);
            }

            $scope.submit = function () {
                if (!$scope.startTime || !$scope.TendTime || $scope.startTime.getTime() > $scope.TendTime.getTime()) {
                    sogModal.openAlertDialog('提示', '请输入正确的时间，且开始时间不能大于结束时间！');
                    return;
                }
                $scope.confirm({ startTime: $scope.startTime, endTime: $scope.TendTime });
            }
        }]);
});