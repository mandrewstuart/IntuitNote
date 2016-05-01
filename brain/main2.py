from bottle import response, redirect, route, run, template, get, post, request, error, SimpleTemplate
import os, pymysql, html, parse_doc
import dictionize, dictClassify

response.content_type = 'application/json'

def escape_request(key):
    return html.escape(request.json[key])

def connect_to_db():
    conn = pymysql.connect(host="localhost", user="ade", passwd="The A-Team", db='ade_db')
    return conn.cursor(), conn


##########################################
#subject pages
##########################################

@post('/createSubject')
def subject_create():
    name = request.json['name']
    cursor, conn = connect_to_db()
    cursor.execute("INSERT INTO subjects (subj_name) VALUES ('{}')".format(name))
    cursor.execute(
        """
        SELECT subj_ID FROM subjects WHERE subj_name = '{}';
        """.format(name))
    id = cursor.fetchall()[0][0]
    conn.commit()
    print({ 'id': id })
    return { 'id': id }


@post('/getSubjects')
def subjects_read():
    cursor, conn = connect_to_db()
    cursor.execute('SELECT * FROM subjects;')
    subjects = cursor.fetchall()

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

    return { 'updated': True }


@post('/deleteSubject')
def subject_delete():
    id = str(int(request.json['id']))
    cursor, conn = connect_to_db()
    cursor.execute('DELETE FROM subjects WHERE subj_ID = {}'.format(id))
    conn.commit()
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
    cursor.execute(
        """
        SELECT doc_ID FROM documents
        WHERE doc_name = '{}' AND doc_subj_ID = {};
        """.format(nom, subj_id))
    doc_ID = cursor.fetchall()[0][0]
    doc_ID = int(doc_ID)
    divise = parse_doc.parse_sentences(contenu)
    cursor.execute('SELECT MAX(sent_ID) FROM sentences;')
    c = cursor.fetchall()[0][0]
    try:
        c = int(c)
    except:
        c = 1
    for s in divise:
        c = c + 1
        cursor.execute(
            """
            INSERT INTO sentences (sent_ID, sent_doc_ID, sent_value)
            VALUES ('{}', {}, '{}', {})
            """.format(str(c), str(doc_ID), s)
    conn.commit()
    return { 'document_ID': doc_ID }


@post('/getSubject')
def show_subject():
    id = str(request.json['id'])
    cursor, conn = connect_to_db()
    cursor.execute(
        'SELECT doc_name, doc_ID FROM documents WHERE doc_subj_ID = {}'.format(id)
        )
    docs = cursor.fetchall()

    return {
        'documents': [ { 'name': item[0], 'id': item[1] } for item in docs ]
    }


@post('/deleteDocument')
def delete_document():
    id = request.json['id']
    cursor, conn = connect_to_db()
    cursor.execute('DELETE FROM documents WHERE doc_ID = {}'.format(id))
    conn.commit()
    return { 'deleted': True }


##########################################
#Sentences
##########################################

@post('/getDocument')
def show_document():
    doc_id = request.json['id']
    cursor, conn = connect_to_db()
    cursor.execute(
        """
        SELECT doc_subj_ID FROM documents
        WHERE doc_ID = {}
        """.format(str(doc_id)))
    subj_id = cursor.fetchall()[0][0]
    cursor.execute(
        """
        SELECT doc_name FROM documents
        WHERE doc_ID = {}
        """.format(str(doc_id)))
    nom = cursor.fetchall()[0][0]
    cursor.execute(
        """
        SELECT s.sent_value, s.sent_ID, COALESCE(t.tag_value, ''), COALESCE(t.tag_id, '')
        FROM sentences s LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID
        WHERE sent_doc_ID = {} ORDER BY s.sent_ID
        """.format(str(doc_id)))
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

    cursor.execute(
        """
        SELECT tag_id FROM tags
        WHERE tag_sent_ID = {} AND tag_value = '{}'
        """.format(phrase, marque))
    tag_id = cursor.fetchall()[0][0]

    conn.commit()

    return { 'tag_id': int(tag_id) }


@post('/reviewTags')
def review():
    subj_id = int(request.json.get('subj_id'))
    cursor, conn = connect_to_db()
    cursor.execute("SELECT subj_name FROM subjects WHERE subj_ID = " + str(subj_id))
    subj_name = cursor.fetchall()[0][0]
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
                WHERE doc_subj_ID = """ + str(subj_id) + " ORDER BY se.sent_ID ASC")
    data = cursor.fetchall()
    doc_id = -1
    documents = []
    for row in data:
        if (-1==doc_id):
            docData = {}
            doc_id = int(row[1])
            docData['document_id'] = doc_id
            docData['document_name'] = row[0]
            sentences = []
        elif (int(row[1])!=doc_id):
            docData['sentences'] = sentences
            documents.append(docData)
            sentences = []
            doc_id = int(row[1])
            docData = {}
            docData['document_id'] = doc_id
            docData['document_name'] = row[0]
        sentence = {}
        sentence['sentence_value'] = row[3]
        sentence['sentence_id'] = int(row[2])
        sentence['tag_value'] = row[4]
        sentence['tag_id'] = int(row[5])
        sentences.append(sentence)
    docData['sentences'] = sentences
    documents.append(docData)
    output['documents']= documents
    return output


@post('/deleteTag')
def delete_tag():
    id = str(int(request.json['id']))
    cursor, conn = connect_to_db()
    cursor.execute('DELETE FROM tags WHERE tag_ID = {}'.format(id))
    conn.commit()
    return { 'deleted': True }


@post('/autoTag')
def auto_tag():
    doc_id = request.json['id']
    cursor, conn = connect_to_db()
    cursor.execute("""SELECT
                COUNT(*)
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                    WHERE doc_ID = """ + str(doc_id) + ")")
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
        cursor.execute('SELECT sent_value, sent_ID FROM sentences WHERE sent_value <> "<br>" AND length(sent_value) > 1 AND sent_doc_ID = ' + str(doc_id) + ' ORDER BY sent_ID')
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
        threshold = dictClassify.getAvgDist(X_plus_Y, idf)*2/3
        #machine learning
        suggestions = dictClassify.distProxit(threshold, X['labels'], Y['tf'], idf)
    conn.commit()
    conn.close()
    return { 'suggestedTags': suggestions }


run(host="localhost", port=5000, reloader=True)