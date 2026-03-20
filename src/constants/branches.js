export const BRANCHES = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    code: 'CSE',
    icon: '💻',
    color: '#1D4ED8',
  },
  {
    id:'csd',
    name: 'Computer Science & Data Science',
    shortName: 'CSD',
    code: 'CSD',
    icon: '🎨',
    color: '#0c1c72',
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    code: 'ECE',
    icon: '📡',
    color: '#7C3AED',
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics Engineering',
    shortName: 'EEE',
    code: 'EEE',
    icon: '⚡',
    color: '#D97706',
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'MECH',
    code: 'ME',
    icon: '⚙️',
    color: '#DC2626',
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortName: 'CIVIL',
    code: 'CE',
    icon: '🏗️',
    color: '#059669',
  },
  {
    id: 'csbs',
    name: 'Computer Science & Business Systems',
    shortName: 'CSBS',
    code: 'CSBS',
    icon: '🖥️',
    color: '#0891B2',
  },
  {
    id: 'chem',
    name: 'Chemical Engineering',
    shortName: 'CHEM',
    code: 'CHE',
    icon: '🧪',
    color: '#9333EA',
  },
  {
    id: 'csm',
    name: 'Computer Science & Machine Learning',
    shortName: 'CSM',
    code: 'CSM',
    icon: '🔢',
    color: '#0284C7',
  },
  {
    id: 'BME', // ✅ fixed: added missing comma after id
    name: 'Biomedical Engineering',
    shortName: 'BME',
    code: 'BME',
    icon: '🩺',
    color: '#09f55f',
  }, // ✅ fixed: added missing comma after this entry
  {
    id: 'PHE',
    name: 'Production & Industrial Engineering',
    shortName: 'PHE',
    code: 'PHE',
    icon: '🏭',
    color: '#05e7d1',
  },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SEMESTER_LABELS = {
  1: '1st Semester',
  2: '2nd Semester',
  3: '3rd Semester',
  4: '4th Semester',
  5: '5th Semester',
  6: '6th Semester',
  7: '7th Semester',
  8: '8th Semester',
};

export const ACADEMIC_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const getBranchById = (id) => BRANCHES.find((b) => b.id === id) || null;

export const getBranchByCode = (code) =>
  BRANCHES.find((b) => b.code === code || b.shortName === code) || null;

export const BRANCH_LIST = BRANCHES.map((b) => ({
  id: b.id,
  label: b.name,
  value: b.id,
  shortName: b.shortName,
  icon: b.icon,
  color: b.color,
}));