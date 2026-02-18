-- Donner 200 crédits (Pro) à un utilisateur par son email
-- À exécuter dans Supabase → SQL Editor (une seule fois)

-- Remplace l'email ci-dessous si besoin, puis exécute tout le bloc.
do $$
declare
  target_email text := 'gregorybaranes@gmail.com';
  uid uuid;
begin
  select id into uid from auth.users where email = target_email;
  if uid is null then
    raise exception 'User not found with email: %', target_email;
  end if;
  insert into public.credits (user_id, amount)
  values (uid, 200)
  on conflict (user_id) do update set amount = 200, updated_at = now();
  raise notice 'Credits set to 200 for user %', target_email;
end $$;
