import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { setAddScore, setRightQuestions } from '../redux/actions';
import fetchApi from '../services/fetchApi';
import fetchGravatar from '../services/fetchGravatar';

const ONE_SECOND = 1000;
const numberArray = 5; // tamanho do array(5)
const SCORE_EASY = 1;
const SCORE_MEDIUM = 2;
const SCORE_HARD = 3;
const NAME_CORRECT_ANSWER = 'correct-answer';

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function decodeEntity(inputStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = inputStr;
  return textarea.value;
}

class Game extends React.Component {
  state = {
    questions: [],
    numberQuestion: 0,
    timer: 30,
    answered: false,
  };

  async componentDidMount() {
    const { results, response_code: responseCode } = await fetchApi();
    const mappedResults = results.map(
      ({
        incorrect_answers: incorrectAnswers,
        correct_answer: correctAnswer,
        ...questionRest
      }) => ({
        ...questionRest,
        correctAnswer,
        answers: shuffleArray([...incorrectAnswers, correctAnswer]),
      }),
    );
    this.setState({
      questions: mappedResults,
    });
    const { history } = this.props;
    const responseCodeInvalid = 3;
    if (responseCode === responseCodeInvalid) {
      localStorage.removeItem('token');
      history.push('/');
    }
  }

  handleClick = ({ target }) => {
    const { timer, questions, numberQuestion } = this.state;
    const { dispatch } = this.props;

    let isDifficulty = questions[numberQuestion].difficulty;
    const SCORE_INCORRECT = 0;
    const SCORE_CORRECT = 10;

    if (target.name === NAME_CORRECT_ANSWER) {
      if (isDifficulty === 'easy') {
        isDifficulty = SCORE_EASY;
      }
      if (isDifficulty === 'medium') {
        isDifficulty = SCORE_MEDIUM;
      }
      if (isDifficulty === 'hard') {
        isDifficulty = SCORE_HARD;
      }
      dispatch(setRightQuestions());
    } else {
      isDifficulty = 0;
    }

    const scorePlayer = (SCORE_INCORRECT === isDifficulty ? isDifficulty : SCORE_CORRECT)
      + timer * isDifficulty;

    dispatch(setAddScore(scorePlayer));

    this.setState({
      answered: true,
      timer: 0,
    });
  };

  getStyle = (name) => {
    const style = { border: '' };
    const { answered } = this.state;
    if (answered === false) {
      return style;
    }
    if (name === NAME_CORRECT_ANSWER) {
      style.border = '3px solid rgb(6, 240, 15)';
    } else {
      style.border = '3px solid rgb(255, 0, 0)';
    }
    return style;
  };

  appointButton = (answer, index) => {
    const { questions, numberQuestion } = this.state;
    const question = questions[numberQuestion];
    return question.correctAnswer === answer
      ? NAME_CORRECT_ANSWER
      : `wrong-answer-${index}`;
  };

  nextQuestion = () => {
    const { numberQuestion } = this.state;
    const { history, name, score, email } = this.props;
    const nextNumberQuestion = numberQuestion + 1;

    if (nextNumberQuestion === numberArray) {
      const rank = JSON.parse(localStorage.getItem('ranking'));
      if (!rank) {
        localStorage.setItem('ranking', JSON.stringify([
          {
            name,
            score,
            picture: fetchGravatar(email),
          },
        ]));
      } else {
        localStorage.setItem('ranking', JSON.stringify([
          ...rank,
          {
            name,
            score,
            picture: fetchGravatar(email),
          },
        ]));
      }

      history.push('/feedback');
      return;
    }

    this.setState({
      numberQuestion: nextNumberQuestion,
      answered: false,
      timer: 30,
    });
  };

  render() {
    const { questions, numberQuestion, timer, answered } = this.state;
    const question = questions[numberQuestion];

    if (!question) return <span>Carregando...</span>;

    const isEnded = timer <= 0;

    if (!isEnded) {
      setTimeout(() => {
        this.setState((state) => ({
          timer: state.timer <= 0 ? 0 : state.timer - 1,
        }));
      }, ONE_SECOND);
    }

    return (
      <div data-testid="game-page">
        <Header />

        <div>
          <p>{`Pergunta - ${numberQuestion + 1}`}</p>
          <p data-testid="question-category">{questions[numberQuestion].category}</p>
          <p data-testid="question-text">
            {decodeEntity(questions[numberQuestion].question)}
          </p>
          <span>
            Tempo:
            {timer}
            segundos
          </span>
          <section data-testid="answer-options">
            {questions[numberQuestion].answers.map((answer, index) => (
              <button
                key={ answer }
                name={ this.appointButton(answer, index) }
                data-testid={ this.appointButton(answer, index) }
                type="button"
                onClick={ this.handleClick }
                disabled={ isEnded }
                style={ this.getStyle(this.appointButton(answer, index)) }
              >
                {answer}
              </button>
            ))}
          </section>
          {answered && (
            <button data-testid="btn-next" type="button" onClick={ this.nextQuestion }>
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  score: state.player.score,
  email: state.player.email,
  name: state.player.name,
});

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Game);
