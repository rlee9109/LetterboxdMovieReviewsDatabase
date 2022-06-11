import csv
import psycopg2
import re

conn = psycopg2.connect(host="localhost", database="rlee", user="rlee_123", password="12345678")
cursor = conn.cursor()
movie_ids = {}
user_ids = {}
rating_ids = {}

def insertStringMovieInfo(movie_id, line):
    # print(line)
    # print(line[6])
    print(movie_id)
    insert = f"insert into movie_info (movie_id, movie_title, original_language, year_released, release_date, runtime, popularity, vote_average, vote_count, overview, image_url, movie_letterboxd_id, imdb_id, imdb_link, tmdb_id, tmdb_link) values({movie_id}, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
    edit_row = [line[6], line[7], line[18], line[11], line[12], line[9], line[16], line[17], line[8][:999], line[2], line[5], line[3], line[4], line[14], line[15]]
    cursor.execute(insert, edit_row)

def insertStringMovieGenres(movie_id, genreString):
    genreString = genreString.replace("\"", "")
    genreString = genreString.replace("[", "")
    genreString = genreString.replace("]", "")
    genreArray = genreString.split(',')
    # print(genreArray)
    for g in genreArray:
        movie_genre_concat = str(movie_id) + "-" + g
        print(movie_genre_concat)
        insert = f"insert into movie_genres (movie_genre_concat, movie_id, genre) values(%s, %s, %s) ON CONFLICT (movie_genre_concat) DO NOTHING;"
        edit_row = [movie_genre_concat, movie_id, g]
        cursor.execute(insert, edit_row)

def insertStringProductionCountries(movie_id, prodString):
    prodString = prodString.replace("\"", "")
    prodString = prodString.replace("[", "")
    prodString = prodString.replace("]", "")
    prodArray = prodString.split(',')
    # print(prodArray)
    for p in prodArray:
        movie_production_concat = str(movie_id) + "-" + p
        print(movie_production_concat)
        insert = f"insert into production_countries (movie_production_concat, movie_id, production_country) values(%s, %s, %s) ON CONFLICT (movie_production_concat) DO NOTHING;"
        edit_row = [movie_production_concat, movie_id, p]
        cursor.execute(insert, edit_row)

def insertStringSpokenLanguages(movie_id, spokenString):
    spokenString = spokenString.replace("\"", "")
    spokenString = spokenString.replace("[", "")
    spokenString = spokenString.replace("]", "")
    spokenArray = spokenString.split(',')
    # print(spokenArray)
    for s in spokenArray:
        lang = s
        if lang == "日本語" :
            lang = "Japanese"
        if lang == "普通话" :
            lang = "Mandarin Chinese"
        movie_languages_concat = str(movie_id) + "-" + lang
        print(movie_languages_concat)
        insert = f"insert into spoken_languages (movie_languages_concat, movie_id, language) values(%s, %s, %s) ON CONFLICT (movie_languages_concat) DO NOTHING;"
        edit_row = [movie_languages_concat, movie_id, lang]
        cursor.execute(insert, edit_row)

def insertStringUserInfo(user_id, line):
    print(user_id)
    insert = f"insert into user_info (user_id, letterboxd_username, display_name, num_reviews) values({user_id}, %s, %s, %s);"
    edit_row = [line[4], line[1], line[3]]
    cursor.execute(insert, edit_row)

def insertStringMovieRating(rating_id, movie, rating, user):
    print(rating_id)
    insert = f"insert into movie_ratings (rating_id, movie_id, rating_val, user_id) values({rating_id}, %s, %s, %s);"
    edit_row = [movie, rating, user]
    cursor.execute(insert, edit_row)

with open('movies_export.csv', 'r') as f:
    line = f.readline()
    line = f.readline()
    movie_id=0
    while line:
        splitLine = re.split(r',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', line.strip())
        print("in progress... movie: ", movie_id)
        if len(splitLine) == 19 :
            if splitLine[11] == 'null' or splitLine[11] == '' or splitLine[18] == 'null' or splitLine[18] == '' or splitLine[12] == 'null' or splitLine[12] == '' or splitLine[9] == 'null' or splitLine[9] == '' or splitLine[16] == 'null' or splitLine[16] == '' or splitLine[17] == 'null' or splitLine[17] == '' :
                movie_id = movie_id
            else:
                insertStringMovieInfo(movie_id, splitLine)

                genreString = splitLine[1]
                if genreString != 'null' and genreString != '[\'\']' and genreString != '[]':
                    insertStringMovieGenres(movie_id, genreString)
                
                prodString = splitLine[10]
                if prodString != 'null' and prodString != '[\'\']' and prodString != '[]':
                    insertStringProductionCountries(movie_id, prodString)

                spokenString = splitLine[13]
                if spokenString != 'null' and spokenString != '[\'\']' and spokenString != '[]':
                    insertStringSpokenLanguages(movie_id, spokenString)

                movie_ids[splitLine[5]] = movie_id
                movie_id = movie_id+1
        line = f.readline()

with open('users_export.csv', 'r') as f:
    line = f.readline()
    line = f.readline()
    user_id = 0
    while line:
        splitLine = re.split(r',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', line.strip())
        print("in progress... user: ", user_id)
        if len(splitLine) == 5 :
            if splitLine[1] == 'null' or splitLine[1] == '' or splitLine[3] == 'null' or splitLine[3] == '' or splitLine[4] == 'null' or splitLine[4] == '':
                print(splitLine[1], splitLine[3], splitLine[4])
                user_id = user_id
            else:
                insertStringUserInfo(user_id, splitLine)

                user_ids[splitLine[4]] = user_id
                user_id = user_id + 1
        line = f.readline()

with open('ratings_export.csv', 'r') as f:
    line = f.readline()
    line = f.readline()
    rating_id = 0
    while line:
        splitLine = re.split(r',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', line.strip())
        print("in progress... rating: ", rating_id)
        if len(splitLine) == 4 :
            if splitLine[1] == 'null' or splitLine[1] == '' or splitLine[2] == 'null' or splitLine[2] == '' or splitLine[3] == 'null' or splitLine[3] == '':
                rating_id = rating_id
            else:
                try: 
                    movie = movie_ids[splitLine[1]]
                    rating = splitLine[2]
                    user = user_ids[splitLine[3]]

                    #print(rating_id, movie, rating, user)

                    insertStringMovieRating(rating_id, movie, rating, user)

                    movie_user_concat = str(movie) + "-" + str(user)
                    rating_ids[movie_user_concat] = rating_id
                    rating_id = rating_id + 1
                except: 
                    print("rating exception " + str(rating_id))
                    print(splitLine)
                    rating_id = rating_id
        line = f.readline()

conn.commit()
cursor.close()
conn.close()


# id,genres,image_url,imdb_id,imdb_link,movie_id,movie_title,original_language,overview,popularity,production_countries,release_date,runtime,spoken_languages,tmdb_id,tmdb_link,vote_average,vote_count,year_released


