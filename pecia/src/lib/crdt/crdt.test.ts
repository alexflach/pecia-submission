// This tests the main primitive operations in the CRDT.
// Applying operations and merging replicas are tested via the replica tests.
import { test, expect } from "vitest";
import {
    TreeMoveCRDT,
    TreeNode,
    Move,
    ReplicaState,
    ROOT,
    TRASH,
} from "./crdt.js";

const TEST_TREE: TreeNode[] = [
    ROOT,
    TRASH,
    {
        parent: "ROOT",
        child: "A",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "10:a",
        },
    },
    {
        parent: "ROOT",
        child: "B",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "20:a",
        },
    },
    {
        parent: "A",
        child: "C",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "13:a",
        },
    },
    {
        parent: "C", // grandchild of A
        child: "D",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "",
        },
    },
    {
        parent: "TRASH",
        child: "E",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "",
        },
    },
    {
        parent: "TRASH",
        child: "F",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "",
        },
    },
    {
        parent: "F", // child of a deleted node
        child: "G",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "",
        },
    },
    {
        parent: "A",
        child: "H",
        meta: {
            type: "para",
            attrs: {},
            content: "",
            previousSibling: null,
            subsequentSibling: null,
            pos: "5:20:10:a",
        },
    },
];

// a valid move of a node to a good parent
const VALID_MOVE: Move = {
    child: "H",
    parent: "B",
    id: "1",
    time: "3",
    meta: {
        type: "para",
        content: null,
        pos: "0:a",
        previousSibling: null,
        subsequentSibling: null,
        attrs: {},
    },
};

// this move would introduce a cycle so should be rejected
const INVALID_MOVE: Move = {
    child: "A",
    parent: "D",
    id: "2",
    time: "4",
    meta: {
        type: "para",
        content: null,
        pos: "0:a",
        previousSibling: null,
        subsequentSibling: null,
        attrs: {},
    },
};

test("Finding nodes works as expected", () => {
    const node = TreeMoveCRDT.findNode(TEST_TREE, "A");
    expect(node).toBeDefined();
    expect(node.child).toBe("A");
    expect(node.parent).toBe("ROOT");

    const missing = TreeMoveCRDT.findNode(TEST_TREE, "MISSING");
    expect(missing).toBeUndefined();
});

test("ancestors can be identified", () => {
    const isAncestorDirectParent = TreeMoveCRDT.ancestor(TEST_TREE, "A", "C");
    const notAncestor = TreeMoveCRDT.ancestor(TEST_TREE, "C", "A");
    const isAncestorNotDirect = TreeMoveCRDT.ancestor(TEST_TREE, "A", "D");

    expect(isAncestorDirectParent).toBe(true);
    expect(notAncestor).toBe(false);
    expect(isAncestorNotDirect).toBe(true);
});

test("deleted nodes can be identified", () => {
    const DELETED_NODES = ["E", "F", "G"]; // 2 children of TRASH and one grandchild
    const deleted = TreeMoveCRDT.getDeletedNodes(TEST_TREE);
    const deletedIDs = deleted.map((node) => node.child);

    expect(deletedIDs.sort()).toEqual(DELETED_NODES);
});

test("siblings can be found", () => {
    const SIBLINGS = ["A", "B", "TRASH"];
    const NODE = TreeMoveCRDT.findNode(TEST_TREE, "A");
    const siblings = TreeMoveCRDT.getSiblingNodes(TEST_TREE, NODE);
    const siblingIDs = siblings.map((node) => node.child);

    expect(siblingIDs.sort()).toEqual(SIBLINGS);
});

test("siblings can be sorted", () => {
    const SORTED_SIBLINGS = ["H", "C"];
    const C_NODE = TreeMoveCRDT.findNode(TEST_TREE, "C");
    const SIBLINGS = TreeMoveCRDT.getSiblingNodes(TEST_TREE, C_NODE);
    const sorted = TreeMoveCRDT.sortSiblings(SIBLINGS);
    const sortedIDs = sorted.map((node) => node.child);

    expect(SORTED_SIBLINGS).toEqual(sortedIDs);
});

test("valid move should be applied correctly", () => {
    const STATE: ReplicaState = { tree: TEST_TREE, opLog: [] };
    const NEW_STATE = TreeMoveCRDT.doOp(STATE, VALID_MOVE);

    //check immutability/referential inequality
    expect(STATE).not.toBe(NEW_STATE);
    expect(STATE.opLog).not.toBe(NEW_STATE.opLog);
    expect(STATE.tree).not.toBe(NEW_STATE.tree);
    expect(STATE.tree).toBe(TEST_TREE); //original tree should be unchanged

    //check operation has been added to the log
    expect(NEW_STATE.opLog).toHaveLength(1);

    //check tree is the same size since this did not add a node
    expect(NEW_STATE.tree.length).toEqual(TEST_TREE.length);

    //check node has been moved as expected
    const newNode = TreeMoveCRDT.findNode(NEW_STATE.tree, "H");
    expect(newNode.parent).toBe("B");

    //confirm old state is unaffected
    const oldNode = TreeMoveCRDT.findNode(STATE.tree, "H");
    expect(oldNode.parent).toBe("A");

    //check opLog has old State that we can revert to
    const record = NEW_STATE.opLog[0];
    expect(record.oldState).toBeDefined();
    expect(record.oldState.oldParent).toBe("A");
});

test("invalid move should be recorded but not executed", () => {
    const STATE: ReplicaState = { tree: TEST_TREE, opLog: [] };
    const NEW_STATE = TreeMoveCRDT.doOp(STATE, INVALID_MOVE);

    //check immutability/referential inequality
    expect(STATE).not.toBe(NEW_STATE);
    expect(STATE.opLog).not.toBe(NEW_STATE.opLog);
    expect(STATE.tree).not.toBe(NEW_STATE.tree);
    expect(STATE.tree).toBe(TEST_TREE); //original tree should be unchanged

    //check operation has been added to the log
    expect(NEW_STATE.opLog).toHaveLength(1);

    //check tree is the same size since this did not add a node
    expect(NEW_STATE.tree.length).toEqual(TEST_TREE.length);

    //check node has been not been moved as expected
    const newNode = TreeMoveCRDT.findNode(NEW_STATE.tree, "A");
    expect(newNode.parent).toBe("ROOT");

    //check opLog has recorded the desired transaction anyway
    const record = NEW_STATE.opLog[0];
    expect(record.oldState).toBeDefined();
    expect(record.oldState.oldParent).toBe("ROOT");
    expect(record.parent).toBe("D");
});

test("moves can be undone", () => {
    const STATE: ReplicaState = { tree: TEST_TREE, opLog: [] };
    const NEW_STATE = TreeMoveCRDT.doOp(STATE, VALID_MOVE);
    const undoneTree = TreeMoveCRDT.undoOp(NEW_STATE.tree, NEW_STATE.opLog[0]);

    //check immutability
    expect(NEW_STATE.tree).not.toBe(undoneTree);

    //check operation has been undone
    const node = TreeMoveCRDT.findNode(undoneTree, "H");
    expect(node.parent).toBe("A");

    //check no impact on previous tree
    const oldNode = TreeMoveCRDT.findNode(NEW_STATE.tree, "H");
    expect(oldNode.parent).toBe("B");
});

test("moves can be redone", () => {
    const STATE: ReplicaState = { tree: TEST_TREE, opLog: [] };
    const NEW_STATE = TreeMoveCRDT.doOp(STATE, VALID_MOVE);
    const undoneTree = TreeMoveCRDT.undoOp(NEW_STATE.tree, NEW_STATE.opLog[0]);
    const REDO_STATE = TreeMoveCRDT.redoOp(
        { tree: undoneTree, opLog: [] },
        NEW_STATE.opLog[0],
    );

    expect(REDO_STATE.opLog).toHaveLength(1);
    //check tree is the same size since this did not add a node
    expect(REDO_STATE.tree.length).toEqual(TEST_TREE.length);

    //check node has been moved as expected
    const newNode = TreeMoveCRDT.findNode(REDO_STATE.tree, "H");
    expect(newNode.parent).toBe("B");

    //confirm old state is unaffected
    const oldNode = TreeMoveCRDT.findNode(undoneTree, "H");
    expect(oldNode.parent).toBe("A");

    //check opLog has old State that we can revert to
    const record = REDO_STATE.opLog[0];
    expect(record.oldState).toBeDefined();
    expect(record.oldState.oldParent).toBe("A");
});
