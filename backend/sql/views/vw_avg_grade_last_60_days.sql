with 
base as (
	select * from vw_completed_climbs
),
filter_base as (
	select * from base 
	where date_recorded > now() - interval '60 days'
),
rank_best as (
	select 
		*,
		dense_rank() over(
			partition by climber_id 
			order by 
				score desc,
				id -- Doesn't matter as we filter anyway
		) as all_score_rank,
		dense_rank() over(
			partition by climber_id , climb_type
			order by 
				score desc,
				id -- Doesn't matter as we filter anyway
		) as climb_type_score_rank	
	from filter_base 
),
group_by_climber_and_type as (
	select 
		climber_id,
		climb_type,
		count(*) as total_climbs,
		sum(score) as total_score,
		cast(sum(score) as float) / count(*) as avg_score
	from rank_best
	where climb_type_score_rank <= 10
	group by 1,2
),
group_by_climber as (
	select 
		climber_id,
		'All' as climb_type, -- We treat both as a climb_type
		count(*) as total_climbs,
		sum(score) as total_score,
		cast(sum(score) as float) / count(*) as avg_score
	from rank_best 
	where all_score_rank <= 10
	group by 1
),
unioned as (
	select * from group_by_climber
	union all select * from group_by_climber_and_type
)
select 
	*,
	-- Scoring using a dirty case statement
	case 
	    when avg_score <= 100 then 'Yellow / 10+'
	    when avg_score <= 150 then 'Blue / 14-15'
	    when avg_score <= 200 then 'Purple / 16-17'
	    when avg_score <= 250 then 'Green / 18-19'
	    when avg_score <= 300 then 'Orange / 20-21'
	    when avg_score <= 350 then 'Red / 22-23'
	    when avg_score <= 400 then 'Black / 24-25'
	    when avg_score <= 450 then 'White / 26'
	    else 'Unknown'
	 end as avg_grade,
	 cast(mod(ceil(avg_score)::integer,50) as float)/50 as perc_to_next_grade -- Distance to next grade represented as a percentage
from unioned
