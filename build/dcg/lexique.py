# Lexique DCG : cartes « terme / définition » tirées du texte des fiches (rien n'est inventé : le terme et sa définition
# sont copiés de la fiche ; l'« intérêt » n'est ajouté que si la même partie de la fiche le donne).
import json, re, sys, collections
MD = json.load(open("/tmp/claude-0/dcg/md.json"))
F = json.load(open("/tmp/claude-0/dcg/fiches.json"))
TITLE = {"%d:%d" % (d["ue"], d["n"]): d["title"] for d in F}
OUT = "/tmp/claude-0/dcg/lexique.json"
GEN = re.compile(r"^(exemples?|ex|principes?|sujet|inconvénients?|avantages?|conséquences?|conditions?|attention|exceptions?|remarques?|nb|n\.b|objectifs?|intérêts?|méthode|dossier.*|étapes?.*|cas.*|solutions?|questions?|documents?|formules?|calculs?|effets?|limites?|rôles?|sources?|résultat|réponse|corrigé|à retenir|retenir|important|astuce|piège|pièges|conseil|conseils|rappel|illustration|application|exercice.*|mission.*|portée|régime|procédure|sanctions?|but|utilité|finalité|enjeux?|exemple concret|en pratique|en résumé|résumé|synthèse|conclusion|fondement|base légale|textes?|article.*|art\.?.*|délai|durée|montant|taux|calcul|traitement comptable|écriture|comptabilisation|schéma|note|notes|oui|non|vrai|faux|avant|après|hypothèse.*|données?|contexte|énoncé|travail à faire|annexe.*|tableau.*|lu|relu|appris|définition|déf|qui|quoi|quand|où|comment|pourquoi|combien|forme|fond|nature|objet|effet|principe général|règle|règles|en principe|par exception|par ailleurs|ensuite|puis|enfin|d'abord|1|2|3)$", re.I)
INT = re.compile(r"^(intérêts?|utilité|but|objectifs?|finalité|rôle|enjeux?|pourquoi\s?\??|à quoi (ça|cela) sert\s?\??)$", re.I)
EMO = re.compile("[☀-➿\U0001F300-\U0001FAFF⭐⭕‍️]+")
LAB = re.compile(r"^(?:- )?\*\*([^*\n]{2,70}?) ?:\*\* ?(.+)$")

def clean(t):
    t = EMO.sub("", t); t = re.sub(r"\*\*", "", t); t = re.sub(r"\s+", " ", t).strip(" -·;,")
    return t
def cut(t, n=260):
    t = clean(t)
    # une autre étiquette (« Mot : … ») ou un exemple qui commence dans la même ligne : on s'arrête avant
    m = re.search(r"(?<=.{30})\s(?:Exemples?\s?:|Ex\s?:|[A-ZÉÈÀ][\w’'() -]{2,38} : )", t)
    if m: t = t[:m.start()].rstrip(" ,;:")
    if len(t) <= n: return t
    m = re.match(r"^(.{60,%d}?[.!?])(\s|$)" % n, t)
    return m.group(1) if m else t[:n].rsplit(" ", 1)[0] + "…"
BADSTART = re.compile(r"^(le|la|les|l['’]|un|une|des|du|de|d['’]|ce|cet|cette|ces|son|sa|ses|leur|leurs|deux|trois|quatre|première?|deuxième|troisième|seconde?|autres?|analyse|comparer|selon|à|au|aux|si|pour|en|dans|sur|par|avec|sans|quand|lorsque|chaque|tout|toute|tous|texte|condition|exemple|cas|étape|phase|point|partie|ce que|ce qui|qui|que|quoi|image|mission|question|monsieur|madame|m\.|mme|il|elle|on|nous|vous|ils|est|sont|doit|peut|faut|avant|après|depuis|entre|vers|chez|jusqu|hors|attention|ensuite|enfin|puis|donc|mais|ou|et|soit|ni|car|bilan|exercice|dossier|document|annexe|travail|source|calcul|formule|méthode|pourquoi|comment)\b", re.I)
LASTBAD = re.compile(r"\b(exemples?|domaines?|définition|principe|conditions?|effets?|régime|cas)$", re.I)
def good_term(t):
    t = clean(t)
    if BADSTART.match(t) or LASTBAD.search(t) and len(t.split()) > 1: return False
    if not (2 <= len(t) <= 48) or GEN.match(t) or re.search(r"\d{2,}|[=<>€%]|\?$", t): return False
    if len(t.split()) > 7 or t.upper() == t and len(t) > 6: return False
    if not re.match(r"[A-Za-zÀ-ÿ]", t): return False
    return True
DEFBAD = re.compile(r"^(si|quand|lorsque|les autres|monsieur|madame|m\.|mme|vous|nous|oui|non|vrai|faux|\d)", re.I)
def good_def(d, term):
    d = clean(d)
    if "?" in d[:120] or DEFBAD.match(d) or re.search(r"\b(monsieur|madame|vous charge|société [A-Z]{2,})\b", d): return False
    if len(d) < 30 or len(re.findall(r"[A-Za-zÀ-ÿ]", d)) < 25: return False
    if len(re.findall(r"\d", d)) > len(d) * .12: return False
    if term.lower() in d.lower()[:len(term) + 3] and len(d) < 50: return False
    return True

cards, seen = [], set()
for key, md in MD.items():
    u, n = map(int, key.split(":")); fid = "d%df%d" % (u, n)
    sec_title, sec = TITLE.get(key, ""), []
    def flush_sec():
        # dans une partie : « Définition : … » prend le titre de la partie comme terme ; « Intérêt / But / Objectif » devient l'intérêt
        defs = [(l, d) for l, d in sec if clean(l).lower() in ("définition", "déf", "definition")]
        ints = [d for l, d in sec if INT.match(clean(l))]
        if defs and good_term(sec_title):
            add(sec_title, defs[0][1], ints[0] if ints else "")
        for l, d in sec:
            if good_term(l) and good_def(d, l):
                add(l, d, "")
    def add(t, d, i):
        t = clean(t); t = t[:1].upper() + t[1:]
        k = (u, t.lower())
        if k in seen or not good_def(d, t): return
        seen.add(k)
        cards.append(dict(c="d%d" % u, f=t, b=cut(d), m=("Intérêt : " + cut(i, 220)) if i else "", ch=fid))
    for line in md.split("\n"):
        if line.startswith("### ") or line.startswith("## "):
            flush_sec(); sec = []; sec_title = clean(line.lstrip("# ")); continue
        m = LAB.match(line.strip())
        if m: sec.append((m.group(1), m.group(2)))
    flush_sec()

c = collections.Counter(x["c"] for x in cards)
print(len(cards), dict(c), "avec intérêt", sum(1 for x in cards if x["m"]))
json.dump(cards, open(OUT, "w"), ensure_ascii=False)
if len(sys.argv) > 1:
    import random; random.seed(int(sys.argv[1]))
    for x in random.sample(cards, 25): print("-", x["c"], "|", x["f"], "|", x["b"][:150], "|", x["m"][:80])

# Tri à la main (relu terme par terme) : on ne garde que les vraies notions de cours.
REJ = set(map(int, """2 3 4 8 9 12 13 14 15 20 21 22 23 24 25 26 27 28 29 43 44 49 54 60 61 62 64 66 67 69 70 71 80 81 82 83 84 87 88 90 91 93 94 97 98 101 102 103 104 105 106 117 121 122 123 124 125 138 139 143 152 153 154 156 157 158 159 160 168 169 179 180 181 182 185 186
232 237 238 240 241 242 243 244 245 246 248 249 250 251 254 255 256 257 261 262 263 264 265 266 267 268 269 270 271 272 273 276 277 278 279 282 284 286 287 288 289 290 291 292 294 295 296 298 299 300 301 302 303 304 305 306 307 308 309 310 311 312 313 314 315 316 317 318 319 322 324 325 327 328 329 330 331 332 333 334 335 336 337 342 343 347 348 349 350 351 352 353 354 355 357 358 359 360 361 362 363 364 365 366 367 368 370 371 372 373 375 380 381 382 383 384 385 386 387 388""".split()))
KEEP = set(map(int, """199 201 207 391 392 393 394 395 396 397 398 400 416 425 427 440 441 452 461 462 464 467 470 476 478 488 489 493 495 501 502
513 524 528 531 532 536 538 541 547 551 563 578 581 584 585 586 589 594 597 598 599 600 601 602 603 604 605 607 608 609 611
614 616 618 619 620 621 622 623 624 625 626 628 630 633 635 638 645 651 652 658 660 662 666 667 676 677 680 681 682 683 688 690 691 692 693 694 699 700 705 706 707 708 709 713 715 720
727 728 729 730 733 734 735 736 737 748 749 752 753 756 758 759 760 761 767 768 777 783 794 803 805 806 808 810 814 819 822 826 833 836 839 849 854 859 860 861 867 868 870 871 875 878 884 891""".split()))
if len(cards) == 895:
    cards = [x for i, x in enumerate(cards) if ((i in KEEP) if x["c"] not in ("d1", "d3") else (i not in REJ))]
    json.dump(cards, open(OUT, "w"), ensure_ascii=False)
    print("après tri :", len(cards), dict(collections.Counter(x["c"] for x in cards)))
else:
    sys.exit("La liste a changé (%d cartes) : refaire le tri à la main." % len(cards))

# Deuxième source : les phrases de définition des fiches (« Le X est un… », « La X désigne… », « Le X consiste à… »)
VERB = re.compile(r"(?:(?<=^)|(?<=\. ))(?:L['’]|Le |La |Les |Un |Une )([a-zà-ÿA-ZÉ][\w’'\- ]{2,40}?) (est un|est une|désigne|correspond à|se définit comme|consiste à|consiste en|représente) ([^.\n]{20,230}\.)", re.M)
have = {(x["c"], x["f"].lower()) for x in cards}
add2 = []
for key, md in MD.items():
    u, n = map(int, key.split(":")); fid = "d%df%d" % (u, n)
    for m in VERB.finditer(md):
        t, v, rest = clean(m.group(1)), m.group(2), clean(m.group(3))
        if len(t.split()) > 6 or re.search(r"\d", t) or re.search(r"\b[A-Z][A-Za-z’']*[A-Z]", t) or re.search(r"\b(société|entreprise|exemple|stratégie optimale|dividende reçu|cas|situation|document|dossier)\b", t, re.I): continue
        if re.match(r"(un|une) (élément|outil|point|moment|enjeu|aspect|exemple|cas)\b", (v.replace("est ", "") + " " + rest), re.I) and v.startswith("est"): continue
        if re.match(r"(à|en) ", rest) and v.startswith("est"): continue
        d = {"est un": "Un ", "est une": "Une ", "désigne": "Désigne ", "correspond à": "Correspond à ", "se définit comme": "Se définit comme ", "consiste à": "Consiste à ", "consiste en": "Consiste en ", "représente": "Représente "}[v] + rest
        T = t[:1].upper() + t[1:]
        k = ("d%d" % u, T.lower())
        if k in have: continue
        have.add(k); add2.append(dict(c="d%d" % u, f=T, b=cut(d), m="", ch=fid))
cards += add2
for x in cards: x["b"] = re.sub(r"\s*cf\.? Step.*$", "", x["b"], flags=re.I).strip()
json.dump(cards, open(OUT, "w"), ensure_ascii=False)
print("avec les phrases de définition :", len(cards), dict(collections.Counter(x["c"] for x in cards)))
