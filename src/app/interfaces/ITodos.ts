/// <reference path="../../typings/index.d.ts" />

import * as mongoose from 'mongoose';

interface ITodoItem {
    title: string;
    completed: boolean;
}

interface ITodos extends mongoose.Document {
    /**
     * Userid/email of user owning the todos 
     * 
     * @type {string}
     */
    email: string;
    /**
     * The displayable name of the todos 
     * 
     * @type {string}
     */
    name: string;

    /**
     * List of todos. 
     * 
     * @type {ITodoItem[]}
     */
    items: ITodoItem[];
}

export = ITodos;
