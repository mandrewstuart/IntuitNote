import postgresql
db = postgresql.open('pq://access_user:test@localhost:5432/mydb')


db.execute("""CREATE TABLE subjects (
subj_ID SERIAL primary key,
subj_name varchar(255)
);""")

db.execute("""CREATE TABLE documents (
doc_ID SERIAL primary key,
doc_subj_ID integer,
doc_name varchar(1023)
);""")

db.execute("""CREATE TABLE sentences(
sent_ID SERIAL primary key,
sent_doc_ID integer,
sent_taggable integer,
sent_value varchar(2047)
);""")

db.execute("""CREATE TABLE tags (
tag_ID SERIAL primary key,
tag_sent_ID integer,
tag_value varchar(511),
confirmed integer
);""")
