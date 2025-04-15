export interface BusinessFAQ {
  question: string;
  answer: string;
}

export const BUSINESS_FAQ: BusinessFAQ[] = [
  {
    question: 'What are your hours?',
    answer: 'We are open Sunday–Thursday 11am–11pm, Friday–Saturday 11am–1am.'
  },
  {
    question: 'Where are you located?',
    answer: 'We are located at 123 Main St, Portland, OR.'
  },
  {
    question: 'How do I contact you?',
    answer: 'You can call us at (555) 123-4567 or email info@sidehustlebar.com.'
  },
  {
    question: 'Do you have vegan options?',
    answer: 'Yes! We offer a variety of vegan and vegetarian menu items.'
  },
  {
    question: 'Can I book a table?',
    answer: 'Yes, you can reserve a table via our website or by calling us.'
  },
  {
    question: 'Do you host events?',
    answer: 'Absolutely! Check our events page for upcoming happenings or contact us to book your own.'
  },
  // Add more Q&A as needed
];
