-- find the first 10 users' display names titles according to indices
SELECT display_name FROM user_info WHERE user_id <=10;

-- find the number of 1996 documentary films
select count(movie_genres.movie_id)
from movie_genres inner join movie_info on movie_genres.movie_id=movie_info.movie_id
where year_released>=1996 and movie_genres.genre='Western';
    
-- find 25 ratings by the user with the Letterboxd username 'deathproof', display the Letterboxd unique movie id and the user's rating
select movie_letterboxd_id, rating_val
from (movie_ratings inner join movie_info on movie_ratings.movie_id=movie_info.movie_id) inner join user_info on user_info.user_id=movie_ratings.user_id
where letterboxd_username='deathproof'
limit 25;
