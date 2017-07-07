/*!
 * qwebs-sequelize
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com> / CABASI
 * MIT Licensed
 */
"use strict";

const DataError = require("qwebs").DataError;
const SequelizeService = require("../qwebs-sequelize");
const pluralize = require('pluralize');

class CrudService {
    constructor(tableName, $sequelize) {
        if (!tableName) throw new DataError({ message: "tableName isn't defined." });
        if (!$sequelize) throw new DataError({ message: "$sequelize isn't defined." });
        if ($sequelize instanceof SequelizeService == false) throw new DataError({ message: "$sequelize isn't a SequelizeService." });
        
        this.$sequelize = $sequelize;
        this.tableName = tableName;
        this.objectName = pluralize.singular(tableName);
    };

    /* rest handlers ------------------------------------------------*/

    getById(request, response) {
        let id = request.params ? request.params.id : request.query ? request.query.id : null;
        if (!id) throw new DataError({ message: "Id is not defined." });
        return this.dbGetById(id).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    save(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.dbSave(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    saveList(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.dbSaveList(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    deleteById(request, response) {
        let id = request.params ? request.params.id : request.query ? request.query.id : null;
        if (!id) throw new DataError({ message: "Id is not defined." });
        return this.dbDeleteById(id).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    delete(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.dbDelete(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    deleteList(request, response) {
        if (!request.body) throw new DataError({ message: "Request body is not defined." });
        return this.dbDeleteList(request.body).then(content => {
            return response.send({ request: request, content: content });
        });
    };

    /* primitives ------------------------------------------*/

    get table() {
        return this.$sequelize[this.objectName];
    };

    dbGetById(id) {
        return this.table.then(table => {
            if (!id) throw new DataError({ message: "Id isn't defined." });
            if (id instanceof ObjectID == false) id = new ObjectID(id);
            return table.findOne({ _id: id }).then(object => {
                if (!object) throw new DataError({ message: `${this.objectName} isn't defined.` });
                return object;
            });
        });
    };

    dbGet(query) {
        return this.table.then(table => {
            if (!query) throw new DataError({ message: "Query isn't defined." });
            return table.findOne(query).then(object => {
                if (!object) throw new DataError({ message: `${this.objectName} isn't defined.` });
                return object;
            });
        });
    };

    dbArray(query, options) {
        query = query || {};
        options = options || {};

        return this.table.then(table => {
            let q = table.find(query);
            if (options.limit) q = q.limit(options.limit);
            if (options.skip) q = q.skip(options.skip);
            if (options.sort) q = q.sort(options.sort);

            return q.toArray();
        });
    };

    dbStream(query, options) {
        query = query || {};
        options = options || {};

        return this.table.then(table => {
            let q = table.find(query);
            if (options.limit) q = q.limit(options.limit);
            if (options.skip) q = q.skip(options.skip);
            if (options.sort) q = q.sort(options.sort);

            return q.stream();
        });
    };

    dbCount(query) {
        query = query || {};

        return this.table.then(table => {
            return this.count(query);
        });
    };

    dbSave(object) {
        return this.dbGetById(object._id).then(previous => {
            return this.dbUpdate(object);
        }).catch(error => {
            if (error.message != `${this.objectName} isn't defined.`) throw error;
            return this.dbInsert(object);
        });
    };

    dbSavetList(objects) {
        return Promise.all(objects.map(object => {
            return this.dbSave(object);
        }));
    };

    dbInsert(object) {
        return this.table.then(table => {
            delete object._id;
            return table.insertOne(object).then(res => {
                return res.ops[0];
            });
        });
    };

    dbInsertList(objects) {
        return Promise.all(objects.map(object => {
            return this.dbInsert(object);
        }));
    };

    dbUpdate(object) {
        return this.table.then(table => {
            if (object._id instanceof ObjectID == false) object._id = new ObjectID(object._id);
            let copy = Object.assign({}, object);
            delete copy._id;
            return table.updateOne({ _id: object._id }, object).then(res => {
                return this.dbGetById(object._id);
            });
        });
    };

    dbUpdateList(objects) {
        return Promise.all(objects.map(object => {
            return this.dbUpdate(object);
        }));
    };

    dbDeleteById(id) {
        return this.table.then(table => {
            if (!id) throw new DataError({ message: "Id isn't defined." });
            if (id instanceof ObjectID == false) id = new ObjectID(id);
            return table.deleteOne({ _id: id });
        });
    };

    dbDelete(object) {
        return this.dbDeleteById(object._id);
    };

    dbDeleteList(objects) {
        return Promise.all(objects.map(object => {
            return this.dbDelete(object);
        }));
    };

    dbDrop(options) {
        return this.table.then(table => {
            return table.drop(options);
        });
    };

    dbCreateIndex(fieldOrSpec, options) {
        return this.table.then(table => {
            return table.createIndex(fieldOrSpec, options);
        });
    };
};

exports = module.exports = CrudService;



