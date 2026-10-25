create table personal_plans (
p_plans_id uuid primary key default uuidv7(),
plans_type varchar(20) not null,
description text not null
created_at timestamptz not null default clock_timestamp());

create table organization_plans (
o_plans_id uuid primary key default uuidv7(),
plans_type varchar(20) not null,
description text not null,
max_teams smallint not null,
max_member smallint not null,
created_at timestamptz not null default clock_timestamp());

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
	references personal_plans(plans_id) on delete restrict,
constraint chk_regex_username check (username ~ '^[A-Za-z0-9_.,-]+$'),
constraint uq_username unique (username));

create table accountability_plans (
accountabilty_id uuid primary key default uuidv7(),
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
created_at timetamptz not null default clock_timestamp(),
joined_at timestamp null,
join_method varchar(30) not null,
leave_at timestamp null,

constraint fk_organization_member foreign key (organization_id)
	references organizations(organization_id) on delete restrict,
constraint fk_user_member foreign key (user_id)
	references user_profiles(user_id) on delete restrict);

constraint chk_kolom_comb check (user_id is not null and organization_id is null and member_id is null)
or (user_id is null and organization_id is not null and member_id is not null)

create table event_platform (
platform_id uuid primary key default uuidv7(),
platform_type varchar(50) not null,
pltform_name varchar(50) not null,
created_at timestamp not null default clock_timestamp());

create table owner_platform (
owner_id uuid primary key default uuidv7(),
owner_type varchar(50) not null,
owner_name varchar(50) not null,
created_at timestamp not null default clock_timestamp());

create table financial_account (
account_id uuid primary key default uuidv7(),
account_sequence smallint not null,
account_name varchar(50) not null,
account_type varchar(50) not null,
currency varchar(5) not null,
platform_id uuid not null,
owner_id uuid not null,
created_at timestamp not null default clock_timestamp(),

constraint fk_account_platform (platform_id)
	references event_platform(platform_id) on delete restrict,
constraint fk_account_owner (owner_id)
	references financial_owner(owner_id) on delete restrict,
constraint uq_account_comb unique (account_sequence, currency, platform_id, owner_id));

create table event_location (
location_id uuid primary key default uuidv7(),
country varchar(40) not null,
province varchar(40) not null,
regency varchar(40) not null,
district varchar(40) not null,
created_at timestamp not null clock_timestamp(),

constraint uq_location_comb unique (country, province, regency, district));

create table payment_channel (
p_channel_id uuid primary key default uuidv7(),
channel_name varchar(50) not null,
created_at timestamp not null clock_timestamp());

create table payment_method (
p_method_id uuid primary key default uuidv7(),
method_name varchar(50) not null,
creatd_at timestamp not null default clock_timestamp());

create table financial_payment (
payment_id uuid primary key default uuidv7(),
p_chanel_id uuid not null,
p_method_id uuid not null,
created_at timestamp not null default clock_timestamp(),

constraint fk_payment_channel foreign key (p_channel_id)
	references payment_channel(p_channel_id) on delete restrict,
constraint fk_payment_method foreign key (p_method_id)
	references payment_method(p_method_id) on delete restrict,
constraint uq_payment_comb unique (p_channel_id, p_method_id));
