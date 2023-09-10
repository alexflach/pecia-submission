import { test, expect } from "vitest";
import { TreeMoveCRDT as CRDT } from "./crdt";
import { Replica } from "./replica";

test("nodes can be created on a new replica", () => {
    const replica = new Replica();
    const id = replica.createNode(
        "test content",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );

    //expect there to be three nodes in the tree and one opLog
    expect(CRDT.findNode(replica.tree, id)).toBeDefined();
    expect(replica.tree.length).toBe(3);
    expect(replica.opLog.length).toBe(1);
});

test("nodes can be deleted", () => {
    const replica = new Replica();
    const id = replica.createNode(
        "test content 2",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );

    replica.deleteNode(id);

    const node = CRDT.findNode(replica.tree, id);
    expect(node).toBeDefined();
    expect(node.parent).toBe("TRASH");
    expect(replica.tree.length).toBe(3);
    expect(replica.opLog.length).toBe(2);
});

test("nodes can be moved", () => {
    const replica = new Replica();
    const id1 = replica.createNode(
        "test content 3",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );
    const id2 = replica.createNode(
        "child to be moved",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );

    replica.moveNode(id2, id1);

    const movedNode = CRDT.findNode(replica.tree, id2);
    expect(movedNode).toBeDefined();
    expect(movedNode.parent).toBe(id1);
    expect(replica.tree.length).toBe(4);
    expect(replica.opLog.length).toBe(3);
});

test("nodes can be edited", () => {
    const OLD_CONTENT = "old content";
    const NEW_CONTENT = "new content";
    const replica = new Replica();
    const id1 = replica.createNode(
        OLD_CONTENT,
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );
    replica.updateNodeContent(id1, NEW_CONTENT, {});

    const editedNode = CRDT.findNode(replica.tree, id1);
    expect(editedNode).toBeDefined();
    expect(editedNode.meta.content).toBe(NEW_CONTENT);
    expect(replica.tree.length).toBe(3);
    expect(replica.opLog.length).toBe(2);
    expect(replica.opLog[1].oldState.oldMetadata.content).toBe(OLD_CONTENT);
});

test("merges produce consistent state", () => {
    const replica1 = new Replica();
    const id1 = replica1.createNode(
        "test content 3",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );
    const id2 = replica1.createNode(
        "child to be moved",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );
    replica1.moveNode(id2, id1);
    replica1.updateNodeContent(id2, "some new content", {});
    replica1.deleteNode(id1);

    const replica2 = new Replica();
    const id3 = replica2.createNode(
        "test content 4",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );
    const id4 = replica2.createNode(
        "child to be moved",
        "text",
        "ROOT",
        null,
        null,
        null,
        {},
        0,
    );
    replica2.moveNode(id4, id3);
    replica2.deleteNode(id4);
    replica2.updateNodeContent(id3, "my new content", {});

    //these will merge the states in the opposite direction
    const merge1 = CRDT.merge(replica1.state, replica2.state);
    const merge2 = CRDT.merge(replica2.state, replica1.state);

    expect(merge1.tree).toEqual(merge2.tree);
    expect(merge1.opLog).toEqual(merge2.opLog);
});
