const config = require('./jest.config');

// Setando que o padrão de arquivos para testes unitários é nome_arquivo.spec.js
config.testMatch = ['**/*.spec.js'];

module.exports = config;
