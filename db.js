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
}

module.exports = {selectStock,insertStock}