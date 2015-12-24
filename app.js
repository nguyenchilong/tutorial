'use strict';
var path = require('path'),
    utils = require('util'),
    appjs = require('appjs'),
    process = require('process'),
    express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    setimmediate = require('setimmediate');
var app = express(), _env = process.env.NODE_ENV || 'development',
    _global = require('./app/config/global'),
    _config = require('./app/config/'+_env);
/**
 * ==================================== config for all environment =====================================================
 * config for application on all environment
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app/static')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'pGliteo123sNeera!!~#)'
}));
if ('development' == app.get('env')) {app.use(errorHandler());}
/**
 * ====================================== setting for global parameters for app ========================================
 * setting for all parameter global section
 */
global.appRoot = path.resolve(__dirname);
global.appID = process.pid;
global.appPort = app.get('port');
global.window = appjs.createWindow(_global.baseUrl+':' + app.get('port') + '/', {
    width: 768,
    height: 720,
    showChrome: true,
    icons: __dirname + '/app/static/icons'
});
process.title = 'pos-system';
/**
 *  =============================== Set up the express routes ==========================================================
 */
var router = require('./app/router/routes');
app.use('/', router);
/**
 * =====================================================================================================================
 * Setup AppJS and build windows
 */
appjs.router.handle = app.handle.bind(app);
/*
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
*/
var httpServer = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
//var io = require("socket.io").listen(httpServer);
//io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
//var socketServer = require("./socket-server")(io);
/*
io.sockets.on("connection", function(socket){
    socket.emit('ready', {msg: 'connect to server ready !'});
    //socket.on('disconnect', function() {console.log("Socket disconnected !");});
    socket.on('refreshOrders', function(params){
        console.log(params);
        /*{"_token":"yQizqCURGi9vNC2VjeaYl6v8OTUA2Ylq","apiUrl":"quickorder.local","outletID":"38","terminalID":"","beaconid1":"43","beaconid2":"","beaconid3":"","refreshTime":"15","lastTime":"10"}*/
        /*var _rt = (parseInt(params.refreshTime) || 15), _ttl = (_rt * 1000 || 0);
        setTimeout(function(){
            console.log('refresh list orders after '+_ttl+'s');
        }, _ttl);
    });
});*/
app.use(function(req, res, next) {
    //res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //req.sio = io;
    next();
});

/** ================================ appJS setup ==================================================================== */
var trayMenu = appjs.createMenu([
    {label:'Show', action:function(){window.frame.show();}},
    {label:'Minimize', action:function(){window.frame.hide();}},
    {label:'Exit',action:function(){window.close();}}
]);
appjs.createStatusIcon({
    icon: __dirname + '/app/static/icons/16.png',
    tooltip: 'POS System',
    menu: trayMenu
});
window.on('create', function(){
    window.frame.show();
    window.frame.center();
});
window.on('ready', function(){
    window.require = require;
    window.process = process;
    window.module = module;
    window.addEventListener('keydown', function(e){
        if (e.keyIdentifier === 'F12' || e.keyCode === 74 && e.metaKey && e.altKey) {
            window.frame.openDevTools();
        }
    });
});
window.on('close', function(){
    process.kill(appID);
    window.close();
    console.log("Window Closed");
});
appjs.on('exit', function () {process.kill(appID);});
