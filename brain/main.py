from bottle import response, redirect, route, run, template, post, request
import os, pymysql, html
import dictionize, dictClassify, parse_doc

response.content_type = 'application/json'

def escape_request(key):
    return html.escape(request.json[key])

def connect_to_db():
    conn = pymysql.connect(host="localhost", user="ade", passwd="The A-Team", db='ade_db', use_unicode=True, charset='utf8', autocommit=True)
    return conn.cursor(), conn


##########################################
#subject pages
##########################################

@post('/createSubject')
def subject_create():
    name = request.json['name']
    user_id = request.json['user_id']
    cursor, conn = connect_to_db()
    cursor.execute("INSERT INTO subjects (subj_name) VALUES ('{}');".format(name))
    id = cursor.lastrowid
    cursor.execute("INSERT INTO user_to_subj (u2s_user_ID, u2s_subj_ID) VALUES ('{}', {});".format(user_id, id))
    return { 'id': id }


@post('/getSubjects')
def subjects_read():
    user_id = request.json['user_id']
    cursor, conn = connect_to_db()
    cursor.execute("""SELECT subj_ID, subj_name
                    FROM subjects s
                    INNER JOIN user_to_subj u2s
                        ON s.subj_ID = u2s.u2s_subj_ID
                    WHERE u2s.u2s_user_ID = '{}';""".format(user_id))
    subjects = cursor.fetchall()
    return {
        'subjects': [ { 'id': item[0], 'name': item[1] } for item in subjects ]
    }


@post('/updateSubject')
def subject_update():
    user_id = request.json['user_id']
    subj_id = int(request.json['subj_id'])
    name = request.json['name']
    cursor, conn = connect_to_db()
    cursor.execute(
        """
        UPDATE subjects s
        INNER JOIN user_to_subj u2s
            ON s.subj_ID = u2s.u2s_subj_ID
        SET s.subj_name = '{}' WHERE s.subj_ID = {} and u2s.u2s_user_ID = '{}';
        """.format(name, str(subj_id), user_id))
    return { 'updated': True }


@post('/deleteSubject')
def subject_delete():
    user_id = request.json['user_id']
    id = str(int(request.json['subj_id']))
    cursor, conn = connect_to_db()
    cursor.execute("""DELETE s.* FROM subjects s INNER JOIN user_to_subj WHERE subj_ID = u2s_subj_ID
                    AND subj_ID = {} and u2s_user_ID = '{}';""".format(id, user_id))
    return { 'deleted': True }


##########################################
#doc pages
##########################################

@post('/createDocument')
def create_document():
    user_id = request.json['user_id']
    subj_id = str(request.json['doc_id'])
    nom = request.json['title']
    contenu = escape_request('text')
    auteur =  escape_request('author')
    publication = escape_request('publication')
    cursor, conn = connect_to_db()
    cursor.execute(
        """
        INSERT INTO documents (doc_name, doc_subj_ID, doc_author, doc_publication)
        VALUES (SELECT '{}', u2s.u2s_subj_ID, '{}', '{}'
                FROM user_to_subj u2s
                INNER JOIN subjects s
                    ON s.subj_ID = u2s.u2s_subj_ID);""".format(nom, auteur, publication))
    doc_id = cursor.lastrowid
    divise = parse_doc.parse_sentences(contenu)
    for s in divise:
        cursor.execute(
            """
            INSERT INTO sentences (sent_doc_ID, sent_value)
            VALUES ({}, '{}')
            """.format(str(doc_ID), s))
    return { 'document_ID': doc_ID }


@post('/getSubject')
def show_subject():
    user_id = request.json['user_id']
    id = str(request.json['subj_id'])
    cursor, conn = connect_to_db()
    cursor.execute(
        """SELECT doc_name, doc_ID, sum(CASE WHEN t.tag_id is not null then 1 else 0 end)
        FROM documents d
        inner join user_to_subj u2s ON {} = d.doc_subj_ID
        inner join sentences s on s.sent_doc_ID = d.doc_ID
        left join tags t on t.tag_sent_ID = s.sent_ID
        WHERE u2s.u2s_user_ID = {}
        GROUP BY doc_name, doc_ID""".format(id, user_id)
        )
    docs = cursor.fetchall()
    return {
        'documents': [ { 'name': item[0], 'id': item[1], 'tagsCount': str(item[2]) } for item in docs ]
    }


@post('/deleteDocument')
def delete_document():
    user_id = request.json['user_id']
    id = request.json['doc_id']
    cursor, conn = connect_to_db()
    cursor.execute("""DELETE d.* FROM documents d
                    INNER JOIN user_to_subj u2s
                        ON d.doc_subj_ID = u2s.u2s_subj_ID
                    WHERE doc_ID = {} and u2s.u2s_user_ID = '{}'""".format(id, user_id))
    return { 'deleted': True }


##########################################
#Sentences
##########################################

@post('/getDocument')
def show_document():
    user_id = request.json['user_id']
    doc_id = request.json['doc_id']
    cursor, conn = connect_to_db()
    cursor.execute("""SELECT s.subj_name, s.subj_id, d.doc_id
                    FROM user_to_subj u2s
                    INNER JOIN subjects s
                        ON s.subj_ID = u2s.u2s_subj_ID
                    INNER JOIN documents d
                        ON d.doc_subj_ID = s.subj_ID
                    WHERE d.doc_ID = {}
                    AND u2s.u2s_user_ID = {}""".format(doc_id, user_id))
    subj_id, nom, id = cursor.fetchall()[0]
    cursor.execute(
        """
        SELECT s.sent_value, s.sent_ID, COALESCE(t.tag_value, ''), COALESCE(t.tag_id, '')
        FROM sentences s LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID
        WHERE sent_doc_ID = {} ORDER BY s.sent_ID
        """.format(str(id)))
    sentences = cursor.fetchall()
    return {
        'document': {
            'subj_id': subj_id,
            'doc_name': nom,
            'doc_id': doc_id,
            'sentences': [
                {
                    'value': html.unescape(x[0]),
                    'id': x[1],
                    'tag_value': html.unescape(x[2]),
                    'tag_id': x[3]
                }
                for x in sentences
            ]
        }
    }


##########################################
#Tags
##########################################

@post('/createTag')
def tag():
    user_id = request.json['user_id']
    phrase = str(request.json['sent_id'])
    marque = escape_request('value')
    cursor, conn = connect_to_db()
    cursor.execute(
        """
        INSERT INTO tags (tag_sent_ID, tag_value)
        VALUES (SELECT {}, '{}'
            FROM user_to_subj u2s
            INNER JOIN documents d
                ON d.doc_subj_id = u2s.u2s_subj_ID
            INNER JOIN sentences s
                ON s.sent_doc_ID = d.doc_ID
            WHERE s.sent_ID = {}
            AND u2s.u2s_user_ID = {});""".format(phrase, marque, phrase, user_id))
    tag_id = cursor.lastrowid
    return { 'tag_id': tag_id }


@post('/reviewTags')
def review():
    user_id = request.json['user_id']
    subj_id = int(request.json.get('subj_id'))
    cursor, conn = connect_to_db()
    cursor.execute("""SELECT subj_name, subj_id
    FROM subjects s
    INNER JOIN user_to_subj u2s
        ON s.subj_ID = u2s.u2s_subj_ID
    WHERE subj_ID = {}
    AND u2s.u2s_user_ID = '{}'""".format(str(subj_id), user_id))
    subj_name, subj_id = cursor.fetchall()[0]
    output = {'subject_name': subj_name}
    output['subectj_id'] = subj_id
    cursor.execute("""SELECT
                d.doc_name
                , d.doc_ID
                , se.sent_id
                , se.sent_value
                , t.tag_value
                , t.tag_ID
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = {} ORDER BY se.sent_ID ASC""".format(subj_id))
    data = cursor.fetchall()
    output = []
    for x in data:
        output.append({'doc_name': x[0],
        'doc_ID': x[1],
        'sent_value': html.unescape(x[3]),
        'sent_ID': x[2],
        'tag_value': html.unescape(x[4]),
        'tag_ID': x[5]})
    return { 'output': output }


@post('/deleteTag')
def delete_tag():
    user_id = request.json['user_id']
    id = str(int(request.json['id']))
    cursor, conn = connect_to_db()
    cursor.execute("""DELETE t.* FROM tags t
    INNER JOIN sentences s
        ON t.tag_sent_ID = s.sent_ID
    INNER JOIN documents d
        ON d.doc_ID = s.sent_doc_ID
    INNER JOIN user_to_subj u2s
        ON u2s.u2s_subj_ID = d.doc_subj_id
    WHERE tag_ID = {}
    AND u2s.u2s_user_ID = '{}'""".format(id, user_id))
    return { 'deleted': True }


#to secure
@post('/autoTag')
def auto_tag():
    user_id = request.json['user_id']
    doc_id = request.json['id']
    cursor, conn = connect_to_db()
    cursor.execute("""SELECT
                COUNT(*)
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                    WHERE doc_ID = """ + str(doc_id) + ") OR doc_subj_ID = 13")
    tag_count = cursor.fetchall()[0][0]
    #inform the user if they still need to tag something already
    if (tag_count == 0):
        return {
            'error': "You haven't tagged anything for this subject yet. <a href='/'>main</a>"
        }
    else:
    #pull with and without tags separately
        cursor.execute("""SELECT sent_value, tag_value, sent_ID
                        FROM sentences s
                        LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID
                        WHERE sent_doc_ID in (SELECT DISTINCT doc_ID
                        FROM documents
                        WHERE doc_ID <> """ + str(doc_id) +
                        """ AND doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                            WHERE doc_ID = """ + str(doc_id) + "))")
        data = cursor.fetchall()
        training_data = []
        for x in data:
            training_data.append([ html.unescape(x[0]), x[2], x[1] ])
        cursor.execute('SELECT sent_value, sent_ID FROM sentences WHERE trim(replace(sent_value, "\t","")) <> "<br>" AND length(trim(sent_value)) > 10 AND sent_doc_ID = ' + str(doc_id) + ' ORDER BY sent_ID')
        target = cursor.fetchall()
        test_data = []
        for x in target:
            test_data.append([html.unescape(x[0]), x[1]])
        #create TF dictionaries
        X = dictionize.dictionize(training_data, 1)
        Y = dictionize.dictionize(test_data)
        X_plus_Y = {}
        X_plus_Y.update(X['tf'])
        X_plus_Y.update(Y['tf'])
        #create IDF dictionary
        idf = dictionize.idfize(X_plus_Y)
        #determine threshold
        #threshold = dictClassify.getAvgDist(X_plus_Y, idf)
        cursor.execute("select val from env_vals where key = 'threshold';")
        threshold = cursor.fetchall()[0][0]
        #machine learning
        suggestions = dictClassify.distProxit(threshold, X['labels'], Y['tf'], idf)
    conn.close()
    return { 'suggestedTags': suggestions }


run(host="localhost", port=5000, reloader=True)
