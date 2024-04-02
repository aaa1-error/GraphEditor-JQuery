class Graph {
    Vertecies

    constructor() {
        console.log('ctor')
        this.Vertecies = {}
    }

    nodeExists(node_name) {
        let result = (node_name in this.Vertecies)

        return result
    }

    bothNodesExist(node_name1, node_name2) {
        return this.nodeExists(node_name1) && this.nodeExists(node_name2)
    }

    areLinked(node_name1, node_name2) {
        if(!this.bothNodesExist(node_name1, node_name2)) return false

        return this.Vertecies[node_name1].has(node_name2) || this.Vertecies[node_name2].has(node_name2)
    }

    addNode(node_name) {
        if(this.nodeExists(node_name)) return false

        this.Vertecies[node_name] = new Set()
        return true
    }

    remove(node_name) {
        console.log('remove ' + node_name)

        if(!this.nodeExists(node_name)) return false

        for(let key in this.Vertecies) {
            this.Vertecies[key].delete(node_name)
        }

        delete this.Vertecies[node_name]

        console.log(this.Vertecies)
        return true
    }

    link(node_name1, node_name2) {
        if(!this.bothNodesExist(node_name1, node_name2)) return false
        if(this.areLinked(node_name1, node_name2)) return false

        this.Vertecies[node_name1].add(node_name2)
        this.Vertecies[node_name2].add(node_name1)

        return true
    }

    unlink(node_name1, node_name2) {
        if(!this.bothNodesExist(node_name1, node_name2)) return false
        if(!this.areLinked(node_name1, node_name2)) return false

        this.Vertecies[node_name1].delete(node_name2)
        this.Vertecies[node_name2].delete(node_name1)

        return true;
    }

    print_network() {
        console.log(this.Vertecies)
    }
}
