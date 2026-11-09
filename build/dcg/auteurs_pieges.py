# Auteurs (théories) et pièges des fiches DCG : phrases copiées des fiches, rien n'est inventé.
import json, re, collections
MD = json.load(open("/tmp/claude-0/dcg/md.json"))
F = json.load(open("/tmp/claude-0/dcg/fiches.json"))
TITLE = {"%d:%d" % (d["ue"], d["n"]): d["title"] for d in F}
EMO = re.compile("[☀-➿\U0001F300-\U0001FAFF⭐⭕‍️]+")
def clean(t): return re.sub(r"\s+", " ", re.sub(r"\*\*|#+ ", "", EMO.sub("", t))).strip(" -·;,")
AUT = {  # nom affiché : motif cherché dans le texte
 "John Maynard Keynes": r"Keynes", "Vilfredo Pareto": r"Pareto", "Corrado Gini": r"Gini", "Arthur Cecil Pigou": r"Pigou", "Ronald Coase": r"Coase",
 "Adolph Wagner": r"Wagner", "Joseph Schumpeter": r"Schumpeter", "Franco Modigliani": r"Modigliani", "Robert Solow": r"Solow", "Richard Musgrave": r"Musgrave",
 "Nicholas Kaldor": r"Kaldor", "Friedrich Hayek": r"Hayek", "Simon Kuznets": r"Kuznets", "Paul Samuelson": r"Samuelson", "Léon Walras": r"Walras",
 "William Baumol": r"Baumol", "Mancur Olson": r"Olson", "Garrett Hardin": r"Hardin", "Elinor Ostrom": r"Ostrom", "George Akerlof": r"Akerlof",
 "Paul Romer": r"Romer", "Milton Friedman": r"Friedman", "Amartya Sen": r"Amartya Sen|\bSen\b", "Michael Porter": r"Porter", "Arthur Okun": r"Okun",
 "Henry Mintzberg": r"Mintzberg", "Kurt Lewin": r"Lewin", "Herbert Simon": r"Herbert Simon|\bSimon\b", "William Edwards Deming": r"Deming",
 "Mitchell, Agle et Wood": r"Mitchell", "Max Clarkson": r"Clarkson", "Edward Freeman": r"Freeman", "Alfred Chandler": r"Chandler",
 "Crozier et Friedberg": r"Crozier", "Rensis Likert": r"Likert", "Blake et Mouton": r"Blake", "Henri Fayol": r"Fayol", "Max Weber": r"Weber",
 "Nelson et Winter": r"Nelson et Winter", "Donaldson et Preston": r"Donaldson", "Berle et Means": r"Berle", "Jensen et Meckling": r"Jensen",
 "Edgar Morin": r"Morin", "Prahalad et Hamel": r"Prahalad", "Oliver Williamson": r"Williamson", "Elton Mayo": r"\bMayo\b|Hawthorne", "Victor Vroom": r"Vroom",
 "Edwin Locke": r"Locke", "Deci et Ryan": r"Deci", "Roger Mucchielli": r"Mucchielli", "Irving Janis": r"Janis", "Thomas et Kilmann": r"Kilmann",
 "Frederick Taylor": r"Taylor", "Cyert et March": r"Cyert", "Cohen, March et Olsen": r"Cohen", "Mary Parker Follett": r"Follett", "Taiichi Ohno": r"Tai?ichi Ohno|Ohno",
 "Abraham Maslow": r"Maslow", "Frederick Herzberg": r"Herzberg", "Douglas McGregor": r"McGregor|Mc Gregor", "Igor Ansoff": r"Ansoff", "Wilson": r"Wilson",
}
refs, seen = [], set()
for key, md in MD.items():
    u, n = map(int, key.split(":"))
    body = re.sub(r"(?<![.!?:])\n+(?=[a-zà-ÿ(])", " ", md)
    sents = [clean(s) for s in re.split(r"(?<=[.!?])\s+|\n+", body)]
    for name, pat in AUT.items():
        if (name, u) in seen: continue
        cand = [s for s in sents if re.search(pat, s) and 40 <= len(s) <= 300 and s.endswith(".") and "|" not in s and not re.match(r"(?i)(il |elle |cette |ce |\(|enfin)", s) and not re.search(r"(?i)ne dit pas|il ne s.agit pas|ne fait pas partie|ne considère pas", s)]
        if not cand: continue
        # la phrase la plus explicative : avec une date, « selon », un verbe d'idée, sinon la plus longue
        sc = lambda s: (bool(re.search(r"\(\d{4}", s)) * 3 + bool(re.search(r"(?i)selon|pour lui|montre|distingue|propose|défend|estime|considère|décrit|théorie|modèle|loi|effet|courbe|matrice|indice", s)) * 2 + min(len(s), 220) / 220)
        best = max(cand, key=sc)
        seen.add((name, u))
        if name in ("Corrado Gini", "Igor Ansoff"): continue
        refs.append([name, "d%d" % u, "d%df%d" % (u, n), TITLE.get(key, ""), best, pat])
print("auteurs", len(refs), collections.Counter(r[1] for r in refs))
PIEGE = re.compile(r"^(?:- )?\*\*((?:pièges?|attention|exceptions?|erreur fréquente|erreurs? à éviter|piège classique|piège à éviter|à ne pas confondre|ne pas confondre|nuance|vigilance|limites?)[^*]{0,40}?) ?:\*\* ?(.{25,})$", re.I | re.M)
pieges = []
for key, md in MD.items():
    u, n = map(int, key.split(":")); sec = TITLE.get(key, "")
    for line in md.split("\n"):
        if line.startswith("### "): sec = clean(line); continue
        m = PIEGE.match(line.strip())
        if not m: continue
        lab = clean(m.group(1)); lab = re.sub(r"\s*\d+$", "", lab); lab = lab[:1].upper() + lab[1:]
        txt = clean(m.group(2))
        if len(txt) > 330: txt = txt[:330].rsplit(" ", 1)[0] + "…"
        pieges.append(["d%d" % u, "%s : %s" % (lab, sec), txt[:1].upper() + txt[1:], "", "d%df%d" % (u, n)])
print("pièges", len(pieges))
json.dump(dict(refs=refs, pieges=pieges), open("/tmp/claude-0/dcg/auteurs_pieges.json", "w"), ensure_ascii=False)
