// src/services/api.ts
import axios from 'axios';
import { Embarcacion } from '../types';

const API_BASE = '/api/embarcaciones';

export const EmbarcacionAPI = {
  getAll: async () => {
    const response = await axios.get<Embarcacion[]>(API_BASE);
    return response.data;
  },
  
  create: async (data: Omit<Embarcacion, 'id'>) => {
    const response = await axios.post<Embarcacion>(API_BASE, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    await axios.delete(`${API_BASE}/${id}`);
  }
};