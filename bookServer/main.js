'use strict';

const Datastorage = require('./dataStorageLayer');

const db=new Datastorage();

const { printResource, readData, prompt} = require('./consoleFunctions');

const menuText=`
Choose:

1. Get All
2. Get One
3. Insert
4. Update
5. Remove
6. exit

Your choise (1,2,3,4,5 or 6): `;

menu();

async function menu(){
    let exited=false;

    do{
        const selectedValue=await prompt(menuText);

        switch(selectedValue){
            case '1':
                try{
                    const result= await db.getAll();
                    for(let resource of result){
                        printResource(resource);
                    }
                }
                catch(err){
                    console.log(err);
                }
                break;
            case '2':   
                try{
                    const id = await prompt('Input id: ');
                    const result = await db.get(+id);
                    if(result.message){
                        console.log(result.message);
                    }
                    else {
                        printResource(result);
                    }
                }
                catch(err){
                    console.log(err);
                }
                break;
            case '3':
                try{
                    const result = await db.insert(await readData());
                    console.log(result);
                }
                catch(err){
                    console.log(err);
                }
                break;
            case '4':
                try {
                    const result = await db.update(await readData());
                    console.log(result);
                }
                catch (err) {
                    console.log(err);
                }
                break;
            case '5':
                try {
                    const id = await prompt('Input id: ');
                    const result = await db.remove(+id);
                    console.log(result);
                }
                catch (err) {
                    console.log(err);
                }
                break;
            case '6': exited=true;
                break;
            default:
                console.log('Only 1,2,3,4,5 or 6 are valid');
        }
    }while(!exited);
}



