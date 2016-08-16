// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IUser.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";
import {hashSync, compareSync} from "bcryptjs";

import * as IUser from '../interfaces/IUser';

var singleton: UsersSchema;

export class UsersSchema {
    private schema: IUser.IUserModel;

    /**
     * Get access to the inner model. 
     * 
     * @returns IUser.IUserModel
     */
    getModel() {
        return this.schema;
    }

    /**
     * Access the account ty userid. This is the primary access method 
     * 
     * @param {string} userid
     * @returns
     */
    getAccountByUserid(userid: string) {
        return this.schema.find({
            where: { userid: userid }
        });
    }

    /**
     * Register a new user  
     * 
     * @param {string} userid
     * @param {string} password
     * @returns {Promise<IUser>}
     */
    register(userid: string, password: string) {
        let hashPwd = hashSync(password);
        return this.schema.create({
            userid: userid,
            password: hashPwd
        });
    }

    checkPasswd(userid: string, password: string) {
        return this.schema.find({
            where: { userid: userid }
        }).then((user: IUser.IUserInstance) => {
            if (compareSync(password, user.password))
                return user;
            else
                throw Error("Incorrect password");
        })
    }

    unregister(userid: string) {
        return this.schema.destroy({
            where: { userid: userid }
        });
    }

    constructor(private db: Sequelize.Connection) {
        this.schema = db.define<IUser.IUserInstance, IUser.IUser>("User", {
            "userid": {
                "type": Sequelize.STRING(64),
                "allowNull": false,
                "primaryKey": true
            },
            "password": {
                "type": Sequelize.STRING(128),
                "allowNull": null
            }
        }, {
                "tableName": "users",
                "timestamps": true,
                "createdAt": "created_at",
                "updatedAt": "updated_at",
            });
    }
}
