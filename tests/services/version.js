class VersionService {

    constructor($sequelize) {
        this.$sequelize = $sequelize;
    }

    getList() {
        let options = {};
        return this.$sequelize.version.findAll(options).then(results => {
            return results.map(item => item.get());
        });
    }
}

module.exports = VersionService;