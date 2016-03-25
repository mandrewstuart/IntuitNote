from bottle import response, redirect, route, run, template, get, post, request, error, SimpleTemplate
import os, sqlite3, html, custom_classify, vectorizer, parse_doc

def returnDBobj():
    conn = sqlite3.connect('db.file')
    return [conn.cursor(), conn]

##########################################
#subject pages
##########################################
@post('/createSubject')
def subject_create():
    name = request.json['name']
    db = returnDBobj()
    db[0].execute("INSERT INTO subjects (subj_name) VALUES ('" + name + "')")
    new_id = db[0].execute("SELECT subj_ID FROM subjects WHERE subj_name = '" + name + "';").fetchall()[0][0]
    db[1].commit()
    db[1].close()
    response.content_type = 'application/json'
    return {"id": new_id}


@post('/getSubjects')
def subjects_read():
    db = returnDBobj()
    data = db[0].execute('SELECT * FROM subjects;').fetchall()
    all_data = []
    for item in data:
        subject = {}
        subject['name'] = item[1]
        subject['id'] = item[0]
        all_data.append(subject)
    db[1].close()
    response.content_type = 'application/json'
    return {"subjects": all_data}


@post('/updateSubject')
def subject_update():
    name = request.json['name']
    subj_id = int(request.json['subj_id'])
    db = returnDBobj()
    db[0].execute("UPDATE subjects SET subj_name = '" + name + "' WHERE subj_ID = " + str(subj_id) + ";")
    db[1].commit()
    db[1].close()
    response.content_type = 'application/json'
    return {"updated": True}


@post('/deleteSubject')
def subject_delete():
    delete_id = int(request.json['id'])
    db = returnDBobj()
    db[0].execute('DELETE FROM subjects WHERE subj_ID = ' + str(delete_id))
    db[0].execute('DELETE FROM tags WHERE tag_sent_ID IN (SELECT sent_ID FROM sentences WHERE sent_doc_ID IN (SELECT doc_ID FROM documents WHERE doc_subj_ID = ' + str(delete_id) + '))')
    db[0].execute('DELETE FROM sentences WHERE sent_doc_ID IN (SELECT doc_ID FROM documents WHERE doc_subj_ID = ' + str(delete_id) + ')')
    db[0].execute('DELETE FROM documents WHERE doc_subj_ID = ' + str(delete_id))
    db[1].commit()
    db[1].close()
    return {"deleted": True}


##########################################
#doc pages
##########################################
@post('/createDocument')
def create_document():
    response.content_type = 'application/json'
    nom = request.json['title']
    contenu = request.json['text']
    contenu = html.escape(contenu)
    auteur = request.json['author']
    auteur = html.escape(auteur)
    sujet = request.json['id']
    publication = request.json['publication']
    publication = html.escape(publication)
    db = returnDBobj()
    db[0].execute("INSERT INTO documents (doc_name, doc_subj_ID, doc_author, doc_publication) VALUES ('" + nom + "', " + str(sujet) + ", '" + auteur + "', '" + publication + "')")
    doc_ID = db[0].execute("SELECT doc_ID FROM documents WHERE doc_name = '" + nom + "' AND doc_subj_ID = " + str(sujet) + ";").fetchall()[0][0]
    doc_ID = int(doc_ID)
    divise = parse_doc.parse_sentences(contenu)
    c = db[0].execute('SELECT MAX(sent_ID) FROM sentences;').fetchall()[0][0]
    try:
        c = int(c)
    except:
        c = 1
    for s in divise:
        c = c + 1
        db[0].execute("INSERT INTO sentences (sent_ID, sent_doc_ID, sent_value, sent_taggable) VALUES ('" + str(c) + "', " + str(doc_ID) + ", '" + s + "', " + ("1" if (len(s)>5) else "0") + ")")
    db[1].commit()
    db[1].close()
    return {"document_ID": doc_ID}


@post('/getSubject')
def show_subject():
    subj_id = request.json['id']
    db = returnDBobj()
    nom = db[0].execute('SELECT subj_name FROM subjects WHERE subj_ID = ' + str(subj_id)).fetchall()
    docs = db[0].execute('SELECT doc_name, doc_ID FROM documents WHERE doc_subj_ID = ' + str(subj_id)).fetchall()
    all_data = []
    for item in docs:
        document = {}
        document['name'] = item[0]
        document['id'] = item[1]
        all_data.append(document)
    db[1].close()
    response.content_type = 'application/json'
    return {"documents": all_data}


@post('/deleteDocument')
def delete_document():
    delete_id = int(request.json['id'])
    db = returnDBobj()
    db[0].execute('DELETE FROM tags WHERE tag_sent_ID IN (SELECT sent_ID FROM sentences WHERE sent_doc_ID  = ' + str(delete_id) + ')')
    db[0].execute('DELETE FROM sentences WHERE sent_doc_ID =' + str(delete_id) + '')
    db[0].execute('DELETE FROM documents WHERE doc_ID = ' + str(delete_id))
    db[1].commit()
    db[1].close()
    return {"deleted": True}


##########################################
#Sentences
##########################################
@post('/getDocument')
def show_document():
    doc_id = request.json['id']
    db = returnDBobj()
    documentData = {}
    subj_id = db[0].execute("SELECT doc_subj_ID FROM documents WHERE doc_ID = " + str(doc_id)).fetchall()[0][0]
    documentData['subj_id'] = subj_id
    nom = db[0].execute("SELECT doc_name FROM documents WHERE doc_ID = " + str(doc_id)).fetchall()[0][0]
    documentData['doc_name'] = nom
    documentData['doc_id'] = doc_id
    sentences = db[0].execute("""SELECT s.sent_value, s.sent_ID, COALESCE(t.tag_value, ''), COALESCE(t.tag_id, '')
        FROM sentences s LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID WHERE sent_doc_ID = """ + str(doc_id) + " ORDER BY s.sent_ID").fetchall()
    sents = []
    for x in sentences:
        sent = {}
        sent['value'] = x[0]
        sent['id'] = int(x[1])
        if (x[2]!=''):
            sent['tag_value'] = x[2]
            sent['tag_id'] = int(x[3])
        sents.append(sent)
    documentData['sentences'] = sents
    db[1].close()
    import pprint
    pprint.pprint(documentData)

    return {"document": documentData}


##########################################
#Tags
##########################################
@post('/createTag')
def tag():
    phrase = str(request.json.get('phrase_id'))
    marque = str(request.json.get('marque'))
    db = returnDBobj()
    db[0].execute("INSERT INTO tags (tag_sent_ID, tag_value) VALUES (" + phrase + ", '" + html.escape(marque) + "')")
    tag_id = db[0].execute("SELECT tag_id FROM tags WHERE tag_sent_ID = " + phrase + " AND tag_value = '" + html.escape(marque) + "'").fetchall()[0][0]
    db[1].commit()
    db[1].close()
    return {"tag_id": int(tag_id)}


@post('/reviewTags/<subj_ID>')
def review(subj_ID):
    db = returnDBobj()
    tagsData = {}
    subj_id = int(request.json.get('subj_id'))
    tagsData['subj_id'] = subj_id
    subj_name = db[0].execute("SELECT subj_name FROM subjects WHERE subj_ID = " + subj_id).fetchall()[0][0]
    tagsData['subj_name'] = subj_name
    data = db[0].execute("""SELECT
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
    sujet = db[0].execute("SELECT subj_name FROM subjects WHERE subj_ID = " + str(subj_ID)).fetchall()[0][0]
    db[1].close()
    return template('tags_review', nom = sujet, rows = data)


@post('/tags/autotag/<doc_ID>')
def auto_tag(doc_ID):
    #check if there are any tags in that subject yet
    db = returnDBobj()
    tag_count = db[0].execute("""SELECT
                COUNT(*)
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                    WHERE doc_ID = """ + str(doc_ID) + ") AND doc_ID <> " + str(doc_ID)).fetchall()[0][0]
    #inform the user if they still need to tag something already
    if (tag_count == 0):
        return "You haven't tagged anything for this subject yet. <a href='/'>main</a>"
    else:
    #pull with and without tags separately
        data = db[0].execute("""SELECT sent_value, tag_value
                        FROM sentences s
                        LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID
                        WHERE sent_doc_ID in (SELECT DISTINCT doc_ID
                        FROM documents
                        WHERE doc_subj_ID = (SELECT doc_subj_ID FROM documents
                                            WHERE doc_ID = """ + str(doc_ID) + """)
                        AND doc_ID <> """ + str(doc_ID) + ") ORDER BY sent_ID").fetchall()
        output = []
        for x in data:
            output.append([html.unescape(x[0])])
        #machine learning
        target = db[0].execute('SELECT sent_value, sent_ID FROM sentences WHERE length(sent_value) > 1 AND sent_doc_ID = ' + str(doc_ID) + ' ORDER BY sent_ID').fetchall()
        clean_target = []
        for x in target:
            clean_target.append([html.unescape(x[0])])
        Z = []
        for x in target:
            Z.append([x[0]])
        A = output + Z
        A = vectorizer.vectorize(A)
        Y = []
        for x in data:
            Y.append( x[1] if (x[1]!= None) else 'None' )
        X = A[:len(output)]
        Z = A[len(output):]
        cusster = cussterify.proxit(X, Z, Y)
        suggestions = cusster[0]
        suggested = []
        for x in range(0,len(suggestions)):
            if (suggestions[x]!='None'):
                suggested.append([suggestions[x], clean_target[x][0]])
    db[1].commit()
    db[1].close()
    return template('auto_tag_review', rows = suggested)


run(host="localhost", port=5000, reloader=True)
