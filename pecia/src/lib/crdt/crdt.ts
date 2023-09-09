// Implementation of the Tree 'Move' based CRDT from:
// https://martin.kleppmann.com/papers/move-op.pdf
import Clock from "./clock.js";
import { LSEQ } from "./lseq.js";
import {
    updateLogIm,
    updateTreeIm,
    undoOpIm,
    applyOpsIm,
    applyOpIm,
} from "./producers.js";

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
    id: string;
}

export interface TreeNode {
    parent: string | null;
    meta: Metadata;
    child: string;
}

export const ROOT: TreeNode = {
    child: "ROOT",
    parent: null,
    meta: {
        type: "ROOT",
        pos: "",
        content: null,
        previousSibling: null,
        subsequentSibling: null,
        attrs: Object,
    },
};

export const TRASH: TreeNode = {
    child: "TRASH",
    parent: "ROOT",
    meta: {
        type: "TRASH",
        pos: "",
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
    id: string;
}

export interface ReplicaState {
    opLog: LogMove[];
    tree: TreeNode[];
}

export class TreeMoveCRDT {
    static findNode(tree: TreeNode[], child: string): TreeNode | undefined {
        return tree.find((n) => n.child === child);
    }

    // given a tree, and two node IDs, determines if n1 is an ancestor of n2 in the tree.
    static ancestor(tree: TreeNode[], n1: string, n2: string): boolean {
        //base case is if n2 is the root or is not in the tree, then we know that n1 is not an ancestor.
        const node = TreeMoveCRDT.findNode(tree, n2);
        if (!node || node.parent === null) return false;
        //otherwise if the node's parent is n1 we have an ancestor relationship
        else if (node.parent === n1) return true;
        //otherwise we need to recurse and check the parent
        else return TreeMoveCRDT.ancestor(tree, n1, node.parent);
    }

    static doOp(state: ReplicaState, move: Move): ReplicaState {
        //we always update the log, even if the move is invalid.
        //it may become valid if an earlier move is then added during a merge.
        const newLog = updateLogIm(state, move).state.opLog;
        const newTree = updateTreeIm(state, move).state.tree;

        return { opLog: newLog, tree: newTree };
    }

    static undoOp(tree: TreeNode[], op: LogMove): TreeNode[] {
        const newState = undoOpIm(tree, op);
        return newState.tree;
    }

    static redoOp(state: ReplicaState, op: LogMove): ReplicaState {
        return TreeMoveCRDT.doOp(state, {
            time: op.time,
            meta: op.meta,
            parent: op.parent,
            child: op.child,
            id: op.id,
        });
    }

    static applyOp(state: ReplicaState, move: Move): ReplicaState {
        return applyOpIm(state, move).replicaState;
    }

    static applyOps(state: ReplicaState, opLog: LogMove[]): ReplicaState {
        return applyOpsIm(state, opLog).replicaState;
    }

    static merge(state1: ReplicaState, state2: ReplicaState): ReplicaState {
        return TreeMoveCRDT.applyOps(state1, state2.opLog);
    }

    static getDeletedNodes(tree: TreeNode[]): TreeNode[] {
        return tree.filter((node) =>
            TreeMoveCRDT.ancestor(tree, "TRASH", node.child),
        );
    }

    static pruneOpLog(opLog: LogMove[], timestamp: string): LogMove[] {
        return opLog.filter(
            (node) =>
                Clock.maxFromStrings(node.time, timestamp) !== timestamp ||
                node.time === timestamp,
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
