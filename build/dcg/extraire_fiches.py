import subprocess, re, json, sys, os, glob
D = "/mnt/user-data/uploads/REVISION/DCG"
def ue_of(f): return int(re.search(r"UE (\d+)", f).group(1))
def txt(f, lay):
    a = ["pdftotext"] + (["-layout"] if lay else []) + [f, "-"]
    return subprocess.run(a, capture_output=True, text=True).stdout.split("\f")
def clean(s): return re.sub(r"\s+", " ", s).strip(" :-–")
FI = {}
for f in sorted(glob.glob(D + "/*.pdf"), key=lambda x: (ue_of(x), x)):
    ue = ue_of(f); L = txt(f, True); R = txt(f, False)
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", f], capture_output=True, text=True).stdout).group(1))
    step = None; cur = None
    for i in range(n):
        t = L[i]; r = R[i]
        if "Source de la fiche" not in t:
            # sommaire : STEP et titres
            lines = [x.strip() for x in r.split("\n")]
            for li, line in enumerate(lines):
                ms = re.match(r"STEP\s*(\d+)\s*[.:]?\s*(.*)", line)
                if ms:
                    tt = ms.group(2); j = li + 1
                    while j < len(lines) and lines[j] and lines[j].isupper() and not re.match(r"([☐□]|Fiche|Partie|STEP|COPYRIGHT|Les Geeks|des Chiffres|\d+ FICHES|UE \d|Tous nos)", lines[j]) and j - li < 3:
                        tt += " " + lines[j]; j += 1
                    step = (int(ms.group(1)), clean(re.sub(r"\(suite\)", "", tt, flags=re.I)))
                mf = re.match(r"[☐□]?\s*Fiche (?:de r[ée]vision )?n ?° ?(\d+)\s*:?\s*(.*)", line)
                if mf:
                    k = (ue, int(mf.group(1))); d = FI.setdefault(k, dict(ue=ue, n=int(mf.group(1)), title="", step=step, pages=[], quiz=[], file=os.path.basename(f)))
                    if mf.group(2).strip():
                        tt = mf.group(2).strip(); nx = lines[li + 1] if li + 1 < len(lines) else ""
                        if nx and not re.match(r"([☐□]|Fiche|Partie|STEP|COPYRIGHT|Les Geeks|des Chiffres|\d+ FICHES|UE \d|Tous nos)", nx) and (tt.endswith(("et", "de", "des", "du", "la", "le", "les", "à", "en", "/", ",", "aux", "d'", "d’")) or nx[:1].islower()):
                            tt += " " + nx
                        d["title"] = clean(tt)
                    d["step"] = d["step"] or step; last = d
                elif line and FI and 'last' in dir() and not last["title"] and not re.match(r"(STEP|Les Geeks|des Chiffres|\d+ FICHES|UE \d|Tous nos cours|COPYRIGHT)", line):
                    last["title"] = clean(line)
            continue
        flat = re.sub(r"[ \t]+", " ", t)
        m = re.search(r"Fiche (?:de r[ée]vision |de M[ée]thodologie)?\s*n ?° ?(\d+)", flat)
        num = int(m.group(1)) if m else (0 if re.search(r"Fiche de M[ée]thodologie", flat) and cur is None else cur)
        if num is None: continue
        cur = num
        d = FI.setdefault((ue, num), dict(ue=ue, n=num, title="", step=step, pages=[], quiz=[], file=os.path.basename(f)))
        d["file"] = os.path.basename(f)
        if not d["title"]:
            mt = re.search(r"Fiche[^\n]*\n\s*(?:❓\s*)?([^\n]+)", r)
            if mt: d["title"] = clean(mt.group(1))
        isq = "Quiz" in r and re.search(r"s\s*e\s*s\s*n\s*o\s*p\s*é\s*R|R\s*é\s*p\s*o\s*n\s*s\s*e\s*s\s*:", r)
        tx = re.sub(r"(Les Geeks|des Chiffres\.?|Source de la fiche[^\n]*|DCG UE ?\d+ ?: ?Fiche[^\n]*|Tous nos cours[^\n]*|COPYRIGHT[^\n]*|\b\d+\s*/\s*\d+\b|\bLu\b|\bRelu\b|\bAppris\b)", " ", r)
        tx = re.sub(r"[^\w\s’'%€.,;:()+\-=/«»]", " ", tx)
        if not isq: d.setdefault("txt", []).append(re.sub(r"\s+", " ", tx).strip())
        if not isq:
            d["pages"].append(i + 1); continue
        qi = r.index("Quiz"); pre = r[:qi]
        pre = re.sub(r"(Les Geeks|des Chiffres\.?|Source de la fiche[^\n]*|DCG UE ?\d+ ?: ?Fiche[^\n]*|Lu|Relu|Appris|❓)", "", pre)
        if d["title"]: pre = pre.replace(d["title"], "")
        if len(re.sub(r"\s+", "", pre)) > 120: d["pages"].append(i + 1)  # page mixte : contenu + quiz
        # quiz
        body = r[qi:]
        for stop in ["🎓", "C’est tombé", "C'est tombé"]:
            if stop in body:
                k = body.index(stop); tail = body[k:]
                am0 = re.search(r"[^\n]*s\s*e\s*s\s*n\s*o\s*p\s*é\s*R[^\n]*", tail)
                body = body[:k] + ("\n" + am0.group(0) if am0 else "")
        am = re.search(r"([^\n]*s\s*e\s*s\s*n\s*o\s*p\s*é\s*R[^\n]*)", body)
        ans = {}
        if am:
            rev = am.group(1)[::-1]
            for a, b in re.findall(r"(\d+)\s*\.\s*([a-dA-D])", rev): ans[int(a)] = b.lower()
        else:
            am = re.search(r"R\s*é\s*p\s*o\s*n\s*s\s*e\s*s\s*:([^\n]*)", body)
            if am:
                for a, b in re.findall(r"(\d+)\s*\.\s*([a-dA-D])", am.group(1)): ans[int(a)] = b.lower()
        body = re.sub(r"[^\n]*(s\s*e\s*s\s*n\s*o\s*p\s*é\s*R|R\s*é\s*p\s*o\s*n\s*s\s*e\s*s\s*:)[^\n]*", "", body)
        body = re.sub(r"(Quiz|Notes|COPYRIGHT[^\n]*|\d+\s*/\s*\d+|Les Geeks|des Chiffres\.?|Lu|Relu|Appris)\s*\n", "\n", body)
        qs = re.split(r"\n\s*(\d+)\s*\.\s+", "\n" + body)
        for j in range(1, len(qs) - 1, 2):
            qn = int(qs[j]); blk = qs[j + 1]
            parts = re.split(r"\n\s*([A-Da-d])\s*[.)]\s+", "\n" + blk)
            q = clean(parts[0]); opts = {}
            for k in range(1, len(parts) - 1, 2): opts[parts[k].lower()] = clean(parts[k + 1])
            if qn in ans and ans[qn] in opts and len(opts) >= 2:
                d["quiz"].append(dict(q=q, opts=opts, a=ans[qn]))
F = sorted(FI.values(), key=lambda d: (d["ue"], d["n"]))
for d in F:
    t = " ".join(d.pop("txt", []))
    if d["title"]: t = t.replace(d["title"], " ", 1)
    d["txt"] = re.sub(r"\s+", " ", t).strip()[:1500]
    for q in d["quiz"]:
        q["opts"] = {k: re.sub(r"\s+\d+$", "", v) for k, v in q["opts"].items()}
    def bad(q):
        if re.search(r"plusieurs (solutions|réponses)", q["q"], re.I): return True
        for v in q["opts"].values():
            if len(v) > 220 or re.search(r"\s[a-fA-F]\)\s|\s[E-F]\.\s", v): return True
            w = v.split()
            if len(w) > 8 and sum(1 for x in w if len(x) == 1) / len(w) > .3: return True
        return len(q["q"]) < 5
    d["quiz"] = [q for q in d["quiz"] if not bad(q)]
json.dump(F, open(sys.argv[1], "w"), ensure_ascii=False, indent=0)
for ue in range(1, 14):
    L = [d for d in F if d["ue"] == ue]
    print(ue, "fiches", len(L), "sans pages", sum(1 for d in L if not d["pages"]), "sans titre", sum(1 for d in L if not d["title"]), "quiz", sum(len(d["quiz"]) for d in L), "steps", len({d["step"] for d in L}))
