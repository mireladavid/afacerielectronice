var express = require('express')
var Sequelize = require('sequelize')

var sequelize = new Sequelize('CARTI', 'student', 'proiectae', {
    dialect: "mysql",
    host: "localhost"
})

sequelize.authenticate().then(() => {
    console.log("Connected to database")
}).catch(() => {
    console.log("Unable to connect to database")
})

var Carti = sequelize.define('carti', {
    nume: Sequelize.STRING,
    autor: Sequelize.STRING,
    pret: Sequelize.STRING
})

var app = express()
app.use(express.static('frontend'))

app.use(express.json());       
app.use(express.urlencoded());

app.get('/createdb', (request, response) => {
    sequelize.sync({force: true}).then(() => {
        response.status(200).send('tables created')
    }).catch((err) => {
        response.status(500).send('could not create tables')
    })
})

//afisare produse
app.get('/catalog', (request, response) => {
    Carti.findAll().then((results) => {
        response.status(200).json(results)
    })
})

//adaugare produse
app.post('/carti', (request, response) => {
    Carti.create(request.body).then((result) => {
        response.status(201).json(result)
    }).catch((err) => {
        response.status(500).send("resource not created")
    })
})

//eliminare
app.delete('/carti/:id', (request, response) => {
    Carti.findByPk(request.params.id).then((nume) => {
        if(nume) {
            nume.destroy().then((result) => {
                response.status(204).send()
            }).catch((err) => {
                console.log(err)
                response.status(500).send('database error')
            })
        } else {
            response.status(404).send('resource not found')
        }
    }).catch((err) => {
        console.log(err)
        response.status(500).send('database error')
    })
})



app.listen(8080)