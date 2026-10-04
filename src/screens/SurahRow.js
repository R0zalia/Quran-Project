import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { formatAyahCount } from '../lib/quranData';
import { FONTS } from '../theme/fonts';

export default function SurahRow({surah, juzNo, navigation})
{
    return(
        <Pressable

        onPress={() =>
                  navigation.navigate('SurahDetail', { surahNo: surah.surahNo })   
                }
        testID = {`surah-row-${juzNo}-${surah.surahNo}`}
        style={styles.row}>
            
                <View style = {styles.surahDetails_plus_surahNo}>
                    <View style = {styles.surah_id_ring}>
                         <Text testID = {`surah-number-${juzNo}-${surah.surahNo}`} style ={styles.surah_number}> {surah.surahNo} </Text>
                    </View>
                    <View>
                         <Text testID = {`surah-name-${juzNo}-${surah.surahNo}`} style = {styles.surah_name}> {surah.name} </Text>
                        <Text testID = {`surah-ayahs-${juzNo}-${surah.surahNo}`} style = {styles.surah_ayahs}> {formatAyahCount(surah.ayahCount)} </Text>
                    </View>
                </View>
                <Text testID = {`surah-arabic-${juzNo}-${surah.surahNo}`} style = {styles.surah_arabic}> {surah.arabicName} </Text>         
           
        
</Pressable>
    )
    
}

const styles = StyleSheet.create(
    {
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            
    backgroundColor: '#FFFFFF',
paddingVertical: 12,
paddingHorizontal: 16,

borderBottomWidth: 1,
borderBottomColor: '#E4DCC8'
  },
  surahDetails_plus_surahNo: {
    flexDirection: 'row',
  },
  surah_id_ring: {
    width: 40, height:
40, borderRadius: 20,
borderWidth: 2, borderColor:
'#C9A227', alignItems:
'center', justifyContent:
'center', marginRight: 12
  },
  surah_number: {
    fontSize: 14, fontWeight:
'700', color: '#0B3D2E'
  },
  surah_name: {
    fontSize: 16, fontWeight:
'600', color: '#0B3D2E',
fontFamily: FONTS.serifSemiBold
  },
  
  surah_arabic: {
    fontSize: 20, color: '#0B3D2E',
    textAlign: 'right',
fontFamily: FONTS.arabic
  },
  surah_ayahs: {
    fontSize: 13, color: '#6B7B72'
  }
    }
);


