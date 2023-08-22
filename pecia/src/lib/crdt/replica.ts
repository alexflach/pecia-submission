import { randomUUID } from 'crypto';
import Clock from './clock.js';
import { LSEQ } from './lseq.js';

import {
    TreeNode,
    LogMove,
    ReplicaState,
    ROOT,
    TRASH,
    Move,
    TreeMoveCRDT as CRDT,
    TreeMoveCRDT,
} from './crdt.js';

export class Replica {
    #tree: TreeNode[] = [];
    #opLog: LogMove[] = [];
    #clock: Clock;
    #id: string;

    constructor(
        tree: TreeNode[] | null = null,
        opLog: LogMove[] | null = null,
        id: string | null = null
    ) {
        if (id) {
            this.#id = id;
            this.#clock = new Clock(id);
        } else {
            this.#id = randomUUID();
            this.#clock = new Clock(this.#id);
        }
        if (!tree) {
            //constructing from scratch so generate a root node
            //and a trash node
            this.#tree.push(ROOT);
            this.#tree.push(TRASH);
        } else {
            this.#tree = tree;
            if (opLog) this.#opLog = opLog;
        }
    }

    get tree() {
        return this.#tree;
    }

    get opLog() {
        return this.#opLog;
    }

    get state(): ReplicaState {
        return {
            tree: this.#tree,
            opLog: this.#opLog,
        };
    }

    //abstracted so that the strategy can be changed as needed. Currently uses a Hybrid Logical Clock
    generateTimestamp() {
        return this.#clock.next();
    }

    updateState(state: ReplicaState) {
        this.#tree = state.tree;
        this.#opLog = state.opLog;
    }

    #generatePos(before: string | null, after: string | null): string {
        let beforePos;
        let afterPos;
        if (!before) {
            beforePos = LSEQ.startPos(this.#id);
        } else {
            const beforeNode = TreeMoveCRDT.findNode(this.#tree, before);
            if (beforeNode) beforePos = beforeNode.meta.pos;
            else beforePos = LSEQ.startPos(this.#id);
        }
        if (!after) {
            afterPos = LSEQ.endPos(this.#id);
        } else {
            const afterNode = TreeMoveCRDT.findNode(this.#tree, after);

            if (afterNode) afterPos = afterNode.meta.pos;
            else afterPos = LSEQ.endPos(this.#id);
        }

        const pos = LSEQ.alloc(beforePos, afterPos, this.#id);
        return pos;
    }

    createNode(
        content = '',
        type: string,
        parent: string,
        before: string | null,
        after: string | null
    ): string {
        const time = this.generateTimestamp();
        const child = randomUUID();

        const pos = this.#generatePos(before, after);
        const move: Move = {
            time,
            parent,
            meta: { type, content, pos },
            child,
        };
        console.log(move);
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
        return child;
    }

    deleteNode(child: string) {
        // cannot delete root or trash, a no-op
        if (child === 'ROOT' || child === 'TRASH') return;

        // cannot delete a node that doesn't exist
        const node = CRDT.findNode(this.#tree, child);
        if (!node) {
            throw new Error('Tried to delete a non-existing node');
        }

        const time = this.generateTimestamp();
        const move: Move = { time, parent: 'TRASH', child, meta: node.meta };
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
    }

    moveNode(child: string, newParent: string) {
        // cannot move root or trash: a no-op
        if (child === 'ROOT' || child === 'TRASH') return;

        const childNode = CRDT.findNode(this.#tree, child);
        if (!childNode) {
            throw new Error(
                `Error in moveNode call: Child: ${child} is not in tree`
            );
        }
        const parentNode = CRDT.findNode(this.#tree, newParent);
        if (!parentNode) {
            throw new Error(
                `Error in moveNode call: newParent: ${newParent} is not in tree`
            );
        }
        const time = this.generateTimestamp();
        const move: Move = {
            time,
            parent: newParent,
            child,
            meta: childNode.meta,
        };

        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
    }

    moveSibling(
        node: string,
        newBefore: string | null,
        newAfter: string | null
    ) {
        const n = TreeMoveCRDT.findNode(this.#tree, node);
        if (!n) {
            throw new Error('node not found');
        }
        let beforePos;
        let afterPos;
        if (!newBefore) {
            beforePos = LSEQ.startPos(this.#id);
        } else {
            const node = TreeMoveCRDT.findNode(this.#tree, newBefore);
            if (node) beforePos = node.meta.pos;
            else beforePos = LSEQ.startPos(this.#id);
        }
        if (!newAfter) {
            afterPos = LSEQ.endPos(this.#id);
        } else {
            const node = TreeMoveCRDT.findNode(this.#tree, newAfter);
            if (node) afterPos = node.meta.pos;
            else afterPos = LSEQ.endPos(this.#id);
        }
        const newPos = LSEQ.alloc(beforePos, afterPos, this.#id);

        const time = this.generateTimestamp();
        const move: Move = {
            time,
            parent: n.parent,
            child: node,
            meta: {
                content: n.meta.content,
                type: n.meta.type,
                pos: newPos,
            },
        };
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
    }

    updateNodeContent(child: string, content: string) {
        //cannot edit root or trash
        if (child === 'ROOT' || child === 'TRASH') return;
        const node = CRDT.findNode(this.#tree, child);
        if (!node) {
            throw new Error(
                `Error in updateNodeContent call: child ${child} is not in tree`
            );
        }

        const time = this.generateTimestamp();
        const move: Move = {
            time,
            parent: node.parent,
            child,
            meta: {
                type: node.meta.type,
                content,
                pos: node.meta.pos,
            },
        };
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
    }
}
