import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setInitAgain } from '../redux/actions';

class Ranking extends Component {
  toInitialPage = () => {
    const { history, dispatch } = this.props;
    dispatch(setInitAgain());
    history.push('/');
  };

  render() {
    const ranks = JSON.parse(localStorage.getItem('ranking'));

    ranks.sort((a, b) => (a.score > b.score ? 0 - 1 : 1));

    const playersRanks = ranks.map((rank, index) => (
      <div key={ index } name={ rank.score }>
        <img src={ rank.picture } alt="gravatar-img" />
        <p data-testid={ `player-name-${index}` }>{ rank.name }</p>
        <p data-testid={ `player-score-${index}` }>{ rank.score }</p>
      </div>
    ));

    console.log(playersRanks[0].props.name);

    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        { playersRanks }
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.toInitialPage }
        >
          Início
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Ranking);
