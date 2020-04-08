//utilização do express para criar o servidor
const express = require("express")
const server = express()

const db = require("./db")

// const ideas = [
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729007.svg",
//         title: "Curso de Programação",
//         category: "Estudo",
//         description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//         url: "https://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729006.svg",
//         title: "Curso de Programação",
//         category: "Estudo",
//         description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//         url: "https://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729003.svg",
//         title: "Curso de Programação",
//         category: "Estudo",
//         description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//         url: "https://www.google.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729008.svg",
//         title: "Curso de Programação",
//         category: "Estudo",
//         description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//         url: "https://www.google.com.br"
//     },
// ]

//configurar arquivos estaticos (CSS, scripts, imagens)
server.use(express.static("public"))

//HABILITAR USO DO REQ.body
server.use(express.urlencoded({extended: true}))


// configuração nunjucks

const nunjuncks = require("nunjucks")
nunjuncks.configure("views", {
    express: server,
    noCache: true,
})


server.listen(3000)

server.get("/", function(req, res) {

    
        db.all(`SELECT * FROM ideas`, function(err, rows){
            if (err) {
                console.log(err)
                return res.send("Erro no banco de dados")
            }

            const reversedIdeas = [...rows].reverse()

            let lastIdeas = []
            for (let idea of reversedIdeas) {
                if(lastIdeas.length < 2){
                    lastIdeas.push(idea)
                }
            }
        
        
            return res.render("index.html", {ideas: lastIdeas})
        })


})

server.get("/ideias", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeas = [...rows].reverse()
        return res.render("ideias.html", {ideas: reversedIdeas})

    })
})

server.post("/", function(req, res){
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?, ?, ?, ?, ?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    
        db.run(query, values, function(err) {
            if (err) {
                console.log(err)
                return res.send("Erro no banco de dados")
            }
        
            return res.redirect("/ideias")
         })
})