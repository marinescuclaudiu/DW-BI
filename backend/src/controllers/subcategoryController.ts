import { Request, Response } from "express";
import { poolOLTP } from "../config/dbPool";
import oracledb from 'oracledb';

export const addSubcategory = async (req: Request, res: Response): Promise<any> => {
    const { id_categorie, denumire } = req.body;
    
        console.log('SubcategoryController - Adding subcategory with name:', denumire);
    
        // Initialize the connection
        let connection: oracledb.Connection | null = null;
        
        try {
            // Wait for the pool to resolve
            const resolvedPool = await poolOLTP;
    
            // Get a connection from the pool
            connection = await resolvedPool.getConnection();
    
            // Prepare the SQL statement
            const sqlFindId = `SELECT MAX(ID_SUBCATEGORIE) AS MAX_ID FROM SUBCATEGORIE`;
    
            // Execute the query
            const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
            if (resultFindId.rows && resultFindId.rows.length > 0) {
                const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;
    
                // Prepare the SQL statement
                const sql = `INSERT INTO SUBCATEGORIE (ID_SUBCATEGORIE, ID_CATEGORIE, DENUMIRE_SUBCATEGORIE) VALUES (:nextId, :id_categorie, :denumire)`;
                
                // Execute the query
                const result = await connection.execute(sql, [nextId, id_categorie, denumire], { autoCommit: true });
    
                if (result.rowsAffected === 0) {
                    return res.status(404).json({ message: 'Something went wrong' });
                }
    
                return res.status(200).json({ message: 'Subcategory added successfully' });
            }
        }   
        catch (err) {
            // Handle any errors that occur
            console.error('Error adding subcategory:', err);
            return res.status(500).json({ error: 'Failed to add subcategory' });
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

export const getSubcategory = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('SubcategoryController - Fetching subcategory with ID:', id);  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM SUBCATEGORIE WHERE ID_SUBCATEGORIE = :id`;
    
        // Execute the query
        const result = await connection.execute(sql, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const subcategories = result.rows.map((row: any) => ({
                id: row.ID_SUBCATEGORIE,       
                id_categorie: row.ID_CATEGORIE,
                denumire: row.DENUMIRE_SUBCATEGORIE
            }));

            return res.status(200).json(subcategories);
        } else {
            return res.status(404).json({ message: 'No subcategory found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching subcategory:', err);
        return res.status(500).json({ error: 'Failed to fetch subcategory' });
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

export const getSubcategories = async (req: Request, res: Response): Promise<any> => {
    console.log('SubcategoryController - Fetching subcategories');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM SUBCATEGORIE`
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const subcategories = result.rows.map((row: any) => ({
                id: row.ID_SUBCATEGORIE,       
                id_categorie: row.ID_CATEGORIE,
                denumire: row.DENUMIRE_SUBCATEGORIE
            }));

            return res.status(200).json(subcategories);
        } else {
            return res.status(404).json({ message: 'No subcategories found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching subcategories:', err);
        return res.status(500).json({ error: 'Failed to fetch subcategories' });
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

export const updateSubcategory = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { id_categorie, denumire } = req.body;

    console.log('SubcategoryController - Updating subcategory with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE SUBCATEGORIE SET DENUMIRE_SUBCATEGORIE = :denumire, ID_CATEGORIE = :id_categorie WHERE ID_SUBCATEGORIE = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [denumire, id_categorie, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        return res.status(200).json({ message: 'Subcategory updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating subcategory:', err);
        return res.status(500).json({ error: 'Failed to update subcategory' });
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

export const deleteSubcategory = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('SubcategoryController - Deleting subcategory with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `DELETE FROM SUBCATEGORIE WHERE ID_SUBCATEGORIE = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        return res.status(200).json({ message: 'Subcategory deleted successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error deleting subcategory:', err);
        return res.status(500).json({ error: 'Failed to delete subcategory' });
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