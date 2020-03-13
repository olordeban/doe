//Configurando o servidor
const express = require("express")
const server = express()

//Configurar conexão BD
const Pool = require('pg').Pool
const db = new Pool({
    user: '',
    password: '',
    host: '',
    port: 5432,
    database: ''
})

//Configurando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//Apresentar arquivos estaticos
server.use(express.static('public'))

//Habilitar body do form
server.use(express.urlencoded({extended: true}))

//Apresentação da página
server.get("/", function (req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.render("Erro no banco de dados!")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})
server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    if (name == "" || email == "" || blood == ""){
        return res.render("indexi.html")
    }
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err){
        if (err) return res.render("indexe.html");
        return res.redirect("/")
    })
})

//Ligando servidor e permitindo acesso
server.listen(3000, function () {
    console.log("Servidor ligado.")
})