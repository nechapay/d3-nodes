const height = 600;
const width = 800;

const nodeMaxCount = 25;

var nodes = [
    // {name: "A", group: 1, color: getRandomColor()},
    // {name: "B", group: 2, color: getRandomColor()},
    // {name: "C", group: 3, color: getRandomColor()}
];
var links = [
    // {source: 0, target: 2, weight: 3},
    // {source: 0, target: 1, weight: 4},
    // {source: 2, target: 1, weight: 15}
];

var force;

var link;
var node;

var svg;

window.addEventListener("load", function () {
    programStart();
});

function programStart() {
    var count = getRandomInt(0, 10);

    addNode(count);
    //addLink(count);
    svg = d3.select("#root").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 800 600");
    force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .charge(-200);

    force.linkDistance(width / 8);

    link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .style("stroke-width", function (d) {
            return Math.sqrt(d.weight);
        });

    node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('circle')
        .attr('class', 'node').style("fill", function (d) {
            return d.color;
        });
    svg.on('click', function () {
        addNode();
        addLink();
        restart();
    });

    force.on('tick', function () {
        node.attr('r', width / 50)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        link.attr('x1', function (d) {
            return d.source.x;
        })
            .attr('y1', function (d) {
                return d.source.y;
            })
            .attr('x2', function (d) {
                return d.target.x;
            })
            .attr('y2', function (d) {
                return d.target.y;
            });
    });

    force.on('end', function () {

        console.log('ended');
    });


    force.start();
}

function restart() {
    node = node.data(nodes);
    node.enter().append('circle')
        .attr('class', 'node').style("fill", function (d) {
        return d.color;
    });

    node.exit()
        .remove();

    link = link.data(links);

    link.enter().insert("line", ".node")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.weight);
        });
    link.exit()
        .remove();

    force.start();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    return '#' + (Math.random() * (1 << 24) | 0).toString(16);
}

function addNode(count) {
    count = count ? count : 1;
    for (var i = 0; i < count; i++) {
        if (nodes.length < nodeMaxCount) {
            nodes.push({name: "A", group: 1, color: getRandomColor()});
        } else {
            info.print('nodes at maximum');
            return
        }
    }
}

function addLink(count) {
    var source, target;
    count = count ? count : 1;
    for (var i = 0; i < count; i++) {
        source = 0;
        target = 0;
        if (links.length >= nodes.length * (nodes.length - 1) / 2) {
            info.print('max links');
            return
        }
        var goNext = true;
        do {
            source = getRandomInt(0, nodes.length);
            target = getRandomInt(0, nodes.length);
            if (source !== target && !linkExists(source, target)) {
                goNext = false;
            }
        } while (goNext)
        info.print(`link ${source} ${target} established`);
        links.push({source: source, target: target, weight: getRandomInt(3, nodes.length)});
    }
}

function linkExists(s, t) {
    return links.some(function (item) {
        return (item.source.index === s && item.target.index === t) || (item.source.index === t && item.target.index === s)
    });
}

function getConnections(item) {
    var sCount = 0, tCount = 0;
    links.forEach(function (el) {
        if (el.source.index === item) {
            sCount++;
        }
        if (el.target.index === item) {
            tCount++;
        }
    });
    info.print(`node ${item} has ${sCount + tCount} connections`);
    return sCount + tCount;
}

var info = new Vue({
    data: function () {
        return {
            messages: []
        }
    },
    methods: {
        print: function (val) {
            this.messages.push(val);
            if (this.messages.length > 10) {
                this.messages.shift();
            }
        }
    },
    template: '<div><transition-group name="list" tag="ul"><li class="list-item" :key="item" v-for="item in messages">{{ item }}</li></transition-group></div>',
}).$mount('#info')
