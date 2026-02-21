
import React from 'react';
import { Course, Assignment, Rubric, Submission } from './types';

export const COURSES: Course[] = [
  { id: 'cs101', name: 'CS101: Intro to Computer Science' },
  { id: 'eng202', name: 'ENG202: Advanced Composition' },
  { id: 'his303', name: 'HIS303: Modern World History' }
];

export const ASSIGNMENTS: Assignment[] = [
  { id: 'a1', name: 'The Impact of AI on Society', rubricId: 'r1' },
  { id: 'a2', name: 'Critical Analysis of King Lear', rubricId: 'r2' },
  { id: 'a3', name: 'Origins of the Cold War', rubricId: 'r1' }
];

export const RUBRICS: Rubric[] = [
  {
    id: 'r1',
    title: 'Standard Analytical Rubric',
    criteria: [
      { id: 'c1', name: 'Thesis Clarity', maxPoints: 10, description: 'Clearly stated and arguable thesis statement.' },
      { id: 'c2', name: 'Evidence Quality', maxPoints: 10, description: 'Relevant and well-integrated evidence from credible sources.' },
      { id: 'c3', name: 'Structural Logic', maxPoints: 10, description: 'Paragraphs flow logically with effective transitions.' },
      { id: 'c4', name: 'Grammar & Style', maxPoints: 10, description: 'Adherence to formal academic writing conventions.' }
    ]
  }
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    studentName: 'Alice Johnson',
    text: "The rapid integration of AI in modern workplaces has fundamentally shifted the labor market. While some argue that automation leads to job loss, it is more accurate to say that AI acts as a tool for augmentation. For example, in healthcare, AI tools assist doctors in diagnosing rare diseases with higher accuracy than ever before. However, the ethical implications of data privacy remain a major hurdle. In conclusion, we must balance efficiency with oversight."
  },
  {
    id: 's2',
    studentName: 'Bob Smith',
    text: "Artificial Intelligence is really cool. It helps with coding and writing. I think it will change everything because robots are getting smarter. Some people are scared of it but I'm not because it makes my homework easier. The main thing is that we need to use it right or things could go bad. My thesis is that AI is both good and bad."
  },
  {
    id: 's3',
    studentName: 'Charlie Davis',
    text: "The historical precedent for disruptive technology suggests that societies eventually adapt. AI is no different from the steam engine or the internet. Data from the World Economic Forum indicates that by 2025, 85 million jobs may be displaced, but 97 million new roles could emerge. This net gain suggests that the 'replacement' narrative is statistically flawed. My paper argues that educational reform is the necessary link to ensure this transition benefits all classes."
  }
];

export const COLORS = {
  primary: '#3B82F6',
  supported: '#10B981',
  partially: '#F59E0B',
  notSupported: '#EF4444',
  pending: '#94A3B8'
};
