
# install psql
createdb ade
psql ade

CREATE TABLE subjects (
subj_ID int primary key,
subj_name varchar(255),
subj_created_date date,
subj_modified_date date
);

CREATE TABLE documents (
doc_ID int primary key,
doc_subj_ID references subjects(subj_ID),
doc_name varchar(255),
doc_author varchar(255),
doc_publication varchar(255),
doc_date date,
doc_created_date date,
doc_modified_date date
);

CREATE TABLE sentences(
sent_ID int primary key,
sent_doc_ID int references documents(doc_ID),
sent_taggable int,
sent_value varchar(2047)
);


CREATE TABLE tags (
tag_ID int primary key,
tag_sent_ID int references sentences(sent_ID),
tag_value varchar(255),
tag_created_date date,
tag_modified_date date
);
