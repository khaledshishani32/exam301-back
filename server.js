`use strict`

const express = require('express') // require the express package
const server = express() // initialize your express server instance
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
server.use(cors())
server.use(express.json());
const mongoose = require("mongoose");
const port = process.env.PORT

mongoose.connect("mongodb://localhost:27017/cocktailDB", { useNewUrlParser: true, useUnifiedTopology: true });


const cocktailSchem = new mongoose.Schema({
    strDrink:String,
    strDrinkThumb:String,
    idDrink:String
})

const mycocktailModel =  mongoose.model('cockDB' , cocktailSchem)


server.get('/drinks' , getDrinks)
server.post('/addToFav' , addToFav)
server.get('/myFav' , myFav)

server.get('/delete/:id' , deleteItem)
server.get('/update/:id' , updateItem)

// all drink 
function getDrinks(req , res){
    const url =`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`

    axios.get(url).then(result=>{
        res.send(result.data.drinks)
    })
}


// create or add to fav 

function addToFav(req , res){
    const {strDrink , strDrinkThumb , idDrink } = req.body

    const newArr = new mycocktailModel({
        strDrink:strDrink,
        strDrinkThumb:strDrinkThumb,
        idDrink:idDrink

    })

    newArr.save()
}

//get my fav cocktail
function myFav(req , res){
    mycocktailModel.find({},(error ,data)=>{
        res.send(data)
    })
}


// delete cocktail item 

function deleteItem(req , res){
    const id = req.params.id;

    mycocktailModel.remove({_id:id} , (error , data)=>{
        mycocktailModel.find({} ,(error ,data1)=>{
            res.send(data1)
        })
    })
}

// update cocktail item 

function updateItem(req , res){
    // this name on front 
    const {name  ,img , cocktail_ID} =req.body
    const id = req.params.id;
    
    mycocktailModel.findOne({_id:id} ,(error , data)=>{
        data.strDrink = name;
        data.strDrinkThumb = img;
        data.idDrink = cocktail_ID;
        data.save().then(()=>{
            mycocktailModel.find({} , (error , data1)=>{
                res.send(data1)
            })
        })
    })

}

// a server endpoint 
server.get('/', // our endpoint name
 function (req, res) { // callback function of what we should do with our request
  res.send('Hello World khaled') // our endpoint function response
})
 
server.listen(port) 