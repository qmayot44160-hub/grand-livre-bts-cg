# Convertit les pages des fiches DCG en texte de cours (markdown du Grand Livre) : titres, paragraphes, listes, tableaux simples
import re, json, html, sys, os
from collections import Counter
X = "/tmp/claude-0/dcg/xml"
F = json.load(open("/tmp/claude-0/dcg/fiches.json"))

def load(pdfname):
    s = open(os.path.join(X, pdfname[:-4].replace(" ", "_") + ".xml"), encoding="utf-8", errors="replace").read()
    fonts = {m.group(1): dict(size=int(m.group(2)), fam=m.group(3), color=m.group(4)) for m in re.finditer(r'<fontspec id="(\d+)" size="(-?\d+)" family="([^"]*)" color="([^"]*)"', s)}
    pages = {}
    for pm in re.finditer(r'<page number="(\d+)"[^>]*height="(\d+)" width="(\d+)">(.*?)</page>', s, re.S):
        els = []
        for t in re.finditer(r'<text top="(-?\d+)" left="(-?\d+)" width="(\d+)" height="(\d+)" font="(\d+)">(.*?)</text>', pm.group(4), re.S):
            raw = t.group(6); bold = "<b>" in raw
            txt = html.unescape(re.sub(r"<[^>]+>", "", raw))
            if not txt.strip() and txt != " ": continue
            els.append(dict(top=int(t.group(1)), left=int(t.group(2)), w=int(t.group(3)), h=int(t.group(4)), f=fonts.get(t.group(5), dict(size=12, fam="", color="#000000")), b=bold, t=txt))
        pages[int(pm.group(1))] = (els, int(pm.group(3)))
    return pages

BOIL = re.compile(r"^(DCG ?UE ?\d+ ?: ?Fiche|Source de la fiche|Les Geeks|des Chiffres|COPYRIGHT|Tous nos cours|Lu$|Relu$|Appris$|\d+ ?/ ?\d+$|Notes$)", re.I)
DISPLAY = re.compile(r"Tangkiwood|Metropolis|Vastago|Display|Black|Heavy|BUSTER", re.I)
BUL = re.compile(r"^\s*([•●▪◦‣∙·\-–✓✔✗✘❌➢➤►▶→⇒☑✅⚠️❗👉🔹🔸🟢🔴⭐️✨💡📌📍]+)\s*")

def chunks_of(els):
    # 1) lignes par ligne de base (bas des caractères), 2) dans chaque ligne, morceaux séparés par un grand blanc
    E = sorted(els, key=lambda e: e["top"] + e["h"]); rows = []
    for e in E:
        b = e["top"] + e["h"]
        if rows and abs(b - rows[-1]["b"]) <= max(3, e["h"] * .22): rows[-1]["els"].append(e)
        else: rows.append(dict(b=b, els=[e]))
    C = []
    for r in rows:
        r["els"].sort(key=lambda e: e["left"]); cur = None
        for e in r["els"]:
            if cur and -8 <= e["left"] - cur["x1"] <= 14:
                cur["els"].append(e); cur["x1"] = max(cur["x1"], e["left"] + e["w"]); cur["y1"] = max(cur["y1"], e["top"] + e["h"]); cur["y0"] = min(cur["y0"], e["top"])
            else:
                cur = dict(x0=e["left"], x1=e["left"] + e["w"], y0=e["top"], y1=e["top"] + e["h"], els=[e]); C.append(cur)
    for c in C:
        c["top"] = c["y0"]; c["text"] = re.sub(r"\s+", " ", "".join(e["t"] for e in c["els"])).strip()
    return [c for c in C if c["text"]]

def tableish(B):
    if len(B) < 6: return False
    tops = Counter(round(b["y0"] / 5) for b in B)
    al = sum(1 for b in B if tops[round(b["y0"] / 5)] >= 2) / len(B)
    ln = sorted(len(b["text"]) for b in B)[len(B) // 2]
    return al >= .7 and ln < 45

def xycut(B, depth=0):
    if len(B) <= 1 or depth > 30: return B
    S = sorted(B, key=lambda b: b["y0"]); groups = [[S[0]]]; mx = S[0]["y1"]
    for b in S[1:]:
        if b["y0"] > mx + 5: groups.append([b])
        else: groups[-1].append(b)
        mx = max(mx, b["y1"])
    if len(groups) > 1: return [x for g in groups for x in xycut(g, depth + 1)]
    if tableish(B): return sorted(B, key=lambda b: (round(b["y0"] / 5), b["x0"]))
    S = sorted(B, key=lambda b: b["x0"]); groups = [[S[0]]]; mx = S[0]["x1"]
    for b in S[1:]:
        if b["x0"] > mx + 14: groups.append([b])
        else: groups[-1].append(b)
        mx = max(mx, b["x1"])
    if len(groups) > 1: return [x for g in groups for x in xycut(g, depth + 1)]
    return sorted(B, key=lambda b: (b["y0"], b["x0"]))

def lines_of(els):
    order = xycut(chunks_of(els)); L = []
    for c in order:
        if L and abs(c["top"] - L[-1]["top"]) <= 4 and c["x0"] > L[-1]["right"]:
            L[-1]["cells"].append(c["text"]); L[-1]["els"] += c["els"]; L[-1]["right"] = c["x1"]
        else:
            L.append(dict(top=c["top"], left=c["x0"], right=c["x1"], cells=[c["text"]], els=list(c["els"])))
    out = []
    for l in L:
        tot = Counter()
        for e in l["els"]: tot[(e["f"]["size"], e["f"]["fam"], e["f"]["color"], e["b"])] += len(e["t"])
        (size, fam, color, b), _ = tot.most_common(1)[0]
        out.append(dict(top=l["top"], left=l["left"], cells=l["cells"], text=" ".join(l["cells"]), size=size, fam=fam, color=color, b=b, h=max(e["h"] for e in l["els"])))
    return out

def esc(s): return s.replace("|", "/").strip()

def fiche_md(d, pages, title):
    body = []; base = Counter()
    LL = []
    for p in d["pages"]:
        els, W = pages[p]
        for l in lines_of(els): LL.append(l)
    for l in LL:
        if not l["b"] and not DISPLAY.search(l["fam"]): base[l["size"]] += len(l["text"])
    bs = base.most_common(1)[0][0] if base else 12
    seen_title = False
    i = 0; para = None; table = None
    def flush():
        nonlocal para, table
        if para: body.append(para.strip()); para = None
        if table:
            if len(table) >= 2:
                n = max(len(r) for r in table)
                rows = [r + [""] * (n - len(r)) for r in table]
                body.append("\n".join(["| " + " | ".join(esc(c) for c in rows[0]) + " |", "| " + " | ".join(["---"] * n) + " |"] + ["| " + " | ".join(esc(c) for c in r) + " |" for r in rows[1:]]))
            else:
                body.append(" · ".join(table[0]))
            table = None
    prev = None
    for l in LL:
        t = l["text"].strip()
        if not t or BOIL.match(t) or re.match(r"^❓?\s*$", t): continue
        if t == "Quiz" or re.search(r"s\s*e\s*s\s*n\s*o\s*p\s*é\s*R", t): break
        if not seen_title and title and (t.rstrip(" :") == title or (len(t) > 6 and t.rstrip(" :").lower() in title.lower())):
            if t.rstrip(" :") == title or title.lower().endswith(t.rstrip(" :").lower()): seen_title = True
            continue
        if re.match(r"^.{0,60}\(suite\)\s*$", t, re.I): continue
        big = l["size"] >= bs + 3 or DISPLAY.search(l["fam"]) or l["color"].lower() in ("#ffffff", "#fff")
        if len(l["cells"]) >= 2 and not big and all(len(c) < 90 for c in l["cells"]):
            if para: body.append(para.strip()); para = None
            table = table or []
            table.append(l["cells"]); prev = l; continue
        if table: flush()
        m = BUL.match(t)
        close = prev is not None and 0 <= l["top"] - prev["top"] <= max(prev["h"], l["h"]) * 1.9
        if para is not None and close and t[:1].islower() and not big:
            para = para + " " + t.strip("* "); prev = l; continue
        if big and close and body and body[-1].startswith("### ") and para is None and (t[:1].islower() or len(t) < 25) and prev is not None and prev.get("_big"):
            body[-1] += " " + t.strip(" :"); prev = l; prev["_big"] = True; continue
        if l["b"] and close and para is None and body and body[-1].startswith("**") and body[-1].endswith("**") and not m and not big:
            body[-1] = body[-1][:-2] + " " + t.strip(" *") + "**"; prev = l; continue
        if len(re.findall(r"[A-Za-zÀ-ÿ0-9]", t)) < 3: continue
        if big and len(t) <= 12 and (t.upper() == t or len(t) <= 4): continue
        if big and len(t) < 120:
            flush(); body.append("### " + re.sub(r"^#\s*\d+\s*[.:]?\s*", "", t).strip(" :")); prev = l; prev["_big"] = True; continue
        if l["b"] and len(t) < 110 and not m and not (para and prev and l["top"] - prev["top"] < prev["h"] * 1.6 and not prev["b"]):
            flush(); body.append("**" + t.strip(" *") + "**"); prev = l; continue
        if m and len(t) > len(m.group(0)):
            flush(); para = "- " + t[m.end():]; prev = l; continue
        cont = para is not None and prev is not None and 0 <= l["top"] - prev["top"] <= max(prev["h"], l["h"]) * 1.9 and abs(l["size"] - prev["size"]) <= 2
        if cont:
            para = (para[:-1] if para.endswith("-") and not para.endswith(" -") else para + " ") + t
        else:
            flush(); para = t
        prev = l
    flush()
    def numl(x):
        if x.startswith(("#", "|", "- ")) or len(re.findall(r"(?:^|\s)\d{1,2}\s?[.)]\s?[A-ZÉÈÀ]", x)) < 2: return x
        parts = re.split(r"(?:^|\s)(?=\d{1,2}\s?[.)]\s?[A-ZÉÈÀ])", x)
        head = parts[0].strip() if not re.match(r"\d", parts[0].strip()) else ""
        items = [p.strip() for p in (parts[1:] if head else parts) if p.strip()]
        return (head + "\n\n" if head else "") + "\n".join("- " + re.sub(r"^(\d{1,2})\s?[.)]\s?", r"\1. ", it) for it in items)
    EMO = "[\u2600-\u27BF\U0001F300-\U0001FAFF\u2B50\u2B55][\u200d\ufe0f\u2600-\u27BF\U0001F300-\U0001FAFF]*"
    def labels(x):
        if x.startswith(("#", "|")): return x
        x = re.sub(r"\s+" + EMO + r"\s*(?=[A-ZÉÈ][^:\n]{1,32}\s?:)", "\n\n", x)
        x = re.sub(r"(?m)^(- )?" + EMO + r"\s*", r"\1", x)
        x = re.sub(r"(?m)^(- )?([A-ZÉÈÀ][\w’'()/ -]{1,32}?) ?: ", lambda m: (m.group(1) or "") + "**" + m.group(2) + " :** ", x)
        return x
    body = [labels(numl(x)) for x in body]
    md = "\n\n".join(x for x in body if x and x.strip("*#- ").strip())
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md

OUT = {}
cache = {}
for d in F:
    if not d["pages"]: continue
    if d["file"] not in cache: cache[d["file"]] = load(d["file"])
    title = d["title"]
    OUT["%d:%d" % (d["ue"], d["n"])] = fiche_md(d, cache[d["file"]], title)
json.dump(OUT, open("/tmp/claude-0/dcg/md.json", "w"), ensure_ascii=False)
print(len(OUT), sum(len(v) for v in OUT.values()))
if len(sys.argv) > 1:
    for k in sys.argv[1:]: print("=" * 30, k); print(OUT[k][:3000])
