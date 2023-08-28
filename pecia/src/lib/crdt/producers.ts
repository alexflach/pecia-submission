import { produce } from 'immer';
import {
    TreeMoveCRDT,
    Metadata,
    TreeNode,
    ReplicaState,
    Move,
    OldState,
    LogMove,
} from './crdt';

type GetChildAndMetadataState = {
    tree?: TreeNode[];
    child?: string;
    parent?: string;
    meta?: Metadata;
};
export const getParentAndMetadataIm = (tree: TreeNode[], child: string) => {
    return produce(
        { tree, child } as GetChildAndMetadataState,
        (draftState) => {
            const node = TreeMoveCRDT.findNode(tree, child);
            if (node) {
                draftState.parent = node.parent;
                draftState.meta = node.meta;
            } else draftState = null;
        }
    );
};

type UpdateLogState = {
    state: ReplicaState;
    move: Move;
};
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
        });
    });
};

export const updateTreeIm = (state: ReplicaState, move: Move) => {
    return produce({ state, move } as UpdateLogState, (draftState) => {
        let apply = true;
        // we cannot move the root node or the trash node:
        if (
            draftState.move.parent === null ||
            draftState.move.child === 'TRASH'
        )
            apply = false;
        // if the move's child would be an ancestor of its parent, then we reject the move,
        // likewise if they are the same node:
        if (
            TreeMoveCRDT.ancestor(
                draftState.state.tree,
                draftState.move.child,
                draftState.move.parent
            ) ||
            draftState.move.child === draftState.move.parent
        )
            apply = false;
        if (apply) {
            draftState.state.tree = state.tree.filter(
                (n) => n.child !== move.child
            );
            draftState.state.tree.push({
                parent: move.parent,
                meta: move.meta,
                child: move.child,
            });
        }
    });
};

type UndoState = {
    tree: TreeNode[];
    op: LogMove;
};

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
