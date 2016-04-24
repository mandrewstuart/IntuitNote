from bottle import response, redirect, route, run, template, get, post, request, error, SimpleTemplate
import os, sqlite3, html, parse_doc
import dictionize, dictClassify

response.content_type = 'application/json'

def escape_request(key):
    return html.escape(request.json[key])


def connect_to_db():
    conn = sqlite3.connect('db.file')
    return conn.cursor(), conn


##########################################
#subject pages
##########################################

@post('/createSubject')
def subject_create():
    name = request.json['name']
    cursor, conn = connect_to_db()

    cursor.execute("INSERT INTO subjects (subj_name) VALUES ('{}')".format(name))

    id = cursor.execute(
        """
        SELECT subj_ID FROM subjects WHERE subj_name = '{}';
        """.format(name)).fetchall()[0][0]

    conn.commit()
    conn.close()

    return { 'id': id }


@post('/getSubjects')
def subjects_read():
    cursor, conn = connect_to_db()
    subjects = cursor.execute('SELECT * FROM subjects;').fetchall()
    conn.close()

    return {
        'subjects': [ { 'id': item[0], 'name': item[1] } for item in subjects ]
    }


@post('/updateSubject')
def subject_update():
    name = request.json['name']
    subj_id = int(request.json['subj_id'])
    cursor, conn = connect_to_db()

    cursor.execute(
        """
        UPDATE subjects SET subj_name = '{}' WHERE subj_ID = {};
        """.format(name, str(subj_id)))

    conn.commit()
    conn.close()

    return { 'updated': True }


@post('/deleteSubject')
def subject_delete():
    id = str(int(request.json['id']))
    cursor, conn = connect_to_db()
    cursor.execute('DELETE FROM subjects WHERE subj_ID = {}'.format(id))

    cursor.execute(
        """
        DELETE FROM tags WHERE tag_sent_ID
        IN (SELECT sent_ID FROM sentences WHERE sent_doc_ID
        IN (SELECT doc_ID FROM documents WHERE doc_subj_ID = {}))
        """.format(id))

    cursor.execute(
        """
        DELETE FROM sentences WHERE sent_doc_ID
        IN (SELECT doc_ID FROM documents WHERE doc_subj_ID = {})
        """.format(id))

    cursor.execute('DELETE FROM documents WHERE doc_subj_ID = {}'.format(id))

    conn.commit()
    conn.close()

    return { 'deleted': True }


##########################################
#doc pages
##########################################

@post('/createDocument')
def create_document():
    subj_id = str(request.json['id'])
    nom = request.json['title']
    contenu = escape_request('text')
    auteur =  escape_request('author')
    publication = escape_request('publication')
    cursor, conn = connect_to_db()
    cursor.execute(
        """
        INSERT INTO documents (doc_name, doc_subj_ID, doc_author, doc_publication)
        VALUES ('{}', {}, '{}', '{}')
        """.format(nom, subj_id, auteur, publication))
    doc_ID = cursor.execute(
        """
        SELECT doc_ID FROM documents
        WHERE doc_name = '{}' AND doc_subj_ID = {};
        """.format(nom, subj_id)).fetchall()[0][0]
    doc_ID = int(doc_ID)
    divise = parse_doc.parse_sentences(contenu)
    c = cursor.execute('SELECT MAX(sent_ID) FROM sentences;').fetchall()[0][0]
    try:
        c = int(c)
    except:
        c = 1
    for s in divise:
        c = c + 1
        cursor.execute(
            """
            INSERT INTO sentences (sent_ID, sent_doc_ID, sent_value, sent_taggable)
            VALUES ('{}', {}, '{}', {})
            """.format(str(c), str(doc_ID), s, ("1" if (len(s)>5) else "0")))
    conn.commit()
    conn.close()
    return { 'document_ID': doc_ID }


@post('/getSubject')
def show_subject():
    id = str(request.json['id'])
    cursor, conn = connect_to_db()

    nom = cursor.execute(
        'SELECT subj_name FROM subjects WHERE subj_ID = {}'.format(id)
        ).fetchall()

    docs = cursor.execute(
        'SELECT doc_name, doc_ID FROM documents WHERE doc_subj_ID = {}'.format(id)
        ).fetchall()

    conn.close()

    return {
        'documents': [ { 'name': item[0], 'id': item[1] } for item in docs ]
    }


@post('/deleteDocument')
def delete_document():
    id = str(int(request.json['id']))
    cursor, conn = connect_to_db()

    cursor.execute(
        """
        DELETE FROM tags WHERE tag_sent_ID
        IN (SELECT sent_ID FROM sentences WHERE sent_doc_ID = {})
        """.format(id))

    cursor.execute('DELETE FROM sentences WHERE sent_doc_ID = {}'.format(id))
    cursor.execute('DELETE FROM documents WHERE doc_ID = {}'.format(id))

    conn.commit()
    conn.close()

    return { 'deleted': True }


##########################################
#Sentences
##########################################

@post('/getDocument')
def show_document():
    doc_id = request.json['id']
    cursor, conn = connect_to_db()
    subj_id = cursor.execute(
        """
        SELECT doc_subj_ID FROM documents
        WHERE doc_ID = {}
        """.format(str(doc_id))).fetchall()[0][0]
    nom = cursor.execute(
        """
        SELECT doc_name FROM documents
        WHERE doc_ID = {}
        """.format(str(doc_id))).fetchall()[0][0]
    sentences = cursor.execute(
        """
        SELECT s.sent_value, s.sent_ID, COALESCE(t.tag_value, ''), COALESCE(t.tag_id, '')
        FROM sentences s LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID
        WHERE sent_doc_ID = {} ORDER BY s.sent_ID
        """.format(str(doc_id))).fetchall()

    conn.close()

    return {
        'document': {
            'subj_id': subj_id,
            'doc_name': nom,
            'doc_id': doc_id,
            'sentences': [
                {
                    'value': html.unescape(x[0]),
                    'id': x[1],
                    'tag_value': x[2],
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
    phrase = str(request.json['id'])
    marque = escape_request('value')

    cursor, conn = connect_to_db()

    cursor.execute(
        """
        INSERT INTO tags (tag_sent_ID, tag_value) VALUES ({}, '{}')
        """.format(phrase, marque))

    tag_id = cursor.execute(
        """
        SELECT tag_id FROM tags
        WHERE tag_sent_ID = {} AND tag_value = '{}'
        """.format(phrase, marque)).fetchall()[0][0]

    conn.commit()
    conn.close()

    return { 'tag_id': int(tag_id) }


@post('/reviewTags/<subj_ID>')
def review(subj_ID):
    cursor, conn = connect_to_db()
    tagsData = {}
    subj_id = int(request.json.get('subj_id'))
    tagsData['subj_id'] = subj_id
    subj_name = cursor.execute("SELECT subj_name FROM subjects WHERE subj_ID = " + subj_id).fetchall()[0][0]
    tagsData['subj_name'] = subj_name
    data = cursor.execute("""SELECT
                d.doc_name
                , d.doc_ID
                , se.sent_value
                , t.tag_value
                , t.tag_ID
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = """ + str(subj_ID) + " ORDER BY se.sent_ID ASC").fetchall()
    doc_id = -1
    documents = []
    for row in data:
        if (int(row[1])!=doc_id):
            if (doc_id != -1):
                documents.append(docData)
            docData = {}
            docData['document_name'] = row[0]
            docData['document_id'] = int(row[1])
    sujet = cursor.execute("SELECT subj_name FROM subjects WHERE subj_ID = " + str(subj_ID)).fetchall()[0][0]
    conn.close()
    return template('tags_review', nom = sujet, rows = data)


@post('/autoTag')
def auto_tag():
    #check if there are any tags in that subject yet
    cursor, conn = connect_to_db()
    doc_id = request.json['id']
    tag_count = cursor.execute("""SELECT
                COUNT(*)
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                    WHERE doc_ID = """ + str(doc_id) + ")").fetchall()[0][0]
    #inform the user if they still need to tag something already
    if (tag_count == 0):
        return {
            'error': "You haven't tagged anything for this subject yet. <a href='/'>main</a>"
        }
    else:
    #pull with and without tags separately
        data = cursor.execute("""SELECT sent_value, tag_value, sent_ID
                        FROM sentences s
                        LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID
                        WHERE sent_doc_ID in (SELECT DISTINCT doc_ID
                        FROM documents
                        WHERE doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                            WHERE doc_ID = """ + str(doc_id) + """)
                        AND doc_ID <> """ + str(doc_id) + ") ORDER BY sent_ID").fetchall()
        training_data = []
        for x in data:
            training_data.append([ html.unescape(x[0]) , x[2], x[1] ])
        #machine learning
        target = cursor.execute('SELECT sent_value, sent_ID FROM sentences WHERE sent_value <> "<br>" AND length(sent_value) > 1 AND sent_doc_ID = ' + str(doc_id) + ' ORDER BY sent_ID').fetchall()
        test_data = []
        for x in target:
            test_data.append([html.unescape(x[0]), x[1]])
        X = dictionize.dictionize(training_data, 1)
        Y = dictionize.dictionize(test_data)
        X_plus_Y = {}
        X_plus_Y.update(X['tf'])
        X_plus_Y.update(Y['tf'])
        idf = dictionize.idfize(X_plus_Y)
        threshold = dictClassify.getAvgDist(X_plus_Y, idf)*3/4
        suggestions = dictClassify.distProxit(threshold, X['labels'], Y['tf'], idf)
    conn.commit()
    conn.close()
    return { 'suggestedTags': suggestions }


run(host="localhost", port=5000, reloader=True)
