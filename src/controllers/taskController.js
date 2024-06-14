const express = require('express')
const session = require('express-session')
const tasks = require('./data/tasks.json')
const app = express()
const port = 3000;

app.use(express.json())

// GET /tasks Endpunkt, welcher eine Liste aller Tasks zurück gibt
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks)
});

// POST /tasks Endpunkt, welcher einen neuen Task erstellt und diesen zurück gibt
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    newTask.Id = tasks.length + 1
    tasks.push(newTask);
    res.status(201).json(newTask)
});


// GET /task/{id} Endpunkt, welcher einen einzelnen Task zurück gibt
app.get('/task/:id', (req, res) => {
    const id = req.params.id;
    const findTask = tasks.find(findTask => findTask.id === parseInt(id));
    if (findTask) {
        res.status(200).json(findTask);
    } else {
        res.status(404).json({ message: `Task mit ID ${id} nicht gefunden` });
    }
});

// PUT /task/{id} Endpunkt, welcher den bestehenden Task verändert und diesen zurück gibt
app.patch('/task/:id', (req, res) => {
    const id = req.params.id
    const taskToUpdate = req.body
    const findTask = tasks.find(findTask => findTask.id === parseInt(id))
    if (findTask) {
        tasks.splice(findTask, 1, taskToUpdate)
        tasks.push(taskToUpdate)
        res.status(200).json(taskToUpdate)
    } else {
        return res.sendStatus(404)
    }
});

// DELETE /task/{id} Endpunkt, welcher den bestehenden Task löscht
app.delete('/task/:id', (req, res) => {
    const id = req.params.id
    const findTask = tasks.find(findTask => findTask.id === parseInt(id))
    if (findTask) {
        res.status(200).json(findTask)
        tasks.splice(findTask, 1)
    } else {
        res.status(404).json({ message: `Task mit id ${id} nicht gefunden` })
    }
});



app.listen(port, () => {
    console.log(`Server gestartet auf => http://localhost:${port}`)
});