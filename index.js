const express = require('express'); 
const bodyParser = require('body-parser');
const busboy = require("connect-busboy");  // Upload de arquivo
const { parse } = require("csv-parse");   // Leitura csv
const db = require("./db");
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
// O CORS é uma especificação do W3C 
// e faz uso de headers do HTTP para informar 
// aos navegadores se determinado recurso pode ser ou não acessado
app.use(cors({
    origin: '*'
}));
// request: Requisicao
// Response: Resposta
app.get("/stock", (request, response) => {
    const listar = async function () {
        const results = await db.selectStock();
        for (const item of results) {
            let status = "";
            const vol = item.volume;
            if (vol > 140) {
                item["status"] = "otimo";
            } else if (vol > 100 && vol < 140) {
                item["status"] = "bom";
            } else if (vol < 100) {
                item["status"] = "critico";
            }
        }
        response.status(200).send(results);
    };
    listar();
});




app.use(busboy());
app.post("/stock/upload", function (req, res) {
    try {
        if (req.busboy) {
            req.busboy.on("file", function (fieldName, fileStream, fileName, encoding, mimeType) {



                fileStream.pipe(parse({ delimiter: ",", from_line: 2 }))
                    .on("data", function (row) {
                        try {
                            // Date,Open,High,Low,Close,Volume
                            let dt = new Date(row[0]);
                            let strDt = dt.toISOString().split("T")[0];

                            let item = {
                                "close": row[4],
                                "date": strDt,
                                "high": row[2],
                                "low": row[3],
                                "open": row[1],
                                "volume": row[5]
                            };

                            const inserir = async function (stock_json) {
                                const result = await db.insertStock(stock_json);
                            };
                            console.log(item)
                            inserir(item);
                        } catch (e) {
                            // declarações para manipular quaisquer exceções
                        };
                    })
                    .on("end", function () {
                        console.log("finished");
                        res.send('upload succeeded!');
                    })
                    .on("error", function (error) {
                        console.log("Erro");
                        res.status(500).send('Arquivo invalido:'); // passa o objeto de exceção para o manipulador de erro
                    });


            });
            return req.pipe(req.busboy);
        }
    }
    catch (e) {
        // declarações para manipular quaisquer exceções
        res.status(500).send('Arquivo invalido:' + error.message); // passa o objeto de exceção para o manipulador de erro
    }

});

app.get("/stock_policy", (request, response) => {
    const listar = async function () {
        const results = await db.selectStockPolicy();

        response.status(200).send(results);
    };
    listar();
});



app.put("/stock_policy", (request, response) => {
    const body = request.body;

    console.log(body)
    const atualizar = async function (data) {
        const results = await db.updateStockPolicy(data)

        response.status(200).send("sucesso");
    };
    atualizar(body);



});


app.use(busboy({ immediate: true }));


app.listen(3001, () => {
    console.log("Servidor vai rodar na porta 3001")
});

