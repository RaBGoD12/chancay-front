// src/App.tsx
import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { Embarcacion } from './types'
import { EmbarcacionAPI } from './services/api'
import EmbarcacionForm from './components/embarcacionForm'
import EmbarcacionTable from './components/embarcacionTable'

function App() {
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [editingEmbarcacion, setEditingEmbarcacion] = useState<Embarcacion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch all embarcaciones
  const fetchEmbarcaciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await EmbarcacionAPI.getAll();
      setEmbarcaciones(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las embarcaciones');
      console.error('Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load embarcaciones on mount
  useEffect(() => {
    fetchEmbarcaciones();
  }, [fetchEmbarcaciones]);

  // Create new embarcacion
  const handleCreate = async (data: Omit<Embarcacion, 'id'>) => {
    try {
      setLoading(true);
      await EmbarcacionAPI.create(data);
      await fetchEmbarcaciones();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Error al crear la embarcación');
      console.error('Error creating:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete embarcacion
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await EmbarcacionAPI.delete(id);
      await fetchEmbarcaciones();
      setError('');
    } catch (err) {
      setError('Error al eliminar la embarcación');
      console.error('Error deleting:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start editing embarcacion
  const handleEdit = async (embarcacion: Embarcacion) => {
    setEditingEmbarcacion(embarcacion);
    setShowForm(true);
    return Promise.resolve();
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingEmbarcacion(null);
  };

  return (
    <div className="app-container">
      <h1>Gestión de Embarcaciones</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="actions">
        <button 
          className="new-button"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancelar' : 'Nueva Embarcación'}
        </button>
      </div>

      {showForm && (
        <EmbarcacionForm 
          onSubmit={handleCreate}
          onCancel={handleCancel}
          disabled={loading}
          initialData={editingEmbarcacion}
        />
      )}

      <EmbarcacionTable 
        embarcaciones={embarcaciones}
        onDelete={handleDelete}
        onEdit={handleEdit}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default App;