import { poolConnection } from "./drizzle";

export async function withTransaction<T>(
  callback: (operations: {
    execute: (sql: string, values?: any[]) => Promise<any>;
    query: (sql: string, values?: any[]) => Promise<any>;
  }) => Promise<T>,
): Promise<T> {
  const connection = await poolConnection.getConnection();

  try {
    await connection.beginTransaction();

    const operations = {
      execute: async (sql: string, values?: any[]) => {
        const [result] = await connection.execute(sql, values);
        return result;
      },
      query: async (sql: string, values?: any[]) => {
        const [result] = await connection.execute(sql, values);
        return result;
      },
    };

    const result = await callback(operations);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
