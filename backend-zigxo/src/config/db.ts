/**
 * Thin wrappers around the existing pool, used by agents routes and worker.
 * Keeps agents code clean without duplicating pool setup.
 */
import { QueryResultRow } from 'pg';
import { pool } from './database';

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}
