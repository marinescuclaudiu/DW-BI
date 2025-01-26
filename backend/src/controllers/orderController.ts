import { Request, Response } from "express";
import { poolOLTP } from "../config/dbPool";
import oracledb from 'oracledb';

export const addOrder = async (req: Request, res: Response): Promise<any> => {
  const { id_user, id_cafe, current_date, products } = req.body;

    console.log('OrderController - Adding order for user ID:', id_user);
    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

    // Get a connection from the pool
    connection = await resolvedPool.getConnection();

    // Prepare the SQL statement
    const sqlFindId = `SELECT MAX(ID_COMANDA_CLIENT) AS MAX_ID FROM COMANDA_CLIENT`;

    // Execute the query
    const resultFindId = await connection.execute(sqlFindId, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (resultFindId.rows && resultFindId.rows.length > 0) {
      const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

      // Prepare the SQL statement
      const sql = `INSERT INTO COMANDA_CLIENT(ID_COMANDA_CLIENT, ID_CLIENT, ID_CAFENEA, DATA_PLASARII)
             VALUES(:nextId, :id_user, :id_cafe, :current_date)`;

      // Execute the query
      const result = await connection.execute(
        sql,
        [nextId, id_user, id_cafe, current_date],
        { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: "Something went wrong" });
      }

      var total_price = 0.0;

      // Now iterate over the products array and insert each product
      for (const product of products) {
        const { id, cantitate, pret } = product;

        total_price += cantitate * pret;

        // Prepare the SQL statement
        const sql2 = `INSERT INTO COMANDA_PRODUS(ID_COMANDA_CLIENT, ID_PRODUS, CANTITATE, PRET_FINAL)
            VALUES(:nextId, :id, :cantitate, :pret)`;

        // Execute the query
        const result2 = await connection.execute(
          sql2,
          [nextId, id, cantitate, pret],
          { autoCommit: true }
        );

        if (result2.rowsAffected === 0) {
          return res.status(404).json({ message: "Something went wrong" });
        }
      }

        // Prepare the SQL statement
      const sqlFindId2 = `SELECT MAX(ID_FACTURA_CLIENT) AS MAX_ID FROM FACTURA_CLIENT`;

      const resultFindId2 = await connection.execute(sqlFindId2, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
    
      if (resultFindId2.rows && resultFindId2.rows.length > 0) {
        const nextId2 = (resultFindId2.rows[0] as any).MAX_ID + 1;

        const sql3 = `INSERT INTO FACTURA_CLIENT(ID_FACTURA_CLIENT, ID_COMANDA_CLIENT, PRET_TOTAL, DATA_EMITERII, STATUS, METODA_PLATA)
          VALUES(:nextId2, :nextId, :total_price, :current_date, 'inchisa', 'card')`;

        const result3 = await connection.execute(
          sql3,
          [nextId2, nextId, total_price, current_date],
          { autoCommit: true }
        );

        if (result3.rowsAffected === 0) {
          return res.status(404).json({ message: "Something went wrong" });
        }
      }

      return res.status(200).json({ message: "Order added successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

export const getOrder = async (req: Request, res: Response): Promise<any> => {};

export const getOrders = async (
  req: Request,
  res: Response
): Promise<any> => {};
