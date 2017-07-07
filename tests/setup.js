"use strict";

const Qwebs = require("qwebs");

class Setup {
    constructor() {
        this.qwebs = new Qwebs({ dirname: __dirname });
    }
    
    resolve(serviceName) {
        return this.qwebs.resolve(serviceName);
    }

    run(done) {
        return this.qwebs.load().then(() => {
            done();
        }).catch(error => {
            console.error(error);
            done.fail(error);
        });
    }
}

module.exports = new Setup();