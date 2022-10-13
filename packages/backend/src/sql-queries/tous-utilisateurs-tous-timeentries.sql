--Tous les temps par tâches de tous les utilisateurs

SELECT U.USERNAME,
	R."name",
	P."name",
	K."name",
	T."name",
	TE.workedtime
FROM PUBLIC.USER U
INNER JOIN PUBLIC.USER_PROJECT UP ON UP."userId" = U.ID
INNER JOIN PUBLIC.PROJECT P ON P.ID = UP."projectId"
INNER JOIN PUBLIC."role" R ON R.ID = U."roleId"
INNER JOIN PUBLIC.KANBAN_STATUS K ON K."projectId" = P.ID
INNER JOIN PUBLIC.TASK T ON T."kanbanstatusId" = K.ID
INNER JOIN PUBLIC.TIME_ENTRY TE ON TE."taskId" = T.ID;