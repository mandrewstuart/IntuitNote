import snowballstemmer
from math import log
stem = snowballstemmer.stemmer('Porter')
punctuation = [',', '.', '!', "?", ';', ':', '"', "'", '(', ')', '#', '1','2','3','4','5','6','7','8','9','0']

def dictionize(dataset, labeled=0):
    tf = {}
    l = []
    for x in range(0, len(dataset)):
        s = {}
        a = dataset[x][0]
        for y in punctuation:
            a = a.replace(y, '')
        a = a.lower().split(' ')
        for y in range(0, len(a)):
            a[y] = stem.stemWord(a[y])
        for y in a:
            try:
                s[y] = s[y] + 1
            except:
                s[y] = 1
        tf[dataset[x][1]] = s
        if ((labeled==1) and (dataset[x][2] != None)):
            l.append({dataset[x][2]: s})
    return {'tf': tf, 'labels': l}


def idfize(dataset):
    idf = {}
    vals = dataset.values()
    for x in vals:
        for y in x:
            try:
                idf[y] = idf[y] + 1
            except:
                idf[y] = 1
    for x in idf:
        idf[x] = log(len(dataset)/idf[x])
    return idf
