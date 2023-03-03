define(['app'], function (app) { 
    app.directive("offerInfo", function () {
        return {
            restrict: "A",
            scope: {
                data: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/offerInfo.html',
            replace: true,
            transclude: false,
            controller: function ($scope, rcTools) {

                $scope.numberToChinese = function (round) {
                    return rcTools.numberToChinese(round);
                };
            },
            link: function (scope, iElement, iAttr) {
            }
        }
    });
})
