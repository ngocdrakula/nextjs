import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../../lang.config';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import { translate } from '../../../utils/language';



class CautionAdmin extends Component {

    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_EXHIBITOR_LOGOUT });
    }

    render() {
        const { exUser, user } = this.props;
        const currentUser = exUser || user;
        if (user.mode === MODE.admin && exUser)
            return (
                <div className="callout callout-info">
                    <p>
                        <strong><i className="icon ion-md-nuclear" /> {translate(langConfig.app.Caution)}! </strong>
                        {translate(langConfig.app.YouAreLoggedInto)} <b>{currentUser?.name}</b>{translate(langConfig.app.BeCarefulWhenTakingActionFromThisAccount)}.
                        <a href="#" className="nav-link pull-right logout-link" onClick={this.handleLogout}>
                            <i className="fa fa-sign-out" title={translate(langConfig.app.Logout)} />
                        </a>
                    </p>
                </div>
            );
        return null;
    }
}

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(CautionAdmin)
