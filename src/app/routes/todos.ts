/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains routes for storing user todo lists
 */

import * as express from 'express';

import Todos = require('../models/Todos');
import ITodos = require('../interfaces/ITodos');

// GET: /todos
export function get(req: express.Request, res: express.Response) {
    // injected by passport
    var email = req.user;

    if (!email)
        res.status(401).send("User not logged in");
    else {
        Todos.findOne({
            email: email
        }, (err, todos: ITodos) => {
            if (err) {
                res.status(404).send("Todos not initialized.");
            } else {
                res.json(todos);
            }
        })
    }

}

// POST: /todos
export function create(req: express.Request, res: express.Response) {
    // injected by passport
    var email = req.user;
    var todos = new Todos(req.body);
    todos.email = email;

    if (!email)
        res.status(401).send("User not logged in");
    else {
        Todos.findOne({
            email: email
        }, (t: ITodos) => {
            if (t._id)
                todos._id = t._id;
            todos.save(err => {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(todos);
            });
        });
    }

}
