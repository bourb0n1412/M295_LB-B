const express = require('express');
const session = require('express-session');
const tasks = require('./data/tasks.json')
const app = express();
const port = 3000;

app.use(express.json());
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

// Auth Controller
// http://expressjs.com/de/api.html#res.cookie
// Endpunkt, welcher die Credentials entgegennimmt, überprüft und ein Cookie zurück gibt (http://expressjs.com/de/api.html#res.cookie)
app.post('/login', (req, res) => {
    const email = req.headers.email;
    const password = req.headers.password;
    if (password === "m295") {
        req.session.auth = true
        res.cookie('auth', true, { httpOnly: true })
        res.status(201).json({
            authenticated: req.session.auth,
            message: 'Login successful'
        });
    } else {
        res.cookie('auth', false, { httpOnly: true })
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
});

// Endpunkt, welcher das Cookie auf Gültigkeit überprüft und das Ergebnis zurück gibt
app.get('/verify', (req, res) => {
    if (req.session.auth) {
        res.status(200).json({
            authenticated: true,
            message: 'Cookie is valid'
        })
    } else {
        res.status(401).json({
            authenticated: false,
            message: 'Cookie is invalid'
        })
    }
});

// Endpunkt, welcher das mitgegebene Cookie als ungültig markiert
app.delete('/logout', (req, res) => {
    req.session.auth
    req.session.auth = false
    res.cookie('auth', false, { httpOnly: true })
    res.status(204)
})



// Task Controller
// Endpunkt, welcher eine Liste aller Tasks zurück gibt
app.get('/tasks', (req, res) => {
    if (req.session.auth) {
        res.status(200).json(tasks)
    } else {
        res.status(403).json({
            message: "You don't have permsissions"
        })
    }
});

// Endpunkt, welcher einen neuen Task erstellt und diesen zurück gibt
app.post('/tasks', (req, res) => {
    if (req.session.auth) {
        const newTask = req.body;
        newTask.Id = tasks.length + 1
        if (newTask.Titel === "") {
            return res.status(400).json({ message: 'Task-Titel darf nicht leer sein' })
        } else {
            tasks.push(newTask);
            res.status(201).json(newTask)
        }
    } else {
        res.status(403).json({
            message: "You don't have permsissions"
        })
    }
});


// Endpunkt, welcher einen einzelnen Task zurück gibt
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const findTask = tasks.find(findTask => findTask.id === parseInt(id));
    if (req.session.auth) {
        if (findTask) {
            res.status(200).json(findTask);
        } else {
            res.status(404).json({ message: `Task mit ID ${id} nicht gefunden` });
        }
    } else {
        res.status(403).json({
            message: "You don't have permsissions"
        })
    }
});

// Endpunkt, welcher den bestehenden Task verändert und diesen zurück gibt
app.patch('/tasks/:id', (req, res) => {
    const id = req.params.id
    const taskToUpdate = req.body
    const findTask = tasks.find(task => task.id === parseInt(id))
    if (req.session.auth) {
        if (taskToUpdate.Titel === "") {
            return res.status(400).json({ message: 'Task-Titel darf nicht leer sein' })
        }
        if (findTask) {
            tasks.splice(findTask, 1, taskToUpdate);
            res.status(200).json(taskToUpdate);
        } else {
            res.status(404).json({ message: `Task mit ID ${id} nicht gefunden` })
        }
    } else {
        res.status(403).json({
            message: "You don't have Permissions"
        });
    }
});

// Endpunkt, welcher den bestehenden Task löscht
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id
    const findTask = tasks.find(findTask => findTask.id === parseInt(id))
    if (req.session.auth) {
        if (findTask) {
            res.status(200).json(findTask)
            tasks.splice(findTask, 1)
        } else {
            res.status(404).json({ message: `Task mit id ${id} nicht gefunden` })
        }
    } else {
        res.status(403).json({
            message: "You don't have permsissions"
        })
    }

});

app.listen(port, () => {
    console.log(`Server gestartet auf => http://localhost:${port}`);
});
