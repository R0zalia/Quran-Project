import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Example screens: they show how stack navigation works. Build the Quran
// screens the same way, then register them below.
import SurahListScreen from './screens/SurahListScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import { findSurah } from './lib/quranData';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0B3D2E" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SurahList"
          screenOptions={{
            headerStyle: { backgroundColor: '#0B3D2E' },
            headerTintColor: '#F5F1E6',
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: '#EEF1F8' },
          }}>
          {/* The first screen: its `name` is what navigate() and
              initialRouteName refer to, and `title` is shown in the header.. */}
          <Stack.Screen
            name="SurahList"
            component={SurahListScreen}
            options={{ title: 'Al-Quran' }}
          />
          {/* options can also be a function of the route, so the header can
              show the name of the planet that was opened. */}
          <Stack.Screen
            name="SurahDetail"
            component={SurahDetailScreen}
            options={({ route }) => ({
              title: findSurah(route.params.surahNo).name,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
