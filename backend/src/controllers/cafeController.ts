import { Request, Response } from "express";
import { poolOLTP } from "../config/dbPool";
import oracledb from 'oracledb';

export const addCafe = async (req: Request, res: Response): Promise<any> => {
    const { id_locatie, nume } = req.body;

    console.log('CafeController - Adding cafe with ID:', id_locatie, 'and name:', nume);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sqlFindId = `SELECT MAX(ID_CAFENEA) AS MAX_ID FROM CAFENEA`;

        // Execute the query
        const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
     
        if (resultFindId.rows && resultFindId.rows.length > 0) {
            const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

            // Prepare the SQL statement
            const sql = `INSERT INTO CAFENEA (ID_CAFENEA, ID_LOCATIE, NUME_CAFENEA) VALUES (:nextId, :id_locatie, :nume)`;
            
            // Execute the query
            const result = await connection.execute(sql, [nextId, id_locatie, nume], { autoCommit: true });

            if (result.rowsAffected === 0) {
                return res.status(404).json({ message: 'Something went wrong' });
            }

            return res.status(200).json({ message: 'Cafe added successfully' });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error('Error closing connection:', err);
            }
        }
    }
}



export const getCafe = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('CafeController - Fetching cafe with ID:', id);  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CAFENEA WHERE ID_CAFENEA = :id`;
    
        // Execute the query
        const result = await connection.execute(sql, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const cafes = result.rows.map((row: any) => ({
                id: row.ID_CAFENEA,
                id_locatie: row.ID_LOCATIE,       
                nume: row.NUME_CAFENEA
            }));

            return res.status(200).json(cafes);
        } else {
            return res.status(404).json({ message: 'No cafe found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching cafe:', err);
        return res.status(500).json({ error: 'Failed to fetch cafe' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            try {
            await connection.close();
            } catch (closeError) {
            console.error('Error closing connection:', closeError);
            }
        }
    }
}

export const getCafes = async (req: Request, res: Response): Promise<any> => {
    console.log('CafeController - Fetching cafes');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CAFENEA`
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const cafes = result.rows.map((row: any) => ({
                id: row.ID_CAFENEA,
                id_locatie: row.ID_LOCATIE,       
                nume: row.NUME_CAFENEA
            }));

            return res.status(200).json(cafes);
        } else {
            return res.status(404).json({ message: 'No cafes found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching cafes:', err);
        return res.status(500).json({ error: 'Failed to fetch cafes' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            try {
            await connection.close();
            } catch (closeError) {
            console.error('Error closing connection:', closeError);
            }
        }
    }
}

export const updateCafe = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { id_locatie, nume } = req.body;

    console.log('CafeController - Updating cafe with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE CAFENEA SET ID_LOCATIE = :id_locatie, NUME_CAFENEA = :nume WHERE ID_CAFENEA = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id_locatie, nume, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Cafe not found' });
        }

        return res.status(200).json({ message: 'Cafe updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating cafe:', err);
        return res.status(500).json({ error: 'Failed to update cafe' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            try {
            await connection.close();
            } catch (closeError) {
            console.error('Error closing connection:', closeError);
            }
        }
    }
}

export const deleteCafe = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('CafeController - Deleting cafe with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `DELETE FROM CAFENEA WHERE ID_CAFENEA = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Cafe not found' });
        }

        return res.status(200).json({ message: 'Cafe deleted successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error deleting cafe:', err);
        return res.status(500).json({ error: 'Failed to delete cafe' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            try {
            await connection.close();
            } catch (closeError) {
            console.error('Error closing connection:', closeError);
            }
        }
    }
}