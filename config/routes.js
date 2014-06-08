// caminio routes
// define your routes here
module.exports.routes = {
  '/caminio/lineup': 'LineupController#index',
  '/caminio/lineup/:id/export': 'LineupController#export',
  '/caminio/lineup/compile_all': 'LineupController#compileAll',
  '/caminio/lineup_entries/events': 'LineupEntriesController#events',
  'autorest /caminio/lineup_people': 'LineupPerson',
  'autorest /caminio/lineup_orgs': 'LineupOrg',
  'autorest /caminio/lineup_entries': 'LineupEntry'
};
