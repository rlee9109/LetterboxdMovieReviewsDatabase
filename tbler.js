// A global variable to get and hold the data resulting from a query
var globalvariable = {
    qResult: null
}

// These variables determine if search fields are shown for psql or mongodb
var psqlShown = document.getElementById("div1");
var mongoShown = document.getElementById("div2");

// These variables will hold the user input from search fields
var PSQLSearchTitle;
var PSQLSearchYear;
var PSQLSearchLanguage;
var MongoSearchTitle;
var MongoSearchYear;
var MongoSearchLanguage;

// Populate the above variables with user input from search fields
function getPSQLSearch() {
    PSQLSearchTitle = document.getElementById("PSQLTitle").value;
    PSQLSearchYear = document.getElementById("PSQLYear").value;
    PSQLSearchLanguage = document.getElementById("PSQLLanguage").value;
}
function getMongoSearch() {
    MongoSearchTitle = document.getElementById("MongoTitle").value;
    MongoSearchYear = document.getElementById("MongoYear").value;
    MongoSearchLanguage = document.getElementById("MongoLanguage").value;
}

// Only shows PSQL search fields if that button is selected
function showPSQLFields() {
    if (psqlShown.style.display === "none") {
        psqlShown.style.display = "block";
        mongoShown.style.display = "none";
    } else {
        mongoShown.style.display = "none";
        document.querySelector("#gt2").innerHTML = null;
        document.querySelector("#gt4").innerHTML = null;
    }
}

// Only shows MongoDB search fields if that button is selected
function showMongoFields() {
    if (mongoShown.style.display === "none") {
        mongoShown.style.display = "block";
        psqlShown.style.display = "none";
    } else {
        psqlShown.style.display = "none";
        document.querySelector("#gt2").innerHTML = null;
        document.querySelector("#gt4").innerHTML = null;
    }
}

/**
 * Do a query using PSQL database using user input from PSQL search fields.
 */
function doPSQLQuery() {
    getPSQLSearch();
    let params = {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        }
    }
    let content = {};
    content["movie_title"] = PSQLSearchTitle;
    content["year_released"] = PSQLSearchYear;
    content["original_language"] = PSQLSearchLanguage;
    console.log(PSQLSearchTitle)

    if (PSQLSearchTitle == '' && PSQLSearchYear == '' && PSQLSearchLanguage == '') {
        document.querySelector("#gt").innerHTML = "Please enter atleast one search field."
        document.querySelector("#gt2").innerHTML = null;
    }
    else {
        params['body'] = JSON.stringify(content);

        let uurl = "http://165.106.10.170:30046/PSQLSearch"
        fetch(uurl, params)
            .then(function (response) {
                response.text().then(function (text) {
                    qResult = JSON.parse(text);
                    console.log("query result length", qResult.length)
                    if (qResult.length == 0) {
                        document.querySelector("#gt").innerHTML = "No movies found, please try again.";
                    } else {
                        document.querySelector("#gt").innerHTML = null;
                    }
                    
                    document.querySelector("#gt2").innerHTML = tabform(qResult, "PSQL");
                });
            });
    }
}

/**
 * Do a query using Mongodb database using user input from PSQL search fields.
 */
function doMongoQuery() {
    getMongoSearch();

    let params = {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        }
    }
    // console.log("This is the form data:");
    let content = {};
    content["movie_title"] = MongoSearchTitle;
    content["year_released"] = MongoSearchYear;
    content["original_language"] = MongoSearchLanguage;
    console.log(MongoSearchTitle)

    if (MongoSearchTitle == '' && MongoSearchYear == '' && MongoSearchLanguage == '') {
        document.querySelector("#gt3").innerHTML = "Please enter atleast one search field."
        document.querySelector("#gt4").innerHTML = null;

    }
    else {
        params['body'] = JSON.stringify(content);

        let uurl = "http://165.106.10.170:30046/MongoSearch"

        fetch(uurl, params)
            .then(function (response) {
                response.text().then(function (text) {
                    qResult = JSON.parse(text);
                    console.log("query result length", qResult.length)
                    if (qResult.length == 0) {
                        document.querySelector("#gt3").innerHTML = "No movies found, please try again.";
                    } else {
                        document.querySelector("#gt3").innerHTML = null;
                    }

                    document.querySelector("#gt4").innerHTML = tabform(qResult, "MongoDB");
                });
            });
    }
}

/**
 * Create an html table from a bunch of data in JSON form. 
 * Where the JSON form is an array of objects
 * @param dbres -- the JSON data
 * @returns an HTML table
 */
 function tabform(dbres, dbSelection) {
    if (dbres.length == 0) {
        return null;
    }
    else {
        let tbl = '<table border="1">';

        // ['movie_title', 'year_released', "original_language", "overview", "popularity", "imdb_link"]

        let keyss = ['movie_title', 'year_released', "original_language", "overview", "popularity", "imdb_link"];
        tbl += "<tr>";
        // first, format the table header. 
        // each item in the header is a key in the first JSON object
        // each of these is turned into a button that sorts the JSON data on that key
        for (let k of keyss) {
            tbl += "<th><button onclick='doReSort(\"" + k + "\")'>" + k + "</button></th>"
        }

        tbl += "</tr>";
        dbres.forEach(element => {
            // console.log(element);
            tbl += "<tr>";
            keyss.forEach(k => {
                //console.log(k, element[k]);

                if (k == 'imdb_link') {
                    tbl += "<td>" + "<a href=" + element[k] + " target='_blank'>" + element[k] + "</a>" + "</td>";
                }
                else if (k == 'movie_title') {
                    if (dbSelection == "PSQL") {
                        tbl += "<td>" + "<button class='btnlabel' onclick='drillDownPSQL(\"" + element[k] + "\")'>" + element[k] + "</button>" + "</td>";
                    } else {
                        tbl += "<td>" + "<button class='btnlabel' onclick='drillDownMongo(\"" + element[k] + "\")'>" + element[k] + "</button>" + "</td>";
                    }
                }
                else {
                    tbl += "<td>" + element[k] + "</td>";
                }
            });
            tbl += "</tr>";
        });
        tbl += "</table>";
        return tbl;
    }
}

var newtab;

/**
 * Drill down table, open new tab
 * @param {} movie_title which dept to show
 */
function drillDownPSQL(movie_title) {
    let params = {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        }
    }
    let drillContent = {};
    drillContent['movie_title'] = movie_title;
    console.log("here")
    console.log(drillContent)
    params['body'] = JSON.stringify(drillContent);

    let uurl = "http://165.106.10.170:30046/movie-reviews-psql"
    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                console.log("working?")
                qResult = JSON.parse(text);
                newtab = window.open(uurl, "movie_title=" + movie_title);
                newtab.document.write("<head><h1>Movie Reviews: " + movie_title + "</h1>");
                newtab.document.write("<style>display: inline-block;font-size: 12px;}</style></head>" + tabformdrill(qResult));
                newtab.document.write("<script src='tbler.js'></" + "script>");
            });
        });
}

/**
 * Drill down table, open new tab
 * @param {} movie_title which dept to show
 */
 function drillDownMongo(movie_title) {
    let params = {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        }
    }
    let drillContent = {};
    drillContent['movie_title'] = movie_title;
    console.log("here")
    console.log(drillContent)
    params['body'] = JSON.stringify(drillContent);

    let uurl = "http://165.106.10.170:30046/movie-reviews-mongodb"
    fetch(uurl, params)
        .then(function (response) {
            response.text().then(function (text) {
                console.log("working?")
                qResult = JSON.parse(text);
                newtab = window.open(uurl, "movie_title=" + movie_title);
                newtab.document.write("<head><h1>Movie Reviews: " + movie_title + "</h1>");
                newtab.document.write("<style>display: inline-block;font-size: 12px;}</style></head>" + tabformdrill(qResult));
                newtab.document.write("<script src='tbler.js'></" + "script>");
            });
        });
}

/**
 * Create an html table from a bunch of data in JSON form. 
 * Where the JSON form is an array of objects
 * @param dbres -- the JSON data
 * @returns an HTML table
 */
function tabformdrill(dbres) {

    if (dbres.length == 0) {
        return null;
    }
    else {
        let tbl = '<table border="1">';
        let keyss = ['rating_id', 'display_name', 'letterboxd_username', 'rating_val'];
        tbl += "<tr>";

        for (let k of keyss) {
            // tbl += "<th><button onclick='doDrillSort(\"" + k + "\")'>" + k + "</button></th>"
            tbl += "<th>" + k + "</th>"
        }

        tbl += "</tr>";
        dbres.forEach(element => {
            tbl += "<tr>";
            keyss.forEach(k => {
                //console.log(k, element[k]);
                tbl += "<td>" + element[k] + "</td>";
            });
            tbl += "</tr>";
        });
        tbl += "</table>";
        return tbl;
    }
}

/**
 * Sort the retrieved data by the given key. 
 * Then reformat it into a table.
 * @param {} field the field on which to sort.
 */
function doReSort(field) {
    sortBy(field);
    document.querySelector("#gt2").innerHTML = tabform(qResult, "PSQL");
    document.querySelector("#gt4").innerHTML = tabform(qResult, "MongoDB");
}

/**
 * Doesnt work :(
 * Sort the retrieved data by the given key. 
 * Then reformat it into a table.
 * @param {} field the field on which to sort.
 */
function doDrillSort(field) {
    console.log("doDrillSort")
    console.log(globalvariable.qResult)
    sortBy(field);
    newtab.document.write("display: inline-block;font-size: 12px;}</style>"+tabformdrill(globalvariable = qResult));
}

/**
 * Actually do the Sorting
 * @param {} pName the field by which to sort
 */
function sortBy(pName) {
    function compare(a, b) {
        if (a[pName] < b[pName]) {
            return -1;
        }
        if (a[pName] > b[pName]) {
            return 1;
        }
        return 0;
    }
    globalvariable.qResult.sort(compare);
    console.log(`sorted on ${pName}`);
    //console.log(qResult);
}
