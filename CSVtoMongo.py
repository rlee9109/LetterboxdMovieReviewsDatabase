import pymongo
from pymongo import MongoClient, errors
import pandas as pd
import json


client = MongoClient('localhost', 27017)
db = client["rlee"]
movie_col = db["movie_info"]
user_col = db["user_info"]
rating_col = db["rating_info"]

if "rlee" in client.list_database_names():
  print("The database exists.")

try:
    movie_data = pd.read_csv('movies_export.csv')
    movie_col.insert_many(movie_data.to_dict('records'))

except errors.BulkWriteError as e:
    print(f"Articles bulk insertion error {e} for MOVIES")

    panic_list = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
    if len(panic_list) > 0:
        print(f"these are not duplicate errors {panic_list}")

# count = 0
# for m in movie_col.find():
#     print(m["_id"])
#     db.movie_col.update_one({'_id': m["_id"]}, {"$set": {'movie_count': count}})
#     print(count)
#     count = count + 1

try:
    user_data = pd.read_csv('users_export.csv')
    user_col.insert_many(user_data.to_dict('records'))
except errors.BulkWriteError as e:
    print(f"Articles bulk insertion error {e} for USERS")

    panic_list = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
    if len(panic_list) > 0:
        print(f"these are not duplicate errors {panic_list}")

# count = 0
# for u in user_col.find():
#     print(u["_id"])
#     db.user_col.update_one({'_id': u["_id"]}, {"$set": {'user_count': count}})
#     print(count)
#     count = count + 1

try:
    rating_data = pd.read_csv('ratings_export.csv')
    rating_col.insert_many(rating_data.to_dict('records'))
except errors.BulkWriteError as e:
    print(f"Articles bulk insertion error {e} for RATINGS")

    panic_list = list(filter(lambda x: x['code'] != 11000, e.details['writeErrors']))
    if len(panic_list) > 0:
        print(f"these are not duplicate errors {panic_list}")

# count = 0
# for r in rating_col.find():
#     print(r["_id"])
#     db.rating_col.update_one({'_id': r["_id"]}, {"$set": {'rating_count': count}})
#     print(count)
#     count = count + 1

print(db.list_collection_names())

emptyQuery = { }

movie_doc = movie_col.find(emptyQuery)
print("length of movie collection: ")
print(len(list(movie_doc)))
print(list(movie_doc)[0])

user_doc = user_col.find(emptyQuery)
print("length of user collection: ")
print(len(list(user_doc)))
print(list(user_doc)[0])

rating_doc = rating_col.find(emptyQuery)
print("length of rating collection: ")
print(len(list(rating_doc)))
print(list(rating_doc)[0])