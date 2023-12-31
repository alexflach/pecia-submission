// Contains helper methods using 'immer' to guarantee immutability.
// Methods have the 'Im' suffix to indicate immutability.

import { produce } from "immer";
import {
    TreeMoveCRDT,
    Metadata,
    TreeNode,
    ReplicaState,
    Move,
    OldState,
    LogMove,
} from "./crdt";
import Clock from "./clock";

interface GetChildAndMetadataState {
    tree?: TreeNode[];
    child?: string;
    parent?: string;
    meta?: Metadata;
}

// given the input child and tree, returns the node metadata and parent if found.
export const getParentAndMetadataIm = (tree: TreeNode[], child: string) => {
    return produce(
        { tree, child } as GetChildAndMetadataState,
        (draftState) => {
            const node = TreeMoveCRDT.findNode(tree, child);
            if (node) {
                draftState.parent = node.parent;
                draftState.meta = node.meta;
            } else draftState = null;
        },
    );
};

type UpdateLogState = {
    state: ReplicaState;
    move: Move;
};

// given an input state and a move, returns a new state with the move added to the
// operation log.
export const updateLogIm = (state: ReplicaState, move: Move) => {
    return produce({ state, move } as UpdateLogState, (draftState) => {
        const node = TreeMoveCRDT.findNode(state.tree, move.child);

        let oldState: OldState | null = null;
        if (node) {
            oldState = { oldParent: node.parent, oldMetadata: node.meta };
        }
        draftState.state.opLog.push({
            oldState,
            time: move.time,
            parent: move.parent,
            meta: move.meta,
            child: move.child,
            id: move.id,
        });
    });
};

// Given an input state and a move, safely applies the move if possible
export const updateTreeIm = (state: ReplicaState, move: Move) => {
    return produce({ state, move } as UpdateLogState, (draftState) => {
        let apply = true;
        // we cannot move the root node or the trash node:
        if (
            draftState.move.parent === null ||
            draftState.move.child === "TRASH"
        )
            apply = false;
        // if the move's child would be an ancestor of its parent, then we reject the move,
        // likewise if they are the same node:
        if (
            TreeMoveCRDT.ancestor(
                draftState.state.tree,
                draftState.move.child,
                draftState.move.parent,
            ) ||
            draftState.move.child === draftState.move.parent
        )
            apply = false;
        if (apply) {
            draftState.state.tree = state.tree.filter(
                (n) => n.child !== move.child,
            );
            draftState.state.tree.push({
                parent: move.parent,
                meta: move.meta,
                child: move.child,
            });
        } else {
            draftState.state.tree = [...state.tree];
        }
    });
};

type UndoState = {
    tree: TreeNode[];
    op: LogMove;
};

// undoes an operation by removing the relevant node from the tree and replacing
// it with the old state of the tree
export const undoOpIm = (tree: TreeNode[], op: LogMove) => {
    return produce({ tree, op } as UndoState, (draftState) => {
        draftState.tree = draftState.tree.filter((n) => n.child !== op.child);
        if (op.oldState) {
            const newNode: TreeNode = {
                parent: op.oldState.oldParent,
                meta: op.oldState.oldMetadata,
                child: op.child,
            };
            draftState.tree.push(newNode);
        }
    });
};

type ApplyState = {
    replicaState: ReplicaState;
    move: Move;
};

// implements the apply operation logic from Kleppmann's paper.
export const applyOpIm = (replicaState: ReplicaState, move: Move) => {
    return produce({ replicaState, move } as ApplyState, (draftState) => {
        // If this is the first operation or the move timestamp is more recent than the oldest log entry, we can just
        // do the op as normal
        const opLength = draftState.replicaState.opLog.length;
        const logTime = draftState.replicaState.opLog[opLength - 1]?.time;
        if (
            opLength < 1 ||
            Clock.maxFromStrings(logTime, move.time) === move.time
        ) {
            draftState.replicaState = TreeMoveCRDT.doOp(
                draftState.replicaState,
                move,
            );
        } else {
            const lastOp =
                draftState.replicaState.opLog.length > 0
                    ? draftState.replicaState.opLog.pop()
                    : null;
            if (!lastOp) {
                throw new Error("something went wrong with the op log");
            } else {
                const newTree = undoOpIm(
                    draftState.replicaState.tree,
                    lastOp,
                ).tree;
                draftState.replicaState = TreeMoveCRDT.redoOp(
                    applyOpIm(
                        {
                            opLog: draftState.replicaState.opLog,
                            tree: newTree,
                        } as ReplicaState,
                        move,
                    ).replicaState,
                    lastOp,
                );
            }
        }
    });
};

// applies a sequence of operations
export const applyOpsIm = (replicaState: ReplicaState, opLog: LogMove[]) => {
    return produce({ replicaState, opLog }, (draftState) => {
        for (const op of draftState.opLog) {
            const move: Move = {
                time: op.time,
                child: op.child,
                parent: op.parent,
                meta: op.meta,
                id: op.id,
            };
            if (
                !draftState.replicaState.opLog.find(
                    (operation) => operation.id === op.id,
                )
            ) {
                draftState.replicaState = applyOpIm(
                    draftState.replicaState,
                    move,
                ).replicaState;
            }
        }
    });
};
