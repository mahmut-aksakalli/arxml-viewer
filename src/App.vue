<template>
  <div id="app" class="accordion">
        <!-- <section class="accordion-tabs">
          <button class="accordion-tab accordion-tab-active" data-actab-id="0">XML View</button>
          <button class="accordion-tab" data-actab-id="1">ECU Composition</button>
        </section> -->
        
          <article class="accordion-item accordion-active" data-actab-id="0">
            <DropZone></DropZone>  
            <SearchArea></SearchArea>
          </article>
          
          <!--<article class="accordion-item" data-actab-id="1">
              <section id="swc-components-area"></section>
              <section id="swc-content-area">
                  <section id="runnables-area"></section>
                  <section id="ports-area"></section>
              </section>  
          </article>-->
  </div>
</template>

<script>
import DropZone from './components/dropzone.vue';
import SearchArea from './components/searcharea.vue';

export default {
  name: 'App',
  components: {
    DropZone,
    SearchArea
  }
}
</script>

<style>

* {
    font-family: monospace;
}

html, body{
    height: 100%;
    padding: 0;
    margin : 0;
    background: white;
}

ul {
    list-style-type: none;
}

.accordion{
    height: inherit;
    margin: 0;
}

.accordion-tabs{
    position: fixed;
    right: 3%;
    top: 2%;
}

.accordion-tab {
    border: 0;
    padding: 3px;
    background: antiquewhite;
}

.accordion-tab-active {
    background: rgb(252, 215, 161);
}

.accordion-item{
    height: inherit;
    display: none;
    overflow: auto;
}
.accordion-active{
    display: block;
}
</style>
