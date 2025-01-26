import { Request, Response } from "express";
import { poolOLTP } from "../config/dbPool";
import oracledb from 'oracledb';

export const addProduct = async (req: Request, res: Response): Promise<any> => {
     const { denumire, id_subcategorie, dimensiune, unitate_masura, pret } = req.body;
    
        console.log('ProductController - Adding product with name:', denumire);
    
        // Initialize the connection
        let connection: oracledb.Connection | null = null;
        
        try {
            // Wait for the pool to resolve
            const resolvedPool = await poolOLTP;
    
            // Get a connection from the pool
            connection = await resolvedPool.getConnection();
    
            // Prepare the SQL statement
            const sqlFindId = `SELECT MAX(ID_PRODUS) AS MAX_ID FROM PRODUS`;
    
            // Execute the query
            const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
            if (resultFindId.rows && resultFindId.rows.length > 0) {
                const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

                // Prepare the SQL statement
                const sql = `INSERT INTO PRODUS (ID_PRODUS, ID_SUBCATEGORIE, DENUMIRE, DIMENSIUNE, UNITATE_MASURA, PRET, ACTIV) VALUES (:nextId, :id_subcategorie, :denumire, :dimensiune, :unitate_masura, :pret, :activ)`;
                
                // Execute the query
                const result = await connection.execute(sql, [nextId, id_subcategorie, denumire, dimensiune, unitate_masura, pret, 1], { autoCommit: true });
    
                console.log(result);

                if (result.rowsAffected === 0) {
                    return res.status(404).json({ message: 'Something went wrong' });
                }
    
                return res.status(200).json({ message: 'Product added successfully' });
            }
        }   
        catch (err) {
            // Handle any errors that occur
            console.error('Error adding product:', err);
            return res.status(500).json({ error: 'Failed to add product' });
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

export const getProduct = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('ProductController - Fetching product with ID:', id);  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM PRODUS WHERE ID_PRODUS = :id`;
    
        // Execute the query
        const result = await connection.execute(sql, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const products = result.rows.map((row: any) => ({
                id: row.ID_PRODUS,
                id_subcategorie: row.ID_SUBCATEGORIE,       
                denumire: row.DENUMIRE,
                dimensiune: row.DIMENSIUNE,
                unitate_masura: row.UNITATE_MASURA,
                pret: row.PRET,
                activ: row.ACTIV
            }));

            return res.status(200).json(products);
        } else {
            return res.status(404).json({ message: 'No product found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching product:', err);
        return res.status(500).json({ error: 'Failed to fetch product' });
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

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    console.log('ProductController - Fetching products');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM PRODUS`;
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const products = result.rows.map((row: any) => ({
                id: row.ID_PRODUS,
                id_subcategorie: row.ID_SUBCATEGORIE,       
                denumire: row.DENUMIRE,
                dimensiune: row.DIMENSIUNE,
                unitate_masura: row.UNITATE_MASURA,
                pret: row.PRET,
                activ: row.ACTIV
            }));

            return res.status(200).json(products);
        } else {
            return res.status(404).json({ message: 'No products found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Failed to fetch products' });
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

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { id_subcategorie, denumire, dimensiune, unitate_masura, pret } = req.body;

    console.log('ProductController - Updating product with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE PRODUS SET ID_SUBCATEGORIE = :id_subcategorie, DENUMIRE = :denumire, DIMENSIUNE = :dimensiune, UNITATE_MASURA = :unitate_masura, PRET = :pret WHERE ID_PRODUS = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id_subcategorie, denumire, dimensiune, unitate_masura, pret, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Failed to update product' });
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

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    console.log('ProductController - Deleting product with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `DELETE FROM PRODUS WHERE ID_PRODUS = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error deleting product:', err);
        return res.status(500).json({ error: 'Failed to delete product' });
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

export const getProductsOnDiscount = async (req: Request, res: Response): Promise<any> => {
    console.log('ProductController - Fetching products by discount');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolOLTP;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM PRODUS
                    JOIN OFERTA_PRODUS USING (ID_PRODUS)
                    JOIN OFERTA USING (ID_OFERTA)
                    WHERE DATA_FINALIZARE > SYSDATE`;
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0){
            const products = result.rows.map((row: any) => ({
                id_produs: row.ID_PRODUS,
                id_oferta: row.ID_OFERTA,
                id_subcategorie: row.ID_SUBCATEGORIE,       
                denumire: row.DENUMIRE,
                dimensiune: row.DIMENSIUNE,
                unitate_masura: row.UNITATE_MASURA,
                pret: row.PRET,
                activ: row.ACTIV,
                procent_reducere: row.PROCENT_REDUCERE
            }));

            return res.status(200).json(products);
        } else {
            return res.status(404).json({ message: 'No products found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Failed to fetch products' });
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