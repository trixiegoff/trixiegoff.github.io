const hashes = new Map()
let jobs = []


msg = function(type, payload) {
  self.postMessage([type, payload])
}

log = function(text) {
  msg("log", text)
}

self.onmessage = function(msg) {
  //log("I GOT YOUR MESSAGE! 😌")
		
  }

stats = function() {
  let biggesthash = [...hashes.keys()].reduce((a, e) => e > a ? e : a)
  let biggestbucket = [...hashes.values()].reduce((a, e) => e.length > a.length ? e : a)
  let totalhashbits = [...hashes.keys()].map((e) => e.toString(2).length).reduce((a, e) => e + a, 0)
  let avghashlength = totalhashbits / hashes.size
  log(`Total hashes bit size (bits/32bit words) ${totalhashbits}/${totalhashbits/32}`)
  log(`Average hash length (bits/32bit words): ${avghashlength}/${avghashlength/32}`)
  log(`Biggest hash: 0x${biggesthash.toString(16)}=${hashes.get(biggesthash)[0]}`)
  log(`Biggest bucket: ${biggestbucket.join(", ")}`)
}

log(`Downloading dictionary...`)
let xhr = new XMLHttpRequest();
xhr.open('GET', 'words.txt');

xhr.onload = function() {
  if (xhr.status != 200) {
    log(`Error ${xhr.status}: ${xhr.statusText}`)
  } else {
    log(`Downloaded ${xhr.response.length} bytes`)
    let rawdic = xhr.responseText.split("\n")
    log(`Hashing ${rawdic.length} words...`)
    mapdic(rawdic)
    log(`${rawdic.length} words hashed into ${hashes.size} buckets`)
    stats()
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

 
//my brain refuses to rename this as it returns a pile of hash
function weedrun(in_str, out = 0n) { 
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


function mapdic(words) {
  for (word of words) {
		let hash = weedrun(word)
    if (hashes.has(hash)) {
    	hashes.set(hash, [...hashes.get(hash), word])
    } else {
      hashes.set(hash, [word])
    }
	}
}

function eatdic(rawdic) {
 	words = rawdic[0].split("\n")
  for (word of words) {
		let hash = weedrun(word)
		let hi = hashes.indexOf(hash)
    if (hi == -1) {
    		hashes.push(hash)
      hi = hashes.indexOf(hash)
      }
		anagrams[hi] = anagrams[hi] ?? ""
		anagrams[hi] += word + ","
	}
}


function subtract(hash1, hash2) {
  while((hash1 & hash2) != 0n) {
    hash2 <<= 26n
  }
  while(hash2 > 0n) {
    hash2 >>= 26n
    smoke = (hash2 & hash1)
    hash1 &= ~smoke
    hash2 &= ~smoke
  }
  return hash1
}

function add(hash1, hash2) { //new hotness
  while(hash2 > 0n) {
    smoke = (hash2 ^ hash1)
    hash1 |= hash2
    hash2 &= ~smoke
    hash2 <<= 26n  
  }
  return hash1
}


function add_slow(hash1, hash2) { //original bit by bit algorithm
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


function findgwams(hash1 = 0n, gwams = []) {
  //hashes.forEach((hash2, i) => if ((hash1 & hash2) == hash2) gwams.push(hi))
  //return gwams
}

