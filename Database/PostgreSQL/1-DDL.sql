create table personal_plans (
p_plans_id uuid primary key default uuidv7(),
plans_type varchar(20) not null,
description text not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null);

create table organization_plans (
o_plans_id uuid primary key default uuidv7(),
plans_type varchar(20) not null,
description text not null,
max_teams smallint not null,
max_member smallint not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null);

create table user_authentication (
user_auth_id uuid primary key default uuidv7(),
email varchar(100) not null unique,
password_hash text not null,
created_at timestamptz not null,
password_change_at timestamptz null);

create table user_profiles (
user_id uuid primary key default uuidv7(),
user_auth_id uuid not null,
p_plans_id uuid not null,
display_name varchar(100) not null,
username varchar(50) not null,
avatar_url varchar(300) null,
biodata varchar(200) null,
base_currency varchar(5) not null,
time_zone varchar(20) not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamptz null,

constraint fk_user_auth foreign key (user_auth_id)
	references user_authentication(user_auth_id) on delete restrict,
constraint fk_user_plans foreign key (p_plans_id)
	references personal_plans(p_plans_id) on delete restrict,
constraint chk_regex_username check (username ~ '^[A-Za-z0-9_.,-]+$'),
constraint uq_username unique (username));

create table accountability_plans (
accountability_id uuid primary key default uuidv7(),
user_id uuid null,
o_plans_id uuid not null,
created_at timestamptz not null default clock_timestamp(),
updated_at timestamp null,

constraint fk_user_account foreign key (user_id)
	references user_profiles(user_id) on delete restrict,
constraint fk_accountability_plans foreign key (o_plans_id)
	references organization_plans(o_plans_id) on delete restrict);

create table organizations (
organization_id uuid primary key default uuidv7(),
accountability_id uuid not null,
organization_name varchar(40) not null,
description varchar(250) null,
created_by uuid not null,
created_at timestamptz not null default clock_timestamp(),
deleted_at timestamp null,
 
constraint fk_created_user foreign key (created_by)
 	references user_profiles(user_id) on delete restrict,
constraint fk_accountability_org foreign key (accountability_id)
	references accountability_plans(accountability_id) on delete restrict);

create table organization_member (
member_id uuid primary key default uuidv7(),
organization_id uuid not null,
user_id uuid not null,
member_role varchar(30) not null default 'Member',
created_at timestamptz not null default clock_timestamp(),
joined_at timestamp null,
join_method varchar(30) not null,
leave_at timestamp null,

constraint fk_organization_member foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_user_member foreign key (user_id)
	references user_profiles(user_id) on delete restrict);

create table financial_platform (
platform_id uuid primary key default uuidv7(),
platform_type varchar(25) not null,
platform_name varchar(25) not null,
is_custom boolean not null,
creted_at timestamp not null default clock_timestamp(),
updated_at timestamp null);

create table owner_platforms (
owner_id uuid primary key default uuidv7(),
platform_id uuid not null,
user_id uuid not null,
owner_type varchar(30) not null,
owner_name varchar(30) not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint fk_owner_platform foreign key (platform_id)
	references financial_platform(platform_id) on delete restrict,
constraint fk_user_owner_identity foreign key (user_id)
	references user_profiles(user_id) on delete restrict);

create table financial_account (
account_id uuid primary key default uuidv7(),
account_name varchar(70) not null,
account_type varchar(70) null,
account_sequence smallint not null,
currency varchar(5) not null,
owner_id uuid not null,
platform_id uuid not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null, -- update hanya di account_name dan account type saja

constraint fk_account_owner foreign key (owner_id)
	references owner_platforms(owner_id) on delete restrict,
constraint fk_account_platform foreign key (platform_id)
	references financial_platform(platform_id) on delete restrict,
constraint uq_account_comb unique (account_sequence, currency, owner_id, platform_id));

create table financial_location (
location_id uuid primary key default uuidv7(),
country varchar(50) not null,
province varchar(50) not null,
regency varchar(50) not null,
district varchar(50) not null,

constraint uq_location_comb unique (country, province, regency, district));

create table sub_category (
s_category_id uuid primary key default uuidv7(),
s_category_name varchar(50) not null,
slug_s_category_name varchar(50) not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint uq_slug_s_category unique (slug_s_category_name));

create table main_category (
m_category_id uuid primary key default uuidv7(),
m_category_name varchar(50) not null,
slug_m_category_name varchar(50) not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint uq_slug_m_category unique (slug_m_category_name));

create table categories (
category_id uuid primary key default uuidv7(),
m_category_id uuid not null,
s_category_id uuid not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint fk_m_category_id foreign key (m_category_id)
	references main_category(m_category_id) on delete restrict,
constraint fk_s_category_id foreign key (s_category_id)
	references sub_category(s_category_id) on delete restrict,
constraint uq_category_comb unique (m_category_id, s_category_id));

create table payment_channel (
p_channel_id uuid primary key default uuidv7(),
p_channel_name varchar(50) not null,
slug_p_channel_name varchar(50) not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint uq_slug_p_channel_name unique (slug_p_channel_name));

create table payment_method (
p_method_id uuid primary key default uuidv7(),
p_method_name varchar(50) not null,
slug_p_method_name varchar(50) not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint uq_slug_p_method_name unique (slug_p_method_name));

create table financial_payment (
payment_id uuid primary key default uuidv7(),
p_channel_id uuid not null,
p_method_id uuid not null,
created_at timestamp not null default clock_timestamp(),
updated_at timestamp null,

constraint fk_p_channel_id foreign key (p_channel_id)
	references payment_channel(p_channel_id) on delete restrict,
constraint fk_p_method_name foreign key (p_method_id)
	references payment_method(p_method_id) on delete restrict,
constraint uq_payment_comb unique (p_method_id, p_channel_id));

create table financial_events (
financial_event_id uuid primary key default uuidv7(),
user_id uuid null,
organization_id uuid null,
member_id uuid null,
written_at timestamp not null default clock_timestamp(),
event_date timestamp not null,
event_class varchar(10) not null,
account_source uuid not null,
account_destination uuid not null,
payment_id uuid not null,
category_id uuid not null,
description varchar(300) null,
location_id uuid not null,
actual_currency varchar(5) not null,
actual_amount numeric(30,10) not null,
base_currency varchar(5) not null,
exchange_rate numeric(30,10) not null,
base_amount numeric(30,10) not null,
file_type varchar(20) null,
file_size varchar(20) null,
file_url varchar(300) null,

constraint fk_user_financial foreign key (user_id)
	references user_profiles(user_id) on delete restrict,
constraint fk_organization_financial foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_member_financial foreign key (member_id)
	references organization_member(member_id) on delete restrict,
constraint fk_account_source foreign key (account_source)
	references financial_account(account_id) on delete restrict,
constraint fk_account_destination foreign key (account_destination)
	references financial_account(account_id) on delete restrict,
constraint fk_financial_payment foreign key (payment_id)
	references financial_payment(payment_id) on delete restrict,
constraint fk_financial_category foreign key (category_id)
	references categories(category_id) on delete restrict,
constraint fk_financial_location foreign key (location_id)
	references financial_location(location_id) on delete restrict,
constraint chk_financial_identity check ((user_id is not null and organization_id is null and member_id is null)
	or (user_id is null and organization_id is not null and member_id is not null)),
constraint chk_actual_amount check (actual_amount >= 0),
constraint chk_exchange_rate check (exchange_rate >= 0),
constraint chk_calc_base_amount check (base_amount = actual_amount * exchange_rate),
constraint chk_base_amount check (base_amount >= 0));
