# qwebs-sequelize
[Sequelize](http://docs.sequelizejs.com/) service for [Qwebs server](https://www.npmjs.com/package/qwebs).

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]

## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)
  * [Sequelize](http://docs.sequelizejs.com/)
  * Singleton

```js
return $sequelize.db.then(db => {
  //db is a singleton Sequelize Db instance
});
```

### Add the sequelize connection string in config.json

Please consult the [sequelize configuration section](http://docs.sequelizejs.com/manual/installation/getting-started.html#setting-up-a-connection).

```json
{
	"sequelize": {
        "database": "<host>",
        "username": "<username>",
        "password": "<password>",
        "options": {
        "dialect": "mysql|sqlite|postgres|mssql",
            "dialectOptions": {
                "instanceName": "SQLEXPRESS",
                "database": "<database>"
            }
        }
    }
}
```

### Declare and inject $sequelize

#### Via route.json
```routes.json
{
  "services": [
    { "name": "$sequelize", "location": "qwebs-sequelize" }
  ]
}
```

#### Or in javascript
```js
const Qwebs = require("qwebs");
const qwebs = new Qwebs();

qwebs.inject("$sequelize" ,"qwebs-sequelize");
```

### Use $sequelize service

```js
class MyService {
  constructor($sequelize) {
    this.$sequelize = $sequelize;
  };

  insert(request, response) {
    return this.$sequelize.db.then(db => {
        db.user.findAll().then(results => {
            return results.map(p => p.get());
        }).then(users => {
        return response.send({ request: request, content: data });
        });
    });
  );
};

exports = module.exports = MyService; //Return a class. Qwebs will instanciate it;
```

## Installation

### Database MSSQL Server

#### Activate TCP/IP on MSSQL server

[Open Sql Server Configuration Manager](https://manuel-rauber.com/2015/11/08/connect-to-ms-sql-using-node-js-and-sequelizejs/) (C:\Windows\SysWOW64\SQLServerManager13.msc)

1. Click on "Configuration du réseau SQL Server"
2. Open SQL Server Instance
3. Activate TCP/IP
4. Click on Services SQL Server
5. Restart SQL Server
6. Atart or restart SQL Server Browser

### API

1. Install node.js
2. Install git
3. git clone https://github.com/BenoitClaveau/qwebs-sequelize.git
4. npm install -g pm2
5. npm install -g gulp


## Hosting

### Throught IIS

#### URL routing 

>:80 -> IIS
>:80/api -> :3000 (node.js)

1. [Install URL-Rewrite module on ISS](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Select the web site.
3. Creating Rewrite Rules
4. Create a reverse proxy with regular extension.
5. ex: ^api(\/(.+))?$ -> R:2 contains the substring after api/ 