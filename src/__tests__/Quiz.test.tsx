import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Quiz from '../pages/Quiz';
import Results from '../pages/Results';

jest.mock('../integrations/supabase/client');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const questions = [
  "How interested are you in solving complex mathematical problems?",
  "How much do you enjoy conducting experiments and understanding scientific concepts?",
  "How passionate are you about reading, writing, and analyzing texts?",
  "How interested are you in learning about past events and their impact on society?",
  "How creative do you feel when expressing yourself through art, music, or design?",
  "How enthusiastic are you about working with computers and emerging technologies?",
];

describe('Quiz Component', () => {
  test('should not treat "Not applicable" as a low-interest score', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={['/quiz']}>
        <Routes>
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the loading to complete and the first question to appear
    await waitFor(() => {
      expect(screen.getByText(questions[0])).toBeInTheDocument();
    });

    // Answer all questions
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByLabelText('Moderately interested'));
      fireEvent.click(screen.getByText('Next'));
      // Wait for the next question to appear
      await waitFor(() => {
        expect(screen.getByText(questions[i + 1])).toBeInTheDocument();
      });
    }

    // Select "Not applicable" on the last question
    fireEvent.click(screen.getByLabelText('Not applicable'));

    // Enter marks
    fireEvent.change(screen.getByLabelText('Enter your academic marks (percentage or CGPA)'), {
      target: { value: '90' },
    });

    // Submit the quiz
    fireEvent.click(screen.getByText('Get Results'));

    // Wait for navigation to be called and assert the state is correct
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/results', {
            state: expect.objectContaining({
                answers: expect.not.objectContaining({ '5': 'not-applicable' }),
            }),
        });
    });
  });
});
