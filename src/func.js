const {JSONPath}      = require('jsonpath-plus');
const traverse        = require('traverse');

exports.getShortNameFromJsonObject = (node) =>
{
    let shortname = '';
    let result;

    // is it traverse object or not
    if(node.hasOwnProperty('keys'))
    {
        if(-1 !== node.keys.indexOf('SHORT-NAME'))
            shortname = node.node['SHORT-NAME'];
    }
    else
    {
        // if it's primitive type, then use value directly
        if ('string' === typeof(node) || 'number' === typeof(node) || 'boolean' === typeof(node)) {
            shortname = node.toString();
    
        }else{
    
            result = JSONPath({path: '$.SHORT-NAME', json: node});
            if(0 !== result.length){
                shortname = result[0];
            }else{
                result = JSONPath({path: '$.#text', json: node});
                if(0 !== result.length){
                    shortname = result[0];
                }
            }        
        }
    }

    return shortname;
}

exports.getArPathFromTraverseObject = (node)  => {
    let ar_path = '';

    for (let i=0; i<node.parents.length; i++ ){
        if(-1 !== node.parents[i].keys.indexOf('SHORT-NAME'))
            ar_path = `${ar_path}/${node.parents[i].node['SHORT-NAME']}`;
    }

    return ar_path;
}

exports.getXPathFromTraversePathArr = (target_path)  => {
    let xpath     = '';

    xpath     = xpath + JSONPath.toPointer(target_path);
    xpath     = xpath.replace(/\//g,'.');
    xpath     = xpath.replace(/(?<=\d+)\./g,'].');
    xpath     = xpath.replace(/\.(?=\d+)/g,'[');

    return xpath;
}

exports.getTraverseObjectFromArPath = (obj, arpath) => {
    let result = null;
    let path_arr = [];
    let target_node = obj;
    let search_arr  = arpath.split('/');

    for( let i = 1; i < search_arr.length; i++){
        let search_flag = false;
        traverse(target_node).forEach(function () {

            if("SHORT-NAME" === this.key)
                if(search_arr[i] === this.node){
                    for (const sub_path of this.parent.path){
                        if("parent" !== sub_path && "node" !== sub_path)
                            path_arr.push(sub_path);
                    }
                    target_node = this;
                    search_flag = true;
                    this.stop();
                }
            
        });

        if(false === search_flag)
            break;
        if((i+1) === search_arr.length){
            xpath = module.exports.getXPathFromTraversePathArr(path_arr);
            result = {"xpath": xpath, "traverseObj": target_node}
        }
    }
    
    return result;
}