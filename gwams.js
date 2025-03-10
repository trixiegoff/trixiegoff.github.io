const hashes = new Map()
let rawdic = []
let jobs = []


msg = function(type, payload) {
	self.postMessage([type, payload])
}

log = function(text) {
	msg("log", text)
}

self.onmessage = function(msg) {
  log("I GOT YOUR MESSAGE! 😌")
  }

let xhr = new XMLHttpRequest();
xhr.open('GET', 'words.txt');

xhr.onload = function() {
  if (xhr.status != 200) {
    log(`Error ${xhr.status}: ${xhr.statusText}`)
  } else {
    log(`Done, got ${xhr.response.length} bytes`)
	rawdic = xhr.responseText.split("\n")
	log(`Downloaded ${rawdic.length} words, processing hashtograms...`)
  mapdic(rawdic)
  log(`${rawdic.length} words hashed into ${hashes.size} buckets`)
  }
}

xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    log(`Received ${event.loaded} of ${event.total} bytes`)
  } else {
    log(`Received ${event.loaded} bytes`)
  }
}

xhr.onerror = function() {
  log("🫠 Failed to load dictionary!")
}

xhr.send()
 
//my brain refuses to rename this as it returns# a pile of hash
function weedrun(in_str, out = 0n) { 
  for (c of in_str) {
    let n = BigInt((c.charCodeAt() & ~32) - 65) //lower case & normalize
    if (!((n > 26) || (n < 0))) { //only process english alphabet
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

