let setup = require('./setup');

describe("Version", function() {

  beforeAll(setup.run.bind(setup));

  it("getList", function(done) {  
    let sequelize = setup.resolve("$sequelize");
    return sequelize.connection.authenticate().then(() => {
      console.log("connected!")
    }).catch(fail).then(done);
  }, 20000);
});