-- Ajouter 50 crédits pour gregory@superhome.fr (paiement test)
-- À exécuter dans Supabase → SQL Editor (une seule fois)

do $$
declare
  target_email text := 'gregory@superhome.fr';
  uid uuid;
  current int;
begin
  select id into uid from auth.users where email = target_email;
  if uid is null then
    raise exception 'User not found with email: %', target_email;
  end if;
  select amount into current from public.credits where user_id = uid;
  if current is null then
    insert into public.credits (user_id, amount)
    values (uid, 50)
    on conflict (user_id) do update set amount = 50, updated_at = now();
  else
    update public.credits set amount = amount + 50, updated_at = now() where user_id = uid;
  end if;
  raise notice 'Credits updated for % (added 50)', target_email;
end $$;
