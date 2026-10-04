# Lab 03 starter — Quran Index (JSON · SectionList · Stack Navigation)

A complete React Native project that already runs. It opens on a small **Planets** app:
an example of reading a JSON file, listing it, and opening a detail screen on a stack.
Your job is to build the **Quran index** from `src/data/quran.json`, following the rules
in the lab handout, `lab-03.pdf`, which is in this repo.

```
npm install
npm run android
npm test            # the shared suite: it fails until you build the Quran screens
```

## What is already here

```
src/
├── App.js                        the stack navigator, with the two planet screens registered
├── data/
│   ├── planets.json              example data: 8 planets and 14 missions
│   └── quran.json                YOUR data: 30 juz and 114 surahs. Do not edit it.
├── lib/
│   ├── planetData.js             example helpers: find, join, and format the planet data
│   └── quranData.js              YOUR helpers go here (it only imports quran.json so far)
├── screens/
│   ├── PlanetListScreen.js       example: a FlatList whose rows open the detail screen,
│   │                             and where the bundled fonts are used
│   └── PlanetDetailScreen.js     example: reads route.params and fills itself from the JSON
├── theme/fonts.js                the three font family names, and how Android finds them
└── assets/
    ├── fonts/                    NotoSerif, NotoSerif-SemiBold, NotoNaskhArabic (+ licence)
    └── titles/
        ├── surah-001.png … 114.png   the 114 surah title banners
        └── titleImages.js            { 'surah-001.png': require('./surah-001.png'), … }
JSON-AND-STRINGS.md               how JSON and string formatting work, with examples
__tests__/shared.test.js          the tests you can see
lab-03.pdf                        the lab handout: every rule, testID and style you are graded on
```

The grader finds your files by **name** anywhere under `src/`, so the folders are up to you.

## Read the example first

`planets.json` is split into **two tables**, the same idea as `quran.json`, where each juz
lists surah ids and the surahs' details are in their own table:

```json
{ "missions": [{ "missionId": "voyager-2", "name": "Voyager 2", "agency": "NASA",
                 "visits": [{ "planetId": 7, "year": 1986, "kind": "Flyby" }] }],
  "planets":  [{ "id": 7, "name": "Uranus", "type": "Ice giant", "moons": 28,
                 "diameterKm": 51118, "imageUrl": "https://…", "description": "…" }] }
```

A mission names a planet only by its `planetId`, so each planet's facts are written once.
To show "who visited Uranus", `visitsToPlanet()` in `planetData.js` goes through every
mission and keeps the visit whose `planetId` matches. In `quran.json` a juz holds
`"surahs": [1, 2]`: work out how to turn each of those ids into the surah it names.

The example is deliberately **not** the lab with the names changed:

| | Planets example | Quran lab |
|---|---|---|
| List | `FlatList`, one flat array | `SectionList`, rows grouped under a header per juz |
| Join | from one planet to the missions that visited it | from each juz's surah ids to the surahs' details |
| Row key | the planet's `id` | must stay unique when a surah appears in more than one juz |
| Image | a web address, `{ uri: planet.imageUrl }` | a bundled PNG, looked up in `titleImages.js` |

So read how each piece works, then write the Quran version yourself.

## Where to start

1. Write your helpers in `src/lib/quranData.js`.
2. Add `SurahListScreen.js` and `SurahDetailScreen.js` (and the components the handout asks
   for), using the testIDs and styles from the handout.
3. Register the two Quran screens in `App.js` and make the list the first screen. You can
   delete the planet screens when yours work, or keep them to refer back to.

`titleImages.js` exists because Metro only packages images named in a literal
`require('./surah-001.png')`. A path read from JSON while the app is running is never
bundled, so each surah's `titleImage` in `quran.json` is the key you look up in that map.
