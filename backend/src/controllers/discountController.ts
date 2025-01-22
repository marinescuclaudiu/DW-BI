import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';
import { formatDateToCustom } from "../helpers/formatDate";

export const getDiscount = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('DiscountController - Fetching discount with ID:', id);  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM OFERTA WHERE ID_OFERTA = :id`;
    
        // Execute the query
        const result = await connection.execute(sql, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const discounts = result.rows.map((row: any) => ({
                id: row.ID_OFERTA,       
                procent_reducere: row.PROCENT_REDUCERE,
                data_inceput: formatDateToCustom(row.DATA_INCEPUT),
                data_finalizare: formatDateToCustom(row.DATA_FINALIZARE)
            }));

            return res.status(200).json(discounts);
        } else {
            return res.status(404).json({ message: 'No discount found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching discount:', err);
        return res.status(500).json({ error: 'Failed to fetch discount' });
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

export const getDiscounts = async (req: Request, res: Response): Promise<any> => {
    console.log('DiscountController - Fetching discounts');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM OFERTA`
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const discounts = result.rows.map((row: any) => ({
                id: row.ID_OFERTA,       
                procent_reducere: row.PROCENT_REDUCERE,
                data_inceput: formatDateToCustom(row.DATA_INCEPUT),
                data_finalizare: formatDateToCustom(row.DATA_FINALIZARE)
            }));

            return res.status(200).json(discounts);
        } else {
            return res.status(404).json({ message: 'No discounts found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching discounts:', err);
        return res.status(500).json({ error: 'Failed to fetch discounts' });
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

export const updateDiscount = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { procent_reducere, data_inceput, data_finalizare } = req.body;

    console.log('DiscountController - Updating discount with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE OFERTA SET PROCENT_REDUCERE = :procent_reducere, DATA_INCEPUT = :data_inceput, DATA_FINALIZARE = :data_finalizare WHERE ID_OFERTA = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [procent_reducere, data_inceput, data_finalizare, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        return res.status(200).json({ message: 'Discount updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating discount:', err);
        return res.status(500).json({ error: 'Failed to update discount' });
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

export const deleteDiscount = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('DiscountController - Deleting discount with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `DELETE FROM OFERTA WHERE ID_OFERTA = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        return res.status(200).json({ message: 'Discount deleted successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error deleting discount:', err);
        return res.status(500).json({ error: 'Failed to delete discount' });
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