import { Schema, SchemaSpec } from 'prosemirror-model';
import paraSpec from '../nodes/para/para';
import ItalicSpec from '../marks/italic';
import BoldSpec from '../marks/bold';
import UnderlineSpec from '../marks/underline';
import StrikethroughSpec from '../marks/strikethrough';
import headingSpec from '../nodes/para/heading';
import blockQuoteSpec from '../nodes/struct/blockquote';
import { addListNodes } from 'prosemirror-schema-list';

const schemaSpec: SchemaSpec = {
    nodes: {
        para: paraSpec,
        heading: headingSpec,
        blockquote: blockQuoteSpec,
        doc: {
            content: 'block+',
        },
        text: {
            group: 'inline',
        },
    },
    marks: {
        italic: ItalicSpec,
        bold: BoldSpec,
        underline: UnderlineSpec,
        strikethrough: StrikethroughSpec,
    },
};

const baseSchema = new Schema(schemaSpec);

const docSchema = new Schema({
    nodes: addListNodes(baseSchema.spec.nodes, 'para block*', 'block'),
    marks: baseSchema.spec.marks,
});

export default docSchema;
