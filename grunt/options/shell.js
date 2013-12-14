/* grunt-shell */

module.exports = {
  deploy: {
    command: 'scp grunt/tasks/aliases.js build/index.html build/checksums.json build/cache.manifest serra:/var/www'
  }
};
