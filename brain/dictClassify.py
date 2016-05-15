#needs the idf global
def dictManDist(t,s,idf):
    dist = 0
    for k in t:
        if k in s:
            dist = dist + abs(t[k]-s[k])*idf[k]
        else:
            dist = dist + t[k]*idf[k]
    for k in s:
        if k not in t:
            dist = dist + s[k]*idf[k]
    return dist


def getAvgDist(tf, idf):
    vals = list(tf.values())
    avg = 0
    c = 0
    for x in range(0, len(tf)):
        for y in range(x+1, len(tf)):
            c = c + 1
            avg = (avg*(c-1) + dictManDist(vals[x], vals[y], idf))/c
    return avg

#needs the idf global
def distProxit(threshold, labeled, test, idf):
    attribution = {}
    for label_key in labeled:
        for test_key in test:
            if (sum([test[test_key][x] for x in test[test_key]])>3):
                newDist = dictManDist(list(label_key.values())[0], test[test_key], idf)
                print(newDist)
                if (newDist<=threshold):
                    try:
                        oldDist = attribution[test_key]['val']
                        if (newDist<oldDist):
                            attribution[test_key]={'val':newDist, 'tag': list(label_key.keys())[0]}
                    except:
                        attribution[test_key]={'val':newDist, 'tag': list(label_key.keys())[0]}
    output = []
    for x in attribution:
        output.append({
        'tag_value': attribution[x]['tag']
        , 'sentence_id': x
        , 'distance': attribution[x]['val']
        })
    return output
