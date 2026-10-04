/**
 * SHARED TEST CASES — Lab 03, Quran Index
 *
 * These are the tests you can see and run as often as you like. They check that
 * both screens render, that every required testID exists, that the list is built
 * from quran.json, that pressing a surah asks the navigator for the detail screen,
 * and that the detail screen shows that surah. They do NOT check every rule in the
 * handout — your final mark also includes hidden tests that do. A green run here
 * does not mean the lab is finished; read the rules, not just these tests.
 *
 * The screens are rendered on their own, with no navigator: the list gets a
 * `navigation` object whose `navigate` is a jest mock, and the detail screen gets a
 * `route` with `params`. That is exactly what the stack navigator hands them in the
 * real app.
 */
import fs from 'fs';
import path from 'path';
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

/**
 * Finding the student's files.
 *
 * Each module is found by its **file name**, anywhere under `src/`, so
 * `src/screens/SurahListScreen.js` and a flat `src/SurahListScreen.js` grade
 * identically. Only the name is fixed.
 *
 * Resolution is lazy on purpose: a missing file fails the cases that need it, and
 * the Q0 case below names it, instead of stopping the whole suite loading.
 */
const SRC = path.join(__dirname, '..', 'src');

const findFile = (base, exts = ['.jsx', '.js']) => {
  const wanted = exts.map((ext) => `${base}${ext}`);
  const hits = [];
  const stack = [SRC];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      continue;
    }
    entries.forEach((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') stack.push(full);
      } else if (wanted.includes(entry.name)) {
        hits.push(full);
      }
    });
  }
  if (hits.length === 0) {
    throw new Error(
      `could not find ${wanted.join(' or ')} anywhere under src/ — ` +
        'the file name is fixed even though the folder is not',
    );
  }
  // If a student kept a copy in two places, take the shallowest.
  hits.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length);
  return hits[0];
};

const modules = {};
const load = (base, exts) => {
  if (!(base in modules)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    modules[base] = require(findFile(base, exts));
  }
  return modules[base];
};

const component = (base) => {
  const mod = load(base);
  return mod.default || mod;
};
const quran = () => {
  const mod = load('quran', ['.json']);
  return mod.default || mod;
};
const lib = (name) => {
  const mod = load('quranData');
  return mod[name];
};

const MODULES = ['SurahListScreen', 'SurahDetailScreen', 'JuzHeader', 'SurahRow', 'quranData'];

const flat = (style) => StyleSheet.flatten(style) || {};
const surahOf = (n) => quran().surahs.find((s) => s.id === n);

const renderList = async () => {
  const navigation = { navigate: jest.fn() };
  const SurahListScreen = component('SurahListScreen');
  await render(<SurahListScreen navigation={navigation} />);
  return navigation;
};

const renderDetail = async (surahNo) => {
  const SurahDetailScreen = component('SurahDetailScreen');
  return render(<SurahDetailScreen route={{ params: { surahNo } }} />);
};

// Both suites open with this. The workspace pins @testing-library/react-native
// 14, whose `render` and `fireEvent` are ASYNC. Miss an `await` and every UI case
// below fails with "render function has not been called".
test('environment: the async testing-library renders this screen', async () => {
  await renderList();
  expect(screen.toJSON()).toBeTruthy();
});

describe('Q0 the files', () => {
  test('every module the grader needs is somewhere under src/, by name', async () => {
    const missing = MODULES.filter((base) => {
      try {
        findFile(base);
        return false;
      } catch (e) {
        return true;
      }
    });
    expect(missing).toEqual([]);
  });

  test('quran.json is still under src/ and still holds 30 juz and 114 surahs', async () => {
    const data = quran();
    expect(data.juz).toHaveLength(30);
    expect(data.surahs).toHaveLength(114);
  });
});

describe('Q1 reading the JSON', () => {
  test('buildSections returns one section per juz, titled Juz 1 to Juz 30', async () => {
    const sections = lib('buildSections')();
    expect(sections).toHaveLength(30);
    expect(sections[0].title).toBe('Juz 1');
    expect(sections[29].title).toBe('Juz 30');
    sections.forEach((section) => expect(Array.isArray(section.data)).toBe(true));
  });

  test('Juz 1 holds Al-Fatihah and Al-Baqarah, with their ayah counts', async () => {
    const [juz1] = lib('buildSections')();
    expect(juz1.data.map((row) => row.name)).toEqual(['Al-Fatihah', 'Al-Baqarah']);
    expect(juz1.data[1].surahNo).toBe(2);
    expect(juz1.data[1].ayahCount).toBe(286);
  });

  test('findSurah looks a surah up by its number', async () => {
    expect(lib('findSurah')(18).name).toBe('Al-Kahf');
  });
});

describe('Q2 the list screen', () => {
  test('every fixed testID on the list screen exists', async () => {
    await renderList();
    [
      'surah-list-screen',
      'surah-section-list',
      'juz-header-1',
      'juz-title-1',
      'juz-name-1',
      'surah-row-1-1',
      'surah-number-1-1',
      'surah-name-1-1',
      'surah-ayahs-1-1',
      'surah-arabic-1-1',
      'surah-row-1-2',
    ].forEach((id) => expect(screen.getByTestId(id)).toBeTruthy());
  });

  test('a juz header reads its title and its name', async () => {
    await renderList();
    expect(screen.getByTestId('juz-title-1')).toHaveTextContent('Juz 1');
    expect(screen.getByTestId('juz-name-1')).toHaveTextContent('Alif Lam Meem');
  });

  test('a row shows the surah name and its ayah count', async () => {
    await renderList();
    expect(screen.getByTestId('surah-name-1-2')).toHaveTextContent('Al-Baqarah');
    expect(screen.getByTestId('surah-ayahs-1-1')).toHaveTextContent('7 Ayahs');
    expect(screen.getByTestId('surah-ayahs-1-2')).toHaveTextContent('286 Ayahs');
  });

  test('the list is a SectionList', async () => {
    await renderList();
    // A SectionList hands its sections down as `data`, each with its own rows.
    const list = screen.getByTestId('surah-section-list').props;
    expect(Array.isArray(list.data)).toBe(true);
    expect(list.data).toHaveLength(30);
    expect(Array.isArray(list.data[0].data)).toBe(true);
  });
});

describe('Q3 stack navigation', () => {
  test('pressing a surah navigates to SurahDetail with its number', async () => {
    const navigation = await renderList();
    await fireEvent.press(screen.getByTestId('surah-row-1-2'));
    expect(navigation.navigate).toHaveBeenCalledWith(
      'SurahDetail',
      expect.objectContaining({ surahNo: 2 }),
    );
  });

  test('App.js builds a native stack with the two named screens', async () => {
    const src = fs.readFileSync(findFile('App'), 'utf8');
    expect(src).toMatch(/createNativeStackNavigator/);
    expect(src).toMatch(/name\s*=\s*["']SurahList["']/);
    expect(src).toMatch(/name\s*=\s*["']SurahDetail["']/);
  });
});

describe('Q4 the detail screen', () => {
  test('every fixed testID on the detail screen exists', async () => {
    await renderDetail(1);
    [
      'surah-detail-screen',
      'surah-title-image',
      'surah-detail-name',
      'surah-detail-meaning',
      'surah-detail-revelation',
      'surah-detail-ayahs',
      'surah-description',
      'surah-shan-e-nuzool',
    ].forEach((id) => expect(screen.getByTestId(id)).toBeTruthy());
  });

  test('it shows the surah named in route.params', async () => {
    await renderDetail(36);
    expect(screen.getByTestId('surah-detail-name')).toHaveTextContent('Ya-Sin');
    expect(screen.getByTestId('surah-detail-ayahs')).toHaveTextContent('83 Ayahs');
  });

  test('the description and the shan-e-nuzool come from quran.json', async () => {
    await renderDetail(1);
    expect(screen.getByTestId('surah-description')).toHaveTextContent(surahOf(1).description);
    expect(screen.getByTestId('surah-shan-e-nuzool')).toHaveTextContent(surahOf(1).shaneNuzool);
  });

  test('the title image is the one for this surah', async () => {
    await renderDetail(1);
    const { source } = screen.getByTestId('surah-title-image').props;
    expect(JSON.stringify(source)).toMatch(/surah-001\.png/);
  });
});

describe('Q5 the look', () => {
  test('both screens use the parchment background', async () => {
    await renderList();
    expect(flat(screen.getByTestId('surah-list-screen').props.style).backgroundColor).toBe('#F5F1E6');
    await renderDetail(1);
    expect(flat(screen.getByTestId('surah-detail-screen').props.style).backgroundColor).toBe('#F5F1E6');
  });

  test('a juz header is dark green with a gold title', async () => {
    await renderList();
    expect(flat(screen.getByTestId('juz-header-1').props.style).backgroundColor).toBe('#0F4A38');
    expect(flat(screen.getByTestId('juz-title-1').props.style).color).toBe('#C9A227');
  });

  test('Arabic names: 22 on a juz header and 20 on a row, in the Arabic font', async () => {
    await renderList();
    const header = flat(screen.getByTestId('juz-arabic-1').props.style);
    expect(header.fontSize).toBe(22);
    expect(header.color).toBe('#F5F1E6');
    expect(header.fontFamily).toBe('NotoNaskhArabic');
    const row = flat(screen.getByTestId('surah-arabic-1-1').props.style);
    expect(row.fontSize).toBe(20);
    expect(row.color).toBe('#0B3D2E');
    expect(row.fontFamily).toBe('NotoNaskhArabic');
  });

  test('titles use the serif fonts from FONTS', async () => {
    await renderList();
    expect(flat(screen.getByTestId('juz-title-1').props.style).fontFamily).toBe('NotoSerif');
    expect(flat(screen.getByTestId('surah-name-1-1').props.style).fontFamily).toBe(
      'NotoSerif-SemiBold',
    );
    await renderDetail(1);
    expect(flat(screen.getByTestId('surah-detail-name').props.style).fontFamily).toBe('NotoSerif');
  });

  test('the meaning is italic grey and the chips are parchment pills with a gold border', async () => {
    await renderDetail(1);
    const meaning = flat(screen.getByTestId('surah-detail-meaning').props.style);
    expect(meaning.fontSize).toBe(15);
    expect(meaning.fontStyle).toBe('italic');
    expect(meaning.color).toBe('#6B7B72');
    const chip = flat(screen.getByTestId('surah-detail-revelation').props.style);
    expect(chip.backgroundColor).toBe('#EFE7D3');
    expect(chip.borderColor).toBe('#C9A227');
    expect(chip.borderWidth).toBe(1);
    expect(chip.borderRadius).toBe(14);
  });

  test('the description and the shan-e-nuzool read at 15 on 23 in dark grey', async () => {
    await renderDetail(1);
    ['surah-description', 'surah-shan-e-nuzool'].forEach((id) => {
      const s = flat(screen.getByTestId(id).props.style);
      expect(s.fontSize).toBe(15);
      expect(s.lineHeight).toBe(23);
      expect(s.color).toBe('#2B3A33');
    });
  });
});
