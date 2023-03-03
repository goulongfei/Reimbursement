/// <reference path="src/javascript/controllers/jdmalluser/jdmalluserscontroller.js" />
var gulp = require('gulp');
var clean = require('gulp-clean');
//var babel = require('gulp-babel');
var htmlhint = require('gulp-htmlhint');
var htmlmin = require('gulp-htmlmin');
var jsonlint = require('gulp-jsonlint');
var jsonMinify = require('gulp-json-minify');
var csslint = require('gulp-csslint');
var cleanCss = require('gulp-clean-css');
//var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var sogRename = require('sog-gulp-rename');
var revCollector = require('sog-gulp-rev-collector');
//var concat = require('gulp-concat');

var fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
 
gulp.task('_js-release', function () {
    var stream =
        gulp.src(['src/**/*.js', '!node_modules/**/*.js', '!src/javascript/enterpriseCheckExtend/**/*.js', '!src/css/fonts/*.js'])
            //.pipe(jshint({ evil: true, esversion: 6 }))
            //.pipe(jshint.reporter())
            //.pipe(babel({
            //    presets: ['es2015']
            //}))
            .pipe(sogRename({ suffix: '-' + packageJson.version }))
            .pipe(gulp.dest('dist'))
            //.pipe(sourcemaps.init())
            //.pipe(uglify({ mangle: false }))
            .pipe(rename({ suffix: '.min' }))
            //.pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
            .pipe(sogRename.manifest('js.json'))
            .pipe(gulp.dest('rev'));
    return stream;
});

gulp.task('_default-htm-release', function () {
    var stream =
        gulp.src(['src/default.htm'])
            .pipe(htmlhint({ 'doctype-first': false }))
            .pipe(htmlhint.reporter())
            .pipe(htmlhint.failReporter())
            .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
            .pipe(gulp.dest('dist'));
    return stream;
});

gulp.task('_html-release', function () {
    var stream =
        gulp.src(['src/**/*.html', '!src/index.html'])
            .pipe(htmlhint({ 'doctype-first': false }))
            .pipe(htmlhint.reporter())
            .pipe(htmlhint.failReporter())
            .pipe(sogRename({ suffix: '-' + packageJson.version }))
            .pipe(gulp.dest('dist'))
            .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('dist'))
            .pipe(sogRename.manifest('html.json'))
            .pipe(gulp.dest('rev'));
    return stream;
});

gulp.task('_json-release', function (cb) {
    var stream =
        gulp.src(['src/**/*.json', '!src/common-config.json', '!src/**/config.json'])
            .pipe(jsonlint())
            .pipe(jsonlint.reporter())
            .pipe(jsonlint.failOnError())
            .pipe(sogRename({ suffix: '-' + packageJson.version }))
            .pipe(gulp.dest('dist'))
            .pipe(jsonMinify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('dist'))
            .pipe(sogRename.manifest('json.json'))
            .pipe(gulp.dest('rev'));
    return stream;
});

gulp.task('_config-release', function () {
    var stream = gulp.src(['src/common-config.json', 'src/**/config.json'])
        .pipe(gulp.dest('dist'));
    return stream;

});

gulp.task('_css-release', function () {
    var stream =
        gulp.src('src/**/*.css')
            .pipe(csslint())
            .pipe(sogRename({ suffix: '-' + packageJson.version }))
            .pipe(gulp.dest('dist'))
            .pipe(cleanCss({ compatibility: 'ie8', level: 0 }))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('dist'))
            .pipe(sogRename.manifest('css.json'))
            .pipe(gulp.dest('rev'));
    return stream;
});

gulp.task('_image-release', function () {
    var stream =
        gulp.src(['src/**/*.jpg', 'src/**/*.gif', 'src/**/*.png'])
            .pipe(sogRename({ suffix: '-' + packageJson.version }))
            .pipe(gulp.dest('dist'))
            .pipe(sogRename.manifest('image.json'))
            .pipe(gulp.dest('rev'));
    return stream;

});

gulp.task('_media', function (cb) {
    var stream =
        gulp.src(['src/**/fonts/*.*', 'src/**/*.jpg', 'src/**/*.png', 'src/**/*.gif', 'src/**/*.css', 'src/index.html', 'src/Web.config'])
            .pipe(gulp.dest('dist'));
    return stream;
});

gulp.task('_enterpriseCheckExtend-release', function () {
    var stream =
        gulp.src(['src/javascript/enterpriseCheckExtend/*.js'])
            .pipe(gulp.dest('dist/javascript/enterpriseCheckExtend'));
    return stream;
}); 

//gulp.task('_js-routes-concat', function () {
//    return gulp.src('src/javascript/routes/*.js')
//        .pipe(concat('app-routes.js'))
//        .pipe(sogRename({ suffix: '-' + packageJson.version }))
//        .pipe(gulp.dest('dist/javascript'))
//        .pipe(rename({ suffix: '.min' }))
//        .pipe(gulp.dest('dist/javascript')) 
//});

gulp.task('release', [
    '_js-release',
    '_html-release',
    '_default-htm-release',
    '_json-release',
    '_config-release',
    '_css-release',
    '_image-release',
    '_media',
    '_enterpriseCheckExtend-release'
], function () {
    var stream =
        gulp.src(['dist/**/*.html', 'dist/default.htm', 'dist/**/*.json', 'dist/**/*.css',
            //文件内部替换范围，能减少gulp时间
            //注意：js中如果有代码路径的引用时文件需要在这里单独配一下
            'dist/**/javascript/*.js',
            'dist/**/javascript/routes/*.js',
            'dist/**/myAngularExtend/**/*.js',
            'dist/**/javascript/controllers/enterpriseCheck/*.js',
            'dist/**/javascript/controllers/nonContractPurchase/*.js',
            'dist/**/javascript/controllers/nonContractPurchaseRenew/*.js',
            'dist/**/javascript/controllers/biddingAbnormity/*.js',
            'dist/**/javascript/controllers/frontPage/*.js',
            'dist/**/javascript/controllers/purchasePlan/*.js',
            'dist/**/javascript/controllers/purchaseScheme/*.js',
            'dist/**/javascript/controllers/directCommissioned/projectDefine/*.js',
            'dist/**/javascript/controllers/strategyCommissioned/strategyGroupCommissioned/*.js',
            'dist/**/javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/*.js',
            'dist/**/javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTender-controller*.js',
            'dist/**/javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTender-controller*.js',
            'dist/**/javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAward-controller*.js',
            'dist/**/javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApproval-controller*.js',
            'dist/**/javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller*.js',
            'dist/**/javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly-controller*.js',
            'dist/**/javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContract-controller*.js',
            'dist/**/javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly-controller*.js',
            'dist/**/javascript/controllers/directCommissioned/notProject/*.js',
            'dist/**/javascript/controllers/JdMallUser/*.js',
            'dist/**/javascript/controllers/OrganizationContact/*.js',
            'dist/**/javascript/controllers/OverDueStrategyDelayRequest/*.js',
            'dist/**/javascript/controllers/supplierReplyBiddingReport/*.js'

            ]).pipe(revCollector(['rev/*.json', 'manifest.json'], { 'replaceReved': true }))
            .pipe(gulp.dest('dist'));
    return stream;
});

gulp.task('default', ['release'], function () {
    gulp.src(['rev'])
        .pipe(clean());

});