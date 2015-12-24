/**
 * Created by longnc on 12/7/15.
 */
var express = require('express'),
    router = express.Router(),
    process = require('process'),
    openurl = require('openurl'),
    phpjs = require(appRoot+'/phpjs'),
    server = require(appRoot+'/server'),
    _env = process.env.NODE_ENV || 'development',
    _global = require(appRoot+'/app/config/global'),
    _config = require(appRoot+'/app/config/'+_env);

/**
 * Set up the express routes
 */
router.get('/request_mail/:email', function(req, res, next){
    openurl.open('mailto:'+req.params.email);
});
router.get('/', function(req, res, next){
    if (req.session.userPOS == undefined){
        res.render('login', { title: '.:: POS System | Login Page ::.', _class: 'display-hide' });
    } else {
        res.render('index', {
            title: '.:: Glite | Application Management POS System ::.',
            udata: req.session.userPOS,
            customers: [],
            totalCustomers: 0,
            currentOrders: [],
            totalCurrentOrders: 0,
            _baseUrl: _global.baseUrl,
            _port: appPort
        });
    }
});
router.post('/login', function(req, res, next){
    var _user = req.body;
    server.sendRequest({
        host: _config.hostApi,
        port: _global.port,
        path: '/api/pos/login',
        method: 'POST',
        params: {email: _user.email, password: phpjs.sha1(_user.password)},
        secure: false
    }, function(_myRes){
        var _pos = JSON.parse(_myRes);
        if(_pos.error != undefined){
            res.render('login', {
                _class: '',
                msg: _pos.error.msg
            });
        } else if(_pos.data.pos != undefined && _pos.data.pos.id){
            req.session.userPOS = _pos.data.pos;
            res.render('index', {
                title: '.:: Glite | Application Management POS System ::.',
                udata: _pos.data.pos,
                customers: [],
                totalCustomers: 0,
                currentOrders: [],
                totalCurrentOrders: 0,
                _baseUrl: _global.baseUrl,
                _port: appPort
            });
        }
    });
});

router.post('/settings', function(req, res, next){
    /**
     apiUrl: 'quickyorder.local',
     outletID: '38',
     terminalID: 'hh01',
     beaconid1: '8',
     beaconid2: '',
     beaconid3: '',
     refreshTime: '15',
     lastTime: '10',
     rCurrentPos: 'epoint_pos',
     memberToken: _token
     */
    var options = {
        host: req.body.apiUrl,
        port: _global.port,
        path: '/api/order/pullOrder',
        method: 'POST',
        params: {
            memberToken: req.body._token,
            outletId: req.body.outletID,
            orderStatus: 3,
            sortingDir: 'DESC',
            start: 0,
            limit: 100
        },
        secure: false
    };
    var config = {
        host: req.body.apiUrl,
        port: _global.port,
        path: '/api/member/findUsersNearBeacon',
        method: 'POST',
        params: {
            memberToken: req.body._token,
            beacon_id: req.body.beaconid1,
            //from: '2015-11-04 10:20:01',
            start: 0,
            limit: 100
        },
        secure: false
    }, nearpos = {items:[], maxPage: 0, maxItem: 0, limitItem: 0};
    // set timer for run schedule
    server.sendRequest(options, function(_data){
        var listOL = JSON.parse(_data), _orders = (listOL.error != undefined) ? [] : listOL.data.order;
        server.sendRequest(config, function(_dataNear){
            var _tmp = JSON.parse(_dataNear);
            if(_tmp.error != undefined){
                res.render('index', {
                    title: '.:: Glite | Application Management POS System ::.',
                    udata: req.session.userPOS,
                    customers: [],
                    totalCustomers: 0,
                    currentOrders: [],
                    totalCurrentOrders: 0,
                    _baseUrl: _global.baseUrl,
                    _port: appPort
                });
            } else if(_tmp.data.member.items != undefined){
                for(var i = 0; i < _tmp.data.member.items.length; i++){
                    var _item = _tmp.data.member.items[i];
                    if(_orders != undefined){
                        for(var j = 0; j < _orders.items.length; j++){
                            var _jtem = _orders.items[j];
                            if(_item.id == _jtem.UserID){
                                var _vtmp = {
                                    PassCode: '',
                                    UserID: _item.id,
                                    FirstName: _item.name,
                                    OrderID: _jtem.OrderID,
                                    StatusName: _jtem.StatusName,
                                    PhoneNumber: _jtem.PhoneNumber,
                                    orderDetail: _jtem.orderDetail,
                                    EmailAddress: _jtem.EmailAddress,
                                    ProfilePictureSource: _item.photo
                                };
                                nearpos.items.push(_vtmp);
                            }
                        }
                    }
                }
                nearpos.maxPage = _tmp.data.member.maxPage;
                nearpos.maxItem = _tmp.data.member.maxItem;
                nearpos.limitItem = _tmp.data.member.limitItem;
            }
            if(_orders.items != undefined || nearpos.items.length > 0){
                res.render('index', {
                    title: '.:: Glite | Application Management POS System ::.',
                    udata: req.session.userPOS,
                    currentOrders: _orders,
                    totalCurrentOrders: _orders.maxItem,
                    customers: nearpos,
                    totalCustomers: nearpos.maxItem,
                    fdata: req.body,
                    _baseUrl: _global.baseUrl,
                    _port: appPort
                });
            }
        }); // end request to /api/member/findUsersNearBeacon
    }); // end request to /api/order/pullOrder
}); // end router post

router.post('/profiles', function(req, res, next){
    var options = {
        host: req.body.apiUrl,
        port: _global.port,
        path: '/api/order/UserOrders',
        method: 'POST',
        params: {
            memberToken: req.body.token,
            userId: req.body.userid,
            start: 0,
            limit: 10
        },
        secure: false
    };
    server.sendRequest(options, function(response){
        var _res = JSON.parse(response);
        res.json({orders: _res.data.order.items, info: req.body.jsonTmp});
    });
});

router.get('/profiles', function(req, res, next){
    var options = {
        host: req.query.apiUrl,
        port: _global.port,
        path: '/api/order/UserOrders',
        method: 'POST',
        params: {
            memberToken: req.query.token,
            userId: req.query.userid,
            start: 0,
            limit: 50
        },
        secure: false
    };
    server.sendRequest(options, function(response){
        var _res = JSON.parse(response);
        res.json({orders: _res.data.order.items});
    });
});

router.get('/exit_pos', function (req, res, next) {
    //req.session.userPOS;
    req.session.destroy(function(e){ res.status(200).send('ok'); });
    process.kill(appID);
    window.close();
});




// end list routes =====================================================================================================
module.exports = router;