// Colours
export const GRADE_COLOURS = {
  'Yellow': '#FFE066',   // Soft yellow
  'Blue': '#339AF0',     // Vibrant blue
  'Purple': '#845EF7',   // Pleasant purple
  'Green': '#51CF66',    // Fresh green
  'Orange': '#FFA94D',   // Warm orange
  'Red': '#FF6B6B',      // Soft red
  'Black': '#343A40',    // Deep black
  'White': '#F8F9FA'     // Clean white
};

// Apply a rope level mapping
export const ROPE_COLOUR_MAP = {
  '10+': GRADE_COLOURS['Yellow'],
  '14': GRADE_COLOURS['Blue'],
  '15': GRADE_COLOURS['Blue'],
  '16': GRADE_COLOURS['Purple'],
  '17': GRADE_COLOURS['Purple'],
  '18': GRADE_COLOURS['Green'],
  '19': GRADE_COLOURS['Green'],
  '20': GRADE_COLOURS['Orange'],
  '21': GRADE_COLOURS['Orange'],
  '22': GRADE_COLOURS['Red'],
  '23': GRADE_COLOURS['Red'],
  '24': GRADE_COLOURS['Black'],
  '25': GRADE_COLOURS['Black'],
  '26': GRADE_COLOURS['White']
};

// Put it as one since we might show ropes and boulders under one graph
export const GRADE_COLOUR_MAPPING = {
  ...GRADE_COLOURS,
  ...ROPE_COLOUR_MAP
};

// Export this specic object also for graphing
export const MIU_BAR_COLOUR_MAP = {
  type: "ordinal",
  values: Object.keys(GRADE_COLOUR_MAPPING),
  colors: Object.values(GRADE_COLOUR_MAPPING)
};

// Sorting
export const GRADE_ORDERING = [
  '10+',
  'Yellow',
  '14',
  '15',
  'Blue',
  '16',
  '17',
  'Purple',
  '18',
  '19',
  'Green',
  '20',
  '21',
  'Orange',
  '22',
  '23',
  'Red',
  '24',
  '25',
  'Black',
  '26',
  'White'
];