# PokemonTeamListCreator
Creates an Open Team List/Sheet and Close Team List/Sheet from Pokémon Showdown paste

PokemonTeamListCreator - VGC Team List 

Update Patch June 2026 by Akrimlos

Target files:
1. index.html
- Add Support ID field.
- Add Pokepaste URL field.
- Add "Import Pokepaste" button.
- Add "Download JSON" button.

2. script.js
New functions:
- savePlayerData()
- loadPlayerData()
- exportJSON()
- importPokepaste()
- validateTeam()

New persisted fields:
playerName
trainerName
teamName
switchName
playerId
birth
supportId

Validation:
- Exactly 6 Pokémon
- Nature present
- Ability present
- Item present
- 4 moves maximum
- EV total <= 510

JSON schema:
{
  "player": {
    "playerName": "",
    "trainerName": "",
    "teamName": "",
    "switchName": "",
    "playerId": "",
    "birth": "",
    "supportId": ""
  },
  "team": []
}

3. PDF mapping (current VGC sheet)
Player Name
Trainer Name in Game
Battle Team Number / Name
Switch Profile Name
Player ID
Date of Birth
Support ID
Nature (Stat Alignment)
Ability
Held Item
Move1-4
Stats HP/Atk/Def/SpA/SpD/Spe

Recommended next phase:
- Challonge API
- PlayTools export

Update March 2024
- Added multi language list. Thanks a lot to Aurélien Soula (Axior)

Update December 2023:
- Added Pokémon from The Indigo Disk
- Added the ability to pass URL parameters ([Thanks to Joe Zhu](https://twitter.com/joezhuu)):
  - player=text
  - trainer=text
  - team=text
  - switch=text
  - id=text
  - dob=text (recommended use -)
  - age=Junior, Senior or Master
  - lang=chs, cht, en, es, fre, ger, ita, jpn, jpnkanji or kor

Update July 2023:
- Added Pokémon for Regulation D
- Improved file size (about x50 less disk space)
  
Pending: Special characters not allowed (for example ★)

Libraries used:

https://github.com/itsjavi/koffing


https://github.com/parallax/jsPDF
