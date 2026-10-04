import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../theme/fonts';

export default function JuzHeader({ juz }) {
  return (
    <View testID={`juz-header-${juz.juzNo}`} style={styles.header}>
        <View>
            <Text testID={`juz-title-${juz.juzNo}`} style={styles.header_title}>
        {`Juz ${juz.juzNo}`}
      </Text>
       <Text testID={`juz-name-${juz.juzNo}`} style={styles.header_name}>
        {juz.name}
      </Text>
     
        </View>
         <Text testID={`juz-arabic-${juz.juzNo}`} style={styles.header_arabic}>
        {juz.arabicName}
      </Text>
          
        

      
    </View>
  );
}

const styles = StyleSheet.create(
    {
    header:
    {
        backgroundColor: '#0F4A38',
        flexDirection: 'row',
        justifyContent: 'space-between',
paddingVertical: 10,
paddingHorizontal: 16,
borderBottomWidth: 2,
borderBottomColor: '#C9A227'
    },
    header_title:
    {
        fontSize: 17, fontWeight:
       '700', color: '#C9A227',
        fontFamily: FONTS.serif
    },
    header_arabic:
    {
        fontSize: 22, color: '#F5F1E6',
     
fontFamily: FONTS.arabic
    },
    header_name:
    {
        fontSize: 13, color:
'#F5F1E6', marginTop: 2
    }
});