define(['app'], function (app) {
    // 重要信息 详细信息
    app.directive("isEmphasis", function () {
        return {
            restrict: "A",
            scope: {
                data: '=', 
            },
            template: '<div class="form-inline"><div class="col-xs-12 form-group"><div class="col-xs-12 form-group baseifo-input text-right"><div class="switch-btn-box" style="width: 160px!important; "><span class="btn checkbox-label-not" ng-class="{ \'checkbox-label-this\': data !== false } " ng-style="{\'width\': \'49%\'}" ng-click="data = true">重要信息</span><span class="btn checkbox-label-not" ng-class="{ \'checkbox-label-this\': data === false } " ng-style="{\'width\': \'49%\'}" ng-click="data = false">详细信息</span> </div> </div> </div>  </div>',
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting) {
                
            },
            link: function (scope, iElement, iAttr) { 
            }
        }
    });
})
 