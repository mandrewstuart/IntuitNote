import sqlite3
conn = sqlite3.connect('db.file')
db = conn.cursor()

db.execute("""CREATE TABLE subjects (
subj_ID integer primary key,
subj_name text,
subj_created_date date,
subj_modified_date date
);""")

db.execute("""CREATE TABLE documents (
doc_ID integer primary key,
doc_subj_ID integer,
doc_title text,
doc_author text,
doc_publication text,
doc_date date,
doc_created_date date,
doc_modified_date date
);""")

db.execute("""CREATE TABLE sentences(
sent_ID integer primary key,
sent_doc_ID integer,
sent_taggable integer,
sent_value text
);""")

db.execute("""CREATE TABLE tags (
tag_ID integer primary key,
tag_sent_ID integer,
tag_value text,
tag_created_date date,
tag_modified_date date
);""")

conn.commit()
conn.close()
