const r = await fetch("words.txt")

dic = r.body.split("\n")

alert("Loaded " + dic.length + " words")