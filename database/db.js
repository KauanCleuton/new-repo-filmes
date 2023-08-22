
const mysql = require('mysql');


const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "dbfilmes"
};

const connection = mysql.createConnection(dbConfig);


connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw new Error('Ocorreu um erro ao conectar ao banco de dados.');
    }
    console.log('Conexão feita com sucesso');
});


const AddValues = async (posicao, titulo, genero, ano, resolucao, audio, assisti) => {
        const connection = mysql.createConnection(dbConfig)
        const AddValuesQuery = 'INSERT INTO tbfilmes (posicao, titulo, genero, ano, resolucao, audio, assisti) VALUES (?, ?, ?, ?, ?, ?, ?) '
        const valuesQuery = [posicao, titulo, genero, ano, resolucao, audio, assisti]
        connection.connect()
        connection.query(AddValuesQuery, valuesQuery, (error, results) => {
            if(error) {
                console.log("Erro ao adicionar um filme no banco de dados")
            }
            else {
                console.log("Filme adicionado com sucesso! ")
            }
        })
        connection.end();
}

const GetFilmes = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM tbfilmes', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// No seu arquivo db.js

const NameNotExist = (posicao, titulo) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM tbfilmes WHERE posicao = ? AND titulo = ?', [posicao, titulo], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const ChangeValues = async (posicao, titulo, genero, ano, resolucao, audio, assisti) => {
        const connection = mysql.createConnection(dbConfig)
        const updateQuery = 'UPDATE tbfilmes SET posicao = ?, titulo = ?, genero = ?, ano = ?, resolucao = ?, audio = ?, assisti = ? WHERE posicao = ?'

        const valuesQuery = [posicao, titulo, genero, ano, resolucao, audio, assisti, posicao]

        connection.query(updateQuery, valuesQuery, (error, results) => {
            if(error) {
                console.log('Error ao alterar um filme', error)
            }
            else {
                console.log(`Filme da posicao ${posicao} alterado com sucesso! `)
            }
        })
        
        connection.end()
       
}

const DeleteFilmeByPosicao = async (posicao) => {
    const connection = mysql.createConnection(dbConfig)

    connection.connect()

    const deleteQuery = "DELETE FROM tbfilmes WHERE posicao = ?"

    connection.query(deleteQuery, [posicao], (error, results) => {{
        if(error) {
            console.error('Erro ao excluir o filme:', error);
        }
        else {
            console.log(`Filme na posição ${posicao} removido com sucesso`)
        }
        connection.end()
    }})
}

module.exports = {
    AddValues,
    GetFilmes,
    NameNotExist,
    ChangeValues,
    DeleteFilmeByPosicao
};


