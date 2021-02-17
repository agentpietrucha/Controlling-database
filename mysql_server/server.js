const mysql = require('mysql');
const express = require('express');
const app = express();


const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'fortepian',
	database: 'test_db'
});

connection.connect((err) => {
	if(err){
		console.log('some error: ', err);
		return;
	}
	console.log('Connected to database.');

  app.get('/', (req, res, next) => {
    console.log('get root');
    res.send("test message");
    connection.query('insert into karolek(name, kupka) values(\'benio\', \'tak\')', (err, res) => {
      if(err){console.log('error in insert: ', err)}
      console.log('insert success');
    });
  });
  app.get('/getall', (req, res, next) => {
    console.log('/getall');
    connection.query('select * from person', (err, data, fields)=>{
      if(err){console.log('err: ', err);}
      console.log('result: ', data);
      res.json(data);
    });
  });
  app.get('/insert', (req, res, next) => {
    console.log('/insert');
    console.log(req.query);
    var q;
    if(req.query.profession){
      q = `insert into person(name, age, profession) values(\'${req.query.name}\', ${req.query.age}, \'${req.query.profession}\')`;
    } else{
      q = `insert into person(name, age) values(\'${req.query.name}\', ${req.query.age})`;
    }
    console.log('query: ', q);
    connection.query(q, (err, data) => {
      if(err){console.log('error while inserting: ', err);}
      res.send('success');
    })
  })
  app.get('/select', (req, res, next) => {
    console.log('/select');
    console.log(req.query);
    let sq;
    if(Object.keys(req.query).length === 0 || req.query.cols === ''){ // select *
      sq = '*';
    } else{
      sq = req.query.cols;
    }
    var q = `select ${sq} from person`;
    connection.query(`select ${sq} from person`, (err, data, fields) => {
      if(err){console.log('error in select: ', err);}
      console.log('data: ', data);
      res.json(data);
    });
  });
  app.get('/wselect', (req, res, next) => {
    console.log('/wselect');
    console.log(req.query);
    // res.send('halko');
    let sq;
    if(Object.keys(req.query).length === 0 || req.query.cols === ''){
      sq = '*';
    } else{
      sq = req.query.cols;
    }
    // /wselect?cols=name,age&age=10&name=karolek
    let wq = '';
    for(const [key, value] of Object.entries(req.query)){
      if(key === 'cols'){ continue; }
      if(parseInt(value)){
        wq += `${key}=${value} and `;  
      } else{
        wq += `${key}=\'${value}\' and `;
      }
    }
    wq = wq.substring(0, wq.length - 5);
    console.log('wg: ', wq);
    console.log('query: ', `select ${sq} from person where ${wq}`);
    connection.query(`select ${sq} from person where ${wq}`, (err, data, fields) => {
      if(err){console.log('error in wselect: ', err);}
      console.log('data: ', data);
      res.json(data);
    })
  })
  app.listen(8080, 'localhost', (req, res) => {
    console.log('server runnign on localhost');
  });
});

// connection.end((err) => {
//     if(err){
//         console.log('error while closing: ', err);
//         return;
//     }
//     console.log('Connection closed');
// });
