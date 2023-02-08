import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchGravatar from '../services/fetchGravatar';

class Header extends Component {
  render() {
    const { email, name, score } = this.props;
    return (
      <div>
        <img
          data-testid="header-profile-picture"
          src={ fetchGravatar(email) }
          alt="profile-pictures"
        />
        <p data-testid="header-player-name">{name}</p>
        <p data-testid="header-score">{score}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.player.email,
  name: state.player.name,
  score: state.player.score,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Header);
