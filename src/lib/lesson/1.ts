export const Lesson1: Step[] = [
  {
    id: 1,
    type: 'intro',
    title: "The Front Door of Your Digital Life",
    description: "Most of your online security depends on a single string of characters: your **password**. But if the door is made of paper, the lock doesn't matter.",
  },
  {
    id: 2,
    type: 'concept',
    title: "The 'Human' Problem",
    description: "Humans are predictable. We love patterns like `123456`, `password`, or our pet's name. Hackers know this and use **'Common Password Lists'** to break into accounts in milliseconds.",
  },
  {
    id: 3,
    type: 'comparison',
    title: "Brute Force vs. Dictionary Attacks",
    description: "**Brute Force** tries every possible combination ($aaa, aab, aac...$). A **Dictionary Attack** targets actual words and known leaked passwords. Both are automated and incredibly fast.",
  },
  
  {
    id: 4,
    type: 'quiz',
    title: "Entropy Check",
    description: "Which of these is harder for a computer to guess through Brute Force?",
    options: ["ILoveCoffee123", "Tr0p!c4l#Sky"],
    correctAnswer: "Tr0p!c4l#Sky",
  },
  {
    id: 5,
    type: 'concept',
    title: "The Power of Length",
    description: "Adding just **one extra character** doesn't just make a password slightly stronger—it multiplies the combinations exponentially. A 12-character password is millions of times stronger than an 8-character one.",
  },
  {
    id: 6,
    type: 'concept',
    title: "Complexity: The Secret Sauce",
    description: "Mixing **Uppercase**, **Lowercase**, **Numbers**, and **Symbols** ($\\% , ! , \#$) forces the hacker's computer to search a much larger 'search space,' slowing them down to a crawl.",
  },
  {
    id: 7,
    type: 'comparison',
    title: "Passwords vs. Passphrases",
    description: "A **Passphrase** is a string of random words (e.g., `Correct-Battery-Staple-Horse`). They are often easier for humans to remember but much harder for computers to crack because of their extreme length.",
  },
  
  {
    id: 8,
    type: 'quiz',
    title: "The Best Strategy",
    description: "What is currently considered the most secure way to handle your passwords across 50 different websites?",
    options: [
      "Use one very complex password for everything",
      "Use a unique, long passphrase for each site via a Password Manager",
      "Write them all down in a physical notebook"
    ],
    correctAnswer: "Use a unique, long passphrase for each site via a Password Manager",
  },

];