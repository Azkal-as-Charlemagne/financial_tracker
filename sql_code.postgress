create table os_detail (
os_id_encryption varchar(70) primary key check (os_id_encryption ~ '^OS-[0-9]+$'),
os_name_encryption varchar(50) not null,
os_version_encryption varchar(50) not null,

constraint unique_os_combination unique (os_name_encryption, os_version_encryption));

create table device_detail (
device_id_encryption varchar(70) primary key check (device_id_encryption ~ '^DVC-[0-9]+$'),
device_name_encryption varchar(50) not null,
device_brand_encryption varchar(50) not null,

constraint unique_device_combination unique (device_name_encryption, device_brand_encryption));

create table entry_platform_detail (
entry_platform_id_encryption varchar(70) primary key check (entry_platform_id_encryption ~ '^EPLT-[0-9]+$'),
entry_platform_type_encryption varchar(50) not null,
entry_platform_name_encryption varchar(50) not null,

constraint unique_entry_platform_combination unique (entry_platform_type_encryption, entry_platform_name_encryption));

create table entry_user_detail (
entry_user_id_encryption varchar(70) primary key check (entry_user_id_encryption ~ '^EUSR-[0-9]+$'),
front_name_encryption varchar(50) not null check (front_name_encryption ~ '^[a-zA-Z ''-]+$'),
mid_name_encryption varchar(50) null check (mid_name_encryption ~ '^[a-zA-Z ''-]+$'),
back_name_encryption varchar(50) not null check (back_name_encryption ~ '^[a-zA-Z ''-]+$'),
birth_date_encryption date not null  check (birth_date_encryption <= CURRENT_DATE and birth_date_encryption >=  '1900-01-01'),
email_hash varchar(60) not null unique check(email_hash ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
password_entry_hash TEXT not null,
country_number_encryption varchar(3) not null check (country_number_encryption ~ '^\+[0-9]{1,4}$'),
number_encryption varchar(30) not null check (number_encryption ~ '^[0-9]{6,20}$'),
country_encryption varchar(50) not null,
province_encryption varchar(50) not null,
regency_encryption varchar(50) not null);

create table entry_detail (
entry_id_encryption varchar(70) primary key check (entry_id_encryption ~ '^ETR-[0-9]+$'),
entry_user_id_encryption varchar(70) not null check (entry_user_id_encryption ~ '^EUSR-[0-9]+$'),
entry_platform_id_encryption varchar(70) not null check (entry_platform_id_encryption ~ '^EPLT-[0-9]+$'),
device_id_encryption varchar(70) not null check (device_id_encryption ~ '^DVC-[0-9]+$'),
os_id_encryption varchar(70) not null check (os_id_encryption ~ '^OS-[0-9]+$'),

constraint fk_entry_user_id foreign key (entry_user_id_encryption) references entry_user_detail(entry_user_id_encryption),
constraint fk_entry_platform_id foreign key (entry_platform_id_encryption) references entry_platform_detail(entry_platform_id_encryption),
constraint fk_device_id foreign key (device_id_encryption) references device_detail(device_id_encryption),
constraint fk_os_id foreign key (os_id_encryption) references os_detail(os_id_encryption),
constraint unique_entry unique (entry_user_id_encryption, entry_platform_id_encryption, device_id_encryption, os_id_encryption));

create table location_detail (
location_id varchar(70) primary key check (location_id ~ '^LCT-[0-9]+$'),
country varchar(50) not null,
province varchar(50) not null,
regency varchar(50) not null,
district varchar(50) not null,

constraint unique_location_combination unique(country, province, regency, district));

create table sub_category_detail (
sub_category_id varchar(70) primary key check (sub_category_id ~ '^SCAT-[0-9]+$'),
sub_category varchar(50) not null);

create table main_category_detail (
main_category_id varchar(70) primary key check (main_category_id ~ '^MCAT-[0-9]+$'),
main_category varchar(50) not null);

create table category_detail (
category_id varchar(70) primary key check (category_id ~ '^CAT-[0-9]+$'),
main_category_id varchar(70) not null,
sub_category_id varchar(70) not null,

constraint fk_main_category_id foreign key (main_category_id) references main_category_detail(main_category_id),
constraint fk_sub_category_id foreign key (sub_category_id) references sub_category_detail(sub_category_id),
constraint unique_category unique (main_category_id, sub_category_id));

create table payment_channel_detail (
payment_channel_id varchar(70) primary key check (payment_channel_id ~ '^PAC-[0-9]+$'),
payment_channel_name varchar(50) not null);

create table payment_method_detail (
payment_method_id varchar(70) primary key check (payment_method_id ~ '^PAM-[0-9]+$'),
payment_method_name varchar(50) not null);

create table payment_detail (
payment_id  varchar(70) primary key check (payment_id ~ '^PAY-[0-9]+$'),
payment_method_id varchar(70) not null,
payment_channel_id varchar(70)  not null,

constraint fk_payment_method_id foreign key (payment_method_id) references payment_method_detail(payment_method_id),
constraint fk_payment_channel_id foreign key (payment_channel_id) references payment_channel_detail(payment_channel_id),
constraint unique_payment unique (payment_method_id, payment_channel_id));

create table account_owner_detail (
account_owner_id varchar(70) primary key check (account_owner_id ~ '^AOWN-[0-9]+$'),
account_owner_type varchar(50) not null,
account_owner_name varchar(50) not null);

create table account_platform_detail (
account_platform_id varchar(70) primary key check (account_platform_id ~ '^APLT-[0-9]+$'),
account_platform_type varchar(50) not null,
account_platform_name varchar(50) not null);

create table account_detail (
account_id varchar(70) primary key check (account_id ~ '^ACC-[0-9]+$'),
account_currency varchar(4) default 'IDR' not null,
account_sequence INT not null,
account_platform_id varchar(70) not null,
account_owner_id varchar(70) not null,

constraint fk_account_platform_id foreign key (account_platform_id) references account_platform_detail(account_platform_id),
constraint fk_account_owner_id foreign key (account_owner_id) references account_owner_detail(account_owner_id),
constraint unique_account_combination unique (account_currency, account_sequence, account_platform_id, account_owner_id));

create table specific_event_type_detail (
specific_event_type_id varchar(70) primary key check (specific_event_type_id ~ '^SEVTP-[0-9]+$'),
specific_event_type varchar(50));

create table general_event_type_detail (
general_event_type_id varchar(70) primary  key check (general_event_type_id ~ '^GEVTP-[0-9]+$'),
general_event_type varchar(50));

create table event_type_detail (
event_type_id varchar(70) primary key check (event_type_id ~ '^EVTP-[0-9]+$'),
general_event_type_id varchar(70) not null,
specific_event_type_id varchar(70) not null,

constraint fk_general_event_type_id foreign key (general_event_type_id)  references general_event_type_detail(general_event_type_id),
constraint fk_specific_event_type_id foreign key (specific_event_type_id) references specific_event_type_detail(specific_event_type_id),
constraint unique_event_type unique (general_event_type_id, specific_event_type_id));

create table financial_events (
uuid bigserial primary key,
batch_id varchar(70) not null,
written_at timestamp with time zone default clock_timestamp() not null check (written_at >= '2026-01-01 00:00:00+00'),
entry_id varchar(70) not null check (entry_id ~ '^ETR-[0-9]+$'),
event_date date not null check (event_date >= '2026-01-01'),
event_class_id varchar(70) not null check (event_class_id ~ '^TRX-[0-9]+$' or event_class_id ~ '^RCC-[0-9]+$' or event_class_id ~ '^PKT-[0-9]+$' or event_class_id ~ '^RVS-[0-9]+$' or event_class_id ~ '^RSN-[0-9]+$'),
event_type_id varchar(70) not null check (event_type_id ~ '^EVTP-[0-9]+$'),
account_source varchar(70) not null check (account_source ~ '^ACC-[0-9]+$'),
account_destination varchar(70) not null check (account_destination ~ '^ACC-[0-9]+$'),
payment_id varchar(70) not null check (payment_id ~ '^PAY-[0-9]+$'),
category_id varchar(70) not null check (category_id ~ '^CAT-[0-9]+$'),
description text not null,
actual_currency varchar(4) not null,
actual_amount numeric(20, 2) not null  check (actual_amount >=0),
base_currency varchar(4) not null default 'IDR' check(base_currency = 'IDR'),
exchange_rate numeric(20, 2) not null check (exchange_rate >0),
base_amount numeric(20, 2) not  null check (base_amount >=0),
location_id varchar(70) not null check (location_id ~ '^LCT-[0-9]+$'),

constraint fk_entry_id foreign key (entry_id) references entry_detail(entry_id_encryption),
constraint fk_event_type_id foreign key (event_type_id) references event_type_detail(event_type_id),
constraint fk_account_source foreign key (account_source) references account_detail(account_id),
constraint fk_account_destination foreign key (account_destination) references account_detail(account_id),
constraint fk_payment_id foreign key (payment_id) references payment_detail(payment_id),
constraint fk_category_id foreign key (category_id) references category_detail(category_id),
constraint fk_location_id foreign key (location_id) references location_detail(location_id),
constraint unique_event_class_id unique (event_class_id),
constraint check_base_amount check (base_amount = round(actual_amount * exchange_rate, 2)));

create or replace function check_format_date_financial_events()
returns trigger as $$
declare
	penginput_baru varchar(70);
	prev_event_date date;
begin
	if new.event_class_id not like 'TRX-%' then
		return new;
	end if;
select entry_user_id_encryption into penginput_baru
from entry_detail
where entry_id_encryption = new.entry_id;

select max(fe.event_date) into prev_event_date
from financial_events fe
join entry_detail ed on ed.entry_id_encryption = fe.entry_id
where ed.entry_user_id_encryption = penginput_baru
	and fe.event_class_id like 'TRX-%';

if prev_event_date > new.event_date then
	raise exception 'Error Tanggal! date kamu (%) lebih mundur dari date sebelumnya (%)', new.event_date, prev_event_date;
end if;
return new;
end;
$$ language plpgsql;

create trigger trigger_format_date_financial_events before insert or update on financial_events for each row execute function check_format_date_financial_events();

create table trx_detail (
event_class_id varchar(70) not null unique check (event_class_id ~ '^TRX-[0-9]+$'),
file_size varchar(50) null,
file_type varchar(30) null,
file_url varchar(255) null,

constraint fk_trx_detail foreign key (event_class_id) references financial_events(event_class_id));

create table rcm_detail (
event_class_id varchar(70) unique not null check (event_class_id ~ '^RCM-[0-9]+$'),
rcm_date date not null,
saldo numeric (20,2) not null check (saldo >=0),
total_asset numeric (20,2) not null check (total_asset >=0),
investment_return numeric (16, 2) not null,
investment_return_percentage decimal (10,6) not null check (investment_return_percentage between -9999.999999 AND 9999.999999),
saldo_growth numeric (20,2) not null,
saldo_growth_percentage decimal (10,6) not null check (saldo_growth_percentage between -9999.999999 AND 9999.999999),
total_asset_growth numeric (20,2) not null,
total_asset_growth_percentage decimal(10,6) not null check (total_asset_growth_percentage between -9999.999999 AND 9999.999999),
nabung_growth numeric (20,2) not null,
nabung_growth_percentage decimal (10,6) not null check (nabung_growth_percentage between -9999.999999 AND 9999.999999),
tabungan_growth numeric (20,2) not null,
tabungan_growth_percentage decimal (10,6) not null check (tabungan_growth_percentage between -9999.999999 AND 9999.999999));

create or replace function check_rcm_detail_formulas()
returns trigger as $$
declare
	bulan_lalu rcm_detail%ROWTYPE;
	calc_saldo_growth numeric(20,2);
	calc_saldo_growth_percentage decimal(10,6);
	calc_total_asset_growth numeric(20,2);
	calc_total_asset_growth_percentage decimal(10,6);
	calc_nabung_growth numeric(20,2);
	calc_nabung_growth_percentage decimal(10,6);
	calc_tabungan_growth numeric(20,2);
	calc_tabungan_growth_percentage decimal(10,6);
	old_saldo numeric(20,2);
	old_total_asset numeric(20,2);
	old_investment_return numeric(20,2);
begin
	select * into bulan_lalu
	from rcm_detail
	where rcm_date < new.rcm_date
	order by rcm_date desc
	limit 1;
	
	old_saldo := coalesce(bulan_lalu.saldo, 0);
	old_total_asset := coalesce(bulan_lalu.total_asset, 0);
	old_investment_return := coalesce(bulan_lalu.investment_return, 0);
	
	calc_saldo_growth := new.saldo - old_saldo;
	if old_saldo = 0 then
		calc_saldo_growth_percentage := sign(new.saldo - old_saldo)  * 100;
	else 
		calc_saldo_growth_percentage := (new.saldo - old_saldo)/old_saldo * 100;
	end if;
	
	calc_total_asset_growth := new.total_asset - old_total_asset;
	if old_total_asset = 0 then
		calc_total_asset_growth_percentage := sign(new.total_asset - old_total_asset) * 100;
	else
		calc_total_asset_growth_percentage := (new.total_asset - old_total_asset)/old_total_asset * 100;
	end if;
	
	calc_nabung_growth := (new.total_asset - new.saldo - new.investment_return) - (old_total_asset - old_saldo - old_investment_return);
	if (old_total_asset - old_saldo - old_investment_return) = 0 then
		calc_nabung_growth_percentage := sign((new.total_asset - new.saldo - new.investment_return) - (old_total_asset - old_saldo - old_investment_return)) *  100;
	else
		calc_nabung_growth_percentage := ((new.total_asset - new.saldo - new.investment_return) - (old_total_asset - old_saldo - old_investment_return))/(old_total_asset - old_saldo - old_investment_return) * 100;
	end if;
	
	calc_tabungan_growth := (new.total_asset - new.saldo) - (old_total_asset - old_saldo);
	if (old_total_asset - old_saldo) = 0 then
		calc_tabungan_growth_percentage := sign((new.total_asset - new.saldo) - (old_total_asset - old_saldo)) * 100;
	else
		calc_tabungan_growth_percentage := ((new.total_asset - new.saldo) - (old_total_asset - old_saldo))/(old_total_asset - old_saldo) * 100;
	end if;	

	if abs(new.saldo_growth - calc_saldo_growth) > 0.01 then
		raise exception 'Error Saldo Growth!, Python: %, DB: %', new.saldo_growth, calc_saldo_growth;
	end if;
	if abs(new.saldo_growth_percentage - calc_saldo_growth_percentage) > 0.01 then
		raise exception 'Error Saldo Growth %%!, Python: %, DB: %', new.saldo_growth_percentage, calc_saldo_growth_percentage;
	end if;
	if abs(new.total_asset_growth - calc_total_asset_growth) > 0.01 then
		raise exception 'Error Total Asset Growth!, Python: %, DB: %', new.total_asset_growth, calc_total_asset_growth;
	end if;
	if abs(new.total_asset_growth_percentage - calc_total_asset_growth_percentage) > 0.01 then
		raise exception 'Error Total Asset Growth %%!, Python: %, DB: %', new.total_asset_growth_percentage, calc_total_asset_growth_percentage;
	end if;
	if abs(new.nabung_growth - calc_nabung_growth) > 0.01 then
		raise exception 'Error Nabung Growth!, Python: %, DB: %', new.nabung_growth, calc_nabung_growth;
	end if;
	if abs(new.nabung_growth_percentage - calc_nabung_growth_percentage) > 0.01 then
		raise exception 'Error Nabung Growth Percentage %%, Python: %, DB: %', new.nabung_growth_percentage, calc_nabung_growth_percentage;
	end if;
	if abs(new.tabungan_growth - calc_tabungan_growth) > 0.01 then
		raise exception 'Error Tabungan Growth!, Python: %, DB: %', new.tabungan_growth, calc_tabungan_growth;
	end if;
	if abs(new.tabungan_growth_percentage - calc_tabungan_growth_percentage) >  0.01 then
		raise exception 'Error Tabungan Growth %%, Python: %, DB: %', new.tabungan_growth_percentage, calc_tabungan_growth_percentage;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger trigger_rcm_detail before insert or update on rcm_detail for each row execute function check_rcm_detail_formulas();

create table pkt_support (
pkt_support_id bigint primary key not null,
year INT not null,
amount_idr numeric(20,2) not null check (amount_idr >=0),
kewajiban_idr numeric(20,2) not null check (kewajiban_idr >=0),
return_idr decimal(10,6) null,
total_idr numeric(20,2) not null check(total_idr >=0),
amount_usd numeric(20,2) not null check (amount_usd >=0),
kewajiban_usd numeric(20,2) not null check (kewajiban_usd >=0),
rate_usd numeric(20,2) not null check (rate_usd >=0),
return_usd decimal(10,6) null,
bobot_usd decimal(10,6) not null,
total_valas numeric(20,2) not null check(total_valas >=0),
return_valas decimal(10,6) not null,
kewajiban_valas numeric(20,2) not null check (kewajiban_valas >=0),

constraint check_total_idr  check (total_idr = amount_idr),
constraint check_bobot_usd check (abs(bobot_usd - case when total_valas = 0 then (amount_usd * rate_usd)/1 else (amount_usd * rate_usd)/total_valas end) <= 0.000001),
constraint check_total_valas check (total_valas = round((amount_usd * rate_usd),2)),
constraint check_return_valas check (return_valas = return_usd),
constraint check_kewajiban_valas check (kewajiban_valas = (kewajiban_usd * rate_usd)));

create table pkt_detail (
pkt_support_id bigint primary key,
event_class_id varchar(70) unique not null check (event_class_id ~ '^PKT-[0-9]+$'),
year INT not null check (year between 2000 and 2100),
net_worth_idr numeric(20,2) not null check (net_worth_idr >=0),
net_worth_valas numeric(20,2) not null check (net_worth_valas >=0),
total_net_worth numeric(20,2) not null check (total_net_worth >=0),
total_return decimal(10,6) not null check (total_return between -9999.999999 AND 9999.999999),
local_inflation decimal(10,6) not null check (local_inflation between -9999.999999 AND 9999.999999),
local_inflation_effect decimal(10,6) not null check (local_inflation_effect between -9999.999999 AND 9999.999999),
global_inflation decimal(10,6) not null check (global_inflation between -9999.999999 AND 9999.999999),
global_inflation_effect decimal(10,6) not null check (global_inflation_effect between -9999.999999 AND 9999.999999),
depreciation_idr decimal(10,6) not null check (depreciation_idr  between -9999.999999 AND 9999.999999),
weighted_inflation decimal(10,6) not null check (weighted_inflation between -9999.999999 AND 9999.999999),
tax_friction decimal(10,6) not null check (tax_friction between -9999.999999 AND 9999.999999),
withdrawal decimal(10,6) not null check (withdrawal between -9999.999999 AND 9999.999999),
real_return decimal(10,6) not null check (real_return between -9999.999999 AND 9999.999999),
real_return_cagr decimal(10,6) not null check (real_return_cagr between -9999.999999 AND 9999.999999),
real_return_standard_deviation decimal(10,6) not null check (real_return_standard_deviation between -9999.999999 AND 9999.999999),

constraint fk_pkt_support_id foreign key(pkt_support_id)
	references pkt_support(pkt_support_id),
constraint check_calc_total_net_worth check (total_net_worth = net_worth_idr + net_worth_valas),
constraint check_calc_local_inflation_effect check (abs(local_inflation_effect - net_worth_idr/case when total_net_worth = 0 then 1 else total_net_worth end) <= 0.01),
constraint check_calc_global_inflation_effect check (abs(global_inflation_effect - net_worth_valas/case when total_net_worth = 0 then 1 else total_net_worth end) <= 0.01),
constraint check_calc_weighted_inflation check (abs(weighted_inflation - ((local_inflation * local_inflation_effect) + (global_inflation_effect * (depreciation_idr - global_inflation)))) <= 0.000001),
constraint check_calc_real_return check (real_return = total_return - weighted_inflation - tax_friction - withdrawal));

create or replace function formula_net_worth_valas (p_pkt_support_id bigint)
returns numeric as $$
declare
	hasil_net_worth_valas numeric(20,2);
begin
	select (total_valas - kewajiban_valas) into hasil_net_worth_valas
	from pkt_support
	where pkt_support.pkt_support_id = p_pkt_support_id;
return coalesce(hasil_net_worth_valas,0);
END;
$$ LANGUAGE plpgsql;

create or replace function check_formula_valas_pkt_detail ()
returns trigger as $$
declare
	calculated_net_worth_valas numeric(20, 2);
begin
	calculated_net_worth_valas := formula_net_worth_valas(new.pkt_support_id);

	if new.net_worth_valas <> calculated_net_worth_valas then
		raise exception 'Validasi gagal: nilai net worth valas yang dikirim (%) tidak sesuai denga hasil formula (%) untuk ID(%)', new.net_worth_valas, calculated_net_worth_valas, new.pkt_support_id;
	end if;
return new;
end;
$$ language plpgsql;

create trigger trigger_net_worth_valas before insert or update on pkt_detail for each row execute function check_formula_valas_pkt_detail();

create or replace function protect_immutable_tables()
returns trigger as $$
begin
	if session_user = 'admin_database' or session_user = 'postgres' then
		if TG_OP = 'DELETE' then
			return old;
		else
			return new;
		end if;
	end if;
raise exception 'Zero Trust Violation: Tabel ini bersifat immutable. Akses % dilarang untuk role %!', TG_OP, session_user;
end;
$$ language plpgsql;

create trigger trigger_immutable_financial_events before update or delete on financial_events for each row execute function protect_immutable_tables();
create trigger trigger_immutable_rcm_detail before update or delete on rcm_detail for each row execute function protect_immutable_tables();
create trigger trigger_immutable_pkt_detail before update or delete on pkt_detail for each row execute function protect_immutable_tables();

create role admin_database with superuser createdb createrole login password '';
create role data_analyst with login password '';
	grant select on all tables in schema public to data_analyst;
	revoke select on entry_user_detail from data_analyst;
create role backend_developer with login password '';
	grant usage on schema public to backend_developer;
	grant select, insert, update on all tables in schema public to backend_developer;
	revoke select on entry_user_detail from backend_developer;
create role etl_python with login password '';
	grant usage on schema public to	etl_python;
	grant usage on all sequences in schema public to etl_python;
	grant select, insert on all tables in schema public to etl_python;
create role ml_python_system with login password '';
create role llm_Cplus_system with login password '';
