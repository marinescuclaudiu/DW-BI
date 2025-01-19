import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';


// Function to insert data into the 'people' table
export const insertPerson = async (req: Request, res: Response): Promise<any> => {
    console.log('Inserting person');
    const { name, age } = req.body;  // Extract name and age from the request body
    
    let connection: oracledb.Connection | null = null;
  
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL insert statement
        const sql = `INSERT INTO people (name, age) VALUES (:name, :age)`;
  
        // Execute the query with the provided parameters (name and age)
        const result = await connection.execute(sql, [name, age], { autoCommit: true });
    
        // Respond with a success message
        return res.status(201).json({
            message: 'Person inserted successfully',
            data: { name, age },
            rowsAffected: result.rowsAffected,
        });
    } catch (err) {
        // Handle any errors that occur
        console.error('Error inserting person:', err);
        return res.status(500).json({ error: 'Failed to insert person' });
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
};

// Function to update a person's data in the 'people' table
export const updatePerson = async (req: Request, res: Response): Promise<any> => {
    console.log('Updating person');

    const id = req.params.id;  // Extract id from the request parameters
    
    const { name, age } = req.body;  // Extract id, name, and age from the request body

    // Log input values for debugging
    console.log(`Received values - id: ${id}, name: ${name}, age: ${age}`);
    
    let connection: oracledb.Connection | null = null;
  
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL update statement
        const sql = `UPDATE people SET name = :name, age = :age WHERE id = :id`;

        // Execute the query with the provided parameters (id, name, and age)
        const result = await connection.execute(sql, [name, age, id], { autoCommit: true });
    
        if (result.rowsAffected === 0) {
            // If no rows are affected, it means no person was found with the given ID
            return res.status(404).json({
                message: 'Person not found',
            });
        }
    
        // Respond with a success message
        return res.status(200).json({
            message: 'Person updated successfully',
            data: { id, name, age },
            rowsAffected: result.rowsAffected,
        });
    } catch (err) {
        // Handle any errors that occur
        console.error('Error updating person:', err);
        return res.status(500).json({ error: 'Failed to update person' });
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
};



// Function to retrieve a person by ID from the 'people' table
export const getPerson = async (req: Request, res: Response): Promise<any> => {
    console.log('Fetching person');
    
    const { id } = req.params;  // Extract id from the URL parameter
    
    // Log input values for debugging
    console.log(`Received id for lookup: ${id}`);
    
    let connection: oracledb.Connection | null = null;
  
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL select statement
        const sql = `SELECT * FROM people WHERE id = :id`;

        // Execute the query with the provided parameter (id)
        const result = await connection.execute(sql, [id]);

        console.log(result);

        // Check if a row is found
        if (result.rows && result.rows.length > 0) {
            // If a person is found, return their data
            const person = result.rows[0] as any[];  // Extract the first (and only) row
            return res.status(200).json({
                message: 'Person found',
                data: {
                    id: person[0], // Assuming 'id' is the first column in the SELECT query
                    name: person[1], // Assuming 'name' is the second column
                    age: person[2],  // Assuming 'age' is the third column
                },
            });
        } else {
            // If no person is found with that ID, return a 404
            return res.status(404).json({
                message: 'Person not found',
            });
        }
    } catch (err: any) {
        // Handle any errors that occur
        console.error('Error fetching person:', err);
        return res.status(500).json({
            error: 'Failed to fetch person',
            details: err.message
        });
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
};

export const deletePerson = async (req: Request, res: Response): Promise<any> => {
    console.log('Deleting person');
    
    const { id } = req.params;  // Extract id from the URL parameter
    
    // Check if id is provided
    if (!id) {
        return res.status(400).json({ message: 'Missing id parameter' });
    }

    console.log(`Received id for deletion: ${id}`);
    
    let connection: oracledb.Connection | null = null;
  
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL delete statement
        const sql = `DELETE FROM people WHERE id = :id`;

        // Log the query for debugging
        console.log(`Executing SQL query: ${sql} with id: ${id}`);

        // Execute the query with the provided parameter (id)
        const result = await connection.execute(sql, [id], { autoCommit: true });

        // Check if any rows were affected (i.e., if a person was deleted)
        if (result.rowsAffected && result.rowsAffected > 0) {
            return res.status(200).json({
                message: 'Person deleted successfully',
                id: id,
            });
        } else {
            // If no rows were affected, it means the person was not found
            console.log(`No person found with id: ${id}`);
            return res.status(404).json({
                message: 'Person not found',
            });
        }
    } catch (err: any) {
        // Handle any errors that occur
        console.error('Error deleting person:', err);
        return res.status(500).json({
            error: 'Failed to delete person',
            details: err.message
        });
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
};