const modules = import.meta.glob('./[0-9]*.js', {eager:true, import:'default'});
export const lessons = Object.values(modules).sort((a,b)=>a.grade-b.grade || a.id.localeCompare(b.id));
