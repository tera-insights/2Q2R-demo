/// <reference path="../../typings/index.d.ts" />

import * as mongoose from 'mongoose';
import ITodos = require('../interfaces/ITodos.ts');

var Schema = mongoose.Schema;

var TodosSchema = new Schema({
    email: String,
    name: String,
    items: [{
        title: String,
        completed: Boolean
    }]
});


export = mongoose.model<ITodos>('Todos', TodosSchema);
