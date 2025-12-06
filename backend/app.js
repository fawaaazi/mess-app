const express = require('express')
const xlsx = require('xlsx')
const path = require('path');
const { json } = require('stream/consumers');
const app = express();
const cors = require("cors")
app.use(express.json());

const allowedOrigin = ["http://127.0.0.1:5501", "http://127.0.0.1:5500", "https://fawaaazi.github.io"]
app.use(cors({
    origin:(origin,callback)=>{
        if(!origin || allowedOrigin.includes(origin)){
            callback(null,true)
        }
        else{
            callback(new Error("CORS not allowed!"))
        }
    }
}))
// const XLSX_PATH = path.join("data,mess,mess.xslx");
function xlsxRead(){
    const workbook = xlsx.readFile("./data/mess.xlsx")
    const sheet = workbook.Strings
     data = sheet.map(element =>({name: element.t}))
     data.pop();
    console.log(data); 
    return data
}

let noOfDaysPresent;
let totalDays;
let totalExpense;
let alavance;
let messBill;
let expensePerDay;
app.get("/",(req, res)=>{
    // res.send("home page")
    res.send(xlsxRead());
})

app.post("/present",(req,res)=>{
     noOfDaysPresent = req.body;
    console.log(req.body)
     totalDays = noOfDaysPresent.reduce((total,current)=> total + current.present,0)
    console.log(totalDays)
    res.send({totalDays})
})

app.post("/expense",(req,res)=>{
    console.log(req.body)
    totalExpense = req.body.totalExpense
    expensePerDay = totalExpense/totalDays
    expensePerDay = expensePerDay.toFixed(2)
    alavance = req.body.alavance
    messBill = noOfDaysPresent.map(element =>({
        name : element.name,
        present : element.present,
        messExpense : element.present * expensePerDay,
        expensePerDay,
        alavance : alavance
    }))
    res.send(messBill)
})
app.listen(5500,()=>{
    console.log("app listnening to port 3000")
})