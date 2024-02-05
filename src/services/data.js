export const programNavIgnoreTypes = [
  "Interhouse",
  "Debating",
  "Choir",
  "Competition",
  "Theatre",
  "Soiree",
  "Exhibition",
  "Expo",
  "Initiatives",
  "Prize Giving",
  "Matric Results",
];

export const animtionValue = (hasData = false) => ({
  HEADER_MAX_HEIGHT: hasData ? 303 : 235,
  HEADER_MIN_HEIGHT: 115,
  HEADER_SCROLL_DISTANCE: (hasData ? 303 : 235) - 115,
  GAME_HEADER_MAX_HEIGHT: hasData ? 303 : 265,
});
