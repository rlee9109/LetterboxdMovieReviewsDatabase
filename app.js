/** 
 * Very simple site for serving static pages 
 * and performing one simple query on the rocket database
 * 
 * To start: UNIX> nohup node app6.js &
 *           where apps6.js is the name of this file
 *           nohup allows things to run in background, smoothly
 */

const path = require('path')
const express = require('express')
const { Pool } = require('pg') // connecting to postgres
const { CommandCompleteMessage, closeComplete } = require('pg-protocol/dist/messages')

const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1/rlee";
const client = new MongoClient(uri);

//  // Connection to postgres parameters
//  const pool = new Pool({
//      user: 'dbuser',
//      host: 'localhost',
//      database: 'rocket',
//      password: '12345678',
//      port: 5432,
//  })


// Connection to postgres parameters
const pool = new Pool({
    user: 'rlee_123',
    host: 'localhost',
    database: 'rlee',
    password: '12345678',
    port: 5432,
})

console.log("Created pool ", pool)

const app = express()
const port = 30046

// static pages are served from the same directory as this file
app.use("/", express.static(path.join(__dirname)));

// do a query to Postgres and return the result as JSON
function dbreq1(dberr, client, done, req, res) {
    console.log("doing dbreq1 now")
    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }
    let postt = req.body;
    console.log(postt['movie_title'])
    console.log(postt['year_released'])
    console.log(postt['original_language'])

    var queryString = "SELECT movie_id, movie_title, year_released, original_language, overview, popularity, imdb_link FROM movie_info";

    // create query string based on form entry
    if (postt['movie_title'] != '' || postt['year_released'] != '' || postt['movie_title'] != '') {
        queryString = queryString + " WHERE ";
        if (postt['movie_title'] != '') {
            queryString = queryString + "movie_title ILIKE '%" + postt['movie_title'] + "%'";
            if (postt['year_released'] != '' || postt['original_language'] != '') {
                queryString = queryString + " AND ";
                if (postt['year_released'] != '') {
                    queryString = queryString + "year_released=" + postt['year_released'];
                } else {
                    queryString = queryString + "original_language ILIKE '%" + postt['original_language'] + "%'";
                }
            }
        } else if (postt['year_released'] != '' || postt['original_language'] != '') {
            if (postt['year_released'] != '') {
                queryString = queryString + "year_released=" + postt['year_released'];
                if (postt['original_language'] != '') {
                    queryString = queryString + "AND original_language ILIKE '%" + postt['original_language'] + "%'";
                }
            } else {
                queryString = queryString + "original_language ILIKE '%" + postt['original_language'] + "%'";
            }
        }
    }
    queryString = queryString + " ORDER BY movie_id"

    // var queryString = "SELECT movie_title, year_released, original_language, overview, popularity, imdb_link FROM movie_info WHERE movie_title LIKE '%" + postt['movie_title'] +"%' AND year_released=" + postt['year_released'] + " AND original_language='" + postt['original_language'] +"'";
    console.log(queryString);

    client.query(queryString, function (dberr, dbres) {
        done()
        if (dberr) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');

        } else {
            res.json(dbres.rows);
        }
    });
    console.log("done with PSQL query")
};

async function dbreq2(dberr, client, done, req, res) {
    console.log("doing dbreq2 now");

    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }

    let postt = req.body;
    console.log(postt['movie_title'])
    console.log(postt['year_released'])
    console.log(postt['original_language'])

    var query;
    if (postt['movie_title'] != '' && postt['year_released'] != '' && postt['original_language'] != '') {
        query = { 'movie_title': new RegExp(postt['movie_title'], 'i'), 'year_released': parseInt(postt['year_released']), 'original_language': postt['original_language'] }
    } else {
        if (postt['movie_title'] != '') {
            if (postt['year_released'] != '') {
                query = { 'movie_title': new RegExp(postt['movie_title'], 'i'), 'year_released': parseInt(postt['year_released']) }
            }
            else if (postt['original_language'] != '') {
                query = { 'movie_title': new RegExp(postt['movie_title'], 'i'), 'original_language': postt['original_language'] }
            } else {
                query = { 'movie_title': new RegExp(postt['movie_title'], 'i') }
            }
        } else if (postt['year_released'] != '') {
            if (postt['original_language'] != '') {
                query = { 'year_released': parseInt(postt['year_released']), 'original_language': postt['original_language'] }
            } else {
                query = { 'year_released': parseInt(postt['year_released']) }
            }
        } else {
            query = { 'original_language': postt['original_language'] }
        }
    }

    let results = await client.db().collection('movie_info').find(query, { projection: { '_id': 0, 'movie_title': 1, 'year_released': 1, "original_language": 1, "overview": 1, "popularity": 1, "imdb_link": 1 } }).toArray();
    res.json(results);

    console.log("done with mongodb query")
};

// specific query for drill down - psql
function dbdrillreqPSQL(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }
    let postt = req.body;

    //new query for drill down, selecting by department
    console.log("drill down for movie: ", postt['movie_title']);
    var query = "SELECT * FROM (movie_ratings INNER JOIN movie_info ON movie_ratings.movie_id=movie_info.movie_id) INNER JOIN user_info ON user_info.user_id=movie_ratings.user_id WHERE movie_info.movie_title='" + postt['movie_title'] +"' ORDER BY movie_ratings.rating_id LIMIT 10000;"
    console.log(query)
    client.query(query, function (dberr, dbres) {
        done()
        if (dberr) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
            
        } else {
            res.json(dbres.rows);
        }
    });
    console.log("done with drilldown query - psql")
};

// specific query for drill down MongoDB
async function dbdrillreqMongo(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }
    let postt = req.body;

    //new query for drill down, selecting by department
    console.log("drill down for movie: ", postt['movie_title']);
    var query = {'movie_title': new RegExp(postt['movie_title'], 'i')}
    // var query = "SELECT * FROM (movie_ratings INNER JOIN movie_info ON movie_ratings.movie_id=movie_info.movie_id) INNER JOIN user_info ON user_info.user_id=movie_ratings.user_id WHERE movie_info.movie_title='" + postt['movie_title'] +"' ORDER BY movie_ratings.rating_id LIMIT 10000;"
    console.log(query)
    let results = await client.db().collection('movie_info').find(query).toArray();
    res.json(results);

    console.log("done with drilldown query - mongodb")
};

// tell express aboout how to handle the dq1 request
app.post('/PSQLSearch', express.json({ type: '*/*' }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        dbreq1(dberr, client, done, req, res);
    });
});

// tell express aboout how to handle the dq2 request
app.post('/MongoSearch', express.json({ type: '*/*' }), function (req, res) {
    client.connect((function (dberr, client, done) {
        dbreq2(dberr, client, done, req, res);
    }));
});

// tell express aboout how to handle the drill down request with psql
app.post('/movie-reviews-psql', express.json({ type: '*/*' }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        dbdrillreqPSQL(dberr, client, done, req, res);
    });
});

// tell express aboout how to handle the drill down request with mongodb
app.post('/movie-reviews-mongodb', express.json({ type: '*/*' }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        dbdrillreqPSQL(dberr, client, done, req, res);
    });
});

// start the Node server
app.listen(port, function (error) {
    if (error) throw error
    console.log(`Server created Successfully on port ${port}`);
})