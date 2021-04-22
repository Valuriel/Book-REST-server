'use strict';

const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

const Datastorage = require('./dataStorageLayer');
const db = new Datastorage();

const { CODES, MESSAGES } =require('./statusCodes');

const {port, host, resource, idKey} = require('./configREST.json');

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get(`/${resource}`,(req,res)=>
    db.getAll()
        .then(result=>res.json(result))
        .catch(error=>res.json(error)));

app.route(`/${resource}/:value`)
    .get((req,res)=>
        db.get(req.params.value)
            .then(result=>res.json(result))
            .catch(error=>res.json(error)))
    .delete((req,res)=> db.remove(req.params.value)
        .then(result=>res.json(result))
        .catch(error=>res.json(error)))
    .put((req,res)=>{
        if(!req.body) return res.sendStatus(400);
        if(req.body[idKey]==req.params.value){
            db.update(req.body)
            .then(result=>res.json(result))
            .catch(error=>res.json(error));
        }
        else {
            res.json(MESSAGES.NOT_UPDATED());
        }  
    });

    app.post(`/${resource}`, async (req,res)=>{
        if (!req.body) return res.sendStatus(400);
        try{
            const status = await db.get(req.body[idKey]);
            if (status.code && status.code === CODES.NOT_FOUND) {
                res.json(await db.insert(req.body));
            }
            else {
                res.json(MESSAGES.NOT_INSERTED());
            }
        }
        catch(error) {
            res.json(MESSAGES.PROGRAM_ERROR());
        }
        
    })


server.listen(port,host, 
    ()=>console.log(`Rest server ${host}:${port} running`));