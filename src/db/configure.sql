-- DROP TABLE users;
-- DROP TABLE articles;
-- DROP TABLE posts;
-- DROP TABLE goodjob;

-- CREATE TABLE users
-- (
--     id character varying(128) PRIMARY KEY,
--     nickname character varying(128)
-- );

-- CREATE TABLE articles
-- (
--     url character varying(256) PRIMARY KEY,
--     title character varying(64) ,
--     class character varying(64),
--     author character varying(64),
--     date character varying(64),
--     content text[]
-- );

-- CREATE TABLE posts
-- (
--     postId character varying(64) PRIMARY KEY,
--     postTitle character varying(64),
--     created_date timestamp,
--     modified_date timestamp,
--     postContent text
-- );

-- CREATE TABLE goodjob
-- (
--     userId character varying(128),
--     articleUrl character varying(256),
--     postId character varying(128)
-- );