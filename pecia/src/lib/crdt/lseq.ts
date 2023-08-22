//This class implements the LSEQ list CRDT from https://hal.science/hal-00921633/document
//It provides unique position identifiers for siblings in the TreeMoveCRDT

import { randomInt } from './utils.js';

//A Position will be a string in the form of (Int:)+ReplicaID
type PosString = string;
interface Position {
    depth: number;
    replica: string;
    positions: number[];
}

export class LSEQ {
    static #regionStart = 0;
    static #regionEnd = 100;

    static startPos(replica: string): string {
        return `${LSEQ.#regionStart}:${replica}`;
    }

    static endPos(replica: string): string {
        return `${LSEQ.#regionEnd}:${replica}`;
    }

    //currently uses the random allocation method, this is evidenced to be inefficient but is the
    //simplest method for the prototype
    static alloc(
        before: PosString,
        after: PosString,
        replica: string
    ): PosString {
        const p = LSEQ.parse(before);
        const q = LSEQ.parse(after);

        if (p.depth === q.depth) {
            const pPos = p.positions[p.depth - 1];
            const qPos = q.positions[q.depth - 1];

            if (qPos - pPos > 1) {
                const newPos = randomInt(pPos + 1, qPos);
                const treeString = p.positions.slice(0, -1).join(':');
                return `${treeString}${
                    treeString ? ':' : ''
                }${newPos}:${replica}`;
            } else {
                const newPos = randomInt(LSEQ.#regionStart, LSEQ.#regionEnd);
                const treeString = p.positions.join(':');
                return `${treeString}:${newPos}:${replica}`;
            }
        } else {
            //we need to look for a valid id between p and the end of range,
            //else we need to start a new branch.
            const pPos = p.positions[p.depth - 1];

            if (LSEQ.#regionEnd - pPos > 1) {
                const newPos = randomInt(pPos + 1, LSEQ.#regionEnd);
                const treeString = p.positions.slice(0, -1).join(':');
                return `${treeString}${
                    treeString ? ':' : null
                }${newPos}:${replica}`;
            } else {
                const newPos = randomInt(LSEQ.#regionStart, LSEQ.#regionEnd);
                const treeString = p.positions.join(':');
                return `${treeString}:${newPos}:${replica}`;
            }
        }
    }

    static parse(pos: PosString): Position {
        const split = pos.split(':');
        const length = split.length;
        const position: Position = {
            replica: split[length - 1],
            depth: length - 1,
            positions: split.slice(0, -1).map((str) => parseInt(str)),
        };
        return position;
    }

    static compare(a: PosString, b: PosString): number {
        //if the strings are identical we can early return
        if (a === b) return 0;
        const aPos = LSEQ.parse(a);
        const bPos = LSEQ.parse(b);

        for (let i = 0; i < aPos.positions.length; i++) {
            //base case, bPos isn't this deep, if we've got here then b is earlier
            if (!bPos.positions[i]) return 1;
            else if (aPos.positions[i] < bPos.positions[i]) return -1;
            else if (aPos.positions[i] > bPos.positions[i]) return 1;
            else if (aPos.positions[i] === bPos.positions[i]) {
                //scenarios remaining: we could be at the a leaf, but b is deeper
                // in which case a is before b
                if (!aPos.positions[i + 1] && bPos.positions[i + 1]) return -1;
                //or they could both be at their leaves, in which case we have to
                //tie break
                else if (!aPos.positions[i + 1] && !bPos.positions[i + 1]) {
                    return aPos.replica < bPos.replica ? -1 : 1;
                }
                //otherwise we can check the next layer
                else continue;
            }
        }
        // strings aren't comparable
        return 0;
    }

    static sort(positions: PosString[]) {
        //avoid mutation
        const newPos = Array.from(positions);
        return newPos.sort(LSEQ.compare);
    }
}
