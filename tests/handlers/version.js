class VersionHandler {

    constructor($version) {
        this.$version = $version;
    }

    hello(request, response) {
        return response.send({ request: request, content: { text: `hello @${new Date()}` }});
    }

    list(request, response) {
        return this.$version.getList().then(content => {
            response.send({ request: request, content: content });
        });
    }
}

module.exports = VersionHandler;

