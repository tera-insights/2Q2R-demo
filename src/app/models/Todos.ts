/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/ITodos.ts" />
/// <reference path="../interfaces/IUser.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";

import * as ITodos from '../interfaces/ITodos';
import * as IUser from '../interfaces/IUser';

/**
 * This class implements Todo schemas and operations on them 
 * 
 * @class TodosSchema
 */
export class TodosSchema {
    private schema: ITodos.ITodoModel;

    /**
     * Method to connect the two schemas with foreign keys and 1:n relationships 
     * 
     * @param {IUser.IUserModel} users
     */
    connectUsers(users: IUser.IUserModel) {
        this.schema.belongsTo(users);
        users.hasMany(this.schema);
    }

    /**
     * Create a todo
     * 
     * @param {string} userid
     * @param {string} title
     * @param {boolean} completed
     * @returns {Promise<ITodo>}
     */
    create(userid: string, title: string, completed: boolean) {
        return this.db.transaction(
            (transaction: Sequelize.Transaction) => {
                let id = uuid.v4();
                return this.schema.create({
                    id: id,
                    userid: userid,
                    title: title,
                    completed: completed
                }, { transaction: transaction });
            }
        )
    }

    /**
     * Update the info of a todo item 
     * 
     * @param {string} userid   Exisging userid
     * @param {string} id       Existing id
     * @param {string} title    New title
     * @param {boolean} completed   New completion status
     * @returns {Promise<ITodo>}
     */
    update(userid: string, id: string, title: string, completed: boolean) {
        return this.schema.update({
            title: title,
            id: id,
            completed: completed,
            userid: userid
        }, {
                where: { id: id },
                fields: ['completed']
            }).then((res) => {
                return this.schema.findById(id); 
            });
    }

    /**
     * Delete a specifig todo
     * 
     * @param {string} userid
     * @param {string} id
     * @returns {Promise<number>}
     */
    delete(userid: string, id: string) {
        return this.schema.destroy({
            where: { id: id, userid: userid }
        });
    }

    /**
     * Get all todos of a given user 
     * 
     * @param {string} userid
     * @returns {Promise<ITodo[]>}
     */
    get(userid: string) {
        return this.schema.findAll({
            where: { userid: userid }
        });
    }

    /**
     * Delete user todos given the userid 
     * 
     * @param {string} userid
     * @returns
     */
    deleteUser(userid: string) {
        return this.schema.destroy({
            where: { userid: userid }
        });
    }

    constructor(private db: Sequelize.Connection) {
        this.schema = db.define<ITodos.ITodoInstance, ITodos.ITodo>("Todo", {
            "id": {
                "type": Sequelize.UUID,
                "allowNull": false,
                "primaryKey": true
            },
            "userid": {
                "type": Sequelize.STRING(64),
                "allowNull": false
            },
            "title": {
                "type": Sequelize.STRING(128),
                "allowNull": false,
            },
            "completed": {
                "type": Sequelize.BOOLEAN,
                "allowNull": false
            }
        }, {
                "tableName": "todos"
            });
    }
}
