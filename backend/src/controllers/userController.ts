import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';

export const getUser = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('UserController - Fetching user with ID:', id);  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CLIENT WHERE ID_CLIENT = :id`;
    
        // Execute the query
        const result = await connection.execute(sql, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const users = result.rows.map((row: any) => ({
                id: row.ID_CATEGORIE,       
                nume: row.NUME,
                prenume: row.PRENUME,
                email: row.EMAIL
            }));

            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: 'No user found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Failed to fetch user' });
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

export const getUsers = async (req: Request, res: Response): Promise<any> => {
    console.log('UserController - Fetching users');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CLIENT`
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const users = result.rows.map((row: any) => ({
                id: row.ID_CATEGORIE,       
                nume: row.NUME,
                prenume: row.PRENUME,
                email: row.EMAIL
            }));

            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: 'No users found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
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

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { nume, prenume, email, parola } = req.body;

    console.log('UserController - Updating user with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE CLIENT SET NUME = :nume, PRENUME = :prenume, EMAIL = :email, PAROLA = :parola WHERE ID_CLIENT = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [nume, prenume, email, parola, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Failed to update user' });
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

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('UserController - Deleting user with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `DELETE FROM CLIENT WHERE ID_CLIENT = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Failed to delete user' });
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

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, parola } = req.body;

    console.log('UserController - Logging in user with email:', email);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM CLIENT WHERE EMAIL = :email AND PAROLA = :parola`;
    
        // Execute the query    
        const result = await connection.execute(sql, [email, parola], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows && result.rows.length > 0) {
            const user = result.rows.map((row: any) => ({
                id: row.ID_CLIENT,       
                nume: row.NUME,
                prenume: row.PRENUME,
                email: row.EMAIL
            }));
            return res.status(200).json(user);    
        } else {
            return res.status(404).json({ message: 'Name or password is incorrect' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error logging in user:', err);
        return res.status(500).json({ error: 'Failed to log in user' });
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