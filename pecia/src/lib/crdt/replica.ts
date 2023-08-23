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
import { Node } from 'prosemirror-model';

export class Replica {
    tree: TreeNode[] = [];
    opLog: LogMove[] = [];
    clock: Clock;
    id: string;
    docID: string;
    versionID: string;
    createdAt: string;

    constructor(
        tree: TreeNode[] | null = null,
        opLog: LogMove[] | null = null,
        id: string | null = null,
        docID: string | null = null,
        versionID: string | null = null
    ) {
        if (id) {
            this.id = id;
            this.clock = new Clock(id);
        } else {
            this.id = crypto.randomUUID();
            this.clock = new Clock(this.id);
        }
        this.docID = docID || crypto.randomUUID();
        this.versionID = versionID || crypto.randomUUID();
        this.createdAt = this.clock.next();
        if (!tree) {
            //constructing from scratch so generate a root node
            //and a trash node
            this.tree.push(ROOT);
            this.tree.push(TRASH);
        } else {
            this.tree = tree;
            if (opLog) this.opLog = opLog;
        }
    }

    get state(): ReplicaState {
        return {
            tree: this.tree,
            opLog: this.opLog,
        };
    }

    //abstracted so that the strategy can be changed as needed. Currently uses a Hybrid Logical Clock
    generateTimestamp() {
        return this.clock.next();
    }

    updateState(state: ReplicaState) {
        this.tree = state.tree;
        this.opLog = state.opLog;
    }

    #generatePos(before: string | null, after: string | null): string {
        let beforePos;
        let afterPos;
        if (!before) {
            beforePos = LSEQ.startPos(this.id);
        } else {
            const beforeNode = TreeMoveCRDT.findNode(this.tree, before);
            if (beforeNode) beforePos = beforeNode.meta.pos;
            else beforePos = LSEQ.startPos(this.id);
        }
        if (!after) {
            afterPos = LSEQ.endPos(this.id);
        } else {
            const afterNode = TreeMoveCRDT.findNode(this.tree, after);

            if (afterNode) afterPos = afterNode.meta.pos;
            else afterPos = LSEQ.endPos(this.id);
        }

        const pos = LSEQ.alloc(beforePos, afterPos, this.id);
        return pos;
    }

    createNode(
        content = '',
        type: string,
        parent: string,
        before: string | null,
        after: string | null,
        id: string | null
    ): string {
        const time = this.generateTimestamp();
        const child = id ? id : crypto.randomUUID();

        const pos = this.#generatePos(before, after);
        const move: Move = {
            time,
            parent,
            meta: {
                type,
                content,
                pos,
                previousSibling: before,
                subsequentSibling: after,
            },
            child,
        };
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
        return child;
    }

    deleteNode(child: string) {
        // cannot delete root or trash, a no-op
        if (child === 'ROOT' || child === 'TRASH') return;

        // cannot delete a node that doesn't exist
        const node = CRDT.findNode(this.tree, child);
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

        const childNode = CRDT.findNode(this.tree, child);
        if (!childNode) {
            throw new Error(
                `Error in moveNode call: Child: ${child} is not in tree`
            );
        }
        const parentNode = CRDT.findNode(this.tree, newParent);
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
        const n = TreeMoveCRDT.findNode(this.tree, node);
        if (!n) {
            throw new Error('node not found');
        }
        let beforePos: string;
        let afterPos: string;
        if (!newBefore) {
            beforePos = LSEQ.startPos(this.id);
        } else {
            const node = TreeMoveCRDT.findNode(this.tree, newBefore);
            if (node) beforePos = node.meta.pos;
            else beforePos = LSEQ.startPos(this.id);
        }
        if (!newAfter) {
            afterPos = LSEQ.endPos(this.id);
        } else {
            const node = TreeMoveCRDT.findNode(this.tree, newAfter);
            if (node) afterPos = node.meta.pos;
            else afterPos = LSEQ.endPos(this.id);
        }
        const newPos = LSEQ.alloc(beforePos, afterPos, this.id);

        const time = this.generateTimestamp();
        const move: Move = {
            time,
            parent: n.parent,
            child: node,
            meta: {
                content: n.meta.content,
                type: n.meta.type,
                pos: newPos,
                previousSibling: newBefore,
                subsequentSibling: newAfter,
            },
        };
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
    }

    updateNodeContent(child: string, content: string) {
        //cannot edit root or trash
        if (child === 'ROOT' || child === 'TRASH') return;
        const node = CRDT.findNode(this.tree, child);
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
                previousSibling: node.meta.previousSibling,
                subsequentSibling: node.meta.subsequentSibling,
            },
        };
        const newState = CRDT.applyOp(this.state, move);
        this.updateState(newState);
    }
    static fromProsemirrorDoc(
        doc: Node,
        id: string | undefined,
        docID: string | undefined,
        versionID: string | undefined
    ) {
        const replica = new Replica(null, null, id, docID, versionID);
        doc.descendants((node, pos) => {
            //if the node is not the root node or text, we'll add to the tree:
            const nodeType = node.type.name;
            if (nodeType !== 'doc' && nodeType !== 'text') {
                const resolvedPos = doc.resolve(pos);
                const parent = resolvedPos.parent;
                const previousSibling = resolvedPos.nodeBefore;
                const afterPos = pos + node.nodeSize;
                const resolvedAfterPos = doc.resolve(afterPos);
                const subsequentSibling = resolvedAfterPos.nodeAfter;

                const parentID =
                    parent.type.name === 'doc' ? 'ROOT' : parent.attrs?.id;

                const beforeID = previousSibling?.attrs?.id || null;
                const afterID = subsequentSibling?.attrs?.id || null;

                replica.createNode(
                    JSON.stringify(node.content),
                    node.type.name,
                    parentID,
                    beforeID,
                    afterID,
                    node.attrs.id
                );
            }
        });

        return replica;
    }
}
