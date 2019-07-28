const request = require('request-promise-native');
var querystring = require('querystring');

const headers = {
    'Host': 's5.notificator.de',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 5 Plus Build/PQ3A.190705.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.101 Mobile Safari/537.36',
    'Accept': '/',
    //'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'X-Requested-With': 'com.gameforge.mobilizer.ikariam.sencha'
};


const name = 'apamama';
const server = '41';
const email = 'moposa@gma.com'
const password = '1234';

const urlBuilder = (name, server, email, password) => {
    const baseUrl = 'http://s5.notificator.de/profiles/register?'
    return baseUrl + querystring.stringify({
        protocolversion : 'v1.0.0',
        version: '6',
        uuid: '0d41de2c533b4ba43f3dd0f7576b6c40',
        language: 'br',
        gameround: server,
        identity: name,
        appname: 'com.gameforge.mobilizer.ikariam.sencha',
        project: 'mobilizer_ikariam_sencha',
        mailingaddress: email,
        credential: password,
        callback: 'flyjsonp_55FA6ED52DF741449429FDE6E77CE508\''
    });
}

const proxyBuilder = ((protocol, proxy, port) => {
    return protocol + '://' + proxy + ':' + port
});

const protocol = 'http';
const proxy = '85.9.250.197';
const port = '32265';

const  query = {
    url: urlBuilder(name, server, email, password),
    headers: headers,
    method: 'GET',
    json: true,
    proxy: proxyBuilder(protocol, proxy, port)
};

request(query)
    .then(res => {
        console.log(res)
        //console.log(res.res)
    })
    .catch(err => console.log(err));
