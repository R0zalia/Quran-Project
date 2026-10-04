import React from 'react';
import { ScrollView, View, Image, Text, useWindowDimensions } from 'react-native';

import {
  findPlanet,
  visitsToPlanet,
  withCommas,
  formatMoons,
  formatDay,
  formatYear,
} from '../lib/planetData';

// EXAMPLE SCREEN: shows how a screen reads what the previous screen sent, and
// fills itself from the JSON. `route.params` is the object passed to
// navigation.navigate(); the list sent only the id, so look the planet up.
// The text is left unstyled on purpose: this screen is about the data.
export default function PlanetDetailScreen({ route }) {
  const { planetId } = route.params;
  const planet = findPlanet(planetId);
  const visits = visitsToPlanet(planetId);

  // `imageUrl` is a web address, so it goes in { uri }. An image from a URL has

  const imageSize = '100%';

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{ uri: planet.imageUrl }}
        style={{ width: imageSize, height: imageSize, resizeMode: 'contain' }}
      />

      <Text>{planet.name}</Text>
      <Text>{`Named after: ${planet.namedAfter}`}</Text>
      <Text>{`Type: ${planet.type}`}</Text>
      <Text>{`Moons: ${formatMoons(planet.moons)}`}</Text>
      <Text>{`Diameter: ${withCommas(planet.diameterKm)} km`}</Text>
      <Text>{`From the Sun: ${planet.distanceMillionKm} million km`}</Text>
      <Text>{`One day: ${formatDay(planet.dayHours)}`}</Text>
      <Text>{`One year: ${formatYear(planet.yearDays)}`}</Text>
      <Text>{`About: ${planet.description}`}</Text>

      {/* The count is visits.length, so it can never disagree with the list. */}
      <Text>{`Visited by ${visits.length}:`}</Text>
      {visits.map(visit => (
        // A list drawn with map() needs a key on its outer element.
        <View key={visit.missionId}>
          <Text>
            {`${visit.name} (${visit.agency}): ${visit.kind}, ${visit.year}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
