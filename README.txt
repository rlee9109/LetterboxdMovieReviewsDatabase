Rachel Lee
CMSC 383: Databases, Professor Geoffrey Towell
Homework 5: Data Interactively

Project Goal: Create a simple webpage that displays information from a database in an organized and interactive way. Users have the option to use 2 different databases (PostgresSQL or MongoDB), demonstrating that both are functional. Users can search for movies using the movie title, year released, and/or original language. Once search results are shown, users can navigate to viewing all user ratings from any movie.

1. Project Files:
    - app.js : This file is the node driver for this assignment. It contains API endpoints and runs queries on the both databases.
    - tbler.js : This file is the scripting for the html webpage. It reads user input from the webpage, calls on API endpoints, and creates tables from data.
    - index.html : This file builds the actual webpage interface.
    - letterboxd-vector-logo.jpg : image used in the webpage
    - letterboxd_DDL.sql : Unchanged from hw4

2. Webpage access: http://165.106.10.170:30046/
   (Webpage is currently being run continuously on a Bryn Mawr College server using nohup.)

3. Restart Protocol:
    $: kill -9 1240806
    $: nohup node app.js &
