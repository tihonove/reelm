import React, { PropTypes } from 'react';

import { Confirm, Discard } from '../reducers/confirmationReducer';

export default function ConfirmationModal({ show, text, dispatch }) {
    if (!show) {
        return <noscript />;
    }

    const onConfirm = data => dispatch({ type: Confirm, data: data });
    const onDiscard = () => dispatch({ type: Discard });

    return (<div>
            <div>{text}</div>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onDiscard}>No</button>
        </div>);
}

ConfirmationModal.propTypes = {
    show: PropTypes.bool,
    text: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
};
