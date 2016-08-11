/// <reference path="../../typings/index.d.ts" />

import * as Sequelize from 'sequelize';

export interface ITodo {
    id: string;
    userid: string;
    title: string;
    completed: boolean;
}

export interface ITodoInstance
    extends Sequelize.Instance<ITodoInstance, ITodo>, ITodo { }


export interface ITodoModel
    extends Sequelize.Model<ITodoInstance, ITodo> { }
