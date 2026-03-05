-- Automatically update profile rating and ratings_count when a new rating is inserted or updated
create or replace function public.update_profile_rating()
returns trigger
language plpgsql
security definer
as $$
declare
    total_score numeric;
    total_count integer;
begin
    -- Calculate new average and count for the user being rated (to_user)
    select coalesce(sum(score), 0), count(*)
    into total_score, total_count
    from public.ratings
    where to_user = new.to_user;

    -- Update the profiles table
    update public.profiles
    set 
        rating = case when total_count > 0 then total_score / total_count else null end,
        ratings_count = total_count
    where id = new.to_user;

    return new;
end;
$$;

drop trigger if exists on_rating_insert_update on public.ratings;

create trigger on_rating_insert_update
  after insert or update on public.ratings
  for each row
  execute function public.update_profile_rating();
