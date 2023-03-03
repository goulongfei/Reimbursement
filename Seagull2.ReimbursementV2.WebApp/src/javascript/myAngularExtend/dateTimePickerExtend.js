define([
    'angular',
    'app'
], function (angular, app) {

    //时间控件
    app.directive("dateTimePicker", function () {
        return {
            restrict: "AE",
            scope: {
                dateTime: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/dateTimePicker.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", "$filter", "$injector",
                function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure, $filter, $injector) {
                    $scope.data = {
                        bindingDate: undefined,
                        date: undefined,
                        time: "00:00",
                        hours: ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30"
                            , "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"
                            , "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
                            , "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"]
                    };
                    if ($scope.dateTime == "1901-01-01T00:00:00+08:00" || $scope.dateTime == "0001-01-01T00:00:00") {
                        $scope.dateTime = undefined;
                    }
                    if ($scope.dateTime != undefined) {
                        if ($scope.dateTime != "") {
                            //0001-01-01T00:00:00 2019-05-15T00:00:00+08:00
                            var dateArr = $scope.dateTime.split('T');
                            $scope.data.bindingDate = dateArr[0];
                            var timeArr = [];
                            if (dateArr[1].indexOf("+") == -1) {
                                timeArr = dateArr[1].split(':');
                            } else {
                                var timeStar = dateArr[1].substring(0, dateArr[1].indexOf("+"));
                                timeArr = timeStar.split(':');
                            }
                            $scope.data.time = timeArr[0] + ":" + timeArr[1];
                        }
                    }
                    //日期控件
                    $scope.dateOpts = {
                        format: 'yyyy-mm-dd',
                        selectYears: true,
                        onSet: function (e) {
                            $scope.data.date = !!e.select ? new Date(e.select) : undefined;
                            $scope.splicingTime();
                        }
                    };
                    $scope.$watch('data.time', function (newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }
                        $scope.splicingTime();
                    });
                    //拼接时间
                    $scope.splicingTime = function () {
                        if ($scope.data.date != null && $scope.data.date != undefined) {
                            var newDate = $filter('date')($scope.data.date, 'yyyy-MM-dd');
                            $scope.dateTime = newDate + "T" + $scope.data.time + ":00";
                        };
                    }
                    var config = $injector.get('configure').getConfig('pageCommonConfig');
                    if (config && config.dateTimePickerStep) {
                        $scope.data.hours = [];
                        for (var i = 0; i < 24; i++) {
                            for (var y = 0; y < 60; y += config.dateTimePickerStep) {
                                $scope.data.hours.push((i < 10 ? "0" + i : i) + ":" + (y < 10 ? "0" + y : y))
                            }
                        }
                    }
                }],
            link: function ($scope, element, attrs) {
            }
        }
    });
});
