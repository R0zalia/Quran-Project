import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { buildSections, } from '../lib/quranData';
import JuzHeader from './JuzHeader';
import SurahRow from './SurahRow';



export default function SurahListScreen({navigation})
{
    return(
        <View testID="surah-list-screen" style={styles.screen}>
            
            <SectionList
            testID="surah-section-list"
           
            sections = {buildSections()}     
            keyExtractor = { surah => String(surah.id)}
            renderSectionHeader = { ({section : juz}) => (   
                <JuzHeader juz = {juz}/>     
            )}
            renderItem = { ({item: surah, section: juz}) =>   
                 <SurahRow surah = {surah} juzNo ={juz.juzNo} navigation = {navigation}/>  

        }
            stickySectionHeadersEnabled
        />
        

        </View>
    );
}


const styles = StyleSheet.create(
    {
    screen: { flex: 1, backgroundColor: '#F5F1E6'},

  
}
);

