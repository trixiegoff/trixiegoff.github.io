const hashes = new Map()

atomicweedrun = function(in_vals, max_val, out = 0n) { //ONOES I GENERALIZED IT
  let m = BigInt(max_val)
  for (v of in_vals) {
    let n = BigInt(v - 1)
    n = 1n << n //set bit n
    while ((n & out) == n) n <<= m //if collision shift up max_val bits
    out |= n //park that bit
}
  return out //return the delicious hashtogram
}



let findcules = function(inhash) {
  let atoms = [...hashes.keys()].filter((h) => ((h & inhash) == h))
	if (atoms.length == 0) return []
  
let readcule = function(cule, max_val) {
  max_val = BigInt(max_val)
  let out = []
  do {
    let atom = (cule & -cule) //get lowest set bit
    cule &= ~atom
    while(atom > (1n << max_val)) atom >> max_val //normalize
      let i = 1
    do {
      atom >>= 1n
      i++
    } while (atom > 0n)
    out.push(hashes.get(atoms[i]))
  } while (cule > 0)
  return out
}


  let permute = function(atoms, leftoverhash, currentcule, cules) {
    //console.log("Atoms:", atoms, "Leftover Hash:", leftoverhash, "Current Cule:", currentcule)
    //are we out of hash?
    if ((!atoms.some((h) => ((h & leftoverhash) == h))) || (leftoverhash == 0n)) {
      cules.add(currentcule)
      return
    }
    
    atoms.forEach((h, k) => {
      if ((h & leftoverhash) == h) {
        permute(atoms, subtract(leftoverhash, h), add(currentcule, BigInt(k), atoms.length), cules)
      }
    })
  }
  
  const cules = new Set()
  permute(atoms, inhash, 0n, cules)
  
  return [...cules]//.map((c) => //readcule(c, atoms.length)) //this is broken dunno why yet
}


//my brain refuses to rename this as it returns a pile of hash
weedrun = function(in_str, out = 0n) { 
  for (c of in_str) {
    let n = BigInt((c.charCodeAt() & ~32) - 65) //lower case & normalize
    if (!((n > 26n) || (n < 0n))) { //only process english alphabet
      n = 1n << n //set bit n
      while ((n & out) == n) n <<= 26n //if collision shift up 26 bits
      out |= n //park that bit
  }
}
  return out //return the delicious hashtogram
}

msg = function(type, payload) {
  self.postMessage([type, payload])
}

log = function(text) {
  msg("log", text)
}

self.onmessage = function(msg) {
  [cmd, param] = msg.data
  log(`Command: ${cmd}, Param: ${param}`)
  
  switch (cmd) {
    case "init":
      init(param)
      break
    case "gwams":
      self.postMessage(["results", findcules(weedrun(param))])
      break
    case "stats":
      stats()
      break
  }
}

charcount = function (hash) {
    n = 0b11111111111111111111111111n & hash //we only care about the lowest 26 bits
    let count = 0;
    while (n > 0) {
      n &= (n - 1n);
      count++;
    }
    return count;
  }

  stats = function() {
    let biggesthash = [...hashes.keys()].reduce((a, e) => e > a ? e : a)
    let biggestbucket = [...hashes.values()].reduce((a, e) => e.length > a.length ? e : a)
    let totalhashbits = [...hashes.keys()].map((e) => e.toString(2).length).reduce((a, e) => e + a, 0)
    let totaluniquechars = [...hashes.keys()].reduce((a, e) => charcount(e) + a, 0)
    let mostuniquechars = [...hashes.keys()].reduce((a, e) => charcount(e) > a ? e : a)
    let avghashlength = totalhashbits / hashes.size
    log(`Total hashes bit size (bits/32bit words) ${totalhashbits}/${totalhashbits/32}`)
    log(`Unique characters per entry (dictionary total/avg per dictionary word) ${totaluniquechars}/${totaluniquechars/hashes.size}`)
    log(`Most unique characters in a word: ${hashes.get(mostuniquechars).join(", ")} (${charcount(mostuniquechars)} unique chars)`)
    log(`Average hash length (bits/32bit words): ${avghashlength}/${avghashlength/32}`)
    log(`Biggest hash: 0x${biggesthash.toString(16)}=${hashes.get(biggesthash)[0]}`)
    log(`Biggest bucket: ${biggestbucket.join(", ")}`)
  }


  init = function(dic="words") {
    log(`Downloading dictionary...`)
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${dic}.txt`);

    xhr.onload = function() {
      if (xhr.status != 200) {
        log(`Error ${xhr.status}: ${xhr.statusText}`)
      } else {
        log(`Downloaded ${xhr.response.length} bytes`)
        let rawdic = xhr.responseText.split("\n")
        log(`Hashing ${rawdic.length} words...`)
        mapdic(rawdic)
        log(`${rawdic.length} words hashed into ${hashes.size} buckets`)
      }
    }
    
    xhr.onprogress = function(event) {
      if (event.lengthComputable) {
        log(`Downloaded ${event.loaded} of ${event.total} bytes`)
      } else {
        log(`Downloaded ${event.loaded} bytes`)
      }
    }

    xhr.onerror = function(event) {
      log(`Failed to load dictionary!`)
      console.log(event)
    }

    xhr.send()
    return xhr
  }


  mapdic = function(words) {
    for (word of words) {
      let hash = weedrun(word)
      if (hashes.has(hash)) {
        hashes.set(hash, [...hashes.get(hash), word])
      } else {
        hashes.set(hash, [word])
      }
    }
    hashes.delete(0n)
  }


  subtract = function(hash1, hash2, diclen=26n) {
    diclen = BigInt(diclen)
    while((hash1 & hash2) != 0n) {
      hash2 <<= diclen
    }
    while(hash2 > 0n) {
      hash2 >>= diclen
      smoke = (hash2 & hash1)
      hash1 &= ~smoke
      hash2 &= ~smoke
    }
    return hash1
  }


add = function(hash1, hash2, diclen=26n) { //new hotness
  diclen = BigInt(diclen)
  while(hash2 > 0n) {
    smoke = (hash2 ^ hash1)
    hash1 |= hash2
    hash2 &= ~smoke
    hash2 <<= diclen  
  }
  return hash1
}


add_slow = function(hash1, hash2) { //original bit by bit algorithm
  let pos = (hash1 & -hash1) //get lowest set bit column
  while(pos != 0) {
    hash1 = hash1 & ~pos //unset lowest set bit column
    while((pos & hash2) == pos) {
      pos <<= 26n
    }
    hash2 |= pos
    pos = (hash1 & -hash1)
  }
  return hash2
}
