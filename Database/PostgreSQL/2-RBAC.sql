create role migrator nologin;
create role writer nologin;
create role reader nologin;

grant connect on database neondb to migrator;
grant usage, create on schema public to migrator;
grant usage on schema public to writer, reader
grant select, insert
	public.user_credentials, public.user_profiles, public.organizations
	public.organization_members, public.financial_platforms, public.owner_platforms,
	public.financial_accounts, public.financial_locations, public.sub_categories,
	public.main_categories, public.categories, public.payment_channels,
	public.payment_methods, public.payment_options, public.liabilities,
	public.receivables, public.financial_events
to writer;
grant select
	public.user_credentials, public.user_profiles, public.organizations
	public.organization_members, public.financial_platforms, public.owner_platforms,
	public.financial_accounts, public.financial_locations, public.sub_categories,
	public.main_categories, public.categories, public.payment_channels,
	public.payment_methods, public.payment_options, public.liabilities,
	public.receivables, public.financial_events
to reader;
grant update
	(password_hash, password_change_at)
on
	public.user_credentials to writer;
grant update
	(display_name, username, avatar_url, biodata, time_zone, updated_at)
on
	public.user_profiles to writer;
grant update
	(organization_name, description, base_currency, timezone, updated_at)
on
	public.organizations to writer;
grant update
	(member_role)
on
	public.organization_members to writer;
grant update
	(kreditur, liability_amount, due_date, liability_interest)
on
	public.liabilities to writer;
grant update
	(debitur, receivable_amount, due_date, receivable_interest)
on
	public.receivables to writer;

create user migrator_app with login password '';
create user writer_app with login password '';
create user reader_app with login password '';

grant migrator to migrator_app;
grant writer to writer_app;
grant reader to reader_app;
