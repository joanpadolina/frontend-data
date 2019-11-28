# Frontend Data Datavisualisatie D3.js 

## Soorten foto's uit NMVC vormgegeven in een Barchart

![barchart](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/update-style.gif)


`Kloon mijn project`

## gebruikte tools

1. npm
1. vscode
1. rollup.js (aangeraden voor het builden van de d3.js)



## Git clone
```
git clone https://github.com/joanpadolina/frontend-data.git
```
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


## Introductie

Een barchart is te herkennen maar wat kan jij ermee doen? Een goede betekenisvolle animatie/transitie. In dit project ga ik mij bezig houden met de animatie en hoe ik het beste mijn datavisualisatie te laten zien.

# [Concept](https://github.com/joanpadolina/frontend-data/wiki/Concept)

* A picture is worth a thousand words * 

Voor mijn concept wil ik laten zien hoeveel foto's in de collectie zit. Met deze achterliggende gedachtes wil ik de aantal woorden benadrukken die gezegd zijn. 

Het leek mij aan het begin interessant om een interactie te maken door te laten gokken hoeveel foto's er zijn. Zodat ze hun eerste interactie verbroken wordt.

Hoeveel foto's en type foto's is er verzameld door de NMVW?

Voor mijn concept heb ik paar dingen geschets om een beter beeld te krijgen van wat ik wil bereiken. Het is dus meer voor informatieve doeleinde omdat je te zien krijg hoeveel er zijn verzameld.

![schetsen](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/schetsen%20brainstorm.png)
![schets2](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/schets2.jpg)

In mijn eerste fase van schetsen kan je gauw zien dat ik los ging met wat ik wilde bereiken. Maar vanwege complexiteit leek het voor het leerproces beter om een barchart te maken. Zo heb ik een beter begrip van D3 en hoef ik het niet te complex te maken voor mijzelf. 

**Wat moet de barchart doen?**

De barchart laat in principe de collectie zien over de beeldmaterialen met specifiek over `fotosoorten` verdeeld over de landen. De verzameling is uitermate gigantisch waardoor er waarschijnlijk een overkoepelende informatie gaat springen *kuch* Azie *kuch*. Maar dit is voor een visualisatie toch goed om bij te houden. Naast het vergelijken tussen de landen wil ik ook selectie maken per land. Dat heb zo de interactie.



# [Query proces](https://github.com/joanpadolina/frontend-data/wiki/Data-ophalen-en-opschonen)


Het ophalen van de data die ik nodig heb bestond eigenlijk al en kon ik dit zo pakken van Ivo. Het ging namelijk om de verschillende type foto's.


```js
 SELECT ?type ?continentLabel(COUNT(?cho) AS ?choCount) WHERE {
      VALUES ?type { "Foto" "foto" "Negatief" "negatief" "Glasnegatief" "glasnegatief" "Dia" "dia" "Kleurendia" "kleurendia" "Lichtbeeld" "lichtbeeld"}
      ?cho dc:type ?type ;
            dc:title ?title .
       FILTER langMatches(lang(?title), "ned")
    <https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?continent .
    ?continent skos:prefLabel ?continentLabel .
    ?continent skos:narrower* ?place .
    ?cho dct:spatial ?place .
    } GROUP BY ?type ?continentLabel
    ORDER BY DESC(?choCount)`
```

Wat er opgehaald wordt is de `values` die aangegeven. Als dit wordt opgehaald neemt het ook delandnamen en het aantal mee. De data is niet helemaal optimaal en de hoofdletters toevoegen voeg al wat meer resultaten toe. 


# [Data verschonen](https://github.com/joanpadolina/frontend-data/wiki/D3.nest())

De data die ik binnen kreeg was eigenlijk al schoon genoeg om door te geven naar de Barchart. Na het ophalen van de data wilde ik bepaalde types terug krijgen: de waardes van de aantallen en de category. 
Hier gebruik ik de code van Laurens [basisscript](https://github.com/cmda-tt/course-19-20/blob/master/examples/sparql/baseScript.js) met het ophalen van data en een json terug krijgen.

``` js
                    return {
                        category: result.type.value.toLowerCase(),
                        continent: result.continentLabel.value,
                        value: Number(result.choCount.value)
```

De data in de console.log:

![json](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/data-json.png)


# [D3.js basis](https://joanpadolina.gitbook.io/datavisualization/)

Een barchart maken lijkt makkelijk te doen maar dit wat toch een goede oefening om cijfer in beeld te krijgen. Wat ik als eerst gedaan heb ik door simpele data in een barchart te zetten. Ik ben stap voor stap gaan kijken wat er allemaal nodig is voor D3. Hierin ga ik dieper in algemene opzet en specifieke opzet. Bijvoorbeeld margins en d3.select. 

Eerste chart opzet was het nodig om eigen data te laten zien. Hier heb ik geprobeerd mijn ruwe data in een barchart te krijgen. De data was daarom nog niet van een Sparqlquery.
![chart1](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/before-barchart.png)

Top! Eerste opzet.
Wat je hier ziet is alleen de categoriën met de totaal aantal per soort. Dit heb ik met excel berekent en in een barchart geplaatst. 



# [D3.nest()](https://github.com/joanpadolina/frontend-data/wiki/D3-barchart)

De collectie maakt gebruikt van verschillende soorten typeformat. Soms wordt er een hoofdletter gegeven en soms niet. Dit is dus niet handig voor mijn visualisatie want dan wordt alles dubbel. Om dit te verkomen heb ik gebruik gemaakt van de d3.nest()
Dit zit al in D3.js en kan dus bereikt worden door iedereen.

```js
    let nestedCategory = d3.nest()
        .key(d => d.category)
        .key(d => d.continent)
        .rollup(v => {
            return d3.sum(v, d => d.value)
        })
        .entries(data)
```
Wat D3.nest() doet is eigelijk alles groeperen met dezelfde waardes. In dit geval wordt er "Foto's" en "foto's" opgehaald. Terug naar `data verschonen` is er aangegeven dat de category values `toLowerCase()` moet zijn. Hier is alles gelijk getrokken en kan d3.nest zijn werk doen.

Wat d3.nest() nog meer kan, staat [in mijn wiki](https://github.com/joanpadolina/frontend-data/wiki/D3-barchart) 

`keys?`

Na het nesten van de data komen er keys voor in de plaats. Dit kan verwarring zorgen of juist niet. Een andere manier om deze keys weer een normale waarde te geven is door de nieuwe data een `forEach()` te gebruiken. Hier geef je nieuwe waardes per "key". 

Dit is werken met keys

![keys](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/datakeys.png)

```js
nestedCategory.forEach(i => {
        i.category = i.key //geef nieuwe naam
        delete i.key // verwijderd de key

        i.values.forEach(d => {
            d.continent = d.key
            d.totalValue = +d.value


            delete d.key 
            delete d.value
        })
        i.values.sort((a, b) => {
            return b.totalValue - a.totalValue
        })

    })

```
![zonder keys](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/data.values.png)

Dit is een oplossing als je vooral niet weet wat keys zijn of hoe het komt dat de data niet wordt meegegeven. Zo behoud je overzicht in de waardes die je op wilt halen. 

# [D3.js inspiratie en aanpassing](https://github.com/joanpadolina/frontend-data/wiki/D3-inspiratie-en-aanpassingen)

Om de barchart te maken heb ik verschillende voorbeelden gekeken en met elkaar vergeleken hoe de opzet was. Waar ik vooral naar keek is de opzet van de data en hoe dit wordt meegegeven. Daarnaast zocht ik naar patroon die liet zien dat het belangrijk was voor in de D3 opzet. De naam geeft het eigenlijk al weg. De SVG heeft `groepen` nodig.

![Imgur](https://i.imgur.com/tOrMN8P.png)
[inspiratie1](https://observablehq.com/@d3/grouped-bar-chart)

![Imgur](https://i.imgur.com/C8ZvZF7.png)
[inspiratie2](https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad)

Ook worden er assen gemaakt en dit door gegeven in de groepen voor elke rectangles.

// Dit is de originele vanuit mijn inspiratie

```js
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);
```

Dit was natuurlijk voor zijn opzet van een barchart. Wat ik veranderd heb is voornamelijk de domain() en de range().
Ook heb ik een extra `z` toegevoegd voor mijn kleurenpalette die ik doorgeef per continent.
```js

    let x0 = d3.scaleBand()
        .domain(categoryList)
        .rangeRound([0, width])
        .paddingInner(0.2);

    let x1 = d3.scaleBand()
        .domain(continentList).rangeRound([0, x0.bandwidth()])
        .padding(0.1);


    let y = d3.scaleLinear()
        .domain([0, d3.max(nestedCategory, d => {
            return d3.max(d.values, el => {
                return el.totalValue
            })
        })])
        .rangeRound([height, 0]);

    let z = d3.scaleOrdinal()
        .domain(continentList)
        .range(["#29A567", "#586BA4", "#ED4D6E", "#AED9E0", "#FECCBA"])
```

Ik heb vooral gekeken naar mijn data opzet en hoe ik dit moet plaatsen in mijn uiteindelijk visualisatie. Belangrijke leermoment hier is dat, als je begint met maken van een visualisatie, zoek eerst uit wat het verschil is tussen domain() en range().

De meest gekeken filmpje over barchart zal vast van Curran zijn. [Barchart](https://www.youtube.com/watch?v=NlBt-7PuaLk). Hier wordt dan ook uitgelegd wat domain en range zijn en hoe je dat het beste kan gebruiken. 

Om meer te lezen over mijn aanpassing van mijn inspiratie doorloop is verder in mijn [wiki over aanpassingen](https://www.youtube.com/watch?v=NlBt-7PuaLk)

# [D3.js.enter().exit().remove()](https://github.com/joanpadolina/frontend-data/wiki/D3.enter().update().exit().remove())

D3 heeft al veel codes geschreven om het werk makkelijker te maken voor programmeurs. Zo zijn er veel domunentatie en voorbeelden te vinden op google. Het enige waar veel nieuwe programmeurs vast gaan lopen is de manier hoe het wordt geschreven. Vaak is er aangegeven dat het JQUERY is of lijkt. Daar heb ik persoonlijk totaal geen ervaring mee en beginnen eraan is net door spijkers lopen.

**Waar begin ik?**
[Waar is ze begonnen? Lees hier.](https://github.com/joanpadolina/frontend-data/wiki/D3.enter().update().exit().remove())



## [Reflectie](https://github.com/joanpadolina/frontend-data/wiki/Reflectie)

D3.js moet net goed treffen als je beginnend op pro bent. De manier hoe het wordt geschreven heb ik vooral moeite meegehad om te begrijpen. Maar om uiteindelijk tot een werkend datavisualisatie te komen heb ik vooral uren gemaakt in mijn code. Ik heb veel geprobeerd en lang vast gezeten op niet werkende code. Niet werkend vanwege ze versie of omdat het verkeerd is aangegeven. Al deze kleine dingen is crusial en vergt veel energie. Ik lig het verder toe in [mijn wiki](https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad) en vooral over de valkuilen waar ik toch uit ben gekomen.


### Credits

In dit project heb ik een paar mensen lastig gevallen:

Roy C, Chazz, Manouk, Kim, Robert, Laurens, Deanne


### Bronnenlijst

Algemene bronnenlijst waar ik afgelopen weken vaak heb gekeken en gezocht

`voor de data`
[NMWV](https://collectie.wereldculturen.nl/)

`voor de lokatie`
[Tropenmuseum Leiden](https://collectie.wereldculturen.nl/?query=search=packages=OnViewRV)

`inspiratie code checkup`
[Bl.org](https://bl.ocks.org/)

`inspirate`
[Observable](https://observablehq.com/)

`code uitleg d3.js`
[Medium](www.medium.com)

`general debug site (copypaste error)`
[Stackoverflow](www.stackoverflow.com)

`basis barchart`
[Curran over barchart](https://www.youtube.com/watch?v=NlBt-7PuaLk)

`code gebruikt en hervorm. meer over in de wiki en de index.js`
[inspiratie1](https://observablehq.com/@d3/grouped-bar-chart)
[inspiratie2](https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad)


