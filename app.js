const http = require('http')
const url = require('url')

const objUsers = require('./services/users')
const fs = require('fs')
const EventEmitter = require('events')
const event = new EventEmitter()


event.on('end', (data) => {
    console.log("Se ha emitido la lectura")
    console.log(data)
    console.log("************************")
})

event.on('error', () => {
    console.log("Ocurrio un error al leer el archivo")
})

http.createServer(function (req, resp) {
    let method = req.method
    let urlLink = req.url
    let route = url.parse(urlLink, true, false).pathname
    if (method === 'GET') {
        if (route === '/v1/users') {
            let lstUsers = objUsers.getUsers()
            resp.end(JSON.stringify({ status: 200, data: lstUsers }));
        }
        if (route === '/v1/files') {
            fs.readFile('./files/readFile.txt', 'utf8', (err, data) => {
                if (err) {
                    event.emit('error')
                } else {
                    event.emit('end', data)
                }
            })
            resp.end(JSON.stringify({ status: 200, msg: "Data read" }));
        }
        else {
            resp.statusCode = 404
            resp.end(JSON.stringify({ status: 404, msg: "its imposible to find the resource" }));
        }
    } if (method === 'POST') {
        if (route === '/v1/users') {
            let body = ''
            req.on('data', function (chunk) {
                body += chunk
            })
            req.on('end', function () {
                let objBody = JSON.parse(body)
                let id = objUsers.saveUsers(objBody)
                resp.end(JSON.stringify({ status: 200, id: id, msg: "New record avaliable" }));
            })
        } else {
            resp.statusCode = 404
            resp.end(JSON.stringify({ status: 404, msg: "its imposible to find the resource" }));
        }
    } else {
        resp.statusCode = 500
        resp.end(JSON.stringify({ msg: "not found" }));
    }
    resp.writeHead(200, { "Content-Type": "text/html" });
    resp.write("<h1>Hola Mundo</h1>");
    resp.writeHeader(200);
}).listen(8000)