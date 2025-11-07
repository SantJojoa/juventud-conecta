const Invoice = require('../models/Invoice');
const fs = require('fs');
const path = require('path');

const invoiceController = {
    // Subir archivo JSON y validar número de factura
    uploadInvoice: async (req, res) => {
        try {
            // Verificar si se subió un archivo
            if (!req.file) {
                return res.status(400).json({
                    error: 'No se ha seleccionado ningún archivo'
                });
            }

            // Leer el contenido del archivo JSON
            const filePath = req.file.path;
            const fileContent = fs.readFileSync(filePath, 'utf8');
            let jsonData;

            try {
                jsonData = JSON.parse(fileContent);
            } catch (error) {
                // Eliminar archivo temporal si hay error de parsing
                fs.unlinkSync(filePath);
                return res.status(400).json({
                    error: 'El archivo no contiene un JSON válido'
                });
            }

            // Validar que el JSON tenga el campo numeroFactura
            if (!jsonData.numeroFactura) {
                fs.unlinkSync(filePath);
                return res.status(400).json({
                    error: 'El JSON debe contener el campo "numeroFactura"'
                });
            }

            const numeroFactura = jsonData.numeroFactura;

            // Verificar si ya existe una factura con ese número
            const existingInvoice = await Invoice.findOne({
                where: { numeroFactura: numeroFactura }
            });

            if (existingInvoice) {
                // Eliminar archivo temporal
                fs.unlinkSync(filePath);
                return res.status(409).json({
                    error: `La factura con número ${numeroFactura} ya existe en el sistema`
                });
            }

            // Crear nueva factura
            const newInvoice = await Invoice.create({
                numeroFactura: numeroFactura,
                data: jsonData,
                estado: 'procesado'
            });

            // Eliminar archivo temporal después de procesarlo
            fs.unlinkSync(filePath);

            res.status(201).json({
                message: 'Factura subida exitosamente',
                invoice: {
                    id: newInvoice.id,
                    numeroFactura: newInvoice.numeroFactura,
                    estado: newInvoice.estado,
                    fechaSubida: newInvoice.fechaSubida
                }
            });

        } catch (error) {
            console.error('Error al subir factura:', error);

            // Eliminar archivo temporal en caso de error
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo temporal:', unlinkError);
                }
            }

            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    },

    // Obtener todas las facturas
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.findAll({
                order: [['fechaSubida', 'DESC']]
            });

            res.json(invoices);
        } catch (error) {
            console.error('Error al obtener facturas:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    },

    // Obtener factura por ID
    getInvoiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await Invoice.findByPk(id);

            if (!invoice) {
                return res.status(404).json({
                    error: 'Factura no encontrada'
                });
            }

            res.json(invoice);
        } catch (error) {
            console.error('Error al obtener factura:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    },

    // Obtener factura por número
    getInvoiceByNumber: async (req, res) => {
        try {
            const { numeroFactura } = req.params;
            const invoice = await Invoice.findOne({
                where: { numeroFactura: numeroFactura }
            });

            if (!invoice) {
                return res.status(404).json({
                    error: 'Factura no encontrada'
                });
            }

            res.json(invoice);
        } catch (error) {
            console.error('Error al obtener factura por número:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    },

    // Eliminar factura
    deleteInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await Invoice.findByPk(id);

            if (!invoice) {
                return res.status(404).json({
                    error: 'Factura no encontrada'
                });
            }

            await invoice.destroy();

            res.json({
                message: 'Factura eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar factura:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
};

module.exports = invoiceController;
