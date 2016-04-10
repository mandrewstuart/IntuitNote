
def eucDistance(a,b):
    tally = 0
    for x in range(0, len(a)):
        tally = tally + (a[x] - b[x])**2
    return tally**0.5


def lenCheck(d):
    l = len(d[0])
    for x in d:
        if (len(x) != l):
            return False
    return True


def getAvgDist(d):
    avg = 0
    c = 0
    for x in range(0, len(d)):
        for y in range((x+1), len(d)):
            c = c + 1
            avg = (avg*(c-1) + eucDistance(d[x][:-1], d[y][:-1]))/c
    return avg


def getList(d, r = 0):
    l = []
    import random
    for x in range(0, len(d)):
        l.append(x)
    if (r=='random'):
        random.shuffle(l)
    return l


#data = [[1,2,3,],[7,8,9,],[0,0,0],[9,8,7],[7,9,7],[-1,0,2]]
#label_set = ['Medium-small','None','None','None','big','small']
#target = [[1,1,1],[7,8,9]]

def proxit(d, t, labels):
    avgDist = getAvgDist(d+t)/2
    attribution = []
    for x in range(0, len(labels)):
        if (labels[x] != 'None'):
            for y in range(0, len(t)):
                dist = eucDistance(d[x], t[y])
                if (dist<=avgDist):
                    attribution.append([y, dist, labels[x]])
    l = getList(t)
    ordered = []
    for x in l:
        temp = [x, []]
        for y in range(0, len(attribution)):
            if(x==attribution[y][0]):
                temp[1].append([attribution[y][2], attribution[y][1]])
        ordered.append(temp)
    trimmed = []
    for x in l:
        label = 'None'
        min_dist = 9999
        for y in range(0,len(ordered[x][1])):
            if (min_dist > ordered[x][1][y][1]):
                label = ordered[x][1][y][0]
                min_dist = ordered[x][1][y][1]
        trimmed.append([x, label, min_dist])
    return [trimmed, avgDist]
    #return trimmed

#proxit(data, target, label_set)
