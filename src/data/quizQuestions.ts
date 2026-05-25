export interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
}

export const questions: Question[] = [
  {
    id: 1,
    subject: "Mathematics",
    question: "How interested are you in solving complex mathematical problems?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 2,
    subject: "Science",
    question: "How much do you enjoy conducting experiments and understanding scientific concepts?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 3,
    subject: "Literature",
    question: "How passionate are you about reading, writing, and analyzing texts?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 4,
    subject: "History",
    question: "How interested are you in learning about past events and their impact on society?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 5,
    subject: "Arts",
    question: "How creative do you feel when expressing yourself through art, music, or design?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 6,
    subject: "Technology",
    question: "How enthusiastic are you about working with computers and emerging technologies?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  }
];
