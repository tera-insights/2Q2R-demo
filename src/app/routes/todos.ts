/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains routes for storing user todo lists
 */

import * as express from 'express';
import {Todos} from '../models';

// GET: /todos
export function get(req: express.Request, res: express.Response) {
    Todos.get(req.user.userid).then(
        (todos) => {
            res.json(todos);
        }, (err) => {
            res.status(404).send(err);
        }
    );
}

// POST: /todos
export function create(req: express.Request, res: express.Response) {
    Todos.create(
        req.user.userid,
        req.body.title,
        req.body.completed
    ).then(
        (todo) => {
            res.json(todo);
        }, (err) => {
            res.status(404).send(err);
        }
        );
}

// PUT: /todos/:id
export function update(req: express.Request, res: express.Response) {
    Todos.update(
        req.user.userid,
        req.params.id,
        req.body.title,
        req.body.completed
    ).then(
        (todo) => {
            res.json(todo);
        }, (err) => {
            res.status(404).send(err);
        }
        );
}

// DELETE: /todos
export function remove(req: express.Request, res: express.Response) {
    Todos.delete(
        req.user.userid,
        req.params.id
    ).then(
        () => {
            res.status(200).send("OK");
        }, (err) => {
            res.status(404).send(err);
        }
        )
}
