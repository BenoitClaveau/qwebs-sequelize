let setup = require('./setup');

describe("Version", function() {

  beforeAll(setup.run.bind(setup));

  it("getList", function(done) {  
    return setup.resolve("$version").getList().then(items => {
      expect(items.length).not.toBeUndefined();
    }).catch(error => {
      fail(error);
    }).then(done);
  }, 20000);
});