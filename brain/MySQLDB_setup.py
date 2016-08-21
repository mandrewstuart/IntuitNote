
# install psql
DROP DATABASE IF EXISTS ade_db;
CREATE DATABASE ade_db;
use ade_db;

CREATE TABLE user_to_subj (
u2s_user_ID varchar(255) charset utf8,
u2s_subj_ID bigint
);

CREATE TABLE subjects (
subj_ID bigint unsigned auto_increment primary key,
subj_name varchar(255) charset utf8,
subj_created_date date,
subj_modified_date date
);

CREATE TABLE documents (
doc_ID bigint unsigned auto_increment primary key,
doc_subj_ID bigint unsigned,
doc_name varchar(255) charset utf8,
doc_author varchar(255) charset utf8,
doc_publication varchar(255) charset utf8,
doc_date date,
doc_created_date date,
doc_modified_date date,
CONSTRAINT `fk_doc_subj`
    FOREIGN KEY (doc_subj_ID) REFERENCES subjects (subj_ID)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE sentences(
sent_ID bigint unsigned auto_increment primary key,
sent_doc_ID bigint unsigned,
sent_value varchar(2047) charset utf8,
CONSTRAINT `fk_sent_doc`
    FOREIGN KEY (sent_doc_ID) REFERENCES documents (doc_ID)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE tags (
tag_ID bigint unsigned auto_increment primary key,
tag_sent_ID bigint unsigned,
tag_value varchar(255) charset utf8,
tag_created_date date,
tag_modified_date date,
CONSTRAINT `fk_tags_sent`
    FOREIGN KEY (tag_sent_ID) REFERENCES sentences (sent_ID)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
);

CREATE TABLE env_vals (key varchar(50), val int(10));
INSERT INTO env_vals (key, val) VALUES ('threshold', 30);
INSERT INTO env_vals (key, val) VALUES ('filler', 13);

CREATE USER 'ade'@'localhost' IDENTIFIED BY 'The A-Team';

GRANT SELECT, INSERT, UPDATE, DELETE ON ade_db.* TO 'ade'@'localhost';
