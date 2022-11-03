CREATE RECURSIVE VIEW tree (id, ancestors) AS (
    SELECT id, '{}'::varchar
    FROM public.project WHERE "projectId" IS NULL
  UNION ALL
    SELECT p1.id, t.ancestors || p1."projectId"
    FROM public.project p1, tree t
    WHERE p1."projectId" = t.id
);
