// src/data/quizQuestions.ts
export type Question = {
  id: string;
  text: string;
  choices: string[];
  answerIndex: number; // zero-based index of correct choice
  explanation?: string;
};

const QUESTIONS: Question[] = [
  // MEDIUM LEVEL (10)
  {
    id: "q1",
    text: "The remainder when 4587 is divided by 9 is:",
    choices: ["3", "6", "9", "0"],
    answerIndex: 1,
    explanation: "Digit sum = 4+5+8+7 = 24 → 24 mod 9 = 6.",
  },
  {
    id: "q2",
    text: "Which number is divisible by 6?",
    choices: ["242", "318", "455", "502"],
    answerIndex: 1,
    explanation: "318 is even and digit sum 3+1+8 = 12 divisible by 3.",
  },
  {
    id: "q3",
    text: "Convert 263₈ to decimal.",
    choices: ["163", "175", "179", "183"],
    answerIndex: 2,
    explanation: "2×64 + 6×8 + 3 = 128 + 48 + 3 = 179.",
  },
  {
    id: "q4",
    text: "How many 3-digit numbers are divisible by 5?",
    choices: ["90", "100", "180", "200"],
    answerIndex: 2,
    explanation: "From 100–999 there are 900 numbers; those ending in 0 or 5 are 900/5 = 180.",
  },
  {
    id: "q5",
    text: "Which of the following is composite?",
    choices: ["29", "31", "49", "53"],
    answerIndex: 2,
    explanation: "49 = 7×7, so composite.",
  },
  {
    id: "q6",
    text: "Which number gives remainder 4 when divided by 7?",
    choices: ["18", "25", "30", "32"],
    answerIndex: 1,
    explanation: "25 mod 7 = 4.",
  },
  {
    id: "q7",
    text: "Find the unit digit of 7¹³.",
    choices: ["3", "7", "9", "1"],
    answerIndex: 0,
    explanation: "Units cycle: 7,9,3,1 → 13 mod 4 = 1 → 3 (3rd in cycle).",
  },
  {
    id: "q8",
    text: "The number 65872 is divisible by 4 because:",
    choices: [
      "last digit is even",
      "last 2 digits form a number divisible by 4",
      "digit sum divisible by 4",
      "ends in 2",
    ],
    answerIndex: 1,
    explanation: "A number is divisible by 4 if its last two digits form a number divisible by 4 (72 is divisible by 4).",
  },
  {
    id: "q9",
    text: "Convert 1C₁₆ to decimal.",
    choices: ["27", "28", "29", "30"],
    answerIndex: 1,
    explanation: "1×16 + 12 = 28.",
  },
  {
    id: "q10",
    text: "Which of the following is divisible by 11?",
    choices: ["14542", "23716", "92837", "53021"],
    answerIndex: 0,
    explanation: "Alternate sum: (1+5+2)=8 and (4+4)=8 → difference 0 → divisible by 11.",
  },

  // HARD LEVEL (5)
  {
    id: "q11",
    text: "Smallest number that leaves remainder 3 when divided by 8 and remainder 2 when divided by 5:",
    choices: ["18", "33", "42", "58"],
    answerIndex: 3,
    explanation: "Solve N ≡ 3 (mod 8) and N ≡ 2 (mod 5). Smallest solution is 58.",
  },
  {
    id: "q12",
    text: "For what value of x is (123)_x = 33₁₀?",
    choices: ["4", "5", "6", "7"],
    answerIndex: 0,
    explanation: "1×x² + 2×x + 3 = 33 → x = 4.",
  },
  {
    id: "q13",
    text: "How many 4-digit numbers have digit sum equal to 10?",
    choices: ["36", "42", "45", "48"],
    answerIndex: 2,
    explanation: "Using stars & bars with leading digit ≥1 gives 45.",
  },
  {
    id: "q14",
    text: "Highest power of 2 that divides 720 is:",
    choices: ["2³", "2⁴", "2⁵", "2⁶"],
    answerIndex: 1,
    explanation: "720 = 2⁴ × 45, so 2⁴.",
  },
  {
    id: "q15",
    text: "A number 8a4b is divisible by 9. If a + b = 10, find b.",
    choices: ["1", "2", "3", "4"],
    answerIndex: 1,
    explanation: "Sum digits = 8 + a + 4 + b = 12 + (a+b) = 22. Next multiple of 9 is 27 → need +5 so b = 2 when a+b=10 (a=8, b=2 is one valid split).",
  },
];

export default QUESTIONS;
