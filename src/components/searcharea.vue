<template>
    <div id="console">
        <SearchForm 
            v-model="searchResults"
            @onGoToRef="simulateMouseClickOnCheckbox"
        ></SearchForm>
        <SearchResultsTable 
            :results="searchResults"
            @onResultClick="simulateMouseClickOnCheckbox"
        ></SearchResultsTable>
    </div>
</template>

<script>
import SearchForm from './searchform.vue';
import SearchResultsTable from './searchresultstable.vue';

export default {
    name: 'SearchArea',
    data: function () {
        return {
            searchResults: []
        };
    },
    components: {
        SearchForm,
        SearchResultsTable
    },
    methods: {
        simulateMouseClickOnCheckbox: function (result) {
            let sub_path_arr = result.xpath.split('.');        
            sub_path_arr[1]  = "AUTOSAR" + result.fileIndex;

            this.recClickOnCheckbox(sub_path_arr, 1); 
        },

        // iterate over all parent elements to simulate CLICK event on them 
        // if they aren't CHECKED before
        recClickOnCheckbox: function (path_arr, index) {
            // Create a new 'click' event
            let simulate_click_event = new MouseEvent('click');

            // get VNode reference of target
            let target_ref = this.$root.$children[0].$children[0];
            for( let i = 1; i <= index; i++)
            {
                target_ref = target_ref.$refs[path_arr[i]][0]
            }
            
            let checkbox_dom = target_ref.$refs.checkbox;
            if(false === checkbox_dom.checked){
                // send click event if it's not checked
                checkbox_dom.dispatchEvent(simulate_click_event);
            }

            
            if(index < path_arr.length-1){
                // wait one Render cycle to call new Click event on child VNode
                this.$nextTick(function(){
                    this.recClickOnCheckbox(path_arr,index+1);
                });
            }else if(index == path_arr.length-1)
                // focus if it's the last target to be checked
                target_ref.$refs.shortname.focus();
        }
    }
}
</script>

<style>

#console {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 30%;
}
</style>