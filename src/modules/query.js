export default function (){ 
    return `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
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
    `
}