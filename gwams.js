let xhr = new XMLHttpRequest();
xhr.open('GET', 'words.txt');
xhr.send();

rawdic = []

msg = function(type, payload) {
	self.postMessage([type, payload])
}

log = function(text) {
	msg("log", text)
}

xhr.onload = function() {
  if (xhr.status != 200) {
    log(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    log(`Done, got ${xhr.response.length} bytes`);
	rawdic = xhr.responseText.split("\n")
	log(`Loaded ${rawdic.length} words into dic[]`)
  }
};

xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    log(`Received ${event.loaded} of ${event.total} bytes`);
  } else {
    log(`Received ${event.loaded} bytes`);
  }

};

xhr.onerror = function() {
  log("🫠 Failed to load dictionary!");
};

let hashes = []
let anagrams = []


function weedrun(in_str, out = 0n) {
  let pos
  for (c of in_str) {
    let n = BigInt((c.charCodeAt() & ~32) - 65) //lowercase, normalize to a-z = 0-25
    if (!((n > 26) && (n < 0))) { //only process characters in the english alphabet
    	pos = 1n << n //set bit n
    	while((pos & out) == pos) pos = pos << 26n //if bit already set, shift 26 bits, repeat
    	out |= pos //park that bit
    }
  }
  return out //return the delicious hashtogram
}


function eatdic(rawdic) {
 	words = rawdic[0].split("\n")
  for (word of words) {
		//console.log(word)
		let hash = weedrun(word)
		let hi = hashes.indexOf(hash)
    if (hi == -1) {
    		hashes.push(hash)
      hi = hashes.indexOf(hash)
      }
		anagrams[hi] = anagrams[hi] ?? ""
		anagrams[hi] += word + ","
	}
// console.log(anagrams)
// console.log(hashes.map((x) => x.toString(2)).join("\n\n"))
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

function add(hash1, hash2) {
  while(hash2 > 0n) {
    smoke = (hash2 ^ hash1)
    hash1 |= hash2
    hash2 &= ~smoke
    hash2 <<= 26n  
  }
  return hash1
}


function add_slow(hash1, hash2) {
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

function findgwams(hash = 0n) {
  let gwams = []
  //hashes.filter((x) => (x & hash) == x).each(())
	for (hi in hashes) {
    if ((hash & hashes[hi]) == hashes[hi]) gwams.push(hi)
  }
  //console.log(gwams)
	
	gwams.forEach((x) => console.log(anagrams[x]))
  return gwams
}

//console.log(weedrun(`FOURSCOREANDSEVENYEARSAGOOURFATHERSBROUGHTFORTHONTHISCONTINENTANEWNATIONCONCEIVEDINLIBERTYANDDEDICATEDTOTHEPROPOSITIONTHATALLMENARECREATEDEQUALNOWWEAREENGAGEDINAGREATCIVILWARTESTINGWHETHERTHATNATIONORANYNATIONSOCONCEIVEDANDDEDICATEDCANLONGENDUREWEAREMETONAGREATBATTLEFIELDOFTHATWARWEHAVECOMETODEDICATEAPORTIONOFTHATFIELDASAFINALRESTINGPLACEFORTHOSEWHOHEREGAVETHEIRLIVESTHATTHATNATIONMIGHTLIVEITISALTOGETHERFITTINGANDPROPERTHATWESHOULDDOTHISBUTINALARGERSENSEWECANNOTDEDICATEWECANNOTCONSECRATEWECANNOTHALLOWTHISGROUNDTHEBRAVEMENLIVINGANDDEADWHOSTRUGGLEDHEREHAVECONSECRATEDITFARABOVEOURPOORPOWERTOADDORDETRACTTHEWORLDWILLLITTLENOTENORLONGREMEMBERWHATWESAYHEREBUTITCANNEVERFORGETWHATTHEYDIDHEREITISFORUSTHELIVINGRATHERTOBEDEDICATEDHERETOTHEUNFINISHEDWORKWHICHTHEYWHOFOUGHTHEREHAVETHUSFARSONOBLYADVANCEDITISRATHERFORUSTOBEHEREDEDICATEDTOTHEGREATTASKREMAININGBEFOREUSTHATFROMTHESEHONOREDDEADWETAKEINCREASEDDEVOTIONTOTHATCAUSEFORWHICHTHEYGAVETHELASTFULLMEASUREOFDEVOTIONTHATWEHEREHIGHLYRESOLVETHATTHESEDEADSHALLNOTHAVEDIEDINVAINTHATTHISNATIONUNDERGODSHALLHAVEANEWBIRTHOFFREEDOMANDTHATGOVERNMENTOFTHEPEOPLEBYTHEPEOPLEFORTHEPEOPLESHALLNOTPERISHFROMTHEEARTH`).toString(2))

// a = weedrun("abcz")
// b = weedrun("abcabcabczzz")
// console.log([...adhd(a, b).toString(2)].reverse().join(""))


//hashes.filter((h) -> h & test == h)

