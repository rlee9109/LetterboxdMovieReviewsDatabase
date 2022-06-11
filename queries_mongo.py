import pymongo
from pymongo import MongoClient
import pandas as pd
import json


client = MongoClient('localhost', 27017)
db = client["rlee"]
movie_col = db["movie_info"]
user_col = db["user_info"]
rating_col = db["rating_info"]

# if "rlee" in client.list_database_names():
#   print("The database exists.")

# print(db.list_collection_names())

# find the first 10 users' display names according to indices
oneDoc = user_col.find({ }, {'display_name': 1, '_id': 0}).limit(10)
print(list(oneDoc))

# find the number of 1996 documentary films
twoQuery = {'year_released': 1996, 'genres': '["Documentary"]'}
twoDoc = movie_col.find(twoQuery, {'movie_title': 1, 'genres': 1, '_id': 0})
print(len(list(twoDoc)))

# find 25 ratings by the user with the Letterboxd username 'deathproof', display the Letterboxd unique movie id and the user's rating
threeQuery = {'user_id': 'deathproof'}
threeDoc = rating_col.find(threeQuery, {'movie_id': 1, 'rating_val': 1, '_id': 0}).limit(25)
print(list(threeDoc))

