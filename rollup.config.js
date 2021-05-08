import babel from 'rollup-plugin-babel';
import clear from 'rollup-plugin-clear';
export default {
    input: './test/test.js',
    plugins:[
        clear({
            targets: ['./demoRme']
        }),
        babel()
    ]
}