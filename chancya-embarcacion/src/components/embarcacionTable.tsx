// src/components/embarcacionTable.tsx
import React, { useState } from "react";
import { Embarcacion } from "../types";

interface EmbarcacionTableProps {
  embarcaciones: Embarcacion[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (embarcacion: Embarcacion) => Promise<void>;
  loading?: boolean;
  error?: string;
}


const EmbarcacionTable: React.FC<EmbarcacionTableProps> = ({
  embarcaciones,
  onDelete,
  onEdit,
  loading = false,
  error
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Embarcacion | null>(null);

  const handleEdit = (embarcacion: Embarcacion) => {
    setEditingId(embarcacion.id);
    setEditForm({ ...embarcacion });
  };

  const handleEditSubmit = async () => {
    if (!editForm || !onEdit) return;
    try {
      await onEdit(editForm);
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Error editing:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev!,
      [name]: name === 'capacidad' ? Number(value) : value
    }));
  };

  if (loading) return <div className="loading">Cargando embarcaciones...</div>;
  if (error) return <div className="error">{error}</div>;

    const handleDelete = async (id: number) => {
        try {
            await onDelete(id);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

  return (
    <div className="table-container">
      <h2>Lista de Embarcaciones</h2>
      
      {embarcaciones.length === 0 ? (
        <p className="no-data">No hay embarcaciones registradas</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {embarcaciones.map((embarcacion) => (
              <tr key={embarcacion.id}>
                <td>{embarcacion.id}</td>
                <td>
                  {editingId === embarcacion.id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editForm?.nombre || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    embarcacion.nombre
                  )}
                </td>
                <td>
                  {editingId === embarcacion.id ? (
                    <input
                      type="number"
                      name="capacidad"
                      value={editForm?.capacidad || 0}
                      onChange={handleEditChange}
                      min="1"
                    />
                  ) : (
                    embarcacion.capacidad
                  )}
                </td>
                <td>
                  {editingId === embarcacion.id ? (
                    <textarea
                      name="descripcion"
                      value={editForm?.descripcion || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    embarcacion.descripcion
                  )}
                </td>
                <td className="actions">
                  {editingId === embarcacion.id ? (
                    <>
                      <button onClick={handleEditSubmit} className="confirm-button" title="Guardar">
                        ✓
                      </button>
                      <button onClick={handleEditCancel} className="cancel-button" title="Cancelar">
                        ✗
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(embarcacion)}
                        className="edit-button"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      
                      {deleteConfirm === embarcacion.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(embarcacion.id)}
                            className="confirm-button"
                            title="Confirmar eliminación"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="cancel-button"
                            title="Cancelar"
                          >
                            ✗
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(embarcacion.id)}
                          className="delete-button"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmbarcacionTable;