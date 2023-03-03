define([
    'angular',
    'app',
    'scrollspy',
], function (angular, app) {

    //左侧导航
    app.directive("leftNav", function () {
        return {
            restrict: 'A',
            scope: {
                opts: "=",
                data: "=",
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/leftNav.html',
            replace: false,
            transclude: false,
            controller: function ($scope, sogModal, configure, $http, seagull2Url, $window) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                if (!$scope.opts) {
                    $scope.opts = { offset: 1, fixed: 1, delay: 1000, sections: [] };
                }
                if (!$scope.opts.offset) { $scope.opts.offset = 1; }
                if (!$scope.opts.fixed) { $scope.opts.fixed = 1; }
                if (!$scope.opts.delay) { $scope.opts.delay = 1000; }
                if (!angular.isArray($scope.opts.sections)) { $scope.opts.sections = []; }

                if (document.documentElement.clientHeight < $("#leftnav").height()) {
                    if ($scope.opts.actionTypeCode === 14 || $scope.opts.actionTypeCode === 15 || $scope.opts.actionTypeCode === 26
                        || $scope.opts.actionTypeCode === 27 || $scope.opts.actionTypeCode === 33) {
                        $scope.ulHeight = { 'padding': '6px 20px' };
                        $scope.liHeight = { 'padding': '3px 0' };
                    }
                    else {
                        $scope.ulHeight = { 'padding': '10px 20px' };
                        $scope.liHeight = { 'padding': '5px 0' };
                    }
                }
                else {
                    $scope.ulHeight = { 'padding': '20px 20px' };
                    $scope.liHeight = { 'padding': '10px 0' };
                }

                //查看页面
                $scope.lookInfo = function (flag) {
                    var urlat = null;
                    angular.forEach($scope.opts.activityInfoList, function (item) {
                        if (flag.sceneName != $scope.opts.scene) {
                            if ($scope.opts.actionTypeCode === 13 || $scope.opts.actionTypeCode === 14 || $scope.opts.actionTypeCode === 15
                                || $scope.opts.actionTypeCode === 26 || $scope.opts.actionTypeCode === 27 || $scope.opts.actionTypeCode === 28 || $scope.opts.actionTypeCode === 33) {
                                if (flag.sceneName == item.activityCodeName) {
                                    openUrl(item);
                                } else {
                                    return false;
                                }
                            }
                            else {
                                if (flag.sortNo == item.sortNo) {
                                    openUrl(item);
                                } else {
                                    return false;
                                }
                            }
                        }

                    })

                };

                var openUrl = function (item) {
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var activityID = "";
                                var routeType = "";
                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + item.activityStateName + "/?resourceID=" + $scope.opts.resourceId + "&activityID=" + item.activityCode;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                }

                setTimeout(function () { $('body').scrollspy({ target: '#leftnav', offset: $scope.opts.offset }); }, $scope.opts.delay);
            }
        }
    });
})