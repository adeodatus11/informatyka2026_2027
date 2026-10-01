// Kolejność w klasie jest niezależna od trwałego ID i adresu lekcji.
export const compareLessons=(a,b)=>a.grade-b.grade || (a.order??Number(a.id))-(b.order??Number(b.id)) || a.id.localeCompare(b.id);
