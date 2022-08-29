async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
     // require: importação de nodejs
    //     mysql://usuario:senha@IP:PORTA/BANCO"

    const connection = await mysql.createConnection("mysql://root:adminadmin@localhost:3306/stock_schema");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}


async function selectStock(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM stock;');
    return rows;
}

async function insertStock(stock){
    const conn = await connect();
    const sql = 'INSERT INTO stock (close, date, high, low,open, volume) VALUES (?,?,?,?,?,?);';
    const values = [stock.close, stock.date, stock.high, stock.low,stock.open, stock.volume];
    return await conn.query(sql, values);
};


async function selectStockPolicy(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM stock_policy;');
    return rows;
};

async function insertStockPolicy(data){
    const conn = await connect();
    const sql = 'insert into stock_policy (critico_menor_que,bom_menor_que,bom_maior_que,otimo_maior_que)  values(?,?,?,?)';
    const values = [data.critico_menor_que, data.bom_maior_que, data.bom_menor_que, data.otimo_maior_que];
    return await conn.query(sql, values);
};

async function updateStockPolicy(data){
    const conn = await connect();
    const sql = 'update stock_policy set critico_menor_que = ? ,bom_menor_que = ? ,bom_maior_que = ? ,otimo_maior_que = ? where idstock_policy=?';
    const values = [data.critico_menor_que,data.bom_menor_que, data.bom_maior_que,  data.otimo_maior_que, data.idstock_policy];
    return await conn.query(sql, values);
};

// Funções disponiveis para outros arquivos
module.exports = {selectStock,insertStock,selectStockPolicy,insertStockPolicy,updateStockPolicy}