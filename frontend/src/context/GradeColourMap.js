// Colours
const COLOURS = {
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
const ROPE_COLOUR_MAP = {
  '10+': COLOURS['Yellow'],
  '14': COLOURS['Blue'],
  '15': COLOURS['Blue'],
  '16': COLOURS['Purple'],
  '17': COLOURS['Purple'],
  '18': COLOURS['Green'],
  '19': COLOURS['Green'],
  '20': COLOURS['Orange'],
  '21': COLOURS['Orange'],
  '22': COLOURS['Red'],
  '23': COLOURS['Red'],
  '24': COLOURS['Black'],
  '25': COLOURS['Black'],
  '26': COLOURS['White']
};

// Put it as one since we might show ropes and boulders under one graph
export const GRADE_COLOUR_MAPPING = {
  ...COLOURS,
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