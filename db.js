async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
                                              //     mysql://usuario:senha@IP:PORTA/BANCO"

    const connection = await mysql.createConnection("mysql://root:adminadmin@localhost:3306/stock_schema");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}


async function selectCliente(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM cliente;');
    return rows;
}

async function insertCliente(cliente){
    const conn = await connect();
    const sql = 'INSERT INTO cliente(nome,idade) VALUES (?,?);';
    const values = [cliente.nome, cliente.idade];
    return await conn.query(sql, values);
}

module.exports = {selectCliente,insertCliente}