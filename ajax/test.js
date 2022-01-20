const i = require('os').homedir()
const home = process.env.HOME || i
const p = require('path')
const fs = require('fs')
const dbpath = p.join(home,'.todo')

module.exports.add = (title) =>{
    console.log(1)
    fs.readFile(dbpath,{flag:'a+'},(error,data)=>{
    console.log(error)
    console.log(data.toString())
    console.log(1)
})
}