/**
 * call API from other site or other server by http / https module of nodejs
 * Created by longnc on 12/14/15.
 */

var phpjs = require('./phpjs'), querystring = require('querystring');
exports.sendRequest = function(options, callback){
    var http = require('http'), https = require('https'),
        _header = {}, dataString = JSON.stringify(options.params),
        _path = options.path;
    if (options.method.toUpperCase() == 'GET') {
        _path += '?' + querystring.stringify(data);
    } else {
        _header = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length,
            'Accept-Language': 'en-US,en;q=0.5'
        };
    }
    var settingOption = {
        host: phpjs.str_replace(['http://', 'https://'], ['', ''], options.host) || 'pizzahut.gliteservices.com',
        port: options.port || 80,
        path: _path,
        method: options.method.toUpperCase(),
        headers: _header,
        json: true
    }, _dataResponse = '';
    if(options.secure){
        var sendReq = https.request(settingOption, function(response){
            response.on('data', function(data) {
                _dataResponse += data;
            });
            response.on('end', function() {
                var responseObject = JSON.parse(JSON.stringify(_dataResponse));
                callback(responseObject);
            });
        });
        sendReq.write(dataString);
        sendReq.on('error', function(e) {console.error(e.message);});
        sendReq.end();
    } else {
        var sendReq = http.request(settingOption, function (response) {
            response.setEncoding('utf8');
            response.on('data', function (data) {
                _dataResponse += data;
            });
            response.on('end', function () {
                var responseObject = JSON.parse(JSON.stringify(_dataResponse));
                callback(_dataResponse);
            });
        });
        sendReq.write(dataString);
        sendReq.on('error', function(e) {console.error(e.message);});
        sendReq.end();
    }
};

exports.callRequestCurl = function(options, callback){
    var Curl = require('node-libcurl').Curl, curl = new Curl();
    curl.setOpt('URL', options.host+options.path);
    curl.setOpt('POSTFIELDS', querystring.stringify(options.params));
    curl.setOpt('HTTPHEADER', [
        'User-Agent: node-libcurl/1.0',
        'Content-Type: application/json',
        'Content-Length:'+ JSON.stringify(options.params).length
    ]);
    curl.setOpt('VERBOSE', true);
    curl.setOpt('RETURNTRANSFER', true);
    curl.setOpt('CUSTOMREQUEST', options.method.toUpperCase());
    curl.setOpt('FOLLOWLOCATION', true);
    curl.setOpt('DEBUGFUNCTION', debugCallback);
    curl.on('end', function(statusCode, body) {
        console.info(statusCode);
        console.info('---');
        console.log(body);
        console.info('---');
        console.info(this.getInfo( 'TOTAL_TIME'));
        callback(statusCode, body);
        this.close();
    });
    curl.perform();
    curl.on('error', curl.close.bind(curl));
};

var debugCallback = function(infoType, content) {
    var text = '', EOL = ( process.platform === 'win32' ? '\r\n' : '\n' );
    switch (infoType) {
        case infoTypes.TEXT:
            text = content;
            break;
        case infoTypes.DATA_IN:
            text = '-- RECEIVING DATA: ' + EOL + content;
            break;
        case infoTypes.DATA_OUT:
            text = '-- SENDING DATA: ' + EOL + content;
            break;
        case infoTypes.HEADER_IN:
            text = '-- RECEIVING HEADER: ' + EOL + content;
            break;
        case infoTypes.HEADER_OUT:
            text = '-- SENDING HEADER: ' + EOL + content;
            break;
        case infoTypes.SSL_DATA_IN:
            text = '-- RECEIVING SSL DATA: ' + EOL + content;
            break;
        case infoTypes.SSL_DATA_OUT:
            text = '-- SENDING SSL DATA: ' + EOL + content;
            break;
    }
    console.log(text);
    return 0;
};

