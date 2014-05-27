// caminio routes
// define your routes here
module.exports.routes = {
  '/caminio/lineup': 'LineupController#index',
  'autorest /caminio/lineup_people': 'LineupPerson',
  'autorest /caminio/lineup_orgs': 'LineupOrg',
  'autorest /caminio/lineup_entries': 'LineupEntry',
  '/caminio/lineup_compile': 'LineupController#compileAll'
};
