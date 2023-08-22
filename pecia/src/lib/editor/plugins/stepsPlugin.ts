import { Plugin } from 'prosemirror-state';

const stepsPlugin = () => {
    return new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
            if (transactions.some((tr) => tr.docChanged)) {
                transactions.forEach((transaction) => {
                    transaction.steps.forEach((step) => {
                        const json = step.toJSON();
                        console.log(step.toJSON());
                        if (json.from) {
                            const resolvedPosOld = oldState.doc.resolve(
                                json.from
                            );
                            const resolvedPosNew = newState.doc.resolve(
                                json.from
                            );

                            console.log(resolvedPosNew);
                            console.log(resolvedPosOld);
                            console.log(resolvedPosOld.parent);
                        }
                    });
                });
            }
            return null;
        },
    });
};

export default stepsPlugin;
