with base as (
	select * from vw_completed_climbs
),
filtered as (
	select * from base 
	where date_recorded > now() - interval '30 days' -- 30 day limit
),
rank_best_climb as (
	select 
		*,
		dense_rank() over(
			partition by climber_id -- By climber
			order by 
				score desc,
				date_recorded desc,
				id desc -- Incase there are climbs recorded EXACTLY THE SAME TIME
		) as best_climb_rank
	from filtered
)
select * from rank_best_climb