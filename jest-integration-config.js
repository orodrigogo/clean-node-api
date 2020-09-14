const config = require('./jest.config');

// Setando que o padrão de arquivos para testes de integração é nome_arquivo.test.js
config.testMatch = ['**/*.test.js'];

module.exports = config;
