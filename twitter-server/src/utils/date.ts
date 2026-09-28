// Dates read back from the Redis cache are ISO strings (JSON.stringify),
// while fresh Prisma rows hold Date objects — normalise both.
export const toISO = (value: Date | string) => new Date(value).toISOString();
