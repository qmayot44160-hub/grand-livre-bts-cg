import json, os, subprocess, glob, re
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
D = "/mnt/user-data/uploads/REVISION/DCG"; T = "/tmp/claude-0/dcg/png"; O = "/home/claude/grand-livre-bts-cg/private/dcg"
F = json.load(open("/tmp/claude-0/dcg/fiches.json"))
files = sorted({d["file"] for d in F})
def rend(f):
    tag = re.sub(r"\W+", "_", f)[:40]
    subprocess.run(["pdftoppm", "-scale-to-x", "1000", "-scale-to-y", "-1", "-png", os.path.join(D, f), os.path.join(T, tag)], check=True)
    return f
with ThreadPoolExecutor(4) as ex: list(ex.map(rend, files))
print("rendu ok")
def conv(job):
    src, dst = job
    if os.path.exists(dst): return
    Image.open(src).convert("RGB").save(dst, "WEBP", quality=55, method=6)
jobs = []
for d in F:
    tag = re.sub(r"\W+", "_", d["file"])[:40]
    od = os.path.join(O, "u%d" % d["ue"]); os.makedirs(od, exist_ok=True)
    n = len(glob.glob(os.path.join(T, tag + "-*.png")))
    w = len(str(n))
    for k, p in enumerate(d["pages"]):
        src = os.path.join(T, "%s-%0*d.png" % (tag, w, p))
        if not os.path.exists(src):
            cand = glob.glob(os.path.join(T, "%s-*%d.png" % (tag, p)))
            src = [c for c in cand if int(re.search(r"-(\d+)\.png$", c).group(1)) == p][0]
        jobs.append((src, os.path.join(od, "f%d-%d.webp" % (d["n"], k + 1))))
with ThreadPoolExecutor(8) as ex: list(ex.map(conv, jobs))
print("webp", len(jobs))
