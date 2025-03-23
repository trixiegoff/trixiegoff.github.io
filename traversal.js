atomicweedrun = function(in_vals, max_val, out = 0n) {
  let m = BigInt(max_val)
  for (v of in_vals) {
    let n = BigInt(v - 1)
    n = 1n << n //set bit n
    while ((n & out) == n) n <<= m //if collision shift up max_val bits
    out |= n //park that bit
  }
  return out //return the delicious hashtogram
}

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

subtract = function(hash1, hash2) {
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


function findTwaversals(values, spaces) {
    function traverse(values, remainingSpace, currentTraversal, allTraversals) {
        if (!values.some((v) => (v & remainingSpace) == v)) { //are we out of options?
            allTraversals.push(atomicweedrun(currentTraversal, values.length));
            return;
        }

        for (let i = 0; i < values.length; i++) {
            if ((values[i] & remainingSpace) == values[i]) {
                currentTraversal.push(i);
                traverse(values, subtract(remainingSpace, value), currentTraversal, allTraversals);
                currentTraversal.pop();
            }
        }
    }

    const allTraversals = [];
    traverse(values, spaces, [], allTraversals);
    return allTraversals;
}







////////NOT THIS ONE THIS IS THE WORKING EXAMPLE
function findTraversals(values, spaces) {
    function traverse(values, remainingSpace, currentTraversal, allTraversals) {
        if (remainingSpace === 0) {
            // Sort traversal to ensure ordering does not matter
            const sortedTraversal = [...currentTraversal].sort((a, b) => a - b);
            // Add traversal only if it doesn't already exist
            if (!allTraversals.some(trav => trav.join() === sortedTraversal.join())) {
                allTraversals.push(sortedTraversal);
            }
            return;
        }

        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const spaceReduction = value; // Assuming the value itself is the space reduction amount
            if (remainingSpace >= spaceReduction) {
                currentTraversal.push(value);
                traverse(values, remainingSpace - spaceReduction, currentTraversal, allTraversals);
                currentTraversal.pop();
            }
        }
    }

    const allTraversals = [];
    traverse(values, spaces, [], allTraversals);
    return allTraversals;
}

// Example usage:
const values = [
2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151];

for (i=1; i <= values.length; i++) {
  traversals = findTraversals(values, i);
  console.log(i,traversals.length);
}