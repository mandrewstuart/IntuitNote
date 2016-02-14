import math
import snowballstemmer
s = snowballstemmer.stemmer('English')
from nltk.stem.porter import *
stemmer = PorterStemmer()

punctuation = [',', '.', '!', "?", ';', ':', '"', "'", '(', ')', '#', '1','2','3','4','5','6','7','8','9','0']
#stop words not yet implemented
stop_words = ['the', 'and', 'of', 'or', 'but', 'these', 'those', 'that', 'them']

def vectorize(dataset):
    #remove stop words
    #for x in range(0, len(dataset)):
    #    for sw in stop_words:
    #        dataset[x] = [dataset[x][0].replace(sw, '')]
    #create word list mapping
    #and get avg sentence length
    avgLength = 0
    lengthEffect = []
    wl = []
    for x in range(0, len(dataset)):
        a = dataset[x][0]
        for y in punctuation:
            a = a.replace(y, '')
        a = a.lower().split(' ')
        avgLength = (avgLength*x + len(a))/(x+1)
        a = list(set(a))
        lengthEffect.append(len(a))
        b = []
        for y in a:
            #b.append(s.stemWord(y))
            b.append(stemmer.stem(y))
        wl = list(set(wl+ b))
    #create term frequency matrix
    tfm = []
    for x in range(0, len(dataset)):
        a = dataset[x][0]
        for y in punctuation:
            a = a.replace(y, '')
        a = a.lower().split(' ')
        b = [0]*len(wl)
        for y in a:
            #i = wl.index(s.stemWord(y))
            i = wl.index(stemmer.stem(y))
            b[i] = b[i] + 1
        tfm.append(b)
    #create document frequency vector
    idf = [0]*len(wl)
    for x in range(0, len(dataset)):
        a = dataset[x][0]
        for y in punctuation:
            a = a.replace(y, '')
        a = a.lower().split(' ')
        a = list(set(a))
        for y in range(0, len(a)):
            #a[y] = s.stemWord(a[y])
            a[y] = stemmer.stem(a[y])
        a = list(set(a))
        for y in a:
            i = wl.index(y)
            idf[i] = idf[i] + 1
    for x in range(0, len(idf)):
        idf[x] = math.log(len(dataset)/idf[x])
        #idf[x] = len(dataset)/idf[x]
    #map inverse document frequency vector onto term frequency matrix
    for x in range(0, len(tfm)):
        for y in range(0, len(tfm[x])):
            tfm[x][y] = tfm[x][y]*idf[y]
    #change magnitudes based on relation to average sentence length to normalize significance of sentence
    for x in range(0, len(tfm)):
        for y in range(0, len(tfm[x])):
            tfm[x][y] = tfm[x][y]/lengthEffect[x]*avgLength
        #tfm[x] = [y*avgLength/lengthEffect[x] for y in tfm[x]]
    return tfm

