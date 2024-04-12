const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const socketio = require('socket.io');

const app = express();


let db = new sqlite3.Database('./dbs', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
  // Queries scheduled here will be serialized.
  
    db.each(`SELECT seat, name FROM Hall101`, (err, row) => {
      if (err){
        throw err;
      }
      console.log(row.seat + ' ------> ' + row.name);
    });
});

function getUnavaliabeSeats(hall, socket) {
     db.all(`SELECT seat FROM Hall${hall}`, (err, rows) => {
    if (err){
      throw err;
    }
    socket.emit('allSeats', rows.map(function (obj) {
      return obj.seat;
    }))
  });
}

function requestSeat(){}

getUnavaliabeSeats('101')

app.get('/', (req, res) => {
    res.send('Hi from Codedamn')
});

const server = app.listen(1337, () => {
    console.log('Server running!')
});

const io = socketio(server)

io.on('connection', (socket) => {
    console.log('New connection')
  socket.on('getAllSeats', hall => {
    getAllSeats(hall, socket)
  })

})