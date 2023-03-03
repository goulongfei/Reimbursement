define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //添加推广项目
        $stateProvider.state('JdMallUserLogs', {
            url: '/JdMallUserLogs',
            controller: 'JdMallUserLogsController',
            controllerUrl: './javascript/controllers/JdMallUser/JdMallUserLogsController.js',
            templateUrl: './views/JdMallUser/JdMallUserLogs.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});