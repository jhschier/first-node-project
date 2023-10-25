const express = require('express') // Criação de variável chamando a biblioteca express
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())


/* Query params -> http://www.meusite.com/users?nome=JowJow&age=27  ------ Utilização para Filtros

   Route Params -> users/2 ------ Para buscar, deletar ou atualizar algo específico

   */

// Query Params \/
/*
app.get('/users', (request, response) => {  //função get que faz o request para o endereço especificado entre ''

    const { name, age } = request.query // Destructuring Assignment
   
    return response.json ({name, age}) // retorna a response
})
*/
// No Insomnia, o servidor envia os dados inseridos no GET pelo usuário e envia para o Terminal do VS code as informações contidas no objeto


// Route Params \/
/*
app.get ('/users/:id', (request, response) =>{

    const { id } = request.params
    
    return response.json ({ id })
})
*/

// Body Params \/

const users = []
 
const checkUserId = (request, response, next) => {

    const { id } = request.params
    
    const index = users.findIndex(user => user.id === id)
    
    if (index < 0) {

        return response.status(404).json({ message: "User not found." })
    }

    request.userIndex = index
    request.userId = id

    next()

}

app.get('/users', (request, response) => {

    return response.json(users)

})


app.post('/users', (request, response) => {

    try{ // No try, é introduzido o bloco de código que deseja ter a verificação executada.

    const { name, age } = request.body
        if (age < 18) throw new Error("Only allowed users over 18.") // throw define um erro, criado pelo dev. Aqui um erro é criado com IF, se o usuário tiver menos de 18 anos, é impossibilitado de continuar a execução, e é enviado para o catch.

    const user = { id: uuid.v4(), name, age }

    users.push(user)


    return response.status(201).json(user)
    } 
    catch(err){  // No catch, o erro é lidado, e se preciso, é informado ao cliente.
        return response.status(400).json({error: err.message})
    } finally { // função opcional, aqui , independente do erro, terá um bloco de código que será executado no final de tudo.
        console.log("Verificação concluída.")
    }
})

app.put('/users/:id', checkUserId, (request, response) => {
    try {
    const id = request.userId
  
    const { name, age } = request.body
    const index = request.userIndex

    const updatedUser = { id, name, age }

    if(age < 18) throw Error("Cannot Change, only allowed users over 18.")


    users[index] = updatedUser
    return response.json(updatedUser)
    } catch(err) {
        return response.status(400).json({error: err.message})

    }
})

app.delete('/users/:id', checkUserId, (request, response) => {

    const index = request.userIndex
    



        users.splice(index, 1)

    
    return response.status(204).json()

})

    





app.listen(port, () => {

    console.log(`😎 The server has started on Port ${port}`)

})  // especifica em qual porta o endereço está



/* 

Execuções no terminal

npm install "nome da biblioteca" _--> instala a biblioteca desejada

node "nome do arquivo" -> executa o arquivo em node

npm run "nome do script criado no package.json" -> executa pelo nodemon o arquivo desejado

 ### JSON ###

 JSON é JavaScript Object Notation, um padrão de troca de dados entre front-end e back-end.

 No Json é necessário sempre utilizar aspas para tudo, menos para números.

 {
    "nome": "JowJow",
    "age": 27
 }

 atenção! não pode deixar vírgula no final. */