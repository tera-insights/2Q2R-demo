/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as path from 'path';

export function index(req: express.Request, res: express.Response) {
    res.sendFile(
        path.join(__dirname, '../../public/', 'index.html')
    );
};
