let data = [{
        "category": "foto",
        "continent": "Azië",
        "value": 68656
    },
    {
        "category": "foto",
        "continent": "Azië",
        "value": 23763
    },
    {
        "category": "negatief",
        "continent": "Azië",
        "value": 17367
    },
    {
        "category": "dia",
        "continent": "Azië",
        "value": 14699
    },
    {
        "category": "negatief",
        "continent": "Amerika",
        "value": 9869
    },
    {
        "category": "lichtbeeld",
        "continent": "Azië",
        "value": 8968
    },
    {
        "category": "dia",
        "continent": "Amerika",
        "value": 6902
    },
    {
        "category": "foto",
        "continent": "Eurazië",
        "value": 5899
    },
    {
        "category": "kleurendia",
        "continent": "Amerika",
        "value": 5577
    },
    {
        "category": "negatief",
        "continent": "Azië",
        "value": 5448
    },
    {
        "category": "negatief",
        "continent": "Afrika",
        "value": 4692
    },
    {
        "category": "foto",
        "continent": "Amerika",
        "value": 4470
    },
    {
        "category": "glasnegatief",
        "continent": "Azië",
        "value": 4259
    },
    {
        "category": "foto",
        "continent": "Amerika",
        "value": 3653
    },
    {
        "category": "kleurendia",
        "continent": "Oceanië",
        "value": 3453
    },
    {
        "category": "dia",
        "continent": "Amerika",
        "value": 2043
    },
    {
        "category": "foto",
        "continent": "Afrika",
        "value": 1853
    },
    {
        "category": "foto",
        "continent": "Oceanië",
        "value": 1796
    },
    {
        "category": "lichtbeeld",
        "continent": "Azië",
        "value": 1716
    },
    {
        "category": "dia",
        "continent": "Afrika",
        "value": 1576
    },
    {
        "category": "foto",
        "continent": "Eurazië",
        "value": 1334
    },
    {
        "category": "dia",
        "continent": "Oceanië",
        "value": 1258
    },
    {
        "category": "glasnegatief",
        "continent": "Amerika",
        "value": 1059
    },
    {
        "category": "foto",
        "continent": "Afrika",
        "value": 1041
    },
    {
        "category": "negatief",
        "continent": "Oceanië",
        "value": 893
    },
    {
        "category": "negatief",
        "continent": "Eurazië",
        "value": 829
    },
    {
        "category": "foto",
        "continent": "Oceanië",
        "value": 814
    },
    {
        "category": "lichtbeeld",
        "continent": "Afrika",
        "value": 791
    },
    {
        "category": "dia",
        "continent": "Azië",
        "value": 773
    },
    {
        "category": "dia",
        "continent": "Eurazië",
        "value": 731
    },
    {
        "category": "glasnegatief",
        "continent": "Eurazië",
        "value": 584
    },
    {
        "category": "dia",
        "continent": "Afrika",
        "value": 345
    },
    {
        "category": "lichtbeeld",
        "continent": "Amerika",
        "value": 324
    },
    {
        "category": "negatief",
        "continent": "Amerika",
        "value": 94
    },
    {
        "category": "negatief",
        "continent": "Eurazië",
        "value": 78
    },
    {
        "category": "kleurendia",
        "continent": "Afrika",
        "value": 65
    },
    {
        "category": "negatief",
        "continent": "Afrika",
        "value": 47
    },
    {
        "category": "dia",
        "continent": "Eurazië",
        "value": 31
    },
    {
        "category": "lichtbeeld",
        "continent": "Eurazië",
        "value": 26
    },
    {
        "category": "negatief",
        "continent": "Oceanen",
        "value": 26
    },
    {
        "category": "kleurendia",
        "continent": "Azië",
        "value": 22
    },
    {
        "category": "glasnegatief",
        "continent": "Afrika",
        "value": 22
    },
    {
        "category": "foto",
        "continent": "Oceanen",
        "value": 15
    },
    {
        "category": "glasnegatief",
        "continent": "Eurazië",
        "value": 11
    },
    {
        "category": "glasnegatief",
        "continent": "Azië",
        "value": 10
    },
    {
        "category": "kleurendia",
        "continent": "Azië",
        "value": 6
    },
    {
        "category": "kleurendia",
        "continent": "Amerika",
        "value": 3
    },
    {
        "category": "lichtbeeld",
        "continent": "Amerika",
        "value": 2
    },
    {
        "category": "negatief",
        "continent": "Oceanië",
        "value": 2
    },
    {
        "category": "kleurendia",
        "continent": "Oceanië",
        "value": 1
    },
    {
        "category": "dia",
        "continent": "Oceanië",
        "value": 1
    },
    {
        "category": "glasnegatief",
        "continent": "Oceanië",
        "value": 1
    }
]

function merge(data) {
    data.map(d => d.category.toLowerCase())
}
merge(data)


function colorList() {
    return d3.scaleOrdinal(["#29A567", "#586BA4", "#ED4D6E", "#FAFFD8", "#AED9E0", "#FECCBA"])
}
const color = colorList()


const yValue = data.map(d => d.value)
const xValue = data.map(d => d.category)

const colorContinent = data => data.continent

const svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.2);

let x1 = d3.scaleBand()
    .padding(0.05);

let y = d3.scaleLinear()
    .rangeRound([height, 0]);

let z = d3.scaleOrdinal()
    .range(["#29A567", "#586BA4", "#ED4D6E", "#FAFFD8", "#AED9E0", "#FECCBA"])

// https://bl.ocks.org/ADJMLyon/db038850d5890d6aff43c145591c6f90
// nesting my data
let nestedCategory = d3.nest()
    .key(d => d.category)
    .key(d => d.continent)
    .rollup(v => {
        return d3.sum(v, d => d.value)
    })
    .entries(data)

// hier verander ik de namen van de data zodat ik er een beter overzicht heb dan keys gebruiken

nestedCategory.forEach(i => {
    i.category = i.key
    delete i.key

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

let continentList = nestedCategory[0].values.map(d => d.continent)
let categoryList = nestedCategory.map(d => d.category)

// tool tip

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

x0.domain(categoryList)
x1.domain(continentList).rangeRound([0, x0.bandwidth()])
y.domain([0, d3.max(nestedCategory, d => {
    return d3.max(d.values, el => {
        return el.totalValue
    })
})])

z.domain(continentList)


const category = g.append('g')
    .selectAll('g')
    .data(nestedCategory)
    .enter()
    .append('g')
    .attr('transform', d => {
        return `translate(${x0(d.category)},0)`
    })


const rect = category.selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('rect')
    .attr('y', height)
    .attr('width', x0.bandwidth())
    .attr('height', 0)
    .on("mouseover", function (d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(`${d.continent} <br> ${d.totalValue}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 20) + "px");
    })
    .on("mouseout", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });

// tooltip 
// https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73


// console.log(nestedCategory)

let groupBar = () => {
    rect.transition()
        .duration(500)
        .delay((d, i) => {
            return i * 10;
        })
        .attr('x', d => x1(d.continent))
        .attr('y', (d) => y((d.totalValue)))
        .attr('witdh', x0.bandwidth())
        .attr('height', d => height - y(d.totalValue))
        .attr('fill', d => z(d.continent))
    

}
let drawLegend = (data) => {
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => {
            return d;
        });
}

//https://stackoverflow.com/questions/41549713/d3-js-i-want-to-change-the-data-value-to-a-percentage
//de Y-ass veranderen naar een percentage

let leftAxis = d3.axisLeft(y)
    .tickFormat(d => Math.round(d * 100 / d3.max(y.domain())) + "%")

let drawAxis = () => {
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("aantal verzameld");
}

groupBar()
drawLegend(continentList)
drawAxis()

d3.selectAll("input").on("change", change);

let timeout = setTimeout(() => {
    d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
}

function transitionGrouped() {

    rect.transition()
        .duration(500)
        .delay((d, i) => {
            return i * 10;
        })
        .attr("x", d => {
            return x1(d.continent);
        })
        .attr("width", x1.bandwidth())
        .transition()
        .attr("y", d => {
            return y(d.totalValue);
        })
        .attr("height", d => {
            return height - y(d.totalValue);
        });
}

function transitionStacked() {

    rect.transition()
        .duration(500)
        .delay((d, i) => {
            return i * 10;
        })
        .attr("y", d => {
            return y(d.totalValue);
        })
        .attr("height", d => {
            return height - y(d.totalValue);
        })
        .transition()
        .attr("x", d => {
            return x0(d.continent);
        })
        .attr("width", x0.bandwidth());
}

// als ik nog tijd heb alles te berekenen en percentages te laten zien...
function calculatePercentage(partial, total) {
    return (100 * partial) / total + '%';
}


let dropdown = d3.select('body')
    .append('select')

dropdown.selectAll('continent')
    .data(continentList)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d)



// console.log(nestedCategory)

function updateBar(data) {
    const filterContinent = console.dir(data)
    // console.log(filterContinent)
}
dropdown.on('change', function changeButton() {
    // find which unit was selected from the dropdown
    console.dir(this.value)
    var selectedUnit = d3.select(this.value)
    // run update with selected unit
    updateBar(selectedUnit);

})
updateBar(nestedCategory)













// console.log(data)
//select all bars on the graph, take them out, and exit the previous data set. 
//then you can add/enter the new data set
// var bars = chart.selectAll(".bar")
//     .remove()
//     .exit()
//     .enter()
//     .append('g')
//     .attr('class', 'g')
//     .attr('transform', function (d) {
//         return `translate( ${ x0(d.categorie)},0)`
//     })
//     .data(data)

// //now actually give each rectangle the corresponding data
// bars.enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", d => xScale(d.category)) // dit geeft de aantaal arrays terug en plaatst het op de xas
//     .attr("y", function (d) {
//         // console.log(d)
//         return yScale(d.value);
//     })
//     .attr("height", function (d) {
//         return height - yScale(d.value);
//     })
//     .attr("width", barWidth - 1)
//     .attr('fill', d => color(colorContinent(d)))

// var xAxis = d3.axisBottom(xScale);
// var yAxis = d3.axisLeft(yScale);
// //left axis
// //set up axes
// //left axis
// chart.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//     .selectAll('text')


// //bottom axis
// chart.append("g")
//     .attr("class", "xAxis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//     .selectAll("text")
// // .style("text-anchor", "end")
// // .attr("dx", "-.8em")
// // .attr("dy", ".15em")
// // .attr("transform", function (d) {
// //     return "rotate(-65)";
// // });


// //add labels
// chart
//     .append("text")
//     .attr("transform", "translate(-35," + (height + margin.bottom) / 2 + ") rotate(-90)")
//     .text("% of total watch time");

// chart
//     .append("text")
//     .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 5) + ")")
//     .text("categorie");