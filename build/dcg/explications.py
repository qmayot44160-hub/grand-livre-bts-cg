# Explications des quiz DCG : pour chaque question, le passage de la fiche qui justifie la bonne réponse.
# Recherche par mots communs (question + bonne réponse) dans le texte de la fiche ; rien n'est inventé :
# l'explication cite la fiche. Si aucun passage n'est assez proche, on garde le renvoi simple à la fiche.
import re, unicodedata
STOP = set("""avec dans pour par sur sous entre sans selon comme leur leurs elle elles ils nous vous sont etre être avoir fait faire peut peuvent doit doivent
cette ceux celle celles quel quelle quels quelles lequel laquelle lesquels lesquelles parmi suivant suivante suivants suivantes quoi quand ainsi aussi donc mais
plus moins tout tous toute toutes autre autres même entre afin dont lors chez notamment principal principale principaux principales permet permettre
correspond correspondant definition définition terme exemple cas type types fiche question reponse réponse bonne vrai faux affirmation concerne""".split())
EMO = re.compile("[☀-➿\U0001F300-\U0001FAFF⭐⭕‍️]+")
def norm(t): return "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")
def toks(t):
    out = set()
    for w in re.findall(r"[a-z0-9]{3,}", norm(t)):
        if w in STOP or len(w) < 4 and not w.isdigit(): continue
        out.add(w[:6])
    return out
def clean(t): return re.sub(r"\s+", " ", re.sub(r"\*\*|^#+\s*|^- ", "", EMO.sub("", t))).strip(" ·")

def units(md):
    md = md.split("### ❓Quiz")[0]
    sec, lead, U = "", "", []
    for raw in md.split("\n"):
        line = raw.strip()
        if not line or line.startswith("|"): continue
        if line.startswith("#"):
            sec = clean(line); lead = ""; continue
        txt = clean(line)
        if len(txt) < 12: continue
        is_item = raw.lstrip().startswith("- ")
        if not is_item and txt.endswith(":"): lead = txt; continue
        parts = [txt] if len(txt) < 260 else [p for p in re.split(r"(?<=[.!?])\s+", txt) if len(p) > 12]
        for p in parts: U.append(dict(sec=sec, lead=lead if is_item else "", t=p))
        if not is_item: lead = ""
    return U

def explain(md, q, good, n, title):
    U = units(md)
    if not U: return None
    tq, ta = toks(q), toks(good)
    best, bs = None, 0
    for u in U:
        tu = toks(u["t"]); th = toks(u["sec"] + " " + u["lead"])
        a = len(ta & tu); b = len(tq & tu); c = len((tq | ta) & th)
        if ta and a == 0 and not (ta <= th): continue
        # la bonne réponse doit vraiment se retrouver dans le passage
        if len(ta) >= 3 and a < max(2, round(len(ta) * .4)) and not (a >= 1 and b >= 3): continue
        if len(ta) == 2 and a < 1: continue
        s = 2.2 * a + 1.0 * b + 0.6 * c - (0.002 * max(0, len(u["t"]) - 220))
        if re.search(r"(?i)\bexemple|en pratique|application", u["sec"] + " " + u["t"][:40]): s -= 1.5
        if s > bs: best, bs = u, s
    if not best or bs < 4.0: return None
    t = best["t"]
    if best["lead"]: t = best["lead"].rstrip(" :") + " : " + t[:1].lower() + t[1:]
    if len(t) > 330: t = t[:330].rsplit(" ", 1)[0] + "…"
    if not t.endswith((".", "…", "!", "?")): t += "."
    where = "fiche n°%d « %s »" % (n, title) + (", partie « %s »" % best["sec"] if best["sec"] and norm(best["sec"]) != norm(title) and len(best["sec"]) < 80 else "")
    return "D'après la %s : %s" % (where, t[:1].upper() + t[1:])
