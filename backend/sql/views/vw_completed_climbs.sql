select 
  s.id,
  c.id as climber_id,
  g.id as gym_id,
  a.id as gym_area_id,
  w.id as wall_id,
  c.name as climber_name,
  g.name as gym_name,
  a.name as gym_area_name,
  w.name as wall_name,
  w.climb_type,
  s.grade,
  s.attempts,
  s.completed,
  s.notes,
  s.date_recorded,
  -- Scoring using a dirty case statement
  case 
    -- Bouldering specific
    when s.grade = 'Yellow' then 100
    when s.grade = 'Blue' then 150
    when s.grade = 'Purple' then 200
    when s.grade = 'Green' then 250
    when s.grade = 'Orange' then 300
    when s.grade = 'Red' then 350
    when s.grade = 'Black' then 400
    when s.grade = 'White' then 450
    -- Ropes specific
    when s.grade in ('10+') then 100
    when s.grade in ('14', '15') then 150
    when s.grade in ('16', '17') then 200
    when s.grade in ('18', '19') then 250
    when s.grade in ('20', '21') then 300
    when s.grade in ('22', '23') then 350
    when s.grade in ('24', '25') then 400
    when s.grade in ('26') then 450
  else null
  end as score,
-- Make my life easy with days since calcs by adding a date rank
dense_rank() over(
  order by date_recorded
) as latest_climb_rank,
dense_rank() over(
  partition by cast(date_recorded as date)
  order by cast(date_recorded as date)
) as date_rank
from scores s 
join climbers c on s.climber_id = c.id
join walls w on s.wall_id = w.id
join gym_areas a on w.gym_area_id = a.id
join gyms g on a.gym_id = g.id
where s.completed = true