import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import DemoCard from './components/DemoCard.vue'
import DemoGrid from './components/DemoGrid.vue'
import VersionTabs from './components/VersionTabs.vue'
import DemoInfo from './components/DemoInfo.vue'
import ImageGallery from './components/ImageGallery.vue'
import ContactFloat from './components/ContactFloat.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(ContactFloat),
    })
  },
  enhanceApp({ app }) {
    app.component('DemoCard', DemoCard)
    app.component('DemoGrid', DemoGrid)
    app.component('VersionTabs', VersionTabs)
    app.component('DemoInfo', DemoInfo)
    app.component('ImageGallery', ImageGallery)
  },
} satisfies Theme