import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLoginData } from '../redux/actions';
import fetchToken from '../services/fetchToken';
import setLocalStorage from '../services/localStorage';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    btnDisabled: true,
  };

  isButtonValid = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      this.setState({
        btnDisabled: false,
      });
    } else {
      this.setState({
        btnDisabled: true,
      });
    }
  };

  handleChange = ({ target }) => {
    const { name, value } = target;

    this.setState({
      [name]: value,
    }, () => this.isButtonValid());
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { dispatch, history } = this.props;
    const { email, name } = this.state;
    dispatch(setLoginData(email, name));
    const { token } = await fetchToken();
    setLocalStorage(token);
    history.push('/game');
  };

  render() {
    const { name, email, btnDisabled } = this.state;
    return (
      <div data-testid="login-page">
        <form onSubmit={ this.handleSubmit }>
          <label htmlFor="email">
            Email
            <input
              data-testid="input-gravatar-email"
              value={ email }
              id="email"
              type="email"
              onChange={ this.handleChange }
              name="email"
            />
          </label>
          <label htmlFor="name">
            Nome
            <input
              data-testid="input-player-name"
              id="name"
              type="text"
              value={ name }
              onChange={ this.handleChange }
              name="name"
            />
          </label>
          <button
            data-testid="btn-play"
            type="submit"
            disabled={ btnDisabled }
          >
            Play
          </button>

          <Link data-testid="btn-settings" to="/settings"> Configurações </Link>

        </form>

      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Login);
