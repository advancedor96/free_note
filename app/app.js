import Vue from "nativescript-vue";
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
import Home from "./components/Home";
import VueDevtools from 'nativescript-vue-devtools'

Vue.use(VueDevtools)

Vue.registerElement( 'PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh);


TNSFontIcon.paths = {
  'fa': './assets/font-awesome.css',
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);
// Vue.config.silent=false;

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    }
}).$start();
