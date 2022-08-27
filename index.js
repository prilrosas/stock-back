const express = require('express');
const bodyParser = require ('body-parser');
const { response } = require('express');


const db = require("./db");
const cors = require('cors');
const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));

app.get("/stock", (req, res)=>{
    const response=[
        {
            "close": 56.06,
            "date": "03/18/2022",
            "high": 56.28,
            "low": 54.02,
            "open": 54.19,
            "status": "Bom",
            "volume": "179,189"
          },
          {
            "close": 54.13,
            "date": "03/17/2022",
            "high": 54.9,
            "low": 54.05,
            "open": 54.49,
            "status": "Bom",
            "volume": "100,218"
          },
          {
            "close": 54.65,
            "date": "03/16/2022",
            "high": 54.75,
            "low": 53.53,
            "open": 53.99,
            "status": "Bom",
            "volume": "123,044"
          }
    ]
    res.status(200).send(response);
})
app.post("/stock", (req, res) => {
    const response =req.body;
    response['id']=2
    res.status(200).send(response);
})

app.get("/cliente",(req, res) => {
    const listar = async function() {
        const result = await  db.selectCliente();;
        res.status(200).send(result);
     };
    listar();
})


app.post("/cliente",(req, res) => {
    const cliente = req.body;
    const inserir = async function(c) {
        const result = await  db.insertCliente(c);;
        res.status(201).send(result);
     };
     inserir(cliente);
})


app.listen(3001, () => {
    console.log("Servidor vai rodar na porta 3001")
});

