import os
import re
from pathlib import Path

stop_words = set(['il', 'ti', 'oh', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 
                 'e', 'ma', 'o', 'per', 'con', 'su', 'fra', 'tra', 'in', 
                 'nel', 'dello', 'della', 'dei', 'degli', 'delle', 'dal',
                 'che', 'sull', 'di', 'l', 'del', 'al'])

def process_lyrics(input_dir='[Percorso_Verso_La_Cartella_Con_I_File_Di_Testo], output_file='lyrics.csv'):
   with open(output_file, 'w', encoding='utf-8') as f:
       f.write('filename,word\n')
       for file in Path(input_dir).glob('*.txt'):
           with open(file, encoding='utf-8') as lyrics:
               text = lyrics.read().lower()
               words = re.findall(r'\w+', text)
               filtered_words = [w for w in words if w not in stop_words]
               for word in filtered_words:
                   f.write(f'{file.name},{word}\n')

# Esegui la funzione
process_lyrics()