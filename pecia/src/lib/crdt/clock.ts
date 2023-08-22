// This class implements a hybrid logical clock
// For the original work see https://muratbuffalo.blogspot.com/2014/07/hybrid-logical-clocks.html
// Implementation drawn from https://github.com/theproductiveprogrammer/hybrid-logical-clock/blob/master/hlc.js
// adapted to be a stateful class rather than a module with a global clock and functional patterns.

class Clock {
    ts: number;
    nn: number;
    id: string;
    constructor(
        id: string = '',
        ts: number | null = null,
        nn: number | null = null
    ) {
        this.id = id ? id : crypto.randomUUID();
        this.ts = ts ? ts : Date.now();
        this.nn = nn ? nn : 0;
    }

    next() {
        const now = Date.now();
        if (now > this.ts) {
            this.ts = now;
            this.nn = 0;
        } else {
            this.nn++;
        }
        return this.toString();
    }

    toString() {
        return `${this.ts}:${this.nn}:${this.id}`;
    }

    receive(remote: string): string {
        try {
            const remoteClock = Clock.parse(remote);
            this.#updateFromRemote(remoteClock);
            return this.toString();
        } catch (e) {
            console.error(e);
            throw new Error(`receive operation failed with error: ${e}`);
        }
    }

    #updateFromRemote(remote: Clock) {
        const now = Date.now();
        if (now > this.ts && now > remote.ts) {
            this.ts = now;
            this.nn = 0;
        } else if (this.ts === remote.ts) {
            const nn = Math.max(this.nn, remote.nn) + 1;
            this.nn = nn;
        } else if (remote.ts > this.ts) {
            this.ts = remote.ts;
            this.nn = remote.nn + 1;
        } else {
            this.nn++;
        }
    }

    static parse(clockString: string): Clock {
        try {
            const clockArr = clockString.split(':');
            if (
                clockArr.length !== 3 ||
                !(clockArr[2].length > 0) ||
                Number.isNaN(parseInt(clockArr[0])) ||
                Number.isNaN(parseInt(clockArr[1]))
            ) {
                throw new Error();
            }
            return new Clock(
                clockArr[2],
                parseInt(clockArr[0]),
                parseInt(clockArr[1])
            );
        } catch (e) {
            throw new Error(
                `failed to parse clockString ${clockString}, format should be timestamp:counter:id`
            );
        }
    }

    static maxFromStrings(c1: string, c2: string): string {
        const clock1 = Clock.parse(c1);
        const clock2 = Clock.parse(c2);
        return Clock.max(clock1, clock2).toString();
    }

    static max(clock1: Clock, clock2: Clock): Clock {
        let max = clock1;

        if (clock1.ts !== clock2.ts) {
            max = clock1.ts > clock2.ts ? clock1 : clock2;
        } else if (clock1.nn !== clock2.nn) {
            max = clock1.nn > clock2.nn ? clock1 : clock2;
        } else if (clock1.id !== clock2.id) {
            max = clock1.id > clock2.id ? clock1 : clock2;
        }
        // if the clocks are identical we arbitrarily return the first
        return max;
    }
}

export default Clock;
