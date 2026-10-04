# JSON and String Formatting in React Native

The **Planets** example in this starter reads all of its data from `src/data/planets.json`
and turns it into text on screen: `Gas giant · 95 moons`, `Diameter: 142,984 km`,
`One year: 11.9 Earth years`. This note covers the two skills behind that: **JSON** (what it
is, how to write it, and how JavaScript reads and writes it) and **string formatting**
(turning data into the text a `<Text>` shows). Every example below uses the planet data, so
you can open the files and see each idea at work. Your Quran screens need the same skills on
`quran.json`, which is shaped differently.

---

## Part 1 — JSON

### 1.1 What JSON is

**JSON** (*JavaScript Object Notation*) is a **text format** for data. It looks like a
JavaScript object, but it is only text. It holds no code and does nothing when it runs. Almost
every language can read and write it, so it is how apps talk to servers, save settings, and
ship data such as the planet list.

This is one planet and one mission from `planets.json`:

```json
{
  "planets": [
    {
      "id": 7,
      "name": "Uranus",
      "type": "Ice giant",
      "moons": 28,
      "diameterKm": 51118,
      "distanceMillionKm": 2867,
      "imageUrl": "https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg"
    }
  ],
  "missions": [
    {
      "missionId": "voyager-2",
      "name": "Voyager 2",
      "agency": "NASA",
      "launchYear": 1977,
      "visits": [
        { "planetId": 5, "year": 1979, "kind": "Flyby" },
        { "planetId": 7, "year": 1986, "kind": "Flyby" }
      ]
    }
  ]
}
```

### 1.2 Syntax

JSON has **six value types** and nothing else:

| Type | Example | Notes |
|---|---|---|
| string | `"Uranus"` | **double quotes only** |
| number | `28`, `-180`, `57.9`, `1e3` | no `NaN`, no `Infinity`, no leading `0` like `07` |
| boolean | `true`, `false` | lower case |
| null | `null` | the only "empty" value |
| array | `[5, 7]` | ordered list, any mix of types |
| object | `{ "planetId": 7 }` | keys **must** be double-quoted strings |

**Rules that catch people out.** JavaScript allows every item below, but JSON does not:

| ❌ Invalid JSON | ✅ Valid JSON | Why |
|---|---|---|
| `{ name: "Mars" }` | `{ "name": "Mars" }` | keys must be quoted |
| `{ 'name': 'Mars' }` | `{ "name": "Mars" }` | single quotes are not allowed |
| `[1, 2, 3,]` | `[1, 2, 3]` | no trailing comma |
| `{ "moons": 2, }` | `{ "moons": 2 }` | no trailing comma in objects either |
| `// a comment` | *(remove it)* | JSON has **no comments** |
| `{ "rings": undefined }` | `{ "rings": null }` | `undefined` does not exist in JSON |
| `{ "f": function () {} }` | *(not possible)* | no functions |
| `{ "launched": new Date() }` | `{ "launched": "1977-08-20" }` | dates are stored as strings |
| `"line one<newline>line two"` | `"line one\nline two"` | escape special characters |

**Escapes inside strings:** `\"` quote, `\\` backslash, `\n` new line, `\t` tab,
`°` any Unicode character (`°` is °). Symbols and non-English text can also be
written directly, as `"430 °C"` is in Mercury's description, or `"الفاتحة"` in `quran.json`.
The file just has to be saved as UTF-8.

> Since `planets.json` has no comments, it puts its explanation in a `"note"` field at the
> top instead. That is the usual workaround, and `quran.json` does the same.

### 1.3 Using JSON in a React Native app

**a) A JSON file bundled with the app.** Metro, the bundler, turns a `.json` import straight
into a JavaScript object. You don't need to parse it yourself:

```jsx
import solarSystem from '../data/planets.json';   // already an object

solarSystem.planets.length;              // 8
solarSystem.planets[0].name;             // "Mercury"
solarSystem.missions[0].visits[1];       // { planetId: 1, year: 1974, kind: "Flyby" }
```

The data is fixed when the app is built. To change it, you edit the file and rebuild.

**b) JSON from a server.** `fetch` gives you a response, and `.json()` reads its body and
parses it:

```jsx
const res = await fetch('https://api.example.com/planets');
const planets = await res.json();      // parses the body text into an object
```

The planet **photos** do come from a server, but they are images, not JSON: the JSON only
holds their addresses (`imageUrl`), and `<Image source={{ uri: planet.imageUrl }} />`
downloads each one. Lab 03's data is bundled, so the lab does not use `fetch`.

**c) JSON in storage.** AsyncStorage can only store **strings**, so you convert the data to
text before saving it and back again after loading (Assignment 03 does this):

```jsx
await AsyncStorage.setItem('favourites', JSON.stringify([3, 6]));   // "[3,6]"
const raw = await AsyncStorage.getItem('favourites');               // "[3,6]" or null
const favourites = raw === null ? [] : JSON.parse(raw);             // [3, 6]
```

**d) Keep each thing once, and join where you need it.** Don't copy data into components,
and don't repeat it inside the JSON. `planets.json` writes each planet's facts **once**, in
`planets`. A mission does not repeat them: its `visits` name a planet only by `planetId`.
When the detail screen wants "who visited this planet", `visitsToPlanet()` in
`src/lib/planetData.js` joins the two tables:

```js
export function visitsToPlanet(planetId, source = solarSystem) {
  const visits = [];
  source.missions.forEach(mission => {
    const visit = mission.visits.find(v => v.planetId === planetId);
    if (visit) {
      visits.push({ missionId: mission.missionId, name: mission.name,
                    agency: mission.agency, year: visit.year, kind: visit.kind });
    }
  });
  return visits.sort((a, b) => a.year - b.year);
}

visitsToPlanet(7);
// [{ missionId: 'voyager-2', name: 'Voyager 2', agency: 'NASA', year: 1986, kind: 'Flyby' }]
```

The result is a **new** array in the shape the screen wants, and the JSON is left as it
was. `quran.json` is split into two tables in the same way (each juz lists only surah ids,
`"surahs": [1, 2]`), but its join runs in a different direction and a `SectionList` needs a
different shape, so work that one out yourself.

### 1.4 Pros and cons

| ✅ Pros | ❌ Cons |
|---|---|
| Easy for people to read and write | No comments, so you can't leave notes in it |
| Built into JavaScript (`JSON.parse` / `JSON.stringify`) | Very strict: one trailing comma breaks the whole file |
| Every language and every API supports it | Only six types, so no `Date`, `Map`, `Set`, `undefined` or functions |
| Maps directly onto JS objects and arrays | Wordy: every key is repeated in every object |
| Works everywhere as plain text: files, HTTP, storage | Bigger and slower than binary formats for large data |
| Nesting fits real data (a mission contains its visits) | Nothing checks the shape: a typo such as `"diamterKm"` still parses, and the screen just shows `undefined` |
| Easy to keep in git and compare versions | A bundled JSON file is loaded into memory all at once, so very large files make the app slower to start |

### 1.5 JSON functions and the tools used with them

#### `JSON.parse(text)` — text → value

```js
JSON.parse('{"name":"Mars","moons":2}');   // { name: 'Mars', moons: 2 }
JSON.parse('[3, 6]');                      // [3, 6]
JSON.parse('true');                        // true
JSON.parse('null');                        // null

JSON.parse("{'name':'Mars'}");  // ❌ throws SyntaxError (single quotes)
JSON.parse(undefined);          // ❌ throws SyntaxError
JSON.parse('');                 // ❌ throws SyntaxError
```

**`JSON.parse` throws on bad input, so wrap it** whenever the text comes from outside your
code (storage, a server, the user):

```js
export function safeParse(text, fallback) {
  try {
    return text == null ? fallback : JSON.parse(text);
  } catch (e) {
    return fallback;          // bad text should not crash the app
  }
}

safeParse('{not json', []);   // []
```

**The reviver** (optional second argument) lets you change values as they are read. For
example, you can turn date strings back into `Date` objects:

```js
const mission = JSON.parse(text, (key, value) =>
  key === 'launched' ? new Date(value) : value,
);
```

#### `JSON.stringify(value)` — value → text

```js
JSON.stringify({ planetId: 7, name: 'Uranus' });
// '{"planetId":7,"name":"Uranus"}'

JSON.stringify({ planetId: 7, rings: undefined });
// '{"planetId":7}'           undefined values are dropped

JSON.stringify({ planetId: 7, name: 'Uranus' }, null, 2);
// the same, spread over lines with 2-space indents: handy for console.log
```

#### Working with parsed data

After parsing, JSON is just normal arrays and objects, and these are the functions you
will use most:

```js
const { planets, missions } = solarSystem;          // destructuring: two names at once

planets.find(p => p.id === 4);                      // one item (Mars), or undefined
planets.filter(p => p.type === 'Gas giant');        // every match: [Jupiter, Saturn]
planets.map(p => p.name);                           // ['Mercury', 'Venus', ...]
planets.some(p => p.moons > 100);                   // true / false (true: Saturn)
planets.reduce((sum, p) => sum + p.moons, 0);       // 416
missions.forEach(m => console.log(m.name));         // runs once per item, returns nothing

// Two steps chained: every mission that reached Jupiter, by name.
missions
  .filter(m => m.visits.some(v => v.planetId === 5))
  .map(m => m.name);
// ['Pioneer 10', 'Voyager 1', 'Voyager 2', 'Galileo', 'Cassini-Huygens', 'Juno']
```

| Function | Gives back | Use it when |
|---|---|---|
| `find` | the first match, or `undefined` | you want **one** item, by its id |
| `filter` | a new array (maybe empty) | you want **every** item that matches |
| `map` | a new array, same length | you want each item turned into something else |
| `some` | `true` / `false` | you only need to know **whether** one matches |
| `reduce` | one value | you want a total, a count, or one object built from many |
| `forEach` | nothing | you want to do something for each item, as `visitsToPlanet` does |

`find` returning `undefined` is the usual cause of `Cannot read property 'name' of
undefined`: an id that matches nothing, or a number compared with a string
(`'4' === 4` is `false`). A `route.params` id keeps its type, so send the number.

---

## Part 2 — String formatting in React Native

### 2.1 The one rule: text goes inside `<Text>`

On the web you can put a string straight inside a `<div>`. In React Native **every string
must be inside a `<Text>`**. Otherwise the app stops with:

> `Text strings must be rendered within a <Text> component.`

```jsx
<View>Mars</View>                    // ❌ crashes
<View><Text>Mars</Text></View>       // ✅
```

### 2.2 Building strings

**Template literals** (backticks) are the cleanest way to build a string:

```jsx
const size  = `${planet.diameterKm} km`;                        // "6792 km"
const line  = `${planet.type} · ${planet.moons} moons`;         // "Terrestrial · 2 moons"
const visit = `${visit.name} (${visit.agency}): ${visit.kind}, ${visit.year}`;
                                                                // "Voyager 2 (NASA): Flyby, 1986"
const names = `Visited by ${visits.map(v => v.name).join(', ')}`;
                                                                // "Visited by Viking 1, Mangalyaan, ..."
```

Joining with `+` works too, but it's harder to read:

```jsx
planet.type + ' · ' + planet.moons + ' moons';      // same result
```

Anything can go inside `${ }`, including maths, function calls and conditions:

```jsx
`${count} ${count === 1 ? 'moon' : 'moons'}`              // "1 moon" / "95 moons"
`${(planet.yearDays / 365.25).toFixed(1)} Earth years`    // "11.9 Earth years"
`${Math.round(planet.dayHours / 24)} Earth days`          // "176 Earth days"
```

### 2.3 Numbers into text

A number from the JSON usually needs work before it reads well:

```js
(11.8576).toFixed(1);                   // "11.9"   a string, with exactly 1 decimal place
Math.round(175.94);                     // 176
String(142984);                         // "142984"
String(142984).replace(/\B(?=(\d{3})+(?!\d))/g, ',');   // "142,984"
```

The last line is `withCommas()` in `planetData.js`. The pattern finds every place inside the
number that has a multiple of three digits after it, and puts a comma there.
`(142984).toLocaleString()` does the same on many devices, but not on every Android build, so
the example writes it out.

Choosing the **unit** is formatting too. `formatDay()` shows short days in hours and long
ones in Earth days, because "4222.6 hours" means little to a reader:

```js
export function formatDay(hours) {
  if (hours < 48) {
    return `${hours} hours`;                      // "9.9 hours"
  }
  return `${Math.round(hours / 24)} Earth days`;  // "176 Earth days"
}
```

### 2.4 Strings in JSX

```jsx
<Text>{planet.name}</Text>                             // a value
<Text>Moons: {planet.moons}</Text>                     // text and a value side by side
<Text>{`Moons: ${planet.moons}`}</Text>                // one string (easier to test)
<Text>{planet.name}{' '}({planet.type})</Text>         // {' '} adds a space you can see
<Text>{'Line one\nLine two'}</Text>                    // \n works inside {' '}, not in plain JSX text
```

> **Why the example uses one string:** `<Text>Moons: {planet.moons}</Text>` becomes **two**
> text pieces, `"Moons: "` and `"28"`. It looks the same on screen, but a test that looks for
> the exact text `"Moons: 28"` has an easier job when it's a single string:
> `<Text>{`Moons: ${planet.moons}`}</Text>`. The lab's tests look for exact text too.

**Styling part of a string:** put a `<Text>` inside another `<Text>`:

```jsx
<Text>
  Type: <Text style={{ fontWeight: '700' }}>{planet.type}</Text>
</Text>
```

**Showing something only sometimes:** watch out for `0`:

```jsx
{hasRings && <Text>Has rings</Text>}                 // ✅ hasRings is a boolean
{planet.moons && <Text>{planet.moons} moons</Text>}  // ❌ Mercury has 0 moons: this renders "0" outside a Text and crashes
{planet.moons > 0 && <Text>{planet.moons} moons</Text>} // ✅
```

`formatMoons()` avoids the question altogether: it always returns a string, and for `0`
that string is `"No moons"`.

**Long text:** cut it off instead of letting it wrap:

```jsx
<Text numberOfLines={2} ellipsizeMode="tail">{planet.description}</Text>
```

### 2.5 A list of strings from an array

A few items that are not worth a `FlatList` can be drawn with `map()`. Each element needs a
`key` that is unique among its siblings, the same job `keyExtractor` does for a list:

```jsx
<Text>{`Visited by ${visits.length}:`}</Text>
{visits.map(visit => (
  <View key={visit.missionId}>
    <Text>{`${visit.name} (${visit.agency}): ${visit.kind}, ${visit.year}`}</Text>
  </View>
))}
```

Use `visits.length` for the count rather than typing a number, so the heading can never
disagree with the list under it. For a long list, or one that is the whole screen, use a
`FlatList` (as `PlanetListScreen` does) or a `SectionList`: they only draw the rows that are on
screen.

### 2.6 Handy string methods

```js
'mars'.toUpperCase();                  // "MARS"
'  Venus  '.trim();                    // "Venus"
'Cassini-Huygens'.includes('Huy');     // true
'Cassini-Huygens'.startsWith('Cas');   // true
'Gas giant'.replace('Gas ', '');       // "giant"
'voyager-2'.replaceAll('-', ' ');      // "voyager 2"
'Neptune'.slice(0, 3);                 // "Nep"
'NASA / ESA / ASI'.split(' / ');       // ["NASA", "ESA", "ASI"]
['Voyager', 2].join(' ');              // "Voyager 2"
String(7).padStart(3, '0');            // "007"   (e.g. surah-001.png ... surah-114.png)
'Uranus'.length;                       // 6
```

**Search that ignores upper/lower case**, as in a planet search box:

```js
const q = query.trim().toLowerCase();
planets.filter(p => p.name.toLowerCase().includes(q));
```

### 2.7 Put formatting in one function

If the same format appears in more than one place, write it **once** as a function and reuse
it. `formatMoons()` is used by both planet screens:

```js
// src/lib/planetData.js
export function formatMoons(count) {
  if (count === 0) {
    return 'No moons';
  }
  return `${count} ${count === 1 ? 'moon' : 'moons'}`;
}
```

```jsx
// src/screens/PlanetListScreen.js
<Text>{`${item.type} · ${formatMoons(item.moons)}`}</Text>

// src/screens/PlanetDetailScreen.js
<Text>{`Moons: ${formatMoons(planet.moons)}`}</Text>
```

This has three benefits:
- **One place to change it.** If the format changes to `28 known moons`, you edit one line.
- **Easy to test.** `expect(formatMoons(1)).toBe('1 moon')` needs no screen.
- **Tidy components.** They show data; they don't build text.

The Quran screens repeat formats too. Decide which ones, and give each its own function in
`quranData.js`.

### 2.8 Arabic and right-to-left text

The planet example is all English, but `quran.json` is not:

- A string such as `"الفاتحة"` displays correctly by itself. You don't need to do anything.
- Use a font that has Arabic letters (the starter bundles **Noto Naskh Arabic**, named in
  `src/theme/fonts.js`) with `fontFamily`. On Android the font is found by its **file name**.
- In a row that mixes English and Arabic, align the Arabic text yourself (`textAlign: 'right'`
  or put it at the end of a `flexDirection: 'row'`).

---
