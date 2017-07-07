/*!
 * qwebs-mongo
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const DataError = require("qwebs").DataError;
const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");

class SequelizeService {
    constructor($qwebs, $config) {
      if (!$config) throw new DataError({ message: "$config is not defined." });
      if (!$config.sequelize.connectionString) {
        if (!$config.sequelize) throw new DataError({ message: "Sequelize config is not defined." });
        if (!$config.sequelize.connection.database) throw new DataError({ message: "Sequelize connection is not defined." });
        if (!$config.sequelize.connection.database) throw new DataError({ message: "Sequelize database is not defined." });
        if (!$config.sequelize.connection.username) throw new DataError({ message: "Sequelize username is not defined." });
        if (!$config.sequelize.connection.password) throw new DataError({ message: "Sequelize password is not defined." });
      }
      if (!$config.sequelize.models) throw new DataError({ message: "Sequelize models locations is not defined." });

      $config.sequelize.models = path.resolve($config.root, $config.sequelize.models);

      if ($config.sequelize.connectionString) this.connection = new Sequelize($config.sequelize.connectionString);
      else this.connection = new Sequelize($config.sequelize.connection.database, $config.sequelize.connection.username, $config.sequelize.connection.password, $config.sequelize.options);

      this._load();
      this._associate();
    }


    _load() {
      fs.readdirSync(this.$config.models).filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
      }).forEach(function(file) {
        var model = this.connection.import(path.join(__dirname, file));
        this[model.name] = model;
      }.bind(this));
    }

    _associate() {
      Object.keys(this).forEach(function(modelName) {
        if ("associate" in this[modelName]) {
          this[modelName].associate(this);
        }
      }.bind(this));
    }
}

module.exports = SequelizeService;
