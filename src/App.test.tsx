import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Hoist-safe mocks for Vitest (vi.mock is hoisted)
const { invokeMock } = vi.hoisted(() => ({
  invokeMock: vi.fn().mockImplementation((command: string, args?: any) => {
    if (command !== 'greet') return Promise.reject(new Error('Unknown command'));
    const name = args?.name ?? '';
    return Promise.resolve(`Hello, ${name}!`);
  }),
}));

const { toastMock, toastErrorMock } = vi.hoisted(() => ({
  toastMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: invokeMock,
}));

vi.mock('sonner', () => ({
  toast: Object.assign((...args: any[]) => toastMock(...args), {
    error: (...args: any[]) => toastErrorMock(...args),
  }),
}));

// Mock shadcn utils used by Button (alias @ -> src)
const { cnMock } = vi.hoisted(() => ({
  cnMock: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('@/lib/utils', () => ({
  cn: cnMock,
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    invokeMock.mockClear();
    toastMock.mockClear();
    toastErrorMock.mockClear();
  });

  it('renders the main UI elements', () => {
    render(<App />);

    // Headline and description
    expect(screen.getByText('Welcome to Tauri + React')).toBeInTheDocument();
    expect(screen.getByText('Enter your name to be greeted.')).toBeInTheDocument();

    // Input and button
    expect(screen.getByPlaceholderText('Enter a name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /greet/i })).toBeInTheDocument();

    // Links (basic smoke for logos/anchors)
    expect(screen.getByRole('link', { name: /vite logo/i })).toHaveAttribute(
      'href',
      'https://vitejs.dev',
    );
    expect(screen.getByRole('link', { name: /tauri logo/i })).toHaveAttribute(
      'href',
      'https://tauri.app',
    );
    expect(screen.getByRole('link', { name: /react logo/i })).toHaveAttribute(
      'href',
      'https://reactjs.org',
    );
  });

  it('submits the form and shows a toast with the greeting message', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a name...');
    fireEvent.change(input, { target: { value: 'Alice' } });

    fireEvent.click(screen.getByRole('button', { name: /greet/i }));

    await waitFor(() => {
      expect(invokeMock).toHaveBeenCalledWith('greet', { name: 'Alice' });
      expect(toastMock).toHaveBeenCalledWith('Hello, Alice!');
    });
  });

  it('triggers greeting on Enter key in the input', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a name...');
    fireEvent.change(input, { target: { value: 'Bob' } });

    // Press Enter inside the input
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(invokeMock).toHaveBeenCalledWith('greet', { name: 'Bob' });
      expect(toastMock).toHaveBeenCalledWith('Hello, Bob!');
    });
  });

  it('shows an error toast when greeting fails', async () => {
    invokeMock.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    const input = screen.getByPlaceholderText('Enter a name...');
    fireEvent.change(input, { target: { value: 'Charlie' } });

    fireEvent.click(screen.getByRole('button', { name: /greet/i }));

    await waitFor(() => {
      expect(invokeMock).toHaveBeenCalledWith('greet', { name: 'Charlie' });
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to greet. Please try again.');
    });
  });
});
