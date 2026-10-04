import quran from '../data/quran.json';

// YOUR HELPERS for the Quran screens go here: the functions that turn
// quran.json into what the screens show. src/lib/planetData.js is a worked
// example of the idea on a different shape of data.

export function buildSections() {
    return quran.juz.map(juz => ({
        title: `Juz ${juz.juzNo}`,
        juzNo: juz.juzNo,
        name: juz.name,
        arabicName: juz.arabicName,
        data: juz.surahs.map(surahId => {
            const surah = quran.surahs.find(surah => surah.id === surahId);

            return {
                id: `${juz.juzNo}-${surahId}`,
                surahNo: surah.id,
                name: surah.name,
                arabicName: surah.arabicName,
                ayahCount: surah.ayahCount
            };
        })
    }));
}

export function findSurah(n)
{
    return quran.surahs.find(surah => surah.id === n)    
}

export function formatAyahCount(n)
{
    if(n == 0)
    {
        return 'No Ayah';
    }
    return `${n} ${n === 1 ? 'Ayah' : 'Ayahs'}`;
}