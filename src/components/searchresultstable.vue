<template>
    <div id = "search-results">
        <table>
            <tr><th>TAG</th><th>VALUE</th><th>REFERENCE</th></tr>
            <tr 
                v-for="(result,index) in results"
                :key="index"
                @dblclick="$emit('onResultClick',result)"
            >
                <th>{{result.tag}}</th>
                <th>{{result.shortName}}</th>
                <th>{{result.arPath}}</th>
            </tr>
        </table>
    </div>
</template>

<script>
const {JSONPath}      = require('jsonpath-plus');

export default {
    name:'SearchResultsTable',
    props: ['results']
}
</script>

<style>
#search-results{
    height : 90%;
    width: 100%;
    overflow: auto;
}

#search-results table{
    width: 100%;
    border-collapse:collapse;
    word-break: keep-all;
    white-space: nowrap;
    text-align: left;
}
#search-results table tr{
    width: 100%;
    padding: 3px 5px;
    font-size: 10pt;
    border-bottom: solid 1px gainsboro;
}

#search-results table th{
    font-weight: normal;
}

#search-results table tr:first-child th{
    color: darkolivegreen;
    font-weight: bold;
}
#search-results table tr:hover{
    background: gainsboro;
}

#search-results table tr:not(:first-child) th:first-child{
    color: darkred;
}
</style>