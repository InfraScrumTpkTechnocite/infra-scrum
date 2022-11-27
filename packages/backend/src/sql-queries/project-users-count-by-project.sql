--Nombre d'utilisateur(s) par projet, par ordre décroissant du nombre d'utilisateur(s)

SELECT 	P."name",
		COUNT(DISTINCT (P."name",
						U.USERNAME
		)) AS "Nombre d'utilisateur(s)"
FROM PUBLIC.USER U
INNER JOIN PUBLIC.USER_PROJECT UP ON UP."userId" = U.ID
INNER JOIN PUBLIC.PROJECT P ON P.ID = UP."projectId"
GROUP BY P."name"
order by "Nombre d'utilisateur(s)" DESC;