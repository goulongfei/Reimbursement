define([
    'angular',
    'app',
    'scrollspy',
], function (angular, app) {

    //左侧导航
    app.directive("sectionNav", function () {
        return {
            restrict: 'A',
            scope: {
                opts: "=",
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/sectionNav.html',
            replace: false,
            transclude: false,
            controller: function ($scope) {
                if (!$scope.opts) {
                    $scope.opts = { offset: 1, fixed: 1, delay: 1000, sections: [] };
                }
                if (!$scope.opts.offset) { $scope.opts.offset = 1; }
                if (!$scope.opts.fixed) { $scope.opts.fixed = 1; }
                if (!$scope.opts.delay) { $scope.opts.delay = 1000; }
                if (!angular.isArray($scope.opts.sections)) { $scope.opts.sections = []; }

                $scope.click = function (sec) {
                    $(window).scrollTop($("#" + sec)["offset"]().top - ($scope.opts.offset - $scope.opts.fixed));
                }

                setTimeout(function () { $('body').scrollspy({ target: '#sectionnav', offset: $scope.opts.offset }); }, $scope.opts.delay);
            }
        }
    });
})