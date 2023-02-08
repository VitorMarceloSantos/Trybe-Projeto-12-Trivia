import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Feedback extends Component {
  toRankingPage = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  playAgain = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    const { assertions, score } = this.props;
    const TWO = 2;
    return (
      <div>
        <Header />
        {
          assertions <= TWO
            ? (<span data-testid="feedback-text">Could be better...</span>)
            : (<span data-testid="feedback-text">Well Done!</span>)
        }
        <p data-testid="feedback-total-score">{score}</p>
        <p data-testid="feedback-total-question">
          { assertions }
        </p>
        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ this.toRankingPage }
        >
          Ranking
        </button>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.playAgain }
        >
          Play Again
        </button>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  assertions: store.player.assertions,
  score: store.player.score,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(Feedback);
