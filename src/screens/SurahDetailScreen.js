import React from 'react';
import { View, Text, Pressable, SectionList, StyleSheet,ScrollView,Image,Dimensions } from 'react-native';
import { buildSections, findSurah, formatAyahCount } from '../lib/quranData';
import { FONTS } from '../theme/fonts';

const surahTitleImages = {
  1: require('../assets/titles/surah-001.png'),
  2: require('../assets/titles/surah-002.png'),
  3: require('../assets/titles/surah-003.png'),
  4: require('../assets/titles/surah-004.png'),
  5: require('../assets/titles/surah-005.png'),
  6: require('../assets/titles/surah-006.png'),
  7: require('../assets/titles/surah-007.png'),
  8: require('../assets/titles/surah-008.png'),
  9: require('../assets/titles/surah-009.png'),
  10: require('../assets/titles/surah-010.png'),
  11: require('../assets/titles/surah-011.png'),
  12: require('../assets/titles/surah-012.png'),
  13: require('../assets/titles/surah-013.png'),
  14: require('../assets/titles/surah-014.png'),
  15: require('../assets/titles/surah-015.png'),
  16: require('../assets/titles/surah-016.png'),
  17: require('../assets/titles/surah-017.png'),
  18: require('../assets/titles/surah-018.png'),
  19: require('../assets/titles/surah-019.png'),
  20: require('../assets/titles/surah-020.png'),
  21: require('../assets/titles/surah-021.png'),
  22: require('../assets/titles/surah-022.png'),
  23: require('../assets/titles/surah-023.png'),
  24: require('../assets/titles/surah-024.png'),
  25: require('../assets/titles/surah-025.png'),
  26: require('../assets/titles/surah-026.png'),
  27: require('../assets/titles/surah-027.png'),
  28: require('../assets/titles/surah-028.png'),
  29: require('../assets/titles/surah-029.png'),
  30: require('../assets/titles/surah-030.png'),
  31: require('../assets/titles/surah-031.png'),
  32: require('../assets/titles/surah-032.png'),
  33: require('../assets/titles/surah-033.png'),
  34: require('../assets/titles/surah-034.png'),
  35: require('../assets/titles/surah-035.png'),
  36: require('../assets/titles/surah-036.png'),
  37: require('../assets/titles/surah-037.png'),
  38: require('../assets/titles/surah-038.png'),
  39: require('../assets/titles/surah-039.png'),
  40: require('../assets/titles/surah-040.png'),
  41: require('../assets/titles/surah-041.png'),
  42: require('../assets/titles/surah-042.png'),
  43: require('../assets/titles/surah-043.png'),
  44: require('../assets/titles/surah-044.png'),
  45: require('../assets/titles/surah-045.png'),
  46: require('../assets/titles/surah-046.png'),
  47: require('../assets/titles/surah-047.png'),
  48: require('../assets/titles/surah-048.png'),
  49: require('../assets/titles/surah-049.png'),
  50: require('../assets/titles/surah-050.png'),
  51: require('../assets/titles/surah-051.png'),
  52: require('../assets/titles/surah-052.png'),
  53: require('../assets/titles/surah-053.png'),
  54: require('../assets/titles/surah-054.png'),
  55: require('../assets/titles/surah-055.png'),
  56: require('../assets/titles/surah-056.png'),
  57: require('../assets/titles/surah-057.png'),
  58: require('../assets/titles/surah-058.png'),
  59: require('../assets/titles/surah-059.png'),
  60: require('../assets/titles/surah-060.png'),
  61: require('../assets/titles/surah-061.png'),
  62: require('../assets/titles/surah-062.png'),
  63: require('../assets/titles/surah-063.png'),
  64: require('../assets/titles/surah-064.png'),
  65: require('../assets/titles/surah-065.png'),
  66: require('../assets/titles/surah-066.png'),
  67: require('../assets/titles/surah-067.png'),
  68: require('../assets/titles/surah-068.png'),
  69: require('../assets/titles/surah-069.png'),
  70: require('../assets/titles/surah-070.png'),
  71: require('../assets/titles/surah-071.png'),
  72: require('../assets/titles/surah-072.png'),
  73: require('../assets/titles/surah-073.png'),
  74: require('../assets/titles/surah-074.png'),
  75: require('../assets/titles/surah-075.png'),
  76: require('../assets/titles/surah-076.png'),
  77: require('../assets/titles/surah-077.png'),
  78: require('../assets/titles/surah-078.png'),
  79: require('../assets/titles/surah-079.png'),
  80: require('../assets/titles/surah-080.png'),
  81: require('../assets/titles/surah-081.png'),
  82: require('../assets/titles/surah-082.png'),
  83: require('../assets/titles/surah-083.png'),
  84: require('../assets/titles/surah-084.png'),
  85: require('../assets/titles/surah-085.png'),
  86: require('../assets/titles/surah-086.png'),
  87: require('../assets/titles/surah-087.png'),
  88: require('../assets/titles/surah-088.png'),
  89: require('../assets/titles/surah-089.png'),
  90: require('../assets/titles/surah-090.png'),
  91: require('../assets/titles/surah-091.png'),
  92: require('../assets/titles/surah-092.png'),
  93: require('../assets/titles/surah-093.png'),
  94: require('../assets/titles/surah-094.png'),
  95: require('../assets/titles/surah-095.png'),
  96: require('../assets/titles/surah-096.png'),
  97: require('../assets/titles/surah-097.png'),
  98: require('../assets/titles/surah-098.png'),
  99: require('../assets/titles/surah-099.png'),
  100: require('../assets/titles/surah-100.png'),
  101: require('../assets/titles/surah-101.png'),
  102: require('../assets/titles/surah-102.png'),
  103: require('../assets/titles/surah-103.png'),
  104: require('../assets/titles/surah-104.png'),
  105: require('../assets/titles/surah-105.png'),
  106: require('../assets/titles/surah-106.png'),
  107: require('../assets/titles/surah-107.png'),
  108: require('../assets/titles/surah-108.png'),
  109: require('../assets/titles/surah-109.png'),
  110: require('../assets/titles/surah-110.png'),
  111: require('../assets/titles/surah-111.png'),
  112: require('../assets/titles/surah-112.png'),
  113: require('../assets/titles/surah-113.png'),
  114: require('../assets/titles/surah-114.png'),
};

export default function SurahDetailScreen({route}){
  const {surahNo} = route.params;
  const surah = findSurah(surahNo);
  
  return(
    <ScrollView testID = "surah-detail-screen" style = {styles.screen}
        contentContainerStyle = {styles.screen_content}>
        <Image testID = "surah-title-image"
        source={surahTitleImages[surahNo]}
        style= { styles.image}
      />
      <View style = {styles.surah_detail}>
        <Text testID = "surah-detail-name" style = {styles.surah_name}>
        {surah.name}
      </Text>
      <Text testID= "surah-detail-meaning" style = {styles.surah_meaning}>{surah.meaning}</Text>
       <View style = {styles.revelation_plus_count}>
         <View>
             <Text testID= "surah-detail-revelation" style = {styles.surah_revelation}>{surah.revelation}</Text>
        </View>
         <View>
            <Text testID = "surah-detail-ayahs" style = {styles.surah_revelation}>{formatAyahCount(surah.ayahCount)}</Text>
        </View>
        
      </View>

      </View>
      
      <View style = {styles.cards}>
        <View testID = "card" style = {styles.card}>
        <Text testID = "heading-about" style = {styles.heading_about}>About</Text>
        <Text testID = "surah-description" style = {styles.surah_description}>{surah.description}</Text>
      </View>
      <View testID = "card" style = {styles.card2}>
        <Text testID = "heading-shan-e-nuzool" style = {styles.heading_about}>Shan-e-Nuzool</Text>
        <Text testID = "surah-shan-e-nuzool" style = {styles.surah_description}>{surah.shaneNuzool}</Text>
      </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F5F1E6'},
    screen_content:
    {
        padding: 16, justifyContent : 'center', alignItems : 'center'
    },

    image:
    {
        width: Dimensions.get('window').width - 32,
    height: (Dimensions.get('window').width - 32) / 3,
resizeMode:
'contain', borderRadius: 12
    },
    surah_detail: {
      margin: 18
    },
    surah_name: {
        fontSize: 26, fontWeight: '700',
color: '#0B3D2E', textAlign:
'center', fontFamily: FONTS.serif
    },
    surah_meaning:{
        fontSize: 15, fontStyle:
'italic', textAlign:
'center',color: '#6B7B72'

    },
    revelation_plus_count:{
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
      marginBottom: 12

    },
    surah_revelation: {
        fontSize: 13, fontWeight: '600',
        paddingHorizontal:16,
        paddingVertical:5,
backgroundColor: '#EFE7D3',
borderColor: '#C9A227',
borderWidth: 1, borderRadius: 14
    },
    cards:{
      gap: 10
    },
    card: {
        backgroundColor: '#FFFFFF',
borderRadius: 12, padding:
16, borderLeftWidth: 4,
borderLeftColor: '#C9A227'
    },
    heading_about:
    {
        fontSize: 18, fontWeight:
'700', color: '#0F4A38',
fontFamily: FONTS.serif
    },
    surah_description: {
        fontSize: 15, lineHeight: 23,
color: '#2B3A33'
    },
    card2: {
        backgroundColor: '#FFFFFF',
        marginTop: 6,
borderRadius: 12, padding:
16, borderLeftWidth: 4,
borderLeftColor: '#C9A227'
    }



}
);
