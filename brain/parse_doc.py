def parse_sentences(contenu):
    stop_chars = ['.', '?', '!', "\n"]
    divise = []
    debut = 0
    minimum = len(contenu)-1
    while ((minimum >= debut) and (minimum<len(contenu))):
        lettre = 0
        for x in range(0, len(stop_chars)):
            essai = contenu.find(stop_chars[x],debut)
            if ((essai<minimum) and (essai>-1)):
                minimum = essai
                lettre = x
        if (stop_chars[lettre]=='\n'):
            divise.append(contenu[debut:minimum]+'<br>')
        else:
            divise.append(contenu[debut:minimum+1])
        print(contenu[debut:minimum+1])
        debut = minimum+1
        minimum = len(contenu)-1
    return divise

