import { Plugin } from 'prosemirror-state';

const stepsPlugin = () => {
    return new Plugin({
        appendTransaction: (transactions) => {
            if (transactions.some((tr) => tr.docChanged)) {
                transactions.forEach((transaction) => {
                    if (!transaction.docChanged) return;
                    transaction.steps.forEach((step, index) => {
                        console.log(index, step.toJSON());
                    });
                });
            }
            return null;
        },
    });
};

export default stepsPlugin;
