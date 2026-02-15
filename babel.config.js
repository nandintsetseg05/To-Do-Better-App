module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // WatermelonDB requires legacy decorators + loose class properties.
            // Order matters: decorators MUST come before class-properties.
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }],
        ],
    };
};
