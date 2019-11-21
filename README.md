# Frontend Data

# Introductie

Een barchart is te herkennen maar wat kan jij ermee doen? Een goede betekenisvolle animatie/transitie. In dit project ga ik mij bezig houden met de animatie en hoe ik het beste mijn datavisualisatie te laten zien.

## Concept

* A picture is worth a thousand words * 

Voor mijn concept wil ik laten zien hoeveel foto's in de collectie zit. Met deze achterliggende gedachtes wil ik de aantal woorden benadrukken die gezegd zijn. 

Het leek mij aan het begin interessant om een interactie te maken door te laten gokken hoeveel foto's er zijn. Zodat ze hun eerste interactie verbroken wordt.

Hoeveel foto's en type foto's is er verzameld door de NMVW?

Voor mijn concept heb ik paar dingen geschets om een beter beeld te krijgen van wat ik wil bereiken. Het is dus meer voor informatieve doeleinde omdat je te zien krijg hoeveel er zijn verzameld.

![schetsen](https://github.com/joanpadolina/frontend-data/blob/master/wiki%20assets/schetsen%20brainstorm.png)

## Query 

Het ophalen van de data die ik nodig heb bestond eigenlijk al en kon ik dit zo pakken van Ivo. Het ging namelijk om de verschillende type foto's.

```js
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    
    SELECT ?type (COUNT(?cho) AS ?choCount) WHERE {
      VALUES ?type { "Foto" "Negatief" "glasnegatief" "Dia" "kleurendia" "Lichtbeeld"}
      ?cho dc:type ?type ;
            dc:title ?title .
       FILTER langMatches(lang(?title), "ned")
    } GROUP BY ?type
    ORDER BY DESC(?choCount)
```

Enige verschil is dat ik het bij elkaar wilde op tellen zodat ik de totaal aantallen in een chart naar keuze kan brengen. Dit werd uiteindelijk een barchart. De reden waarom ik een barchart heb gekozen en niet voor iets ingewikkeld is, D3.js is niet makkelijk. Ik heb geen ervaring met JQEURY waardoor alles een beetje vaag is voor het begrijp ervan. 

## Data verschonen

De data die ik binnen kreeg was eigenlijk al schoon genoeg om door te geven naar de BarChart. Na het ophalen van de data wilde ik bepaalde types terug krijgen: de waardes van de aantallen en de category.

``` js
        .then(json => {
            const resultsQuery = json.results.bindings
                .map(result => {

                    return {
                        category: result.type.value,
                        value: Number(result.choCount.value)
                    }
				})
```

## D3 visualisatie

Een simpele barchart om te laten zien welke types er allemaal zijn. 

