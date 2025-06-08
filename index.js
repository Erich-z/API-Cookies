import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 3000;
var listaProduto = [];
const app = express();


app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 15, 
        httpOnly: true,
        secure: false 
    }
}));

app.use(cookieParser());



app.get("/", verificarAutenticacao, (req, res) => {
    const ultimoLogin = req.cookies.ultimoLogin;
    res.send(`
        <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Produtos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #1e3c72, #2a5298);
            font-family: 'Segoe UI', sans-serif;
            min-height: 100vh;
        }

        .form-container,
        .table-container {
            background: #fff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            margin-top: 2rem;
        }

        .form-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #2a5298;
        }

        nav .nav-link {
            color: white !important;
        }

        nav .nav-link:hover {
            text-decoration: underline;
        }

        .navbar-custom {
            background: #152642;
        }
    </style>
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
            <a class="navbar-brand text-white" href="#">Sistema de Produtos</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./listarProdutos">Lista de Produtos</a>
                    </li>
                    <li class="nav-item">
                    <span class="nav-link">${ultimoLogin?"Ultimo login: " + ultimoLogin:""}</span>
                    </li>
                </ul>
                <span class="navbar-text">
                    
                    <a class="nav-link text-white" href="/logout">Logout</a>
                </span>
            </div>
        </div>
    </nav>

    <div class="container">
        <!-- Formulário de Cadastro -->
        <section id="home">
            <div class="form-container">
                <h2 class="form-title">Cadastro de Produto</h2>
                <form method="POST" action="/cadastrarProduto">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="codigo" class="form-label">Código de Barras</label>
                            <input type="text" class="form-control" id="codigoDeBarras" name="codigoDeBarras">
                        </div>
                        <div class="col-md-6">
                            <label for="descricao" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="descricao" name="descricao">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="precoCusto" class="form-label">Preço de Custo</label>
                            <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto">
                        </div>
                        <div class="col-md-6">
                            <label for="precoVenda" class="form-label">Preço de Venda</label>
                            <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="validade" class="form-label">Data de Validade</label>
                            <input type="date" class="form-control" id="datavalidade" name="datavalidade">
                        </div>
                        <div class="col-md-6">
                            <label for="estoque" class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="fabricante" class="form-label">Nome do Fabricante</label>
                        <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante">
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Cadastrar Produto</button>
                </form>
            </div>
        </section>
    </div>

</body>

</html>
        
        
    `)


});


app.post("/cadastrarProduto" , verificarAutenticacao, (req, res) => {
    const codigoDeBarras = req.body.codigoDeBarras;
    const descricao = req.body.descricao;
    const precoCusto = req.body.precoCusto;
    const precoVenda = req.body.precoVenda;
    const dataValidade = req.body.dataValidade;
    const qtdEstoque = req.body.qtdEstoque;
    const nomeFabricante = req.body.nomeFabricante;

    if(codigoDeBarras && descricao && precoCusto && precoVenda && dataValidade && qtdEstoque && nomeFabricante){
        listaProduto.push({
            codigoDeBarras: codigoDeBarras,
            descricao: descricao,
            precoCusto: precoCusto,
            precoVenda: precoVenda,
            dataValidade: dataValidade,
            qtdEstoque: qtdEstoque,
            nomeFabricante: nomeFabricante
        })
        res.redirect("/listarProdutos")
    } else {
        let conteudo = `
      <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Produtos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #1e3c72, #2a5298);
            font-family: 'Segoe UI', sans-serif;
            min-height: 100vh;
        }

        .form-container,
        .table-container {
            background: #fff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            margin-top: 2rem;
        }

        .form-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #2a5298;
        }

        nav .nav-link {
            color: white !important;
        }

        nav .nav-link:hover {
            text-decoration: underline;
        }

        .navbar-custom {
            background: #152642;
        }
    </style>
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
            <a class="navbar-brand text-white" href="#">Sistema de Produtos</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./listarProdutos">Lista de Produtos</a>
                    </li>
                </ul>
                <span class="navbar-text">
                    <a class="nav-link text-white" href="/logout">Logout</a>
                </span>
            </div>
        </div>
    </nav>

    <div class="container">
        <section id="home">
            <div class="form-container">
                <h2 class="form-title">Cadastro de Produto</h2>
                <form method="POST" action="/cadastrarProduto">

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Código de Barras</label>
                            <input type="text" class="form-control" name="codigoDeBarras" value="${codigoDeBarras || ''}">
                            ${!codigoDeBarras ? '<span class="text-danger">Informe o código de barras</span>' : ''}
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Descrição</label>
                            <input type="text" class="form-control" name="descricao" value="${descricao || ''}">
                            ${!descricao ? '<span class="text-danger">Informe a descrição</span>' : ''}
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Preço de Custo</label>
                            <input type="number" step="0.01" class="form-control" name="precoCusto" value="${precoCusto || ''}">
                            ${!precoCusto ? '<span class="text-danger">Informe o preço de custo</span>' : ''}
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Preço de Venda</label>
                            <input type="number" step="0.01" class="form-control" name="precoVenda" value="${precoVenda || ''}">
                            ${!precoVenda ? '<span class="text-danger">Informe o preço de venda</span>' : ''}
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Data de Validade</label>
                            <input type="date" class="form-control" name="dataValidade" value="${dataValidade || ''}">
                            ${!dataValidade ? '<span class="text-danger">Informe a validade</span>' : ''}
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" name="qtdEstoque" value="${qtdEstoque || ''}">
                            ${!qtdEstoque ? '<span class="text-danger">Informe a quantidade</span>' : ''}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Nome do Fabricante</label>
                        <input type="text" class="form-control" name="nomeFabricante" value="${nomeFabricante || ''}">
                        ${!nomeFabricante ? '<span class="text-danger">Informe o fabricante</span>' : ''}
                    </div>

                    <div class="mb-3 text-center">
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                        <a href="/" class="btn btn-secondary">Voltar</a>
                    </div>

                </form>
            </div>
        </section>
    </div>
</body>
</html>
        `;

        res.send(conteudo);
    }
});




app.get("/login", (req, res) => {
 res.send(`
    <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Sistema de Produtos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #1e3c72, #2a5298);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', sans-serif;
        }

        .form-container {
            background: #fff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
        }

        .form-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #2a5298;
        }
    </style>
</head>

<body>
    <div class="form-container">
        <h2 class="form-title">Login</h2>
        <form method="POST" action="/login">
            <div class="mb-3">
                <label for="email" class="form-label">Usuario</label>
                <input type="text" name="usuario" class="form-control" id="usuario">
            </div>
            <div class="mb-3">
                <label for="senha" class="form-label">Senha</label>
                <input type="password" name="senha" class="form-control" id="senha">
            </div>
            <!--<span style="color: red;">Usuário ou senha inválidos!</span>-->
            <button type="submit" class="btn btn-primary w-100">Entrar</button>
        </form>
    </div>
</body>

</html>
    
    `)
});


app.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if (usuario == "admin" && senha == "123"){
        req.session.logado = true;
        const dataHoraAtuais = new Date();
        res.cookie('ultimoLogin',dataHoraAtuais.toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30});
        res.redirect("/");
    }
    else{
         res.send(`
            <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Sistema de Produtos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #1e3c72, #2a5298);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', sans-serif;
        }

        .form-container {
            background: #fff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
        }

        .form-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #2a5298;
        }
    </style>
</head>

<body>
    <div class="form-container">
        <h2 class="form-title">Login</h2>
        <form method="POST" action="/login">
            <div class="mb-3">
                <label for="email" class="form-label">Usuario</label>
                <input type="text" name="usuario" class="form-control" id="usuario">
            </div>
            <div class="mb-3">
                <label for="senha" class="form-label">Senha</label>
                <input type="password" name="senha" class="form-control" id="senha">
            </div>
            <span style="color: red;">Usuário ou senha inválidos!</span>
            <button type="submit" class="btn btn-primary w-100">Entrar</button>
        </form>
    </div>
</body>

</html>
    `);
    }
    
});

app.get("/listarProdutos", verificarAutenticacao, (req, res) => {
    let tabela = "";
    const ultimoLogin = req.cookies.ultimoLogin;

    if (listaProduto.length > 0) {
        for (let p of listaProduto) {
            tabela += `
                <tr>
                    <td>${p.codigoDeBarras}</td>
                    <td>${p.descricao}</td>
                    <td>${p.precoCusto}</td>
                    <td>${p.precoVenda}</td>
                    <td>${p.dataValidade}</td>
                    <td>${p.qtdEstoque}</td>
                    <td>${p.nomeFabricante}</td>
                </tr>
            `;
        }
    } else {
        tabela = `<tr><td colspan="7" class="text-center">Nenhum produto cadastrado ainda.</td></tr>`;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Listar Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
            background: linear-gradient(to right, #1e3c72, #2a5298);
            font-family: 'Segoe UI', sans-serif;
            min-height: 100vh;
        }

        .form-container,
        .table-container {
            background: #fff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            margin-top: 2rem;
        }

        .form-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #2a5298;
        }

        nav .nav-link {
            color: white !important;
        }

        nav .nav-link:hover {
            text-decoration: underline;
        }

        .navbar-custom {
            background: #152642;
        }
            </style>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-custom">
                <div class="container-fluid">
                    <a class="navbar-brand text-white" href="/">Sistema de Produtos</a>
                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/listarProdutos">Lista de Produtos</a>
                            </li>
                             <li class="nav-item">
                        <span class="nav-link">${ultimoLogin?"Ultimo login: " + ultimoLogin:""}</span>
                        </li>
                        </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="/logout">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container">
                <div class="tabela-produtos">
                    <h2 class="text-center mb-4 text-white">Produtos Cadastrados</h2>
                    <table class="table table-bordered table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>Código de Barras</th>
                                <th>Descrição</th>
                                <th>Preço Custo</th>
                                <th>Preço Venda</th>
                                <th>Validade</th>
                                <th>Estoque</th>
                                <th>Fabricante</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tabela}
                        </tbody>
                    </table>
                    <div class="text-center mt-3">
                        <a href="/" class="btn btn-secondary">Voltar</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});


function verificarAutenticacao(req, res, next) {  
    if (req.session.logado){
        next();
    }
    else{
        res.redirect("/login");
    }
}


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});


app.listen(port, host, () => {
    console.log(`Servidor em execução em http://localhost:${port}/`);
});
