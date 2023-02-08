import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import render from './helpers/renderWithRouterAndRedux';

const VALID_EMAIL = 'john.doe@example.com';
const VALID_NAME = 'Jhon Doe';
const INVALID_EMAIL = '';
const INVALID_NAME = '';

describe('<Login />', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        response_code: 0,
        response_message: 'Token Generated Successfully!',
        token: 'token',
      }),
    });
  });

  it('should render an email and name input', () => {
    render(<App />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const nameInput = screen.getByRole('textbox', { name: /nome/i });

    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });

  it("should render a submit button with text 'Play'", () => {
    render(<App />);

    const playButton = screen.getByRole('button', { name: /play/i });

    expect(playButton).toBeInTheDocument();
  });

  it("should render a link button with text 'Configurações'", () => {
    render(<App />);

    const settingsButton = screen.getByRole('button', { name: /configurações/i });

    expect(settingsButton).toBeInTheDocument();
  });

  it('should redirect to \'/settings\' when settings button is clicked', () => {
    const { history } = render(<App />);

    const settingsButton = screen.getByRole('button', { name: /configurações/i });

    userEvent.click(settingsButton);

    expect(history.location.pathname).toBe('/settings');
  });

  it('should start submit button disabled', () => {
    render(<App />);

    const playButton = screen.getByRole('button', { name: /play/i });

    expect(playButton).toBeDisabled();
  });

  it('should disable play button when email is invalid and name valid', () => {
    render(<App />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const nameInput = screen.getByRole('textbox', { name: /nome/i });
    const playButton = screen.getByRole('button', { name: /play/i });

    userEvent.type(emailInput, INVALID_EMAIL);
    userEvent.type(nameInput, VALID_NAME);

    expect(playButton).toBeDisabled();
  });

  it('should disable play button when name is invalid and email valid', () => {
    render(<App />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const nameInput = screen.getByRole('textbox', { name: /nome/i });
    const playButton = screen.getByRole('button', { name: /play/i });

    userEvent.type(emailInput, VALID_EMAIL);
    userEvent.type(nameInput, INVALID_NAME);

    expect(playButton).toBeDisabled();
  });

  it('should enable play button when email and name are valid', () => {
    render(<App />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const nameInput = screen.getByRole('textbox', { name: /nome/i });
    const playButton = screen.getByRole('button', { name: /play/i });

    userEvent.type(emailInput, VALID_EMAIL);
    userEvent.type(nameInput, VALID_NAME);

    expect(playButton).toBeEnabled();
  });

  it('should update store and localStore when form is submitted', async () => {
    const { store } = render(<App />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const nameInput = screen.getByRole('textbox', { name: /nome/i });
    const playButton = screen.getByRole('button', { name: /play/i });

    userEvent.type(emailInput, VALID_EMAIL);
    userEvent.type(nameInput, VALID_NAME);
    userEvent.click(playButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('token');
      expect(store.getState().player).toEqual({
        name: VALID_NAME,
        email: VALID_EMAIL,
        score: 0,
      });
    });
  });
});
