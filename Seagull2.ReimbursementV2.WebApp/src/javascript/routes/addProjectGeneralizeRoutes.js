define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //添加推广项目
        $stateProvider.state('addProjectGeneralizeState', {
            url: '/addProjectGeneralize',
            controller: 'addProjectGeneralizeController',
            controllerUrl: './javascript/controllers/frontPage/addProjectGeneralizeController.js',
            templateUrl: './views/frontPage/addProjectGeneralize.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});