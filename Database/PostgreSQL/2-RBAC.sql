create role migrator nologin;
	grant connect on database neondb to migrator;
	grant usage on all schema public to migrator;

create role writer nologin;
	grant usage, create on schema public to writer;
	grant select on 
		public.personal_plans, public.organization_plans, public.main_category,
		public.sub_category, public.categories, public.payment_channel,
		public.payment_method, public.financial_payment,
		public.financial_location, public.financial_platforms
	to writer;
	grant select, insert on
		public.financial_events, public.liabilitys, public.receivables,
		public.financial_account, public.financial_platforms, public.user_profiles,
		public.user_authentication, public.organizations, public.organization_member,
		public.accountability_plans
	to writer;
	grant update
		(account_name, account_type, updated_at) on
		public.financial_account to writer;
	grant update
		(display_name, username, avatar_url, biodata, updated_at) on
		public.user_profiles to writer;
	grant update
		(organization_name, description, deleted_at) on
		public.organizations to writer;
	grant update
		(password_hash, password_change_at) on
		public.user_authentication to writer;
	grant update
		(member_role, joined_at, leave_at) on
		public.organization_member to writer;
	grant update
		(o_plans_id, updated_at) on
		public.accountability_plans to writer;

create role reader nologin;
	grant usage on schema public to reader;
	grant select on
		public.personal_plans, public.organization_plans, public.user_profiles,
		public.accountability_plans, public.organization, public.organization_member,
		public.financial_platform, public.owner_platforms, public.financial_account,
		public.financial_location, public.sub_category, public.main_category,
		public.categories, public.payment_channel, public.payment_method,
		public.financial_payment, public.liabilitys, public.receivables,
		public.financial_events
	to reader;

create role analyst nologin;
	grant usage on schema public to analyst;
	grant select on
		public.personal_plans, public.organization_plans, public.main_category,
		public.sub_category, public.categories, public.payment_channel,
		public.payment_method, public.financial_payment, public.financial_location,
		public.financial_platform, public.organization_member, public.accountability_plans
	to analyst;
	grant select 
		(user_id, p_plans_id, base_currency, time_zone, created_at) on
		public.user_profiles to analyst;
	grant select
		(organization_id, accountability_id, created_by, created_at, deleted_at) on
		public.organizations to analyst;
	grant select
		(owner_id, platform_id, user_id, organization_id, member_id, owner_type, created_at, updated_at) on
		public.owner_platforms to analyst;
	grant select
		(account_id, user_id, organization_id, member_id, account_type, account_sequence, currency, owner_id, platform_id, created_at, updated_at) on
		public.financial_account to analyst;
	grant select
		(liability_id, user_id, create_date, liability_amount, due_date, liability_interest) on
		public.liabilitys to analyst;
	grant select
		(receivable_id, user_id, create_date, receivable_amount, due_date, receivable_interest) on
		public.receivables to analyst;
	grant select (
		financial_event_id,
		user_id,
		organization_id,
		member_id,
		written_at,
		event_date,
		event_class,
		account_source,
		account_destination,
		payment_id,
		category_id,
		location_id,
		actual_currency,
		actual_amount,
		base_currency,
		exchange_rate,
		base_amount,
		liability_id,
		receivable_id,
		reference_correction_id) on
		public.financial_events to analyst;

create user migrator_app with login password '';
	grant migrator to migrator_app;
	grant migrator to neondb_owner;

create user writer_app with login password '';
	grant writer to writer_app;

create user reader_app with login password '';
	grant reader to reader_app;

create user data_analyst with login password '';
	grant analyst to data_analyst;

do $$
declare t record; 
begin
	for t in select tablename from pg_tables where schemaname = 'public' loop
		execute format('ALTER TABLE public.%I owner to migrator', t.tablename);
	end loop;
end $$;
