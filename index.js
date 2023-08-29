const express = require('express')
const app = express()

const cors = require('cors')
const morgan = require('morgan')

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
/* generate a random 8 digit number to be the id of the next person */
const generateId = () => {
  return Math.floor(Math.random() * 10000000)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

morgan.token('body', req => `${JSON.stringify(req.body)}`)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* home */
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

/* info */
app.get('/info', (request, response) => {
  const requestTime = new Date(Date.now())
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${requestTime}</p>
  `
  response.send(info)
})

/* get all persons */
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

/* get person by id */
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {    
      response.json(person)  
  } else {
      response.status(404).end()
  }
})

/* delete person by id */
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


/* add one person */
app.post('/api/persons', (request, response) => {
  const body = request.body

  /* verify if name is undefined */
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  /* verify if number is undefined */
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  /* verify if name is already in phonebook */
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})