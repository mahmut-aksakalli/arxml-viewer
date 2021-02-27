import Vue from 'vue'
import Vuex from 'vuex'

const {ipcRenderer}  = require('electron');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    arxmlFiles  :[]
  },

  getters: {
    allArxmlFiles  : state => state.arxmlFiles,
    arxmlFilesCount: state => state.arxmlFiles.length,
    hasArxmlFile : (state) => (file_path) => {
      return state.arxmlFiles.findIndex(arxmlFile => arxmlFile.path == file_path);
    }
  },
  
  actions: {
    async addArxmlFile({ commit }, file_path) {
      let response = ipcRenderer.sendSync('file-open-request', file_path);
      
      if(JSON.stringify({}) !== response) {
        response =  JSON.parse(response);

        if (!response.hasOwnProperty("FILE-READ-ERROR"))      
          commit('setArxmlFiles', {'path': file_path, 'data' : response});
      }
    },
    async removeArxmlFile({ commit }, file_index) {
      if(0 <= file_index)
        commit('removeArxmlFile', file_index);
    }
  },
  
  mutations: {
    setArxmlFiles: (state, arxmlFile) => state.arxmlFiles.push(arxmlFile),
    removeArxmlFile: (state, index)   => state.arxmlFiles.splice(index,1)
  }
})
