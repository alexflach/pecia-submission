import Clock from './clock.js';
import { LSEQ } from './lseq.js';

export interface Metadata {
    type: string;
    content: string | null;
    pos: string;
    previousSibling: string | null;
    subsequentSibling: string | null;
    attrs?: object;
}

export interface Move {
    time: string;
    parent: string | null;
    meta: Metadata;
    child: string;
}

export interface TreeNode {
    parent: string | null;
    meta: Metadata;
    child: string;
}

export const ROOT: TreeNode = {
    child: 'ROOT',
    parent: null,
    meta: {
        type: 'root',
        pos: '',
        content: null,
        previousSibling: null,
        subsequentSibling: null,
    },
};

export const TRASH: TreeNode = {
    child: 'TRASH',
    parent: 'ROOT',
    meta: {
        type: 'trash',
        pos: '',
        content: null,
        previousSibling: null,
        subsequentSibling: null,
    },
};
export interface OldState {
    oldParent: string | null;
    oldMetadata: Metadata;
}

export interface LogMove {
    oldState: OldState | null;
    time: string;
    parent: string | null;
    meta: Metadata;
    child: string;
}

export interface ReplicaState {
    opLog: LogMove[];
    tree: TreeNode[];
}

export class TreeMoveCRDT {
    static findNode(tree: TreeNode[], child: string): TreeNode | undefined {
        return tree.find((n) => n.child === child);
    }

    static getParent(
        tree: TreeNode[],
        child: string
    ): [string | null, Metadata] | null {
        const node = TreeMoveCRDT.findNode(tree, child);
        if (node) return [node.parent, node.meta];
        else return null;
    }

    //given a tree, and two node IDs, determines if n1 is an ancestor of n2 in the tree.
    static ancestor(tree: TreeNode[], n1: string, n2: string): boolean {
        //base case is if n2 is the root or is not in the tree, then we know that n1 is not an ancestor.
        const node = TreeMoveCRDT.findNode(tree, n2);
        if (!node || node.parent === null) return false;
        //otherwise if the node's parent is n1 we have an ancestor relationship
        else if (node.parent === n1) return true;
        //otherwise we need to recurse and check the parent
        else return TreeMoveCRDT.ancestor(tree, n1, node.parent);
    }

    static updateLog(state: ReplicaState, move: Move): LogMove[] {
        const parent = TreeMoveCRDT.getParent(state.tree, move.child);
        let oldState: OldState | null = null;
        if (parent) {
            const [oldParent, oldMetadata] = parent;
            oldState = { oldParent, oldMetadata };
        }
        const newLog = [...state.opLog];
        newLog.push({
            oldState,
            time: move.time,
            parent: move.parent,
            meta: move.meta,
            child: move.child,
        });
        return newLog;
    }

    static updateTree(state: ReplicaState, move: Move): TreeNode[] {
        // we cannot move the root node or the trash node:
        if (move.parent === null || move.child === 'TRASH') return state.tree;
        // if the move's child would be an ancestor of its parent, then we reject the move,
        // likewise if they are the same node:
        else if (
            TreeMoveCRDT.ancestor(state.tree, move.child, move.parent) ||
            move.child === move.parent
        ) {
            return state.tree;
        } else {
            const newTree = state.tree.filter((n) => n.child !== move.child);
            newTree.push({
                parent: move.parent,
                meta: move.meta,
                child: move.child,
            });
            return newTree;
        }
    }

    static doOp(state: ReplicaState, move: Move): ReplicaState {
        //we always update the log, even if the move is invalid.
        //it may become valid if an earlier move is then added during a merge.
        const newLog = TreeMoveCRDT.updateLog(state, move);
        const newTree = TreeMoveCRDT.updateTree(state, move);
        return { opLog: newLog, tree: newTree };
    }

    static undoOp(tree: readonly TreeNode[], op: LogMove): TreeNode[] {
        // the base case is there was no old state, in which case this was an insertion and we just remove the node
        const newTree = tree.filter((n) => n.child !== op.child);
        // otherwise it was a metadata change or move, in which case we revert to the old state
        if (op.oldState) {
            const newNode: TreeNode = {
                parent: op.oldState.oldParent,
                meta: op.oldState.oldMetadata,
                child: op.child,
            };
            newTree.push(newNode);
        }
        return newTree;
    }

    static redoOp(state: ReplicaState, op: LogMove): ReplicaState {
        const newState = TreeMoveCRDT.doOp(state, {
            time: op.time,
            meta: op.meta,
            parent: op.parent,
            child: op.child,
        });
        return newState;
    }

    //note the recursion and cloning the state could get very expensive memory wise here, need to test the prototype.
    static applyOp(state: ReplicaState, move: Move): ReplicaState {
        // If this is the first operation or the move timestamp is more recent than the oldest log entry, we can just
        // do the op as normal
        const opLength = state.opLog.length;
        const logTime = state.opLog[opLength - 1]?.time;

        if (
            opLength < 1 ||
            Clock.maxFromStrings(logTime, move.time) === move.time
        ) {
            return TreeMoveCRDT.doOp(state, move);
        } else {
            //to avoid mutation
            const newState = structuredClone(state);
            const lastOp =
                newState.opLog.length > 0 ? newState.opLog.pop() : null;
            if (!lastOp) {
                throw new Error(
                    'something went wrong with the structured clone'
                );
            } else {
                const newTree = TreeMoveCRDT.undoOp(newState.tree, lastOp);
                return TreeMoveCRDT.redoOp(
                    TreeMoveCRDT.applyOp(
                        { opLog: newState.opLog, tree: newTree },
                        move
                    ),
                    lastOp
                );
            }
        }
    }
    static applyOps(state: ReplicaState, opLog: LogMove[]): ReplicaState {
        let newState = structuredClone(state);
        for (const op of opLog) {
            const move: Move = {
                time: op.time,
                child: op.child,
                parent: op.parent,
                meta: op.meta,
            };
            newState = TreeMoveCRDT.applyOp(newState, move);
        }
        return newState;
    }

    static merge(state1: ReplicaState, state2: ReplicaState): ReplicaState {
        return TreeMoveCRDT.applyOps(state1, state2.opLog);
    }

    static getDeletedNodes(tree: TreeNode[]): TreeNode[] {
        return tree.filter((node) =>
            TreeMoveCRDT.ancestor(tree, 'TRASH', node.child)
        );
    }

    static pruneOpLog(opLog: LogMove[], timestamp: string): LogMove[] {
        return opLog.filter(
            (node) =>
                Clock.maxFromStrings(node.time, timestamp) !== timestamp ||
                node.time === timestamp
        );
    }

    static getSiblingNodes(tree: TreeNode[], node: TreeNode): TreeNode[] {
        return tree.filter((n) => node.parent === n.parent);
    }

    static compareSiblings(a: TreeNode, b: TreeNode): number {
        return LSEQ.compare(a.meta.pos, b.meta.pos);
    }

    static sortSiblings(siblings: TreeNode[]): TreeNode[] {
        //avoid mutation
        const sibCopy = Array.from(siblings);
        return sibCopy.sort(TreeMoveCRDT.compareSiblings);
    }
}
