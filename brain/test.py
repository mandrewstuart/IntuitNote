import cussterify
import vectorizer
import pprint

data = [['this is a test sentence'],['i love tests'],["i don't know where I am"],['what is the meaning of life'],['love is my test'],['you are the meanest person i know']]
target = [['the meaning of life is love'],['i live in a fish bowl'], ['you are the meanest meanest'], ['have you ever tried doing math']]
label_set = ['0','1','2','3','4','5']

A = data + target
A = vectorizer.vectorize(A)
#pprint.pprint(A)
X = A[:len(data)]
Z = A[len(data):]
pprint.pprint(cussterify.proxit(X, Z, label_set))
