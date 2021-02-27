<template>
    <div 
        id="file-container" 
        dropzone="true"
        @dragover.prevent
        @drop.prevent="onDrop"
    >
        <div id="drop-here" v-show="arxmlFilesCount == 0">[DRAG A FILE]</div>
        <div 
            class="file-viewer"
            v-for="(arxmlFile,index) in allArxmlFiles" :key="index" 
        >
            <span 
                class="file-name" 
                tabindex="0"
                @keydown.delete="removeArxmlFile(index)"
            >{{ arxmlFile.path }}</span>

            <ul>
                <ArxmlNode 
                    :fileindex="index" 
                    :node="arxmlFile.data['AUTOSAR']" 
                    nodeShortName=""
                    nodeTag="AUTOSAR"
                    :ref="'AUTOSAR' + index"
                ></ArxmlNode>
            </ul>
        </div>
    </div>  
</template>

<script>
import ArxmlNode from './arxmlnode.vue';
import {mapGetters, mapActions} from "vuex";

export default {
    name: "DropZone",
    components: {
        ArxmlNode
    },
    computed: {
        ...mapGetters(["arxmlFilesCount","allArxmlFiles"])
    },
    methods: {
        ...mapActions(["addArxmlFile","removeArxmlFile"]),

        onDrop : function (event) {
            
            for(const target_file of event.dataTransfer.files)
            {
                if(target_file.path.endsWith('.arxml')){
                    if(-1 == this.$store.getters.hasArxmlFile(target_file.path))
                        this.addArxmlFile(target_file.path);
                }

            }
        }
    }
}
</script>

<style>

#file-container {
    height: 70%;
    overflow-y: auto;
    overflow-x: auto;
}

#drop-here{
    position: fixed; /* or absolute */
    top: 35%;
    width: 100%;
    text-align: center;
    font-size: 30pt;
    color: antiquewhite;
    user-select: none;
}

.file-name {
    background: bisque;
    font-weight: bold;
}
</style>