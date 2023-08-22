export function sleep(n: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, n);
    });
}

// returns a number between [min,max)
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
export function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
