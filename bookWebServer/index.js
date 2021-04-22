'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const fetch=require('node-fetch');

const {port,host} = require('./config.json');

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'pageviews'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>res.render('menu'));

app.get('/all', async (req,res)=>{
    try{
        const result = 
            await fetch('http://localhost:4000/books',{mode:'cors'});
        const data = await result.json();
        res.render('allpage',{data});
    }
    catch(error){
        fetchError(res);
    }
});

app.route('/getone')
    .get((req,res)=>res.render('getform',{title:'Get',header:'Get', action:'/getone'}))
    .post(async (req,res)=>{
        try{
            const bookID=req.body.bookID;
            const result = 
                await fetch(`http://localhost:4000/books/${bookID}`, { mode: 'cors' });
            const data = await result.json();
            res.render('bookpage',{data})
        }
        catch(error){
            fetchError(res)
        }      
});

app.route('/remove')
    .get((req, res) => res.render('getform', { 
        title: 'Remove', 
        header: 'Remove', 
        action: '/remove' }))
    .post(async (req, res) => {
        try {
            const bookID = req.body.bookID;
            const options={
                method:'DELETE',
                mode: 'cors'
            };
            const result =
                await fetch(`http://localhost:4000/books/${bookID}`,options);
            const data = await result.json();
            res.render('statuspage', { status:data });
        }
        catch (error) {
            fetchError(res)
        }
});

app.get('/insertform', (req,res)=>
    res.render('form',{
        title:'Add a book',
        header:'Book data',
        action:'/insert',
        bookID:{value:'', readonly:''},
        name: { value: '', readonly:'' },
        author: { value: '', readonly:'' },
        type: { value: '', readonly:'' },
        year: { value: '', readonly:'' }
    })
);

app.post('/insert', async (req,res)=>{
    try{
        const options={
            method:'POST',
            body:JSON.stringify(req.body),
            mode:'cors',
            headers:{
                'Content-Type':'application/json'
            }
        };

        const result = await fetch('http://localhost:4000/books',options);
        const data= await result.json();
        res.render('statuspage', { status: data });
    }
    catch(error){
        fetchError(res);
    }
});

app.get('/updateform', (req, res) =>
    res.render('form', {
        title: 'Update a book',
        header: 'Book data',
        action: '/updatedata',
        bookID: { value: '', readonly: '' },
        name: { value: '', readonly: 'readonly' },
        author: { value: '', readonly: 'readonly' },
        type: { value: '', readonly: 'readonly' },
        year: { value: '', readonly: 'readonly' }
    })
);

app.post('/updatedata', async (req,res)=>{
    try{
        const bookID = req.body.bookID;
        const result =
            await fetch(`http://localhost:4000/books/${bookID}`, { mode: 'cors' });
        const data = await result.json();
        if(data.message) {
            res.render('statuspage', { status: data });
        }
        else {
            res.render('form', {
                title: 'Update a book',
                header: 'Book data',
                action: '/update',
                bookID: { value: data.bookID, readonly: 'readonly' },
                name: { value: data.name, readonly: '' },
                author: { value: data.author, readonly: '' },
                type: { value: data.type, readonly: '' },
                year: { value: data.year, readonly: '' }
            });
        }  
    }
    catch(error){
        fetchError(res);
    }
});

app.post('/update', async (req,res)=>{
    try {
        const options = {
            method: 'PUT',
            body: JSON.stringify(req.body),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const result = await fetch(`http://localhost:4000/books/${req.body.bookID}`, options);
        const data = await result.json();
        res.render('statuspage', { status: data });
    }
    catch (error) {
        fetchError(res);
    }
});

server.listen(port,host,
    ()=>console.log(`Server ${host}:${port} running`));


function fetchError(res) {
        const status = { message: 'Failed to fetch', type: 'error' }
        res.render('statuspage', { status })
    }