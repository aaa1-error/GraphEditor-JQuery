const graph = new Graph()

var mode = 'VISUAL';
var labelsAreHidden = false;

$(function() {
    console.log('ready')

    $('#field')
        .click(fieldOnClick)
        .contextmenu(addConnections)

    $(document).keypress(function(event) {
        if(event.target.type === 'text') return;
        console.log(event.target.type)

        switch(event.code) {
            case 'Space':
                switch(mode) {
                    case 'VISUAL':
                        mode = 'LINK'
                        break

                    case 'LINK':
                        mode = 'REMOVE'
                        leavingLinkMode()
                        break

                    case 'REMOVE':
                        mode = 'VISUAL'
                        break

                    default:
                        mode = 'VISUAL'
                        break
                    }

                $('#mode').text(`-- ${mode} --`)
                break;

            case 'KeyC':
                    $('.node-label').toggle()
                break;

            case 'KeyP':
                graph.print_network()
                break;

            default:

                break;
        }
    })
})

function nodeOnClick(event) {
    switch(mode) {
        case 'LINK': nodeOnClickLinkMode(event); break;
        case 'VISUAL': break;
        case 'REMOVE': nodeOnClickRemoveMode(event); break;
    }

    event.stopPropagation()
}

var selectedNode;
function nodeOnClickLinkMode(event) {
    if(mode != 'LINK') return

    if(selectedNode == null) {
        selectedNode = $(event.target)
        $(event.target).css('border-color', "#00ffff")
        
    } else {
        connect(selectedNode, $(event.target))
        $(selectedNode).css('border-color', "#ff129b")
        selectedNode = null;
    }
}

function nodeOnClickRemoveMode(event) {
    if($(event.target).hasClass('node')) {
        $(event.target).remove()
        graph.remove(event.target.id)
    }
}

function leavingLinkMode() {
    if(selectedNode != null) $(selectedNode).css('border-color', "#ff129b")
    selectedNode = null
}

var nodeCount = 0;
function fieldOnClick(event) {
    if(mode !== 'VISUAL') return;

    var div = document.createElement('div')
    div.id = 'node_' + nodeCount
    div.style.left = (event.clientX - 16) + 'px'
    div.style.top = (event.clientY - 16) + 'px'
    div.style.position = 'absolute'

    $(div)
    .addClass('node')
    .draggable({ 
        drag: onDrag,
        containment: 'parent'
    })
    .appendTo('#field')
    .click(nodeOnClick)

    var kostil = document.createElement('div')
    kostil.id = 'node-kostil_' + nodeCount

    $(kostil).addClass('node-kostil').appendTo($(div))

    var label = document.createElement('input')
    label.type = 'text'
    label.value = div.id

    $(label).addClass('node-label').appendTo($(kostil))

    nodeCount++;
    graph.addNode(div.id)
}

function onDrag() {
    $('.node-kostil').connections('update');
}

function addConnections() {
    //$('.node-kostil').connections('remove');
    //$('.node-kostil').connections();
}

function connect(div1, div2) {
    var id1 = $(div1).attr('id')
    var id2 = $(div2).attr('id')
    var kostil1 = $(div1).find('.node-kostil').get(0)
    var kostil2 = $(div2).find('.node-kostil').get(0)

    if(graph.areLinked(id1, id2)) {
        var c1 = `${kostil1.id} ${kostil2.id}`
        var c2 = `${kostil2.id} ${kostil1.id}`

        console.log('c1: ' + c1)
        console.log('c2: ' + c2)

        var c1DOM = document.getElementById(c1)
        var c2DOM = document.getElementById(c2)

        if(c1DOM) {
            c1DOM.parentNode.removeChild(c1DOM)
        }

        if(c2DOM) {
            c2DOM.parentNode.removeChild(c2DOM)
        }

        graph.unlink(id1, id2)
        return;
    }


    $(div1).find('.node-kostil').connections({ to: $(div2).find('.node-kostil')})
    graph.link(id1, id2)
}
