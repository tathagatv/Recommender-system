const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const adminRo = require('./routes/admin');
const baseRo = require('./routes/base');

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRo);
app.use('/',baseRo);

// app.get('/', function(req, res){
//     session
//         .run('match(n:product) return n.title, n.price limit 25')
//         .then(function(result){
//             result.records.forEach(function(record){
//                 console.log(record._fields);
//             });
//         })
//         .catch(function(err){
//             console.log(err);
//         });
//     res.send('working');
// });


app.listen(3000);
console.log('Server started on port 3000');

// module.exports = app;