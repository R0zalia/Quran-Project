// Bundled fonts, from src/assets/fonts (copied into android/app/src/main/assets/fonts).
//
// Android finds an asset font by FILE NAME, not by the name inside the font:
//   fontFamily 'NotoSerif' + fontWeight below '700'  -> fonts/NotoSerif.ttf
//   fontFamily 'NotoSerif' + fontWeight '700' or more -> fonts/NotoSerif_bold.ttf
// A weight of '600' is not bold to Android, so the semibold file is a family of
// its own. If a file is missing, Android silently falls back to the system font.
export const FONTS = {
  serif: 'NotoSerif', // use with fontWeight '400' or '700'
  serifSemiBold: 'NotoSerif-SemiBold', // use with fontWeight '600'
  arabic: 'NotoNaskhArabic',
};
