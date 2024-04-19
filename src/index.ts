
type DirectionKey = 'F' | 'L' | 'R' | 'B';
type Direction = 'forward' | 'left' | 'right' | 'backward';

const DIRECTIONS: Record<DirectionKey, Direction> = {
    'F': 'forward',
    'L': 'left',
    'R': 'right',
    'B': 'backward'
};

/**
 * Validates the provdided directions string for correct format.
 * @param directions - The string containing directions and steps.
 */
const validateDirectionsString = (directions: string) => {

    if (directions.length === 0) throw new Error("No directions provided");

    // Check if only allowed characters are used - case-insensitive
    if (!/^[0-9FLRB]*$/i.test(directions)) throw new Error("Directions contains invalid characters. Only numbers and F, L, R, B are allowed.");

    // Check if at least one step number is provided before direction letter
    if (!/\d[FLRB]/i.test(directions)) throw new Error("No step count provided before a direction.");

} 


/**
 * Parses a string of directions and returns totals for each direction.
 * @param directions - A string of directions. 
 * @returns An object with the total steps for each direction.
 * @example 
 * parseDirections("3F1B2L0R")
 * // Returns: {forward: 3, backward: 1, left: 2, right: 0}
 */
const parseDirections = (directions : string) => {
    // Remove all spaces
    directions = directions.replace(/ /g, "")
    validateDirectionsString(directions)

    let totals: Record<Direction, number> = {
        forward: 0,
        left: 0,
        right: 0,
        backward: 0
    };

    // Temp variable for holding # of steps for a given direction
    let stepCountStack : string = "";

    for(let i : number = 0; i < directions.length; i++){

        let currentChar : string = directions[i];

        // If currentChar can be parsed to int, add to stepCountStack & continue
        if(!isNaN(Number(currentChar))){
            stepCountStack += currentChar;
            continue;
        };

        if(stepCountStack.length === 0) throw new Error(`No step count before direction '${currentChar}'.`);

        // At this point, we are at a direction char and need to parse the # of steps to take
        let numberOfSteps : number = parseInt(stepCountStack);

        let direction = DIRECTIONS[currentChar.toUpperCase() as DirectionKey];

        if(!direction) throw new Error(`Invalid Direction ${currentChar}\n Accepted values are:\nF\nB\nL\nR`)

        // Add steps to 'totals' tracker
        totals[direction] += numberOfSteps;

        // Reset count stack
        stepCountStack = "";

    }   
    return totals
}


/**
 * Calculates the euclidean distance based on x and y axis movements.
 * @param totals - Totals of each direction movement.
 * @returns Euclidean distance result.
 */
const calculateEuclidean = (totals: Record<Direction, number>) => {
    //Get distance traveled on both axis
    const xDistance = totals.forward - totals.backward;
    const yDistance = totals.right - totals.left;

    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

const route = "15F6B6B5L16R8B16F20L6F13F11R";

try{
    let stepTotals = parseDirections(route);
    let euclideanDistance = calculateEuclidean(stepTotals);
    console.log(`Euclidean distance: ${euclideanDistance}`);
}catch(er){
    console.error(er);
}
