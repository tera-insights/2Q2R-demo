/// <reference path="../../typings/index.d.ts" />

import * as Sequelize from 'sequelize';

export interface IUser {
    id: string;
    userid: string;
    password: string;
}

export interface IUserInstance
    extends Sequelize.Instance<IUserInstance, IUser>, IUser { }


export interface IUserModel
    extends Sequelize.Model<IUserInstance, IUser> { }
