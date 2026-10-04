import React from 'react';
import { FlatList, View, Pressable, Text, StyleSheet } from 'react-native';

import { allPlanets, formatMoons } from '../lib/planetData';
import { FONTS } from '../theme/fonts';

// EXAMPLE SCREEN: a FlatList built from JSON, where each row opens another
// screen. Every screen the stack renders is given a `navigation` prop.
//
// A FlatList takes one flat array. The Quran list is grouped by juz, which is
// what a SectionList is for, so that screen is built differently.
//
// It is also where the bundled fonts are shown: the styles below set
// `fontFamily` from src/theme/fonts.js. The Quran screens need the same three
// families, so read how the rows here do it.
export default function PlanetListScreen({ navigation }) {
  return (
    <FlatList
      style={styles.screen}
      data={allPlanets()}
      // A key must be a string, and unique in the list. Each planet appears
      // once, so its id is enough.
      keyExtractor={planet => String(planet.id)}
      renderItem={({ item }) => (
        <Pressable
          // navigate(routeName, params): the params object is handed to the
          // next screen as `route.params`. Send only what it needs to find
          // the planet, here its id.
          onPress={() =>
            navigation.navigate('PlanetDetail', { planetId: item.id })
          }
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
          <View style={styles.order}>
            <Text style={styles.orderText}>{item.id}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.name}>{item.name}</Text>
            {/* Two fields joined into one line of text. */}
            <Text style={styles.meta}>
              {`${item.type} · ${formatMoons(item.moons)}`}
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF1F8' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D5DBEA',
  },
  rowPressed: { backgroundColor: '#E1E6F3' },
  order: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0B1026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderText: {
    fontSize: 14,
    fontFamily: FONTS.serif,
    fontWeight: '700',
    color: '#E8ECF8',
  },
  body: { flex: 1 },
  
  name: {
    fontSize: 17,
    fontFamily: FONTS.serifSemiBold,
    fontWeight: '600',
    color: '#1B2550',
  },
  meta: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: FONTS.serif,
    color: '#5E6886',
  },
  arrow: { fontSize: 24, color: '#5B6CFF' },
});
