// EXAMPLE HELPERS for the planet screens. Read them, then write your own
// quranData.js for the Quran screens: the data is shaped differently, so these
// functions will not work there as they are.

// A .json import is already an object: Metro parses it when it bundles the app.
import solarSystem from '../data/planets.json';

// planets.json has two tables:
//   planets  - each planet once, with its facts
//   missions - each mission once, with the planets it reached:
//              visits: [{ planetId, year, kind }]
// A visit names a planet only by its id, so the name, image and facts are
// always looked up in `planets`. Nothing about a planet is written twice.

export function allPlanets(source = solarSystem) {
  return source.planets;
}

// find() returns the first match, or undefined when there is none.
export function findPlanet(planetId, source = solarSystem) {
  return source.planets.find(planet => planet.id === planetId);
}

// The join, going the other way: start from one planet and collect every
// mission that reached it. One mission can reach several planets, so a mission
// can hold more than one visit, and we keep the one for this planet.
//
//   visitsToPlanet(6) ->
//   [{ missionId: 'voyager-1', name: 'Voyager 1', agency: 'NASA', year: 1980, kind: 'Flyby' }, ...]
export function visitsToPlanet(planetId, source = solarSystem) {
  const visits = [];
  source.missions.forEach(mission => {
    const visit = mission.visits.find(v => v.planetId === planetId);
    if (visit) {
      visits.push({
        missionId: mission.missionId,
        name: mission.name,
        agency: mission.agency,
        year: visit.year,
        kind: visit.kind,
      });
    }
  });
  // Oldest first. sort() changes the array it is called on, which is fine
  // here: `visits` is a new array, not the one inside the JSON.
  return visits.sort((a, b) => a.year - b.year);
}

// ---- Turning numbers from the JSON into text for a <Text> -----------------

// 142984 -> "142,984". A regex puts a comma before every group of three digits.
export function withCommas(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Singular or plural, and a word instead of "0".
export function formatMoons(count) {
  if (count === 0) {
    return 'No moons';
  }
  return `${count} ${count === 1 ? 'moon' : 'moons'}`;
}

// Short days read best in hours, long ones in Earth days.
export function formatDay(hours) {
  if (hours < 48) {
    return `${hours} hours`;
  }
  return `${Math.round(hours / 24)} Earth days`;
}

// toFixed(1) keeps one decimal place and returns a string: 11.86 -> "11.9".
export function formatYear(days) {
  if (days < 730) {
    return `${days} Earth days`;
  }
  return `${(days / 365.25).toFixed(1)} Earth years`;
}
