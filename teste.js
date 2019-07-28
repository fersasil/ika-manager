const request = require('request-promise-native').defaults({ jar: true });
const querystring = require('querystring');
const JSON5 = require('json5');
const mergeJSON = require('merge-json');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = class Account {
    constructor(name, email, password, server, proxy) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.server = server;
        this.country = 'br';
        this.proxy;
    }

    async makeTutorial() {
        console.log(Date())
        console.log('\n');
        
        this.baseUrl = await this.createBaseUrl();

        let html = await this.login();
        
        await this.fetchResource(html);
        ////console.log(html)

        // await this.assignScientists("6", "12");
        // await this.rewardShown();

        // process.exit()

        await this.assignWorkers(23);
        await this.rewardShown();

        await this.build("6", "4"); //construir academia
        await this.speedBuilding("6", "0"); //adiantar academia
        await this.speedBuilding("6", "0"); //adiantar academia
        
        await this.rewardShown();

        
        //process.exit();
        // //pesquisar conservação
        
        await this.doResearch("economy");
        await this.rewardShown();
        
        // //Contratar cientistas
        await this.assignScientists("6", "12");
        await this.rewardShown();

        // //Contruir Armazen

        await this.build("5", "7");
        await this.speedBuilding("5", "0");
        await this.speedBuilding("5", "0");
        await this.rewardShown();
        await this.rewardShown();

        // //Contruir Quartel

        await this.build("4", "6");
        await this.speedBuilding("4", "0");
        await this.speedBuilding("4", "0");
        await this.rewardShown();

        // //Recrutar unidades


        await this.buildUnits("4", "0", "0", "0", "2");

        // //Criar muralhas

        await this.build("14", "8");
        await this.speedBuilding("14", "0");
        await this.speedBuilding("14", "0");
        await this.rewardShown();

        // //Contruir Porto
        await this.build("1", "3");

        //Esperar os 45 segundos

        console.log('esperando...')

        await sleep(120000);

        html = await this.login();
        await this.getActionRequestAsHtml(html);


        console.log('Fim esperando');

        // const url = `https://s33-br.ikariam.gameforge.com/?action=Premium&function=buildingSpeedup&cityId=116935&position=1&level=0&backgroundView=city&currentCityId=116935&actionRequest=${this.actionRequest}`;

        // const a = await request({
        //     url: url,
        //     method: "GET"
        // });

        //Premio pelos soldados! 
        await this.rewardShown();
        await this.rewardShown();

        await this.speedBuilding("1", "0");
        await this.speedBuilding("1", "0");
        await this.speedBuilding("1", "0");
        await this.rewardShown();

        console.log('ERRO DO SPEED BUILDING ')

        // bot.DoLogin() ? 
        // SIM! 
        html = await this.login();
        await this.getActionRequestAsHtml(html);
        // //Comprar um barco

        await this.buyTransporter("1");
        await this.rewardShown();

        // //Upar armazem

        await this.upgradeBuilding("5", "2");
        await this.rewardShown();

        // //Roubar barbaros

        await this.attackBarbarianVillage("2", "2");
        await this.rewardShown();

        // //Ver Premium

        await this.viewPremium();
        await this.rewardShown();

        // //Abortar up do Armazém

        await this.abortBuilding("5", "5");

        // //Construir mais 3 Armazéns

        await this.build("11", "7");
        await this.speedBuilding("11", "0");
        await this.speedBuilding("11", "0");

        await this.build("16", "7");
        await this.speedBuilding("16", "0");
        await this.speedBuilding("16", "0");

        await this.build("10", "7");
        await this.speedBuilding("10", "0");
        await this.speedBuilding("10", "0");
        
        // //Demolir Muralha

        this.demolishBuilding("14", "2")
        this.demolishBuilding("14", "1")

        console.log('\n');
        console.log(Date())
    }

    async login(){
        const data = {
            "name": this.name,
            "password": this.password,
        }

        const headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'application/x-www-form-urlencoded',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Referer': this.baseUrl + '/?action=loginAvatar&function=login',
            'Upgrade-Insecure-Requests': '1',
        };

        const dataString = await this.getBodyPost(data);

        const options = {
            url: this.baseUrl + '/?action=loginAvatar&function=login',
            method: 'POST',
            headers: headers,
            body: dataString,
        };

        if(this.proxy){
            options.proxy = this.proxy;
        }

        return await request(options);
    }

    async getIslandId(html) {
        const indexIslandId = html.search('js_islandBread');
        const substringWithIslandId = html.substring(indexIslandId, indexIslandId + 300);
        const islandHrefIndex = substringWithIslandId.search('islandId=');
        const islandIdUnformatted = substringWithIslandId.substring(islandHrefIndex).split('"')[0];
        const islandId = islandIdUnformatted.split('=')[1];

        this.cities.capital.islandId = islandId;
        this.islandId = islandId;

        return islandId;
    }

    async getActionRequest(jsonArray) {
        const jsonData = jsonArray[0][1];

        // TODO da pra pegar mais informações aqui...
        this.actionRequest = jsonData.actionRequest;
        //return data.actionRequest;
    }

    async getActionRequestAsHtml(html) {
        const jsonData = await this.getInfo(html);
        
        this.actionRequest = jsonData.actionRequest;
    }

    async fetchResource(html) {
        const jsonData = await this.getInfo(html);

        this.cities = {
            capital: {
                id: jsonData.viewParams.cityId,
                resourcers: {
                    '1': jsonData.currentResources['1'],
                    '2': jsonData.currentResources['2'],
                    '3': jsonData.currentResources['3'],
                    '4': jsonData.currentResources['4'],
                    'citizens': jsonData.citizens,
                    'population': jsonData.population,
                    'resource': jsonData.resource
                }
            },
        }

        await this.getIslandId(html);

        this.actionRequest = jsonData.actionRequest;
    }

    async getInfo(html) {
        const h = html.search('dataSetForView')

        const asd = html.substring(h).split(';')[0];

        const semONome = asd.search('{')

        const fim = asd.substring(semONome);

        const semComentario = fim.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '')

        //const t = semComentario.replace('JSON', '');

        const semJson = semComentario.replace(/(?:JSON\.parse)/g, '')
        const aux = semJson.replace(/(?:[\(])|(?:[\)])/g, '')
        const semBarras = aux.replace(/[\\]/g, '');
        const aspasArrumar = semBarras.replace(/(?:\}\')/g, '}')
        const arrumadoSemAspas = aspasArrumar.replace(/(?:\'\{)/g, '{');

        //const aux3 = aux2.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":')

        const deleteItem = (itemName, string) => {
            const subStringtoDelete = string.substring(string.search(itemName) - 1);
            const endSubstringToDelete = subStringtoDelete.search(',') + 1;

            const stringToRemove = subStringtoDelete.substring(0, endSubstringToDelete);

            return string.replace(stringToRemove, '');
        }


        let htm = deleteItem("serverName", arrumadoSemAspas);




        htm = deleteItem("feedbackMsg", htm);
        htm = deleteItem("tutorialData", htm);
        htm = deleteItem("ingameCounterConfig", htm)
        htm = deleteItem("bgViewData", htm)
        htm = deleteItem("shortcuts", htm)
        htm = deleteItem("hasAlly", htm)
        htm = deleteItem("backgroundView", htm)

        htm = deleteItem("heavyVersion", htm)


        return JSON5.parse(htm)
    }


    async getBodyPost(customFields = {}) {
        const defaultElements = {
            //action: 'CityScreen',
            //function: 'build',
            //view: 'buildingList',
            //cityId: this.cities.capital.id,
            //actionRequest: this.actionRequest,
        }

        customFields.clientVersion = '';

        const queryUrl = mergeJSON.merge(defaultElements, customFields);

        return querystring.stringify(queryUrl);
    }

    async abortBuilding(position, templatePosition) {
        const data = {
            action: "CityScreen",
            function: "cancelBuilding",
            cityId: this.cities.capital.id,
            position: position,
            actionRequest: this.actionRequest,
            templatePosition: templatePosition,
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            ajax: 1
        }

        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        //console.log(html);

        await this.getActionRequest(html);
    }

    async demolishBuilding(level, position) {
        const data = {
            action: "CityScreen",
            function: "demolishBuilding",
            level: level,
            cityId: this.cities.capital.id,
            position: position,
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            templateView: 'wall',
            actionRequest: this.actionRequest,
            ajax: 1
        }

        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        //console.log(html);

        await this.getActionRequest(html);
    }

    async buyTransporter(position) {
        const data = {
            action: "CityScreen",
            function: "increaseTransporter",
            cityId: this.cities.capital.id,
            position: position,
            activeTab: "tabBuyTransporter",
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            actionRequest: this.actionRequest,
            ajax: 1
        }

        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        //console.log(html);

        await this.getActionRequest(html);
    }

    async viewPremium(){
        const data = {
            view: "premium",
            linkType: 1,
            ajax: 1
        }

        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        //console.log(html);

        await this.getActionRequest(html);
    }

    async rewardShown() {
        const data = {
            action: "TutorialOperations",
            function: "rewardShown",
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            actionRequest: this.actionRequest,
            ajax: 1
        }

        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        //console.log(html);

        await this.getActionRequest(html);
    }

    async attackBarbarianVillage(numberSpearman, numberTransporter) {
        const data = {
            action: "transportOperations",
            function: "attackBarbarianVillage",
            actionRequest: this.actionRequest,
            islandId: this.cities.capital.islandId,
            destinationCityId: 0,
            cargo_army_315_upkeep: 1,
            cargo_army_315: numberSpearman,
            transporter: numberTransporter,
            barbarianVillage: 1,
            backgroundView: "island",
            currentIslandId: this.cities.capital.islandId,
            templateView: "plunder",
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async assignScientists(position, numberScientists) {
        const data = {
            action: "IslandScreen",
            function: "workerPlan",
            screen: "academy",
            position: position,
            cityId: this.cities.capital.id,
            s: numberScientists,
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            templateView: "academy",
            actionRequest: this.actionRequest,
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async build(position, building) {
        const data = {
            action: "CityScreen",
            function: "build",
            cityId: this.cities.capital.id,
            position: position,
            building: building,
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            templateView: "buildingGround",
            actionRequest: this.actionRequest,
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async doResearch(researchType) {
        const data = {
            action: "Advisor",
            function: "doResearch",
            type: researchType,
            actionRequest: this.actionRequest,
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async speedBuilding(position, level) {
        const data = {
            action: "Premium",
            function: "buildingSpeedup",
            cityId: this.cities.capital.id,
            position: position,
            level: level,
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            actionRequest: this.actionRequest,
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async buildUnits(position, numberSlinger, numberSwordsman, numberHoplite, numberSpearman) {

        const data = {
            301: numberSlinger,   //Fundeiro
            302: numberSwordsman, //Espadachim
            303: numberHoplite,   //Hoplita
            304: 0,             //Fuzileiro
            305: 0,             //Morteiro
            306: 0,             //Catapulta
            307: 0,             //Aríete
            308: 0,             //Gigante a Vapor
            309: 0,             //Balão-Bombardeio
            310: 0,             //Cozinheiro
            311: 0,             //Médico
            312: 0,             //Girocóptero
            313: 0,             //Arqueiro
            315: numberSpearman,  //Lanceiro
            action: "CityScreen",
            function: "buildUnits",
            actionRequest: this.actionRequest,
            cityId: this.cities.capital.id,
            position: position,
            backgroundView: "city",
            currentCityId: this.cities.capital.id,
            templateView: "barracks",
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async upgradeBuilding(position, level) {

        const data = {
            action: "CityScreen",
            function: "upgradeBuilding",
            actionRequest: this.actionRequest,
            cityId: this.cities.capital.id,
            position: position,
            level: level,
            currentIslandId: this.islandId,
            ajax: 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }



    async assignWorkers(numberWorkers) {

        const data = {
            "action": "IslandScreen",
            "function": "workerPlan",
            "type": "resource",
            "islandId": this.islandId,
            "cityId": this.cities.capital.id,
            "screen": "resource",
            "rw": numberWorkers,
            "backgroundView": "island",
            "currentIslandId": this.islandId,
            "templateView": "resource",
            "actionRequest": this.actionRequest,
            "ajax": 1
        };

        //str:= bot.baseUrl + "/?" + data.Encode()
        const query = querystring.stringify(data);
        const url = this.baseUrl + '/index.php';
        //fmt.Println("Trabalhadores ok")
        const params = {
            url: url,
            body: query
        };

        const html = await this.fetchPage(params)

        await this.getActionRequest(html);
    }

    async fetchPage(params, proxy = null) {
        var headers = {
            'Origin': this.baseUrl,
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'keep-alive',
        };

        const dataString = params.body;

        let options;

        if (this.proxy) {
            options = {
                url: params.url,
                method: 'POST',
                headers: headers,
                body: dataString,
                proxy: this.proxy,
                json: true
            };
        }
        else {
            options = {
                url: params.url,
                method: 'POST',
                headers: headers,
                body: dataString,
                json: true
            };
        }

        return await request(options);
    }

    async createBaseUrl() {
        const url = `http://s${this.server}-${this.country}.ikariam.gameforge.com`;
        this.baseUrl = url;
        //console.log(url)
        return url;
    }
}