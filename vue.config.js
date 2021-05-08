module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  pluginOptions: {
    electronBuilder: {
        nodeIntegration: true,
        builderOptions: {
          productName: "arxmlviewer",
          icon:"src/assets/icon.png",
          artifactName: "${productName}_setup.${ext}"
          
      }
    }
  }
}