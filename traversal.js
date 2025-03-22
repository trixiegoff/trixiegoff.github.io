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