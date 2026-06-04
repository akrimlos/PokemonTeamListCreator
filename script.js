// VGC PATCH 2026 - FIXED GRID ALIGNMENT & LEVEL 50

document.addEventListener('DOMContentLoaded', ()=>{

 const sid=document.getElementById('supportId');

 if(sid){ sid.value=localStorage.getItem('supportId')||''; sid.addEventListener('change',()=>localStorage.setItem('supportId',sid.value));}

 ['playerName','trainerName','teamName','switchName','playerId','birth'].forEach(id=>{

   const e=document.getElementById(id);

   if(e){

      e.value=e.value||localStorage.getItem(id)||'';

      e.addEventListener('change',()=>localStorage.setItem(id,e.value));

   }

 });

});



window.exportJSON=function(){

 const data={

   player:{

    playerName:document.getElementById('playerName')?.value||'',

    trainerName:document.getElementById('trainerName')?.value||'',

    teamName:document.getElementById('teamName')?.value||'',

    switchName:document.getElementById('switchName')?.value||'',

    playerId:document.getElementById('playerId')?.value||'',

    birth:document.getElementById('birth')?.value||'',

    supportId:document.getElementById('supportId')?.value||''

   },

   showdown:document.getElementById('paste')?.value||''

 };

 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});

 const a=document.createElement('a');

 a.href=URL.createObjectURL(blob);

 a.download='team-registration.json';

 a.click();

}



'use strict'



import { Koffing } from './koff.mjs';



const urlParams = new URLSearchParams(window.location.search);

const setIfExists = (id, param) => {

    const value = urlParams.get(param);

    const el = document.getElementById(id);



    if (value !== null && el) {

        el.value = value;

    }

};



setIfExists('playerName', 'player');

setIfExists('trainerName', 'trainer');

setIfExists('teamName', 'team');

setIfExists('switchName', 'switch');

setIfExists('playerId', 'id');

setIfExists('birth', 'dob');



const age = urlParams.get('age');

if (age) {

    const ageEl = document.getElementById(age);

    if (ageEl) ageEl.checked = true;

}



const lang = urlParams.get('lang');

if (lang) {

    const langEl = document.getElementById(lang);

    if (langEl) langEl.checked = true;

}



const langFiles = [

    "./Resources/Pokes/Pokes",
    "./Resources/Abilities/Abilities",
    "./Resources/Items/Items",
    "./Resources/Moves/Moves",
    "./Resources/Types/Types", 
    "./Resources/Natures/Natures"
];



const langs = ['Chs', 'Cht', 'En', 'Es', 'Fre', 'Ger', 'Ita', 'Jpn', 'Kor'];



for (let i = 0; i < langs.length; i++) {

    for (let z = 0; z < langFiles.length; z++) {

        var myScript = document.createElement('script');

        myScript.setAttribute('src', langFiles[z] + langs[i] + '.js');

        document.head.appendChild(myScript);

    }


}


//Cargador del Traductor multilenguaje
    var natureScript = document.createElement('script');
    natureScript.setAttribute(
    'src',
    './Resources/Natures/NatureTranslator.js'
                             );
      document.head.appendChild(natureScript);


const button = document.getElementById('print');

const sheets = document.getElementsByName('sheet');



function getStats(poke, ivs, evs, level, nat) {

    var ret = {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0};

    var baseStats = pokedex[poke];

    var nature = natures[nat] || natures['Serious'];



    for (const [key, value] of Object.entries(baseStats)){

        if (key == 'hp'){

            var stat = Math.floor(((((2 * baseStats.hp) + (evs.hp/4) + ivs.hp) * level)/100) + level + 10);

            ret['hp'] = stat;

        } else {

            var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + (evs[key]/4) + ivs[key]) * level) / 100) + 5)) * nature[key]);

            ret[key] = stat;

        }

    }

    return ret;

}



function sheetChange(event) {

    if (event.target.id == "reg"){

        var langInputs = document.querySelectorAll("#listLang input");

        for (const element of langInputs) {

          element.setAttribute("type", "checkbox");

          element.checked = true;

        }



        var spanTags = document.querySelectorAll('#listLang .dot');

        for (const element of spanTags) {

            element.style.borderRadius  = 0;

        }



        var spanTags = document.querySelectorAll('#listLang .option');

        for (const element of spanTags) {

            element.classList.add("cb");

        }

    } else {

        var langInputs = document.querySelectorAll("#listLang input");

        for (const element of langInputs) {

            element.setAttribute("type", "radio");

        }



        var spanTags = document.querySelectorAll('#listLang .dot');

        for (const element of spanTags) {

            element.style.borderRadius  = "50%";

        }



        var spanTags = document.querySelectorAll('#listLang .option');

        for (const element of spanTags) {

            element.classList.remove("cb");

        }

    }

}


function generatePdf(element) {

//Validacion defensiva click rapido antes de generar pdf.
         const langReady =
         window.pokesEn &&
         window.abilitiesEn &&
         window.itemsEn &&
         window.movesEn &&
         window.naturesEn &&
         window.NatureTranslator;

      if (!langReady) {
           document.getElementById('error').innerText =
           'LANGUAGE FILES NOT LOADED YET';
           return;
                      }

    document.getElementById('error').innerText = '';



    var playerName = document.getElementById('playerName').value;

    var trainerName = document.getElementById('trainerName').value;

    var teamName = document.getElementById('teamName').value;

    var switchName = document.getElementById('switchName').value;

    var playerId = document.getElementById('playerId').value;

    var birth = document.getElementById('birth').value;

    var supportId = document.getElementById('supportId')?.value || '';

    var paste = document.getElementById('paste').value;

    var ageDivision = document.querySelector('input[name="ageDivision"]:checked');

    var chosenLang = document.querySelectorAll('input[name="radioLang"]:checked');



    let selectedSheet = null;

    for (const sheet of sheets) {

        if (sheet.checked) {

            selectedSheet = sheet.value;

            break;

        }

    }



    if (!selectedSheet){

        document.getElementById('error').innerText = 'NO TEAM LIST SELECTED';

        return;

    }

    else if (!paste) {

        document.getElementById('error').innerText = 'NO PASTE DETECTED';

        return;

    }

    else if (chosenLang.length === 0){

        document.getElementById('error').innerText = 'NO LANGUAGE SELECTED';

        return;

    }



    let parsedTeam;

    try{

        parsedTeam = Koffing.parse(paste);

    }

    catch(err){

        document.getElementById('error').innerText = 'INVALID SHOWDOWN PASTE';

        return;

    }



    const pokes = parsedTeam?.teams?.[0]?.pokemon || [];

    if (pokes.length !== 6) {

        document.getElementById('error').innerText = `TEAM MUST CONTAIN EXACTLY 6 POKÉMON (FOUND ${pokes.length})`;

        return;

    }



    const doc = new jsPDF();



    // Precargar fuentes con identificadores únicos globales para evitar colisiones

    doc.addFileToVFS("fontLatin.ttf", fontLatin);

    doc.addFont('fontLatin.ttf', 'fontLatin', 'normal');

    doc.addFileToVFS("fontCh.ttf", fontCh);

    doc.addFont('fontCh.ttf', 'fontCh', 'normal');

    doc.addFileToVFS("fontJpn.ttf", fontJpn);

    doc.addFont('fontJpn.ttf', 'fontJpn', 'normal');

    doc.addFileToVFS("fontKor.ttf", fontKor);

    doc.addFont('fontKor.ttf', 'fontKor', 'normal');



    if (selectedSheet == 'open' || selectedSheet == 'close'){

        chosenLang = chosenLang[0].value;



        if (chosenLang == 'Cht' || chosenLang == 'Chs') {

            doc.setFont("fontCh", 'normal');

        } else if (chosenLang == 'Jpn') {

            doc.setFont("fontJpn", 'normal');

        } else if (chosenLang == 'Kor') {

            doc.setFont("fontKor", 'normal');

        } else {

            doc.setFont("fontLatin", 'normal');

        }



        doc.addFileToVFS("text1.ttf", text1);

        doc.addFont('text1.ttf', 'text1', 'normal');

        doc.addFileToVFS("text2.ttf", text2);

        doc.addFont('text2.ttf', 'text2', 'normal');

        doc.addFileToVFS("text3.ttf", text3);

        doc.addFont('text3.ttf', 'text3', 'normal');



        doc.setFontSize(7);

        doc.setFont("text2", 'normal');

        var msg = "All Pokémon must be listed exactly as they appear in the Battle Team,";

        doc.text(50, 272, msg);



        doc.setFont("text1", 'normal');

        var msg = "at the alignment they are in the game.";

        doc.text(120.5, 272, msg);



        doc.setFontSize(13);

        doc.setFont("text1", 'normal');

        var msg = "Pokémon Champions Registration Sheet";

        doc.text(73, 12.5, msg);



        doc.setLineWidth(0.3);

        var x = 45;

        var y = 34.5;

        var mygap = 7;

        for (let i = 0; i < 4; i++) {

            doc.line(x, y+mygap*i, x+65, y+mygap*i);

        }



        doc.setFontSize(12);

        doc.setFont("text1", 'normal');

        var msg = "Player Name: ";

        doc.text(45, 33, msg, "right");



        doc.setFontSize(9);

        var msg = "Trainer Name in Game: ";

        doc.text(45, 40, msg, "right");

        var msg = "Battle Team Number / Name: ";

        doc.text(45, 47, msg, "right");

        var msg = "Switch Profile Name: ";

        doc.text(45, 54, msg, "right");



        var x = 155;

        var gapx = 21;

        for (let i = 0; i < 3; i++) {

            doc.rect(x + gapx * i, 30, 4, 4);

        }



        var msg = "Age Division: ";

        doc.text(140, 33, msg, "right");

        var msg = "Juniors ";

        doc.text(154, 33, msg, "right");

        var msg = "Seniors ";

        doc.text(175, 33, msg, "right");

        var msg = "Masters ";

        doc.text(196, 33, msg, "right");



        doc.setFont("text2", 'normal');

        doc.setFontSize(13);

        doc.text(playerName, 47, 33);

        doc.text(trainerName, 47, 40);

        doc.text(teamName, 47, 47);

        doc.text(switchName, 47, 54);



        for (let i = 0; i < 6; i++) {

            doc.setLineWidth(0.6);

            var x = 6.5 + 99 * (i%2);

            var y = 59.5 + 70 * Math.floor(i/2);

            doc.rect(x, y, 95, 68);



            doc.setLineWidth(0.4);

            var startY = 12;

            var mygap = 8;

            for (let b = 0; b < 7; b++) {

                doc.line(x, y+startY+mygap*b, x+95, y+startY+mygap*b);

            }

        }



        if (ageDivision) {

            ageDivision = ageDivision.value;

            doc.setLineWidth(1);

            var posX = 154 + 21 * ageDivision;

            doc.line(posX, 29, posX+6, 35);

            doc.line(posX+6, 29, posX, 35);

        }



        for (let i = 0; i < pokes.length; i++) {

            var textX = 35;

            var gapX = 100;

            var textXX = 27.5;



            var pokeY = 67;

            var alignmentY = pokeY + 8;

            

            var levelY = pokeY + 9;  

            var statY = pokeY + 17.5;   

            

            var abilityY = pokeY + 18;

            var itemY = pokeY + 26;

            var gapY = 70;



            var moveY = pokeY + 34;

            var moveGapY = 8;

            var statGapY = 8; 



            var nameId = PokeTranslator[pokes[i].name];

            var abilityId = AbilityTranslator[pokes[i].ability];

        

            var itemId = 'NOITEM';

            if (pokes[i].item){

                itemId = ItemTranslator[pokes[i].item];

            }


            var statAlignment = pokes[i].nature || 'Serious';
            const natureId = NatureTranslator[statAlignment];
            statAlignment = window['natures' + chosenLang]?.[natureId] || statAlignment;

            var level = 50; 



            var ivs = {'hp': 31, 'atk': 31, 'def': 31, 'spa': 31, 'spd': 31, 'spe': 31};

            if (pokes[i].ivs) {

                for (const [key, value] of Object.entries(pokes[i].ivs)){

                    ivs[key] = value;

                }

            }



            var evs = {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0};

            if (pokes[i].evs){

                for (const [key, value] of Object.entries(pokes[i].evs)){

                    evs[key] = value;

                }

            }



            if (!pokedex[pokes[i].name]){

                document.getElementById('error').innerText = 'ERROR IN PASTE';

                return;

            }



            // Selección dinámica de la fuente por Pokémon individual en el bucle principal

            if (chosenLang == 'Cht' || chosenLang == 'Chs') doc.setFont("fontCh", 'normal');

            else if (chosenLang == 'Jpn') doc.setFont("fontJpn", 'normal');

            else if (chosenLang == 'Kor') doc.setFont("fontKor", 'normal');

            else doc.setFont("fontLatin", 'normal');



            var name = window['pokes' + chosenLang]?.[nameId] || pokes[i].name;

            var ability = window['abilities' + chosenLang]?.[abilityId] || pokes[i].ability;

            var item = itemId === 'NOITEM' ? 'NO ITEM' : (window['items' + chosenLang]?.[itemId] || pokes[i].item);

            var movs = [];

            for (let x = 0; x < pokes[i].moves.length; x++){

                var moveId = MoveTranslator[pokes[i].moves[x]];

                movs.push(  window['moves' + chosenLang]?.[moveId] ||  pokes[i].moves[x] );

            }



            doc.setFontSize(13);

            doc.text("Pokémon", textXX + (i%2) * gapX, pokeY + (Math.floor(i/2)) * gapY, "right");

            let pokeFontSize = 10;
const pokeMaxWidth = 38;

while (
    doc.getTextWidth(name) > pokeMaxWidth &&
    pokeFontSize > 6
) {
    pokeFontSize -= 0.5;
    doc.setFontSize(pokeFontSize);
}

doc.text(
    name,
    textX + (i % 2) * gapX,
    pokeY + (Math.floor(i / 2)) * gapY
);

doc.setFontSize(10);


            doc.setFontSize(10);

            doc.text("Stat Alignment", textXX + 6.5 + (i%2) * gapX, alignmentY + (Math.floor(i/2)) * gapY, "right");

            doc.text(statAlignment, textX + (i%2) * gapX, alignmentY + (Math.floor(i/2)) * gapY);



            doc.setFontSize(12);

            doc.text("Ability", textXX + (i%2) * gapX, abilityY + (Math.floor(i/2)) * gapY, "right");

            doc.setFontSize(9);

            doc.text( ability, textX + (i % 2) * gapX, abilityY + (Math.floor(i / 2)) * gapY, { maxWidth: 50 } );


            doc.setFontSize(12);

            doc.text("Held Item", textXX + 1 + (i%2) * gapX, itemY + (Math.floor(i/2)) * gapY, "right");

            doc.setFontSize(10);

            doc.text( item, textX + (i % 2) * gapX, itemY + (Math.floor(i / 2)) * gapY, { maxWidth: 50 } );



            for (let j = 0; j < movs.length; j++) {

                doc.setFontSize(13);

                doc.text("Move " + (j+1), textXX + (i%2) * gapX, moveY + (Math.floor(i/2)) * gapY + j * moveGapY, "right");

                doc.setFontSize(11);

                doc.text( movs[j], textX + (i % 2) * gapX, moveY + (Math.floor(i / 2)) * gapY + j * moveGapY, { maxWidth: 42 } );

            }



            if (selectedSheet === "close") {

                var natureBase = pokes[i].nature || "Serious";

                var stats = getStats(pokes[i].name, ivs, evs, level, natureBase);

    

                var boxStartX = 6.5 + 99 * (i%2) + 80; 

                var cellCenterX = boxStartX + 7.5; 

                
//Usar el ancho completo de la celda.
                doc.setFontSize(5.5);

                doc.text(statAlignment, cellCenterX, levelY + (Math.floor(i/2)) * gapY, { align: 'center', maxWidth: 13 } );

    

                doc.setFontSize(9);

                var j = 0;

                for (const [key, value] of Object.entries(stats)){

                    doc.text(value.toString(), cellCenterX, statY + (Math.floor(i/2)) * gapY + j * statGapY, { align: 'center' });

                    j++;

                }

            }

        }

    }



    if (selectedSheet == 'open') {

        doc.setFontSize(13);

        doc.setFont("text1", 'normal');

        var msg = "2 of 2: ";

        doc.text(83, 18, msg);



        doc.setFont("text3", 'normal');

        var msg = "For Opponents";

        doc.text(96, 18, msg);



        doc.setFontSize(10);

        var msg = "Do not lose this page! Keep it throughout the tournament, sharing it with your opponent each round.";

        doc.text(31, 24, msg);



        doc.save(playerId+"-OTS.pdf");

    }



    if (selectedSheet === 'close') {

        doc.setFontSize(13);

        doc.setFont("text1", 'normal');

        var msg = "1 of 2: ";

        doc.text(77, 18, msg);



        doc.setFont("text3", 'normal');

        var msg = "For Tournament Staff";

        doc.text(90, 18, msg);



        doc.setFontSize(10);

        var msg = "Complete both pages of this document. Submit this page to event staff before the tournament, at the time set by the Organizer.";

        doc.text(12, 24, msg);



        doc.setLineWidth(0.3);

        doc.setFontSize(9);

        doc.setFont("text1", 'normal');

        var msg = "Player ID: ";

        doc.text(140, 43, msg, "right");

        doc.line(140, 44.5, 180, 44.5);

        doc.setFontSize(13);

        doc.setFont("text2", 'normal');

        doc.text(playerId, 142, 43);



        doc.setFontSize(9);

        doc.setFont("text1", 'normal');

        var msg = "Date of Birth: ";

        doc.text(140, 51, msg, "right");

        doc.line(140, 52.5, 180, 52.5);

        doc.setFontSize(13);

        doc.setFont("text2", 'normal');

        doc.text(birth, 142, 51);



        doc.setFontSize(9);

        doc.setFont("text1", 'normal');

        doc.text("Support ID: ", 140, 58, "right");

        doc.line(140, 58.5, 180, 58.5);

        doc.setFontSize(13);

        doc.setFont("text2", 'normal');

        doc.text(supportId, 141, 58);



        for (let i = 0; i < 6; i++) {

            doc.setLineWidth(0.4);

            var x = 6.5 + 99 * (i%2);

            var y = 59.5 + 70 * Math.floor(i/2);



            doc.line(x+80, y+12, x+80, y+68);

            doc.setFontSize(6);

            doc.setFont("text1", 'normal');

            

            //doc.text(x+81, y+14, "Stat Align.");

            doc.text(x+81, y+22, "HP");

            doc.text(x+81, y+30, "Atk");

            doc.text(x+81, y+38, "Def");

            doc.text(x+81, y+46, "Sp. Atk");

            doc.text(x+81, y+54, "Sp. Def");

            doc.text(x+81, y+62, "Speed");

        }



        doc.save(playerId+"-staff.pdf");

    }



    if (selectedSheet === 'reg') {

        const canvas = document.createElement('canvas');

        canvas.width = 100;

        canvas.height = 100;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'black';

        ctx.fillRect(0, 0, 100, 100);

        const line = canvas.toDataURL();



        // Configuración inicial usando fuente latina por defecto para el encabezado

        doc.setFont("fontLatin", 'normal');

        doc.setFontSize(14);

        doc.text(playerName+" - "+trainerName, 20, 8, 'left');

        

        const ageDivisionId = ageDivision ? ageDivision.id : '';

        doc.text(ageDivisionId, 199, 11, 'right');



        let c_width=190/7;

        const ygap=3.8;

        const ystart_l=15;

        

        var langValues= [];

        for (let i = 0; i < chosenLang.length; i++) {

           langValues.push(chosenLang[i].value);

        }

        var langcheck = ["En","Fre","Ita","Ger","Es","Jpn","Kor","Chs","Cht"];



        for (let r = 0; r < langcheck.length; r++) {

            if (langValues.includes(langcheck[r])) {

                doc.setFillColor('#D3D3D3');

                doc.rect(9,ystart_l+ygap*(8*r),190,ygap,"F");

                doc.setFillColor('#F0F0F0');

                for (let l = 1; l < 4; l++) {

                    doc.rect(9,ystart_l+ygap*(8*r+2*l),190,ygap,"F");

                }

            }

        }



        doc.setFillColor('#000000');

        for (let j=0;j<9;j++) {

            doc.addImage({imageData:line, format:'png', x:9, y:ystart_l+j*8*ygap, width:190, height:0.3});

            for (let i=0;i<7;i++) {

                doc.addImage({imageData:line, format:'png', x:9, y:ystart_l+(i+1)*ygap+j*8*ygap, width:190, height:0.1});

            }

        }

        doc.addImage({imageData:line, format:'png', x:9, y:ystart_l+72*ygap, width:190, height:0.4});

        for (let i=0;i<8;i++) {

            doc.addImage({imageData:line, format:'png', x:9+c_width*i, y:15, width:0.1, height:273.6});

        }



        const gui = {

            "En": { "item": " Held Item", "ability": "Ability", "alignment": "Stat Alignment", "lg":"EN", "move":"Move" },

            "Es": { "item": "Objeto equipado", "ability": "Habilidad", "alignment": "Alineación", "lg":"ES", "move":"Movimiento" },

            "Ita": { "item": "Strumento tenuto", "ability": "Abilit\u00e0", "alignment": "Allineamento", "lg":"IT", "move":"Mossa" },

            "Ger": { "item": "Getragenes Item", "ability": "F\u00e4higkeit", "alignment": "Ausrichtung", "lg":"DE", "move":"Attacke" },

            "Fre": { "item": "Objet tenu", "ability": "Talent", "alignment": "Alignement", "lg":"FR", "move":"Capacit\u00e9" },

            "Jpn": { "item": "\u3082\u3061\u3082\u306e", "ability": "\u7279\u6027", "alignment": "Stat Align.", "lg":"JP", "move":"\u30ef\u30b6" },

            "Kor": { "item": "\uc544\uc774\ud15c", "ability": "\ud2b9\uc131", "alignment": "Stat Align.", "lg":"KO", "move":"\uae00\uc218" },

            "Chs": { "item": "\u6301\u6709\u7269\u54c1", "ability": "\u7279\u6027", "alignment": "Stat Align.", "lg":"SC", "move":"\u62db\u5f0f" },

            "Cht": { "item": "\u6301\u6709\u7269\u54c1", "ability": "\u7279\u6027", "alignment": "Stat Align.", "lg":"TC", "move":"\u62db\u5f0f" }

        };



        for (let u = 0; u < langcheck.length; u++) {

            var currentLang = langcheck[u];

            if (langValues.includes(currentLang)) {

                // Modificación del set de tipografía dinamizado correctamente

                if (currentLang == "Chs" || currentLang == "Cht") {

                    doc.setFont("fontCh", 'normal');

                } else if (currentLang == "Jpn") {

                    doc.setFont("fontJpn", 'normal');

                } else if (currentLang == "Kor") {

                    doc.setFont("fontKor", 'normal');

                } else {

                    doc.setFont("fontLatin", 'normal');

                }

             

                const ystart=18.1;

                var startFontSize=9;

                if (u>=5) {

                    startFontSize=8.5;

                }



                doc.setFontSize(startFontSize);

                doc.text(gui[currentLang]["lg"], 10, ystart+ygap*8*u, 'left');

                doc.text("Pok\u00e9mon", 24, ystart+ygap*8*u, 'center');

                doc.text(gui[currentLang]["alignment"], 22, ystart + ygap + ygap * 8 * u, 'center');

                doc.text(gui[currentLang]["ability"], 22, ystart+ygap*2+ygap*8*u, 'center');

                doc.setFontSize(9);

                doc.text(gui[currentLang]['item'], 22, ystart+ygap*3+ygap*8*u,"center");

                doc.setFontSize(startFontSize);

                doc.text(gui[currentLang]['move']+" 1", 22, ystart+ygap*4+ygap*8*u,"center");

                doc.text(gui[currentLang]['move']+" 2", 22, ystart+ygap*5+ygap*8*u,"center");

                doc.text(gui[currentLang]['move']+" 3", 22, ystart+ygap*6+ygap*8*u,"center");

                doc.text(gui[currentLang]['move']+" 4", 22, ystart+ygap*7+ygap*8*u,"center");

                

                for (let i = 0; i < pokes.length; i++) {

                    var id = PokeTranslator[pokes[i].name];

                    var pokeFontSize=startFontSize;

                    var pokeTextWidth= doc.getStringUnitWidth(window['pokes' + currentLang][id])*pokeFontSize;

                    var limitTextWidth=72;

                    if (u>=5) {

                        limitTextWidth=70;

                    }

                    while (pokeTextWidth>limitTextWidth) {

                        pokeFontSize-=0.5;

                        doc.setFontSize(pokeFontSize);

                        pokeTextWidth= doc.getStringUnitWidth(window['pokes' + currentLang][id])*pokeFontSize;

                    }

                    if (u<5) {

                        doc.text(window['pokes' + currentLang][id], 22+c_width*(i+1), ystart+8*ygap*u,"center");

                    } else {

                        doc.text(window['pokes' + currentLang][id], 22+c_width*(i+1), ystart+0.4+8*ygap*u,"center");

                    }

                    doc.setFontSize(startFontSize);

                    

                    var statAlignment = pokes[i].nature || "Serious";
                    const natureId = NatureTranslator[statAlignment];
                    const translatedNature = window['natures' + currentLang]?.[natureId];
                    statAlignment = translatedNature || statAlignment;
                    var natureFontSize = startFontSize;

                    var natureTextWidth = doc.getStringUnitWidth(statAlignment) * natureFontSize;

                        while ( natureTextWidth > limitTextWidth && natureFontSize > 5 ) {

                        natureFontSize -= 0.5;

                     doc.setFontSize(natureFontSize);
                     natureTextWidth = doc.getStringUnitWidth(statAlignment) * natureFontSize;
                                                                                         }
                    doc.text(statAlignment, 22+c_width*(i+1), ystart+ygap+8*ygap*u, "center");
                    doc.setFontSize(startFontSize);
                    

                    id = AbilityTranslator[pokes[i].ability];

                    var abilityFontSize=startFontSize;

                    var abilityTextWidth= doc.getStringUnitWidth(window['abilities' + currentLang][id])*abilityFontSize;

                    while (abilityTextWidth>limitTextWidth) {

                        abilityFontSize-=0.5;

                        doc.setFontSize(abilityFontSize);

                        abilityTextWidth= doc.getStringUnitWidth(window['abilities' + currentLang][id])*abilityFontSize;

                    }

                    doc.text(window['abilities' + currentLang][id], 22+c_width*(i+1), ystart+2*ygap+8*ygap*u,"center");

                    doc.setFontSize(startFontSize);



                    let itemId = 'NOITEM';

                    if (pokes[i].item) {

                        itemId = ItemTranslator[pokes[i].item];

                    }



                    const itemName = itemId === 'NOITEM' ? 'NO ITEM' : (window['items' + currentLang]?.[itemId] || pokes[i].item);

                    var itemFontSize = startFontSize;

                    var itemTextWidth = doc.getStringUnitWidth(itemName) * itemFontSize;

                    while (itemTextWidth > limitTextWidth) {

                        itemFontSize -= 0.5;

                        doc.setFontSize(itemFontSize);

                        itemTextWidth = doc.getStringUnitWidth(itemName) * itemFontSize;

                    }



                    doc.text(itemName, 22 + c_width * (i + 1), ystart + 3 * ygap + 8 * ygap * u, "center");

                    doc.setFontSize(startFontSize);



                    for (let x = 0; x < pokes[i].moves.length; x++){

                        var moveId = MoveTranslator[pokes[i].moves[x]];

                        var moveFontSize=startFontSize;

                        var moveTextWidth= doc.getStringUnitWidth(window['moves' + currentLang][moveId])*moveFontSize;

                        while (moveTextWidth>limitTextWidth) {

                            moveFontSize-=0.5;

                            doc.setFontSize(moveFontSize);

                            moveTextWidth= doc.getStringUnitWidth(window['moves' + currentLang][moveId])*moveFontSize;

                        }

                        // Corrección de la ecuación dinámica multiplicando por la constante matemática del salto (8*ygap*u)

                        doc.text(window['moves' + currentLang][moveId], 22+c_width*(i+1), ystart+4*ygap+(8*ygap*u)+ygap*x,"center");

                        doc.setFontSize(startFontSize);

                    }

                }

            }

        }

        doc.save(playerId+"-reg.pdf");

    }

}



button.addEventListener('click', generatePdf);

for (const element of sheets) {

    element.addEventListener('change', sheetChange);

}

document.getElementById("open").checked = true;
window.generatePdf = generatePdf;
window.jsPDF = window.jspdf.jsPDF; 
