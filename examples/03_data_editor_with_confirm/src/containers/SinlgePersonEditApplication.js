import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { forwardTo } from 'reelm';

import PersonEditForm from '../components/PersonEditForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { Person, Confirmation } from '../reducers/singlePersonEditReducer';

function SinglePersonEditApplication({
    person, confirmation, dispatch }) {
    return (<div>
            <ConfirmationModal
              {...confirmation}
              dispatch={forwardTo(dispatch, Confirmation)} />
            <PersonEditForm
              person={person}
              dispatch={forwardTo(dispatch, Person)} />
        </div>);
}

SinglePersonEditApplication.propTypes = {
    person: PropTypes.object.isRequired,
    confirmation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        person: state.person,
        confirmation: state.confirmation,
    })
    )(SinglePersonEditApplication);
