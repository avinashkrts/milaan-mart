const presets = ['module:metro-react-native-babel-preset'];
const plugins = [
  'react-native-reanimated/plugin',
  [
    'module-resolver',
    {
      root: ['./src'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      alias: {
        tests: ['./tests/'],
        "@components": "./src/components",
      }
    }    
  ]
];

module.exports = (api) => {
  api.cache(true);
  return {
    presets: presets,
    plugins: plugins
  }
};
