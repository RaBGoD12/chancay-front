// src/components/embarcacionForm.tsx
import React, { useState } from "react";
import { Embarcacion } from "../types";

interface EmbarcacionFormProps {
  onSubmit: (data: Omit<Embarcacion, 'id'>) => Promise<void>;
  onCancel: () => void;
  disabled: boolean;
  initialData: Embarcacion | null;
}

interface FormData {
  nombre: string;
  capacidad: string;
  descripcion: string;
  fechaProgramada: string;
}

const initialFormData: FormData = {
  nombre: "",
  capacidad: "",
  descripcion: "",
  fechaProgramada: new Date().toISOString().split('T')[0] // Default to today
};

const EmbarcacionForm: React.FC<EmbarcacionFormProps> = ({ 
  onSubmit, 
  onCancel,
  disabled = false,
  initialData = null 
}) => {
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        ...initialData,
        capacidad: String(initialData.capacidad),
        fechaProgramada: initialData.fechaProgramada.split('T')[0]
      };
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    const capacidadNum = Number(formData.capacidad);
    if (!formData.capacidad || isNaN(capacidadNum) || capacidadNum <= 0) {
      newErrors.capacidad = 'La capacidad debe ser un número mayor a 0';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.fechaProgramada) {
      newErrors.fechaProgramada = 'La fecha es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      // Convert capacidad to number before submitting
      await onSubmit({
        ...formData,
        capacidad: Number(formData.capacidad)
      });
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form className="embarcacion-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={disabled}
          className={errors.nombre ? 'error' : ''}
        />
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="capacidad">Capacidad:</label>
        <input
          type="text"
          id="capacidad"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          disabled={disabled}
          className={errors.capacidad ? 'error' : ''}
        />
        {errors.capacidad && <span className="error-message">{errors.capacidad}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={disabled}
          className={errors.descripcion ? 'error' : ''}
        />
        {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="fechaProgramada">Fecha Programada:</label>
        <input
          type="date"
          id="fechaProgramada"
          name="fechaProgramada"
          value={formData.fechaProgramada}
          onChange={handleChange}
          disabled={disabled}
          className={errors.fechaProgramada ? 'error' : ''}
        />
        {errors.fechaProgramada && (
          <span className="error-message">{errors.fechaProgramada}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={disabled}>Guardar</button>
        <button type="button" onClick={onCancel} disabled={disabled}>Cancelar</button>
      </div>
    </form>
  );
};

export default EmbarcacionForm;