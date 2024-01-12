module.exports = {
  // 'babel-preset-expo',
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    'react-native-reanimated/plugin',
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true,
        "regenerator": true
      }
    ],

    ["@babel/plugin-transform-flow-strip-types", { "loose": true }],
    ["@babel/plugin-transform-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }],
    ["@babel/plugin-transform-private-methods", { "loose": true }],
    ["@babel/plugin-transform-private-property-in-object", { "loose": true }],
    [
      'module-resolver',
      {

        "root": ["./src"],
        "extensions": [".ios.ts", ".android.ts", ".ts", ".ios.tsx", ".android.tsx", ".tsx", ".jsx", ".js", ".json"],
        alias: {
          'crypto': 'react-native-quick-crypto',
          'stream': 'stream-browserify',
          'buffer': '@craftzdog/react-native-buffer',
          "@": "./src",
        },
      },
    ],
    ["react-native-worklets-core/plugin"],
    ["dotenv-import", {
      "moduleName": "@env",
      "path": ".env",
      "blocklist": null,
      "allowlist": null,
      "safe": false,
      "allowUndefined": false
    }],
  ],
};
