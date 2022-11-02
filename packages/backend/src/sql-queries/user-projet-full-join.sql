select distinct(p."name")
from user_project as up
full join project p ON p.id = up."projectId"
where p."projectId" is null
