import { Request, Response } from "express";
import { poolDW, poolOLTP } from "../config/dbPool"; 
import oracledb from 'oracledb';

const dbUserOLTP = process.env.DB_USER_OLTP;
const dbUserPrefix = dbUserOLTP ? `${dbUserOLTP}.` : '';

// Split the query into individual statements
const queries = [
    // Insert into CAFENELE
    `INSERT INTO CAFENELE (id_cafenea, nume_cafenea, nume_oras)
     SELECT 
       c.id_cafenea, 
       c.nume_cafenea, 
       o.nume AS nume_oras
     FROM ${dbUserPrefix}cafenea c
     JOIN ${dbUserPrefix}locatie l USING (id_locatie)
     JOIN ${dbUserPrefix}oras o USING (id_oras)
     WHERE NOT EXISTS (
       SELECT 1
       FROM CAFENELE dw
       WHERE dw.id_cafenea = c.id_cafenea
     )`,

    // Insert into ORASE
    `INSERT INTO ORASE (id_oras, nume_oras, nume_judet, nume_regiune)
     SELECT 
       o.id_oras, 
       o.nume, 
       j.nume AS nume_judet, 
       r.nume AS nume_regiune
     FROM ${dbUserPrefix}oras o
     JOIN ${dbUserPrefix}judet j USING (id_judet)
     JOIN ${dbUserPrefix}regiune r USING (id_regiune)
     WHERE NOT EXISTS (
       SELECT 1
       FROM ORASE dw
       WHERE dw.id_oras = o.id_oras
     )`,

    // Insert into OFERTE
    `INSERT INTO OFERTE (id_oferta, procent_reducere, data_inceput, data_finalizare)
     SELECT 
       id_oferta, 
       procent_reducere, 
       data_inceput, 
       data_finalizare
     FROM ${dbUserPrefix}oferta
     WHERE NOT EXISTS (
       SELECT 1
       FROM OFERTE dw
       WHERE dw.id_oferta = ${dbUserPrefix}oferta.id_oferta
     )`,

    // Insert into PRODUSE
    `INSERT INTO PRODUSE (id_produs, denumire, dimensiune, pret_unitar, activ, categorie, subcategorie)
     SELECT 
       p.id_produs, 
       p.denumire, 
       p.dimensiune, 
       p.pret, 
       p.activ, 
       c.denumire_categorie, 
       s.denumire_subcategorie
     FROM ${dbUserPrefix}produs p
     JOIN ${dbUserPrefix}subcategorie s USING (id_subcategorie)
     JOIN ${dbUserPrefix}categorie c USING (id_categorie)
     WHERE NOT EXISTS (
       SELECT 1
       FROM PRODUSE dw
       WHERE dw.id_produs = p.id_produs
     )`,

    // Insert into FACTURI
    `INSERT INTO FACTURI (id_factura, data_emiterii, pret_total, metoda_plata)
     SELECT 
       id_factura_client, 
       data_emiterii, 
       pret_total, 
       metoda_plata
     FROM ${dbUserPrefix}factura_client
     WHERE NOT EXISTS (
       SELECT 1
       FROM FACTURI dw
       WHERE dw.id_factura = ${dbUserPrefix}factura_client.id_factura_client
     )`,

    // Insert into VANZARI
    `INSERT INTO VANZARI (
        id_vanzare,
        cafenea_id,
        produs_id,
        factura_id,
        timp_id,
        oferta_id,
        oras_id,
        pret_unitar_vanzare,
        cantitate
     )
     WITH OrderedSales AS (
         SELECT 
             caf.ID_CAFENEA,
             cp.ID_PRODUS,
             fc.ID_FACTURA_CLIENT,
             fc.DATA_EMITERII AS DATE_EMITERE,
             CASE 
                 WHEN cc.DATA_PLASARII BETWEEN o.DATA_INCEPUT AND o.DATA_FINALIZARE 
                 THEN o.ID_OFERTA
                 ELSE NULL
             END AS ID_OFERTA,
             loc.ID_ORAS,
             cp.PRET_FINAL,
             cp.CANTITATE,
             ROW_NUMBER() OVER (
                 PARTITION BY cc.ID_COMANDA_CLIENT, cp.ID_PRODUS
                 ORDER BY 
                     CASE 
                         WHEN cc.DATA_PLASARII BETWEEN o.DATA_INCEPUT AND o.DATA_FINALIZARE 
                         THEN 1 ELSE 2 
                     END
             ) AS ROW_NUM
         FROM 
             ${dbUserPrefix}CAFENEA caf
         JOIN 
             ${dbUserPrefix}COMANDA_CLIENT cc ON caf.ID_CAFENEA = cc.ID_CAFENEA
         JOIN 
             ${dbUserPrefix}COMANDA_PRODUS cp ON cc.ID_COMANDA_CLIENT = cp.ID_COMANDA_CLIENT
         JOIN 
             ${dbUserPrefix}FACTURA_CLIENT fc ON cc.ID_COMANDA_CLIENT = fc.ID_COMANDA_CLIENT
         LEFT JOIN 
             ${dbUserPrefix}OFERTA_PRODUS op ON cp.ID_PRODUS = op.ID_PRODUS
         LEFT JOIN 
             ${dbUserPrefix}OFERTA o ON op.ID_OFERTA = o.ID_OFERTA
                        AND cc.DATA_PLASARII BETWEEN o.DATA_INCEPUT AND o.DATA_FINALIZARE
         JOIN 
             ${dbUserPrefix}LOCATIE loc ON caf.ID_LOCATIE = loc.ID_LOCATIE
     )
     SELECT 
         rownum AS id_vanzare,
         ID_CAFENEA, 
         ID_PRODUS, 
         ID_FACTURA_CLIENT, 
         DATE_EMITERE, 
         ID_OFERTA, 
         ID_ORAS, 
         PRET_FINAL, 
         CANTITATE
     FROM 
         OrderedSales
     WHERE 
       ROW_NUM = 1
       AND NOT EXISTS (
         SELECT 1
         FROM VANZARI dw
         WHERE 
           dw.cafenea_id = OrderedSales.ID_CAFENEA
           AND dw.produs_id = OrderedSales.ID_PRODUS
           AND dw.factura_id = OrderedSales.ID_FACTURA_CLIENT
           AND dw.timp_id = OrderedSales.DATE_EMITERE 
       )`
];

export const updateWarehouse = async (req: Request, res: Response): Promise<any> => {
    console.log('WarehouseController - Update warehouse');

    // Initialize the connection
    let connection: oracledb.Connection | null = null;

    try {
        // Wait for the pool to resolve
        const resolvedPool = await poolDW;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Execute each query one by one
        for (const query of queries) {
            await connection.execute(query, [], { autoCommit: true });
        }

        return res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
        console.error('Error during warehouse update:', err);
        return res.status(500).json({ error: 'Failed to update warehouse' });
    } finally {
        // Release connections back to their respective pools
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error('Error closing connection to DW:', closeError);
            }
        }
    }
};