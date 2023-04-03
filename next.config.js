// const NextJSObfuscatorPlugin = require("nextjs-obfuscator");
const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    /*
    config.node = {
      fs: 'empty',
    };
    // Added aliases
    config.resolve.alias = {
      '@root': path.join(__dirname),
      themes: path.resolve(__dirname, 'themes/'),
    };
    */

    config.plugins.push(
      new JavaScriptObfuscator({
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayCallsTransform: false,
        stringArrayEncoding: [],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      }, ['bundles/**/**.js'])
    )
    return config;
  },
}

module.exports = nextConfig
