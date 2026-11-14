create table user_credentials (
user_credential_id uuid primary key default uuidv7(),
email varchar(256) not null unique,
password_hash text not null,
created_at timestamptz not null default clock_timestamp(),
password_change_at timestamptz null,

constraint chk_email_lowercase check (email = lower(email)));

create table user_profiles (
user_id uuid primary key default uuidv7(),
user_credential_id uuid not null,
display_name varchar(100) not null,
username varchar(50) not null,
avatar_url varchar(300) null,
biodata varchar(200) null,
base_currency varchar(5) not null,
time_zone varchar(40) not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint fk_user_credential foreign key (user_credential_id)
	references user_credentials(user_credential_id) on delete restrict,
constraint chk_regex_username check (username ~ '^[A-Za-z0-9_.-]+$'),
constraint uq_username unique (username));

create table organizations (
organization_id uuid primary key default uuidv7(),
organization_name varchar(40) not null,
description varchar(250) null,
base_currency char(5) not null,
timezone varchar(50) not null,
created_by uuid not null,
created_at timestamptz not null default clock_timestamp(),
deleted_at timestamptz null,
 
constraint fk_created_user foreign key (created_by)
 	references user_profiles(user_id) on delete restrict);

create table organization_members (
member_id uuid primary key default uuidv7(),
organization_id uuid not null,
user_id uuid not null,
member_role varchar(30) not null default 'Member',
created_at timestamptz not null default clock_timestamp(),
joined_at timestamptz null,
join_method varchar(30) not null,
left_at timestamptz null,
deleted_at timestamptz null,

constraint fk_organization_member foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_user_member foreign key (user_id)
	references user_profiles(user_id) on delete restrict,
constraint uq_organization_member unique (organization_id, user_id));

create table financial_platforms (
platform_id uuid primary key default uuidv7(),
platform_type varchar(25) not null,
platform_name varchar(25) not null,
is_custom boolean not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null);

create table owner_platforms (
owner_platform_id uuid primary key default uuidv7(),
platform_id uuid not null,
user_id uuid null, -- pemilik baris
organization_id uuid null,
member_id uuid null,
owner_type varchar(30) not null,
owner_name varchar(30) not null, -- pemilik akun
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint fk_owner_platform foreign key (platform_id)
	references financial_platforms(platform_id) on delete restrict,
constraint fk_user_owner_identity foreign key (user_id)
	references user_profiles(user_id) on delete restrict,
constraint fk_owner_organization_account foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_owner_member_account foreign key (member_id)
	references organization_members(member_id) on delete restrict,
constraint chk_owner_member_identity check ((user_id is not null and organization_id is null and member_id is null)
	or (user_id is null and organization_id is not null and member_id is not null)));

create table financial_accounts (
account_id uuid primary key default uuidv7(),
user_id uuid null,
organization_id uuid null,
member_id uuid null,
account_name varchar(70) not null,
account_type varchar(70) null,
account_sequence smallint not null,
currency varchar(5) not null,
owner_platform_id uuid not null,
platform_id uuid not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null, -- update hanya di account_name dan account type saja

constraint fk_user_financial_account foreign key (user_id)
	references user_profiles(user_id) on delete restrict,
constraint fk_account_owner foreign key (owner_platform_id)
	references owner_platforms(owner_platform_id) on delete restrict,
constraint fk_account_platform foreign key (platform_id)
	references financial_platforms(platform_id) on delete restrict,
constraint fk_organization_account foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_member_account foreign key (member_id)
	references organization_members(member_id) on delete restrict,
constraint uq_account_comb unique (account_sequence, currency, owner_platform_id, platform_id),
constraint chk_personal_or_organization check ((user_id is not null and organization_id is null and member_id is null)
	or (user_id is null and organization_id is not null and member_id is not null)));

create table financial_locations (
location_id uuid primary key default uuidv7(),
country varchar(50) not null,
province varchar(50) not null,
regency varchar(50) not null,
district varchar(50) not null,

constraint uq_location_comb unique (country, province, regency, district));

create table sub_categories (
sub_category_id uuid primary key default uuidv7(),
sub_category_name varchar(50) not null,
slug_sub_category_name varchar(50) not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint uq_slug_sub_category unique (slug_sub_category_name));

create table main_categories (
main_category_id uuid primary key default uuidv7(),
main_category_name varchar(50) not null,
slug_main_category_name varchar(50) not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint uq_slug_main_category unique (slug_main_category_name));

create table categories (
category_id uuid primary key default uuidv7(),
main_category_id uuid not null,
sub_category_id uuid not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint fk_main_category_id foreign key (main_category_id)
	references main_categories(main_category_id) on delete restrict,
constraint fk_sub_category_id foreign key (sub_category_id)
	references sub_categories(sub_category_id) on delete restrict,
constraint uq_category_comb unique (main_category_id, sub_category_id));

create table payment_channels (
payment_channel_id uuid primary key default uuidv7(),
payment_channel_name varchar(50) not null,
slug_payment_channel_name varchar(50) not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint uq_slug_payment_channel_name unique (slug_payment_channel_name));

create table payment_methods (
payment_method_id uuid primary key default uuidv7(),
payment_method_name varchar(50) not null,
slug_payment_method_name varchar(50) not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint uq_slug_payment_method_name unique (slug_payment_method_name));

create table payment_options (
payment_option_id uuid primary key default uuidv7(),
payment_channel_id uuid not null,
payment_method_id uuid not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint fk_payment_channel_id foreign key (payment_channel_id)
	references payment_channels(payment_channel_id) on delete restrict,
constraint fk_payment_method_id foreign key (payment_method_id)
	references payment_methods(payment_method_id) on delete restrict,
constraint uq_payment_option_comb unique (payment_method_id, payment_channel_id));

create table liabilities (
liability_id uuid primary key default uuidv7(),
user_id uuid not null,
kreditur varchar(50) not null,
create_date timestamp not null,
liability_amount numeric(30,10) not null,
due_date timestamp not null,
liability_interest decimal(10,6) null,

constraint fk_user_liability foreign key (user_id)
	references user_profiles(user_id) on delete restrict);

create table receivables (
receivable_id uuid primary key default uuidv7(),
user_id uuid not null,
debitur varchar(50) not null,
create_date timestamp not null,
receivable_amount numeric(30,10) not null,
due_date timestamp not null,
receivable_interest decimal(10,6) null,

constraint fk_user_receivable foreign key (user_id)
	references user_profiles(user_id) on delete restrict);

create table financial_events (
financial_event_id uuid primary key default uuidv7(),
user_id uuid null,
organization_id uuid null,
member_id uuid null,
written_at timestamptz not null default clock_timestamp(),
event_date date not null,
event_class varchar(10) not null,
source_account_id uuid not null,
destination_account_id uuid not null,
payment_option_id uuid not null,
category_id uuid not null,
description varchar(300) null,
location_id uuid not null,
actual_currency varchar(5) not null,
actual_amount numeric(30,10) not null,
base_currency varchar(5) not null,
exchange_rate numeric(30,10) not null,
base_amount numeric(40,20) not null,
file_type varchar(20) null,
file_size bigint null, -- dalam byte
file_url varchar(300) null,
liability_id uuid null,
receivable_id uuid null,
reference_correction_id uuid null,

constraint fk_user_financial foreign key (user_id)
	references user_profiles(user_id) on delete restrict,
constraint fk_organization_financial foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_member_financial foreign key (member_id)
	references organization_members(member_id) on delete restrict,
constraint fk_source_account foreign key (source_account_id)
	references financial_accounts(account_id) on delete restrict,
constraint fk_destination_account foreign key (destination_account_id)
	references financial_accounts(account_id) on delete restrict,
constraint fk_financial_payment_option foreign key (payment_option_id)
	references payment_options(payment_option_id) on delete restrict,
constraint fk_financial_category foreign key (category_id)
	references categories(category_id) on delete restrict,
constraint fk_financial_location foreign key (location_id)
	references financial_locations(location_id) on delete restrict,
constraint fk_financial_liability foreign key (liability_id)
	references liabilities(liability_id) on delete restrict,
constraint fk_financial_receivable foreign key (receivable_id)
	references receivables(receivable_id) on delete restrict,
constraint fk_reference_correction foreign key (reference_correction_id)
	references financial_events(financial_event_id) on delete restrict,
constraint chk_financial_identity check ((user_id is not null and organization_id is null and member_id is null)
	or (user_id is null and organization_id is not null and member_id is not null)),
constraint chk_financial_account_movement check (source_account_id <> destination_account_id),
constraint chk_liability_or_receivable check (liability_id is null or receivable_id is null),
constraint chk_actual_amount check (actual_amount >= 0),
constraint chk_exchange_rate check (exchange_rate > 0),
constraint chk_calc_base_amount check (base_amount = actual_amount * exchange_rate),
constraint chk_base_amount check (base_amount >= 0));
