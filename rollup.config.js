import * as d3 from 'd3'

export default {
    input: 'src/index.js',
    output: {
        file: 'public/bundle.js',
        format: 'iife',
        name: 'bundle',
    },
    external: [ 'd3']
}