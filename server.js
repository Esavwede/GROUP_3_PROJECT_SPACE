const http = require('http');
const url = require('url');
const fs = require('fs');

const server= http.createServer((req, res)=>{
    const pathName = req.url;
    if(pathName === '/'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const indexPage = fs.readFileSync(`${__dirname}/pages/index.html`, 'utf-8')
        res.end(indexPage)
    } else if(pathName === '/about'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const aboutPage = fs.readFileSync(`${__dirname}/pages/about.html`, 'utf-8')
        res.end(aboutPage)
    } else if (pathName === '/sys'){
        res.end('Saving...')
    } else {
        res.writeHead(404, {'Content-type': 'text/html'})
        const notFound = fs.readFileSync(`${__dirname}/pages/404.html`, 'utf-8' )
        res.end(notFound)
    }
});

const port = 5000;
const hostName= '127.0.0.1'
server.listen(port, hostName, ()=>{
    console.log(`Server runninig on port ${port}`)
})
