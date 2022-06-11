\c rlee

DROP TABLE IF EXISTS movie_info CASCADE;
DROP TABLE IF EXISTS movie_genres CASCADE;
DROP TABLE IF EXISTS production_countries CASCADE;
DROP TABLE IF EXISTS spoken_languages CASCADE;
DROP TABLE IF EXISTS user_info CASCADE;
DROP TABLE IF EXISTS movie_ratings CASCADE;

CREATE TABLE movie_info (
    movie_id INTEGER PRIMARY KEY, --just a count up indices
    movie_title VARCHAR(255),
    original_language VARCHAR(255),
    year_released INTEGER,
    release_date DATE,
    runtime INTEGER,
    popularity FLOAT,
    vote_average FLOAT,
    vote_count INTEGER,
    overview VARCHAR(1000),
    image_url VARCHAR(500),
    movie_letterboxd_id VARCHAR(255),
    imdb_id VARCHAR(255),
    imdb_link VARCHAR(255),
    tmdb_id VARCHAR(255),
    tmdb_link VARCHAR(255)
);

-- a table where each movie is connected to each of its genres
CREATE TABLE movie_genres (
    movie_genre_concat VARCHAR(255) PRIMARY KEY,
    movie_id INTEGER, --the same count up used in movie_info
    genre VARCHAR(255),
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movie_info (movie_id)
);

-- a table where each movie is connected to each of its production countries
CREATE TABLE production_countries (
    movie_production_concat VARCHAR(255) PRIMARY KEY,
    movie_id INTEGER, -- the same count up used in movie_info
    production_country VARCHAR(255),
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movie_info (movie_id)
);

-- a table where each movie is connected to each of its languages
CREATE TABLE spoken_languages (
    movie_languages_concat VARCHAR(255) PRIMARY KEY,
    movie_id INTEGER, --the same count up used in movie_info
    language VARCHAR(255),
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movie_info (movie_id)
);

CREATE TABLE user_info (
    user_id INTEGER PRIMARY KEY,
    letterboxd_username VARCHAR(255),
    display_name VARCHAR(255),
    num_reviews INTEGER
);

CREATE TABLE movie_ratings (
    rating_id INTEGER PRIMARY KEY,
    movie_id INTEGER,
    rating_val INTEGER,
    user_id INTEGER,
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movie_info (movie_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user_info (user_id)
);
