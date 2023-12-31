import { Schema, SchemaSpec } from 'prosemirror-model';
import paraSpec from '../nodes/para/para';
import ItalicSpec from '../marks/italic';
import BoldSpec from '../marks/bold';
import UnderlineSpec from '../marks/underline';
import StrikethroughSpec from '../marks/strikethrough';
import headingSpec from '../nodes/para/heading';
import blockQuoteSpec from '../nodes/struct/blockquote';
import orderedListSpec from '../nodes/list/orderedList';
import unorderedListSpec from '../nodes/list/unorderedList';
import listItemSpec from '../nodes/list/listItem';

const schemaSpec: SchemaSpec = {
    nodes: {
        para: paraSpec,
        heading: headingSpec,
        blockquote: blockQuoteSpec,
        orderedList: orderedListSpec,
        unorderedList: unorderedListSpec,
        listItem: listItemSpec,
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

export default baseSchema;
