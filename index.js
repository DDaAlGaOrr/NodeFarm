const fs = require('fs')
const http = require('http')
const url = require('url')
//FILES
/* --------------------------------------------------------------------------------------------------------- */
// read and write files in node js blocking
// const textin = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(textin)
// const textOut = `This is what we know about the avocado: ${textin}. \n create on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('file written')
/* --------------------------------------------------------------------------------------------------------- */
// read and write files in node js aynchronously
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     if(err){
//         return console.log('error 😘')
//     }
//     console.log(data1)
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
//             console.log(data3)

//             fs.writeFile('./txt/final.txt',`${data2} \n ${data3}`,err =>{
//                 console.log('your file has been written 👿')
//             })
//         })
//     })
// })
// console.log('will read file')
//HTTP SERVER
const replaceTemplate = (template,product)=>{
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName)
        output = output.replace(/{%IMAGE%}/g, product.image)
        output = output.replace(/{%QUANTITY%}/g, product.quantity)
        output = output.replace(/{%PRICE%}/g, product.price)
        output = output.replace(/{%ID%}/g, product.id)
        output = output.replace(/{%FROM%}/g, product.from)
        output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
        output = output.replace(/{%DESCRIPTION%}/g, product.description)
        if(!product.organic){
            output = output.replace(/{%NOT_ORGANIC%}/,'not-organic')
        }
        return output
}
/* --------------------------------------------------------------------------------------------------------- */       
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const templatecard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-Product.html`,'utf-8')
const dataObj = JSON.parse(data)
/* --------------------------------------------------------------------------------------------------------- */
const server = http.createServer((req, res)=>{
    const { query, pathname}  = url.parse(req.url,true)
    console.log(pathname)
    // const pathname = req.url
    //overview
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type':'text/html'})
        const cardsHTML = dataObj.map(ele=>replaceTemplate(templatecard,ele)).join('')
        // console.log(cardsHTML)
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML)
        res.end(output)
    }
    //product
    else if(pathname === '/product'){
        res.writeHead(200,{'Content-type':'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(templateProduct,product)
        res.end(output)
    }
    //api
    else if(pathname === '/api'){
        res.writeHead(200,{
            'Content-type':'application/json',
            'My-own-header': 'hello'
        })
        res.end(data)
    }
    // not found
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'My-own-header': 'hello'
        })
        res.end('<h1>page not found: 404</h1>')
    }
})
/* --------------------------------------------------------------------------------------------------------- */
server.listen(3000,'127.0.0.1', () =>{
    console.log('Server on port 3000')
})



