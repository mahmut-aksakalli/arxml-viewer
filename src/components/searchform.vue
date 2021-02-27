<template>
    <div id="search-box">
        <input 
            type="text" 
            id="commandline" 
            placeholder="Search for something..[ENTER]"
            v-model.trim="searchText"
            @keydown.enter="processSearchPattern"
        />
        <button @click="processSearchPattern">Search</button>
        <button @click="gotoRef">GOTO Reference</button>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

const traverse        = require('traverse');

export default {
    name: 'SearchForm',
    data: function() {
        return {
            searchText: '',
            searchResults: []
        };
    },
    computed: {
        ...mapGetters(["allArxmlFiles"])
    },
    methods: {
        gotoRef: function () {
            // save 'this' to prevent confusion with traverse -> this
            let _this = this;
            // clear content of previous search results
            _this.searchResults.splice(0, _this.searchResults.length)

            // check if search_text is empty or not
            if(0 !== _this.searchText.length)
            {
                for(const [file_index, active_file] of _this.allArxmlFiles.entries()){
                    let result = _this.$func.getTraverseObjectFromArPath(active_file,_this.searchText);
                    if(null !== result)
                        this.$emit('onGoToRef',{'xpath':result.xpath, 'fileIndex': file_index});            
                }                              
            }

        },
        processSearchPattern: function (){
            // save 'this' to prevent confusion with traverse -> this
            let _this = this;
            // clear content of previous search results
            _this.searchResults.splice(0, _this.searchResults.length)

            // check if string is empty or not
            if(0 !== _this.searchText.length)
            {
                let pattern = new RegExp(`.*${_this.searchText}.*`,'i');

                for(const [file_index, active_file] of _this.allArxmlFiles.entries()){

                    traverse(active_file).forEach(function () {
                        
                        // search in Values
                        if(true === this.isLeaf){
                            if(pattern.test(this.node) || pattern.test(this.key)){
                                let ar_path   = '';
                                let tag       = '';
                                let path_arr  = '';
                                let xpath     = '';

                                if("#text" === this.key || "SHORT-NAME" === this.key || this.key.startsWith("@_")){
                                    if("SHORT-NAME" === this.key)
                                        tag      = this.key;
                                    else
                                        tag      = this.parent.key;
                                                                        
                                    path_arr = this.path.slice(0,-1);
                                }else{
                                    tag      = this.key;
                                    path_arr = this.path;                                
                                }
                                xpath     = _this.$func.getXPathFromTraversePathArr(path_arr);
                                ar_path   = _this.$func.getArPathFromTraverseObject(this);
                                
                                _this.searchResults.push({  "tag": tag, "shortName": this.node, 
                                                        "arPath" : ar_path, "xpath":xpath, "fileIndex": file_index});
                            }
                        }else
                        {
                            // search in TAGS
                            if(pattern.test(this.key))
                            {
                                let shortname = '';
                                let xpath     = _this.$func.getXPathFromTraversePathArr(this.path); 
                                let ar_path   = _this.$func.getArPathFromTraverseObject(this);
            
                                // check it's array or object
                                if(-1 === this.keys.indexOf('0')){    
                                    shortname = _this.$func.getShortNameFromJsonObject(this);
                                    _this.searchResults.push({  "tag": this.key,"shortName": shortname, 
                                                            "arPath" : ar_path, "xpath":xpath, "fileIndex": file_index});
                                }else{
            
                                    for(const i of this.keys)
                                    {
                                        let xpath_arr = '';
                                        shortname = _this.$func.getShortNameFromJsonObject(this.node[i]);
                                        xpath_arr = xpath + '[' + i.toString() +']';
            
                                        _this.searchResults.push({  "tag": this.key,"shortName": shortname, 
                                                                "arPath" : ar_path, "xpath":xpath_arr, "fileIndex": file_index});
                                    }
                                }
                            
                            }
                        }

                    });                
                }

            }

            // emit search results to parent to view on SearchResultsArea
            this.$emit('input', this.searchResults);
        }        
    }
}
</script>

<style>

#commandline {
    width: 80%;
    background: floralwhite;
    border: slategrey 1px solid;
    padding: 3px 5px;
    margin: 0;
}

#search-box{
    width: inherit;
    display: inline-flex;
}

#search-box button{
    margin: 0;
    width: 10%;
}
</style>