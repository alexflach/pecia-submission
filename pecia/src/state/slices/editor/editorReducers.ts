import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { Schema, Node, Fragment } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import { history, undo, redo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import idPlugin from "../../../lib/editor/plugins/idPlugin";
import stepsPlugin from "../../../lib/editor/plugins/stepsPlugin";
import { Replica } from "../../../lib/crdt/replica";
import { initIDs, generateNodeList, generateVersionFromReplica } from "./utils";
import { TreeMoveCRDT } from "../../../lib/crdt/crdt";

const PM_PLUGINS = [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    keymap(baseKeymap),
    idPlugin(),
    stepsPlugin(),
];

export type Editor = {
    currentDocID: string | null;
    schema: Schema;
    editorState: EditorState | null;
    versions: Replica[] | null;
    doc: string;
    currentVersionID: string | null;
    currentVersionLabel: string | null;
    title: string;
    owner: string;
};

export const setCurrentDocID: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>,
) => {
    state.currentDocID = action.payload;
};

export const setOwner: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>,
) => {
    state.owner = action.payload;
};

export const setTitle: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action: PayloadAction<string>,
) => {
    state.title = action.payload;
};

export const deleteVersion: CaseReducer<Editor, PayloadAction<string>> = (
    state,
    action,
) => {
    //can't have 0 versions;
    if (!state.versions || state.versions.length < 2) {
        console.log("bailing for lack of version length");
        return;
    }
    //can't delete currently active version
    if (state.currentVersionID === action.payload) {
        console.log("bailing because trying to delete current version");
        return;
    }
    const newVersions = state.versions.filter(
        (version) => version.versionID !== action.payload,
    );
    console.log(newVersions);

    state.versions = newVersions;
};

export const setSchema = (state, action: PayloadAction<Schema>) => {
    state.schema = action.payload;
};

export const retrieveDoc: CaseReducer<Editor, PayloadAction<null>> = (
    state,
) => {
    const retrievedDoc = localStorage.getItem(
        `pecia-doc-${state.currentDocID}`,
    );
    if (retrievedDoc) {
        const parsed = JSON.parse(retrievedDoc);
        const body = parsed.doc;
        const title = parsed.title;
        state.doc = JSON.stringify(body);
        state.title = title;
    } else {
        state.doc = null;
        state.title = "";
    }
};

type mergePayload = {
    version1ID: string;
    version2ID: string;
    label: string;
    description: string;
};
export const mergeVersions = {
    reducer: (state, action: PayloadAction<mergePayload>) => {
        console.log(action.payload);
        const { version1ID, version2ID, label, description } = action.payload;
        const version1 = state.versions.find(
            (version) => version.versionID === version1ID,
        );
        const version2 = state.versions.find(
            (version) => version.versionID === version2ID,
        );
        if (!version1 || !version2) return;
        const newReplicaState = TreeMoveCRDT.merge(
            { tree: version1.tree, opLog: version1.opLog },
            { tree: version2.tree, opLog: version2.opLog },
        );
        const newVersionID = crypto.randomUUID();
        const newReplica = new Replica(
            newReplicaState.tree,
            newReplicaState.opLog,
            state.owner,
            state.currentDocID,
            newVersionID,
            state.title,
            description,
            label,
            state.owner,
        );
        state.versions.push(newReplica);
    },
    prepare: (
        version1ID: string,
        version2ID: string,
        label: string,
        description: string,
    ) => {
        return {
            payload: {
                version1ID,
                version2ID,
                label,
                description,
            },
        };
    },
};
export const retrieveVersions = (state) => {
    const storedVersions = localStorage.getItem(
        `pecia-versions-${state.currentDocID}`,
    );
    const versions = storedVersions ? JSON.parse(storedVersions) : [];
    const versionReplicas = versions.map(
        (version) =>
            new Replica(
                version.tree,
                version.opLog,
                version.id,
                version.docID,
                version.versionID,
                version.title,
                version.description,
                version.label,
                version.owner,
            ),
    );
    state.versions = versionReplicas;
    //pick the latest version
    const currentVersion = versions?.length
        ? versions[versions.length - 1]
        : null;

    state.currentVersionID = currentVersion?.versionID || null;
    state.currentVersionLabel = currentVersion?.label || null;
};

export const updateEditorState = (
    state,
    action: PayloadAction<Transaction>,
) => {
    state.editorState = state.editorState.apply(action.payload);
};

interface initEditorPayload {
    owner: string;
    title: string;
}

export const initEditor = {
    reducer: (state, action: PayloadAction<initEditorPayload>) => {
        if (!state.schema || !state.currentDocID) return;

        let initDoc: Node | undefined;

        try {
            initDoc = state.doc
                ? Node.fromJSON(state.schema, JSON.parse(state.doc))
                : undefined;
        } catch (err) {
            console.error(err);
        }

        let editorState = EditorState.create({
            schema: state.schema,
            doc: initDoc,
            plugins: PM_PLUGINS,
        });

        editorState = initIDs(editorState);
        //if we don't have any version history we stage an 'initial commit'
        if (!state.versions?.length) {
            const currentVersionID = crypto.randomUUID();
            const initVersion = Replica.fromProsemirrorDoc(
                editorState.doc,
                action.payload.owner,
                state.currentDocID,
                currentVersionID,
            );
            initVersion.title = action.payload.title;
            initVersion.label = "Initial Version";
            initVersion.description = "An initial version created by Pecia";
            initVersion.owner = action.payload.owner;
            state.versions = [initVersion];

            state.currentVersionID = currentVersionID;
            state.currentVersionLabel = initVersion.label;
        }

        state.editorState = editorState;
    },
    prepare: (owner: string, title: string) => {
        return {
            payload: {
                owner,
                title,
            },
        };
    },
};

export interface PMNode {
    child: string;
    parent: string;
    previousSibling: string;
    subsequentSibling: string;
    content: Fragment;
    type: string;
    attrs: object;
    leaf: boolean;
    siblingOffset: number;
    siblingOrder: number;
}

type VersionPayload = {
    label: string;
    owner: string;
    title: string;
    description: string;
};
export const createVersion = {
    reducer: (state, action: PayloadAction<VersionPayload>) => {
        const newVersionID = crypto.randomUUID();
        const previousReplica = state.versions.find(
            (version) => version.versionID === state.currentVersionID,
        );

        const nodes = generateNodeList(state.editorState.doc);

        let newVersion;
        if (previousReplica) {
            console.log("generating from replica");
            newVersion = generateVersionFromReplica(previousReplica, nodes);
        } else {
            console.log("generating from editor state");
            newVersion = Replica.fromProsemirrorDoc(
                state.editorState.doc,
                newVersionID,
                state.currentDOCID,
                newVersionID,
            );
        }

        newVersion.owner = action.payload.owner;
        newVersion.label = action.payload.label;
        newVersion.versionID = newVersionID;
        newVersion.title = action.payload.title;
        newVersion.description = action.payload.description;
        state.versions.push(newVersion);

        state.doc = JSON.stringify(newVersion.toProsemirrorDoc());
        state.currentVersionID = newVersionID;
        state.currentVersionLabel = newVersion.label;
    },
    prepare: (
        owner: string,
        title: string,
        label: string,
        description: string,
    ) => {
        return {
            payload: {
                owner,
                title,
                label,
                description,
            },
        };
    },
};

export const restoreVersionByID = (state, action: PayloadAction<string>) => {
    //steps to reboot editor
    const versionToRestore = state.versions.find(
        (version) => version.versionID === action.payload,
    );
    if (!versionToRestore) return;
    state.currentVersionID = action.payload;
    state.currentVersionLabel = versionToRestore.label;

    state.doc = JSON.stringify(versionToRestore.toProsemirrorDoc());
    state.title = versionToRestore.title;
};

export const restoreVersionPrep = (state, action: PayloadAction<string>) => {
    console.log(action.payload);
};

export const addRemoteVersion = (state, action: PayloadAction<Replica>) => {
    const versionToAdd = new Replica(
        action.payload.tree,
        action.payload.opLog,
        action.payload.id,
        action.payload.docID,
        action.payload.versionID,
        action.payload.title,
        action.payload.description,
        action.payload.label,
        action.payload.owner,
    );
    state.versions.push(versionToAdd);
};
