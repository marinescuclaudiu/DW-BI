import { Request, Response } from "express";
import { poolOLTP } from "../config/dbPool";
import oracledb from 'oracledb';

export const addCategory = async (req: Request, res: Response): Promise<any> => {
    const { denumire } = req.body;

    console.log('CategoryController - Adding category with name:', denumire);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sqlFindId = `SELECT MAX(ID_CATEGORIE) AS MAX_ID FROM CATEGORIE`;

        // Execute the query
        const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (resultFindId.rows && resultFindId.rows.length > 0) {
            const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

            // Prepare the SQL statement
            const sql = `INSERT INTO CATEGORIE (ID_CATEGORIE, DENUMIRE_CATEGORIE) VALUES (:nextId, :denumire)`;
            
            // Execute the query
            const result = await connection.execute(sql, [nextId, denumire], { autoCommit: true });

            if (result.rowsAffected === 0) {
                return res.status(404).json({ message: 'Something went wrong' });
            }

            return res.status(200).json({ message: 'Category added successfully' });
        }
    }   
    catch (err) {
        // Handle any errors that occur
        console.error('Error adding category:', err);
        return res.status(500).json({ error: 'Failed to add category' });
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


export const getCategory = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('CategoryController - Fetching category with ID:', id);  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CATEGORIE WHERE ID_CATEGORIE = :id`;
    
        // Execute the query
        const result = await connection.execute(sql, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const categories = result.rows.map((row: any) => ({
                id: row.ID_CATEGORIE,       
                denumire: row.DENUMIRE_CATEGORIE
            }));

            return res.status(200).json(categories);
        } else {
            return res.status(404).json({ message: 'No category found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching category:', err);
        return res.status(500).json({ error: 'Failed to fetch category' });
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

export const getCategories = async (req: Request, res: Response): Promise<any> => {
    console.log('CategoryController - Fetching categories');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CATEGORIE`
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const categories = result.rows.map((row: any) => ({
                id: row.ID_CATEGORIE,       
                denumire: row.DENUMIRE_CATEGORIE
            }));

            return res.status(200).json(categories);
        } else {
            return res.status(404).json({ message: 'No categories found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching categories:', err);
        return res.status(500).json({ error: 'Failed to fetch categories' });
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

export const updateCategory = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { denumire } = req.body;

    console.log('CategoryController - Updating category with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE CATEGORIE SET DENUMIRE_CATEGORIE = :denumire WHERE ID_CATEGORIE = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [denumire, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating category:', err);
        return res.status(500).json({ error: 'Failed to update category' });
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

export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('CategoryController - Deleting category with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `DELETE FROM CATEGORIE WHERE ID_CATEGORIE = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error deleting category:', err);
        return res.status(500).json({ error: 'Failed to delete category' });
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