const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database/db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));    
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));






// Middleware para verificar se um filme existe no banco de dados
async function FilmeNotExist(request, response, next) {
    try {
        const { posicao, titulo } = request.body;
        const filmesNotExists = await db.NameNotExist(posicao, titulo);

        if (filmesNotExists.length === 0) {
            
            next();
        } else {
            
            response.status(400).json({ error: 'Filme já existe' });
        }
    } catch (error) {
        console.error('Erro ao verificar se o filme existe:', error);
        response.status(500).json({ error: 'Ocorreu um erro ao verificar o filme' });
    }
}
// Rota para fazer um select
app.get('/', async (request, response) => {
    try {
        const filmes = await db.GetFilmes();    
        response.render('index', { filmes: filmes });
        
    } catch (error) {
        console.log('Erro ao buscar filmes:', error);
        response.render('index', { filmes: [] })
    }
});


// Rota para inserir um filme
app.post("/inserir",FilmeNotExist, (request, response) => {
    const { posicao, titulo, genero, ano, resolucao, audio, assisti } = request.body


    try {
        db.AddValues(posicao, titulo, genero, ano, resolucao, audio, assisti);
        response.redirect('/');
    } catch (error) {
        console.log('Erro ao inserir um novo filme', error);
        response.status(500).send('Ocorreu um erro ao inserir um novo filme');
    }
});

app.post("/alterar", (request, response) => {
    const { posicao, titulo, genero, ano, resolucao, audio, assisti } = request.body

    try {
        db.ChangeValues(posicao, titulo, genero, ano, resolucao, audio, assisti)
        response.redirect('/')
    }
    catch (error) {
        console.log('Erro ao alterar um filme', error)
        response.status(500).send('Ocorreu um erro ao alterar um filme')
    }
})
app.post('/delete/:posicao', async (request, response) => {
    const posicao = request.params.posicao
    
    try {
        await db.DeleteFilmeByPosicao(posicao)
        const filmes = await db.GetFilmes()
        response.render('index', { filmes: filmes })
    }
    catch(error) {
        console.log('Erro ao remover o filme', error)
        throw new Error ('Ocorreu um erro ao remover o filme')
    }
})



// rotas para rendeziar o ejs => html que é usado no servidor NodeJS

app.get('/inserir', (request, response) => {
    response.render('inserir');
});
app.get('/alterar', (request, response) => {
    response.render('alterar');
});
app.get('/delete/:posicao', (request, response) => {
    response.render('index');
});
app.listen(3333, () => {
    console.log('Server is running');
});
