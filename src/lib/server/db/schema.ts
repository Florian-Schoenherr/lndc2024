import { pgTable, serial, text, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const eventidea = pgTable('eventidea', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull(),
	likes: integer('likes').notNull(),
	townPrecomputed: text('town').notNull(),
	location: text('location').notNull(),
	date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
	// here the name is different
	visitorAmount: integer('visitors'),
	// here the name is different
	priceCents: integer('price'),
	creator: text('user_id')
		.notNull()
		.references(() => user.id)
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type EventIdeaTableEntry = typeof eventidea.$inferSelect;
