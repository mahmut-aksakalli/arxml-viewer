<template>
    <li class="atomic-element">
        <table>
            <tr>
                <th><input 
                    type="checkbox"  
                    v-model="state.selected"
                    ref="checkbox"
                ></th>
                <th class ="atomic-tag">{{ nodeTag}}</th>
                <th 
                    class ="atomic-shortname" 
                    tabindex="0"
                    ref="shortname"
                >{{ nodeShortName}}</th>
            </tr>
        </table>

        <ul>
            <li v-if="state.selected">
                <table>
                    <tr v-for="(attr,index) in nodeAttributes" :key="index">
                        <th>{{attr[0]}}</th>
                        <th>{{attr[1]}}</th>
                    </tr>
                </table>
            </li>
            <template v-for="(child,index) in nodeChildren">
                <keep-alive :key="index">
                    <ArxmlNode 
                        v-if="state.selected"
                        :fileindex="fileindex" 
                        :node="child.node"
                        :nodeShortName="child.shortName"
                        :nodeTag="child.tag" 
                        :ref="child.xpath"
                    ></ArxmlNode>  
                </keep-alive>
            </template>
        </ul>      
    </li>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
    name: "ArxmlNode",
    props: ['fileindex','node', 'nodeTag','nodeShortName'],
    data: function() {
        return {
            nodeAttributes:[],
            nodeChildren : [],
            state: { 
                selected : false
            }
        };
    },
    computed: {
        ...mapGetters(["allArxmlFiles"])
    },
    methods: {
        ...mapActions(["removeArxmlFile"])
    },
    created: function(){
        if('string' !== typeof(this.node))
        {
            let shortname = '';
            let xpath;

            for(const key in this.node){
                let node_value = this.node[key];
                
                if(true === Array.isArray(node_value))
                {
                    for(let i=0; i<node_value.length; i++){
            
                        // get shortname of node
                        shortname = this.$func.getShortNameFromJsonObject(node_value[i]);
            
                        // create xpath for child node
                        xpath = `${key}[${i}]`;
            
                        this.nodeChildren.push(  {"tag":key, "shortName":shortname, "xpath": xpath, "node":node_value[i]} );            
                    }
                }
                else
                {
                
                    // get attributes of node
                    if(key.startsWith('@_')){
                        this.nodeAttributes.push( [key.substring(2) ,node_value] );
                        continue;
                    }
                    
                    // no need to display shortname seperately
                    if('SHORT-NAME' === key)
                        continue;

                    if(key.startsWith('#text'))
                        continue;

                    shortname = this.$func.getShortNameFromJsonObject(node_value);
        
                    // create xpath for child node
                    xpath = `${key}`;
        
                    this.nodeChildren.push(  {"tag": key, "shortName":shortname, "xpath": xpath, "node": node_value});        

                }                
            } 
        }
    }

}
</script>

<style>

.atomic-element > table {
    word-break: keep-all;
    white-space: nowrap;
}

.atomic-tag {
    color: darkred;
}

.atomic-shortname {
    margin-left: 10px;
    font-size: 10pt;
    color: darkolivegreen;
}

ul > li:not(.atomic-element) > table th {
    font-size: 8pt;
    font-weight: normal;
    padding: 0px 10px 0px 0px;
}

ul > li:not(.atomic-element) > table th:first-child  {
    color: midnightblue;
    font-weight:bold;
}

</style>