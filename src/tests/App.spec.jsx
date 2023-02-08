import { screen } from '@testing-library/react';

import App from '../App';
import render from './helpers/renderWithRouterAndRedux';

describe('<App />', () => {
  it("should render Login page when url is '/'", () => {
    render(<App />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it("should render Game page when url is '/game'", () => {
    render(<App />, undefined, '/game');

    expect(screen.getByTestId('game-page')).toBeInTheDocument();
  });

  it("should render Settings page when url is '/settings'", () => {
    render(<App />, undefined, '/settings');

    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });
});
