def parse_sentences(contenu):
    stop_chars = ['.', '?', '!', "\r\n", "\n"]
    divise = []
    debut = 0
    while ((contenu[debut:].find(stop_chars[0])>-1) or (contenu[debut:].find(stop_chars[1])>-1)):
        a = contenu[debut:].find(stop_chars[0])
        b = contenu[debut:].find(stop_chars[1])
        if (a > b and b > -1):
            divise.append(contenu[debut:debut+b+1])
            debut = debut + b + 1
        elif (b > a and a > -1):
            divise.append(contenu[debut:debut+a+1])
            debut = debut + a + 1
        elif (a > b and b == -1):
            divise.append(contenu[debut:debut+a+1])
            debut = debut + a + 1
        elif (b > a and a == -1):
            divise.append(contenu[debut:debut+b+1])
            debut = debut + b + 1
    if (len(contenu) > debut):
        divise.append(contenu[debut:])
    return divise