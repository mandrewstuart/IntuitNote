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


@route('/subjects')
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


@route('/deleteSubject/<id>')
def subject_delete(id):
    db = returnDBobj()
    db[0].execute('DELETE FROM subjects WHERE subj_ID = ' + str(id))
    db[0].execute('DELETE FROM tags WHERE tag_sent_ID IN (SELECT sent_ID FROM sentences WHERE sent_doc_ID IN (SELECT doc_ID FROM documents WHERE doc_subj_ID = ' + str(id) + '))')
    db[0].execute('DELETE FROM sentences WHERE sent_doc_ID IN (SELECT doc_ID FROM documents WHERE doc_subj_ID = ' + str(id) + ')')
    db[0].execute('DELETE FROM documents WHERE doc_subj_ID = ' + str(id))
    db[1].commit()
    db[1].close()
    return {"deleted": True}


##########################################
#doc pages
##########################################
@post('/document/create')
def create_document():
    response.content_type = 'application/json'
    nom = request.json.get('nom')
    contenu = request.json.get('contenu')
    contenu = html.escape(contenu)
    sujet = request.json.get('sujet')
    db = returnDBobj()
    db[0].execute("INSERT INTO documents (doc_name, doc_subj_ID) VALUES ('" + nom + "', " + str(sujet) + ")")
    doc_ID = db[0].execute("SELECT doc_ID FROM documents WHERE doc_name = '" + nom + "' AND doc_subj_ID = " + str(sujet) + ";").fetchall()[0][0]
    doc_ID = int(doc_ID)
    divise = parse_doc(contenu)
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


@route('/subject/<id>')
def show_subject(id):
    db = returnDBobj()
    nom = db[0].execute('SELECT subj_name FROM subjects WHERE subj_ID = ' + str(id)).fetchall()[0][0]
    docs = db[0].execute('SELECT doc_name, doc_ID FROM documents WHERE doc_subj_ID = ' + str(id)).fetchall()
    db[1].close()
    return template('subject_read', nom = nom, rows = docs, id = id)


@route('/document/delete/<id>')
def delete_document(id):
    response.content_type = 'application/json'
    db = returnDBobj()
    db[0].execute('DELETE FROM documents WHERE doc_ID = ' + str(id))
    db[1].commit()
    db[1].close()
    return {"deleted": True}


##########################################
#Sentences
##########################################
@route('/document/<id>')
def show_document(id):
    db = returnDBobj()
    sentences = db[0].execute("""SELECT s.sent_value, s.sent_ID, COALESCE(t.tag_value, 'qwertpop'), s.sent_taggable
        FROM sentences s LEFT JOIN tags t ON s.sent_ID = t.tag_sent_ID WHERE sent_doc_ID = """ + str(id) + " ORDER BY s.sent_ID").fetchall()
    sents = []
    for x in sentences:
        sents.append([html.unescape(x[0]), x[1], x[2], x[3]])
    nom = db[0].execute("SELECT doc_name FROM documents WHERE doc_ID = " + str(id)).fetchall()[0][0]
    subj_ID = db[0].execute("SELECT doc_subj_ID FROM documents WHERE doc_ID = " + str(id)).fetchall()[0][0]
    db[1].close()
    return template('document_read', rows = sents, nom = nom, sujet = subj_ID)


##########################################
#Tags
##########################################
@post('/tag/create')
def tag():
    phrase = request.json.get('phrase_id')
    marque = request.json.get('marque')
    ok = True
    q = "INSERT INTO tags (tag_sent_ID, tag_value) VALUES (" + phrase + ", '" + html.escape(marque) + "')"
    try:
        db = returnDBobj()
        db[0].execute(q)
        db[1].commit()
        db[1].close()
    except:
        ok = False
    return str(ok)


@route('/tags/review/<subj_ID>')
def review(subj_ID):
    db = returnDBobj()
    data = db[0].execute("""SELECT
                d.doc_name
                , se.sent_value
                , t.tag_value
                , t.tag_ID
                FROM  documents d
                INNER JOIN sentences se ON d.doc_ID = se.sent_doc_ID
                INNER JOIN tags t ON se.sent_ID = t.tag_sent_ID
                WHERE doc_subj_ID = """ + str(subj_ID) + " ORDER BY se.sent_ID ASC").fetchall()
    sujet = db[0].execute("SELECT subj_name FROM subjects WHERE subj_ID = " + str(subj_ID)).fetchall()[0][0]
    db[1].close()
    return template('tags_review', nom = sujet, rows = data)


@route('/tags/autotag/<doc_ID>')
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
