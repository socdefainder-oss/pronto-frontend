// app/lib/slug.ts
export function slugify(input: string) {
  return input
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // tudo que não for [a-z0-9] vira "-"
    .replace(/^-+|-+$/g, "") // remove hífen no começo/fim
    .replace(/-+/g, "-"); // colapsa hífens repetidos
}

export function isValidSlug(slug: string) {
  // regra bem comum para slug: minúsculo, números e hífen, 3..60 chars
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 60;
}
