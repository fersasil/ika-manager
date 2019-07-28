const request = require('request-promise-native').defaults({ jar: true });
const querystring = require('querystring');

const ACADEMY_POSITION = 11;

const server = '45';


const buildDataStringToLogin = ((token, userId, gameRound, language, pName) => {
    return querystring.stringify({
        apiUrl: `http://notificator_ik:598WNDGtdhIUJN@s${gameRound}-br.ikariam.gameforge.com/mobile/api.php`,
        action: 'loginAvatar',
        function: 'mobileLogin',
        token: token,
        loginMode: '3',
        userId: userId,
        gameRound: gameRound,
        language: language,
        registeredWithSP: 'true',
        pName: pName,
        startpage: 'https://br.ikariam.gameforge.com',
        showPortable: 'true',
        actionRequest: '',
        clientVersion: ''
    });

});

const mergeJSON = require("merge-json");

const buildHeader = (...args) => {
    let customElements = {};

    args.forEach(e => {
        customElements = mergeJSON.merge(customElements, e);
    })

    const defaultElements = {
        'Host': `s${server}-br.ikariam.gameforge.com`,
        'Connection': 'keep-alive',
        'Authorization': 'Basic bm90aWZpY2F0b3JfaWs6NTk4V05ER3RkaElVSk4=',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 5 Plus Build/PQ3A.190705.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.101 Mobile Safari/537.36',
        'Accept': '/',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };

    return mergeJSON.merge(defaultElements, customElements);

}

const profileid = '6811745';

const buildLoginUrl = ((profileid) => {
    const baseUrl = 'http://s5.notificator.de/profiles/login?'
    return baseUrl + querystring.stringify({
        protocolversion: 'v1.0.0',
        version: '6',
        uuid: '0d41de2c533b4ba43f3dd0f7576b6c40',
        profileid: profileid,
        appname: 'com.gameforge.mobilizer.ikariam.sencha',
        project: 'mobilizer_ikariam_sencha',
        callback: 'flyjsonp_9031FE7C45B54B60883B23A0D30804D2'
    });
});


request({
    uri: buildLoginUrl(profileid),
    headers: buildHeader({ 'Host': 's5.notificator.de' }),
    method: 'GET',
})
    .then(res => {
        // TODO fazer u parser do flyjson
        res = querystring.parse(res);


        return {
            token: res.token,
            userId: res.userId,
            gameRound: res.gameRound,
            language: res.language,
            pName: res.pName,
        }
    })
    .then((loginInfo) => {

        return request({
            url: `http://s${server}-br.ikariam.gameforge.com/mobile/api.php?_dc=1564173763412`,
            method: 'POST',
            headers: buildHeader(),
            json: true,
            //resolveWithFullResponse: true,
            body: buildDataStringToLogin(loginInfo.token, loginInfo.userId, loginInfo.gameRound, loginInfo.language, loginInfo.pName),
        })
    })
    .then((loginResult) => { // Não serve pra nada
        // Verificar sucesso!
        if (!loginResult.success) {
            // TODO tratar o erro
        }

        // NOVA AÇÃO!

        var dataString = `view=gameData&actionRequest=${loginResult.actionRequest}&clientVersion=`;

        var options = {
            url: `http://s${server}-br.ikariam.gameforge.com/mobile/api.php?_dc=1564173764088`,
            method: 'POST',
            headers: buildHeader(),
            body: dataString,
            json: true,
        };


        return request(options);

    })
    .then(res => {

        return fetchPage(res);
    })
    .then(res => {
        console.log(res)
        // Contruir e acelerar academia
        return buildAcademy(ACADEMY_POSITION, res);
    })
    .then(res => {
        return fetchPage(res);
    })
    .then(res => {
        return buildingSpeedup({
            level: 0,
            position: ACADEMY_POSITION
        }, res);
    })
    .then(res => {
        console.log(res);
    })





/**
 * FUNÇÕES AUXILIARES QUE SERÃO COLOCADAS EM UM NOVO ARQUIVO POSTERIORMENTE!
 */

const fetchPage = res => {
    const url = urlBuilder({ 'IKACTIONKEY': res.actionRequest });

    return request({
        url: url,
        headers: buildHeader(),
        json: true
    });
}

const buildingSpeedup = (params, res) => {
    // return newAction({
    //     position: params.position,
    //     action: 'Premium',
    //     function: 'buildingSpeedup',
    //     view: 'buildingLis',
    //     level: params.level,
    //     getAvatarInfo: 1,
    //     '_dc': 1564221940938
    // }, res);


    // var headers = {
    //     'Host': 's45-br.ikariam.gameforge.com',
    //     'Connection': 'keep-alive',
    //     'Content-Length': '166',
    //     'Authorization': 'Basic bm90aWZpY2F0b3JfaWs6NTk4V05ER3RkaElVSk4=',
    //     'Origin': 'file://',
    //     'X-Requested-With': 'XMLHttpRequest',
    //     'User-Agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 5 Plus Build/PQ3A.190705.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.101 Mobile Safari/537.36',
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //     'Accept': '/',
    //     'Accept-Encoding': 'gzip, deflate',
    //     'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    //     'Cookie': 'Cookie:ikariam_loginMode=1_6_Android; ikariam=5359_b1c6a60674c387ea96c4a762d3f59b2f; PHPSESSID=oqk6ulojlet3csqbji8ccsh3p2'
    // };

    // var dataString = `action=Premium&function=buildingSpeedup&view=buildingList&cityId=9633&position=3&level=0&getAvatarInfo=1&actionRequest=${res.actionRequest}&clientVersion=`;

    // var options = {
    //     url: 'http://s45-br.ikariam.gameforge.com/mobile/api.php?_dc=1564221940938',
    //     method: 'POST',
    //     headers: headers,
    //     body: dataString
    // };

    // return request(options);

    const data = {
        "name": 'mopop',
        "password": '1234',
    }


    var headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://s45-br.ikariam.gameforge.com/?action=loginAvatar&function=login',
        'Upgrade-Insecure-Requests': '1',
        'Cookie': '__auc=ac7cce5b16c31145117dcacc185; pc_idt=AFTfy7I5WrIQ7TxH0ri0NNvzXMY8llh1XeMzqGJenljbHS7GDsINDfdM4Z58OADrhXR8QG0eoIFpA5K6GAF95m3MUcFMUJ3EtZxruIIC7SqlU2wwy5CHGdSUdYzYMH3ICE_SQ_6BkJ9CChiSwu06NPTo6YiVRFElRHe4Nw; PHPSESSID=uffc02fchb8rvb4m2po722vbc4; ikariam_loginMode=0; cookieConsent_3853693914=1'
    };

    var dataString = getBodyPost(data);

    var options = {
        url: 'https://s45-br.ikariam.gameforge.com/?action=loginAvatar&function=login',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    return request(options);


};


const newAction = ((params = {}, res) => {

    const capitalCity = res.cities[0];
    const _dc = params['_dc'];

    delete params['_dc'];

    const defaultParams = {
        actionRequest: res.actionRequest,
        cityId: capitalCity.id,
    };

    const dataString = getBodyPost(mergeJSON.merge(params, defaultParams));

    console.log('\n\n\n')
    console.log(dataString);
    console.log(`http://s${server}-br.ikariam.gameforge.com/mobile/api.php?_dc=${_dc}`)
    console.log('\n\n\n')



    return request({
        url: `http://s${server}-br.ikariam.gameforge.com/mobile/api.php?_dc=${_dc}`,
        method: 'POST',
        headers: buildHeader(),
        body: dataString,
        json: true
    });
});


const getBodyPost = ((customFields = {}) => {
    // const defaultElements = {
    //     action: 'CityScreen',
    //     function: 'build',
    //     view: 'buildingList',
    //     cityId: '',
    //     position: '',
    //     confirm: '1',
    //     actionRequest: '',
    //     clientVersion: ''
    // }

    customFields.clientVersion = '';

    // const queryUrl = mergeJSON.merge(defaultElements, customFields);

    return querystring.stringify(customFields);
})


const newBuilding = (params, res) => {
    return newAction({
        buildingType: params.buildingType,
        position: params.position,
        action: 'CityScreen',
        function: 'build',
        confirm: '1',
        clientVersion: '',
        view: 'buildingList',
        '_dc': 1564219234667
    }, res);
}

const buildAcademy = (position, res) => {
    return newBuilding({
        buildingType: 'academy',
        position: position,
    }, res);
};



const urlBuilder = (customFields, server = 45) => {
    const baseUrl = `http://s${server}-br.ikariam.gameforge.com/mobile/api.php?`;

    const defaultElements = {
        'm_action': 'read',
        'view': 'cityList',
    };

    const queryUrl = mergeJSON.merge(defaultElements, customFields);

    return baseUrl + querystring.stringify(queryUrl);

}