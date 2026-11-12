// Consentimento LGPD nos formulários públicos e contador anônimo de visualizações.
export async function up(knex) {
  await knex.schema.alterTable('animals', (t) => {
    t.integer('views').notNullable().defaultTo(0);
  });
  await knex.schema.alterTable('adoption_requests', (t) => {
    t.timestamp('lgpd_consent_at');
    t.timestamp('anonymized_at');
  });
  await knex.schema.alterTable('contact_messages', (t) => {
    t.timestamp('lgpd_consent_at');
    t.timestamp('anonymized_at');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('contact_messages', (t) => {
    t.dropColumn('anonymized_at');
    t.dropColumn('lgpd_consent_at');
  });
  await knex.schema.alterTable('adoption_requests', (t) => {
    t.dropColumn('anonymized_at');
    t.dropColumn('lgpd_consent_at');
  });
  await knex.schema.alterTable('animals', (t) => {
    t.dropColumn('views');
  });
}
