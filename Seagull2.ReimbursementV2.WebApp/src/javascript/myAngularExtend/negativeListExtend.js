define(['app'], function (app) {
    // 负面清单
    app.directive("negativeList", function () {
        return {
            restrict: "A",
            scope: {
                data: '=',
                readOnly: '=', 
            },
            templateUrl: "htmlTemplate/controlTemplate/common/negativeList.html",
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting) {
                
            },
            link: function (scope, iElement, iAttr) { 
            }
        }
    });
})